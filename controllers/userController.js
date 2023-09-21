const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const handlebars = require("handlebars");
const sendEmail = require("../utils/sendMail");
const fs = require("fs");
const path = require("path");

exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ msg: "Please fill in all fields." });
    }
    if (!validateEmail(email))
      return res.status(400).json({ msg: "Invalid emails." });

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "This email already exists." });
    }

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });

    const passwordHash = await bcrypt.hash(password, 12);

    // const newUser = {
    //   name,
    //   email,
    //   password: passwordHash,
    // };

    // cookieToken(user, req, res);

    // const activation_token = createActivationToken(newUser);

    // encript activation token
    

    // const url = `${CLIENT_URL}/user/activate/${activation_token}`;
    // const url = `http://localhost:5173/user/activate/${activation_token}`;

    // const signupUserMailTemplate = fs.readFileSync(
    //   path.join(__dirname, "../template/signUp.hbs"),
    //   "utf8"
    // );

    // const template = handlebars.compile(signupUserMailTemplate);

    // const messageBody = template({
    //   url,
    // });

    // sendEmail(email, messageBody, "Verify your email address");

    // res.json({
    //   msg: "Please check your mail activate your email to start.",
    // });
    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });

    await newUser.save();

    res.status(200).json({ msg: "Account created, Please login" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.activateEmail = async (req, res) => {
  try {
    const { activation_token } = req.body;
    const user = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    console.log(user, "user");
    const { name, email, password } = user;

    const check = await User.findOne({ email });
    if (check)
      return res.status(400).json({ msg: "This email is already exists" });

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(200).json({ msg: "Account has been activated!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for presence of email and password
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // get user from db
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ msg: "This email does not exists" });
    }

    // match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password incorrect" });
    }

    const refresh_token = createRefreshToken({ id: user._id });

    // update refresh to user
    await User.findOneAndUpdate(
      { email },
      {
        refresh_token: refresh_token,
        refresh_token_expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }
    );

    res.json({ msg: "Login success" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getAccessToken = async (req, res) => {
  try {
    // const rf_token = req.cookies.refreshToken;
    let rf_token;
    if (req.query.email) {
      rf_token = await User.findOne({
        email: req.query.email,
        refresh_token_expiry: { $gt: Date.now() },
      });
    }

    if (!rf_token) {
      return res
        .status(400)
        .send({ success: false, message: "Please login again" });
    }

    const logInUser = jwt.verify(
      rf_token.refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!logInUser) {
      return res
        .status(400)
        .send({ success: false, message: "Please login again" });
    }

    const access_Token = createAccessToken({ _id: logInUser.id });

    res.status(200).send({ success: true, accessToken: access_Token });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { email } = req.query;
    await User.findOneAndUpdate(
      { email },
      {
        refresh_token: null,
        refresh_token_expiry: null,
      }
    );

    return res
      .status(200)
      .send({ success: true, message: "logged out successfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    // console.log(req.user._id, "id");
    const response = await User.findOne({ email: req.query.email }).select(
      "-refresh_token -password"
    );

    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

exports.forgotPasswordmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({
        success: false,
        message: "User doesn't exist",
      });
    }

    // const forgotToken = user.getForgotPasswordToken();
    const forgotToken = crypto.randomBytes(20).toString("hex");
    const forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    await User.findOneAndUpdate(
      {
        email,
      },
      {
        forgotPasswordToken: forgotToken,
        forgotPasswordExpiry: forgotPasswordExpiry,
      }
    );

    await user.save({ validateBeforeSave: false });
    const forgotPasswordMailTemplate = fs.readFileSync(
      path.join(__dirname, "../template/forgotPassword.hbs"),
      "utf8"
    );

    const template = handlebars.compile(forgotPasswordMailTemplate);

    // const myUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/password/reset/${forgotToken}`;
    let url;
    if (process.env.NODE_ENV === "production") {
      // url = `https://drivado-frontend.web.app/password/reset/${forgotToken}`;
    } else {
      url = `http://localhost:3000/password/reset/${forgotToken}`;
    }

    const message = `Copy paste this link in your url and hit enter \n\n ${url}`;

    const messageBody = template({
      url: url,
    });

    sendEmail(email, messageBody, "Forgot password Request");

    res.status(200).json({
      success: true,
      message: "email sent succesfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).send({ msg: error.message });
  }
};

exports.checkToken = async (req, res) => {
  console.log(req.query.token, "token");
  const user = await User.findOne({
    forgotPasswordToken: req.query.token,
    forgotPasswordExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).send({
      success: false,
      message: "Token is invalid or expired",
    });
  } else {
    res.status(200).send({
      success: true,
      message: "Token is valid",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      forgotPasswordToken: req.query.token,
      forgotPasswordExpiry: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.send({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    //update password in database
    console.log(req.user);

    await User.findOneAndUpdate(
      { email: user?.email },
      {
        password: hashPassword,
        forgotPasswordExpiry: null,
        forgotPasswordToken: null,
      }
    );

    res.status(200).send({
      success: true,
      message: "password updated successfully",
      // data: updateUserDetails,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select(
    "-password -refresh_token -refresh_token_expiry -forgotPasswordToken -forgotPasswordExpiry"
  );

  console.log(users, "users list");
  res.send(users);
};

// utilities
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
