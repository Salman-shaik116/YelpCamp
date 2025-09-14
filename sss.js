const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize());
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret,
        algorithm: 'aes-256-ctr',
        key: process.env.CRYPT_KEY || 'thisshouldbeabettersecret!',
        iv: process.env.CRYPT_IV || 'thisshouldbeabettersecret!'
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig))
app.use(flash());
const scriptSrcUrls = [
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css",
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"
];
const styleSrcUrls = [
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css",
    "https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", ...styleSrcUrls],
            connectSrc: ["'self'", ...connectSrcUrls],
            fontSrc: ["'self'", ...fontSrcUrls],
            imgSrc: ["'self'", "data:"]
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.get('/', (req, res) => {
    res.render('home')
});
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
}
)
app.listen(3000, () => {
    console.log('Serving on port 3000')
})
//  Export the app  
module.exports = app;   
