const express = require("express");
const router = express.Router();

const passport = require("passport");

const userController = require("../Controller/userController");


// ================= Register =================

// Show register form
router.get(
  "/register",
  userController.renderRegisterForm
);


// Handle register
router.post(
  "/register",
  userController.registerUser
);


// ================= Login =================

// Show login form
router.get(
  "/login",
  userController.renderLoginForm
);


// Handle login
router.post(
  "/login",

  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),

  userController.loginUser
);


// ================= Logout =================

// Handle logout
router.post(
  "/logout",
  userController.logoutUser
);


module.exports = router;