const passport = require("passport");
const User = require("../models/User");


// ================= Register =================

// Show register form
module.exports.renderRegisterForm = (req, res) => {
  res.render("auth/register");
};


// Handle register
module.exports.registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    const user = new User({
      username,
      email
    });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {

      if (err) {
        req.flash("error", "Login after registration failed.");
        return res.redirect("/login");
      }

      req.flash("success", "Welcome to PinBoard App!");
      res.redirect("/");

    });

  } catch (err) {

    console.log("Registration error:", err.message);

    req.flash("error", err.message);

    res.redirect("/register");
  }
};


// ================= Login =================

// Show login form
module.exports.renderLoginForm = (req, res) => {
  res.render("auth/login");
};


// Handle successful login
module.exports.loginUser = (req, res) => {

  req.flash("success", `Welcome back, ${req.user.username}!`);

  const redirectUrl = req.session.returnTo || "/";

  delete req.session.returnTo;

  res.redirect(redirectUrl);
};


// ================= Logout =================

// Handle logout
module.exports.logoutUser = (req, res, next) => {

  req.logout((err) => {

    if (err) {
      return next(err);
    }

    req.flash("success", "You have been logged out.");

    res.redirect("/login");

  });
};