const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo');

const User = require('./models/User');
const boardRoutes = require('./routes/boards');
const pinRoutes = require('./routes/pins');
const authRoutes = require('./routes/users');

dotenv.config();

const app = express();


// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));


// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));


// Session Config
app.use(session({
  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600
  }),

  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));


// Flash Messages
app.use(flash());


// Passport Config
app.use(passport.initialize());

app.use(passport.session());

passport.use(
  new LocalStrategy(User.authenticate())
);

passport.serializeUser(
  User.serializeUser()
);

passport.deserializeUser(
  User.deserializeUser()
);


// Global Middleware
app.use((req, res, next) => {

  res.locals.success = req.flash('success');

  res.locals.error = req.flash('error');

  res.locals.currentUser = req.user;

  next();
});


// Routes
app.use('/boards', boardRoutes);

app.use('/boards/:boardId/pins', pinRoutes);

app.use('/', authRoutes);


// Home Route
app.get('/', (req, res) => {
  res.redirect('/boards');
});


// Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});