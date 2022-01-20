const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//passport config
require('./config/passport')(passport);

dotenv.config({path:'config.env'});

app.use(expressLayouts);
app.set("view engine","ejs");

const PORT = process.env.PORT || 8000;

//log request
app.use(morgan('tiny'));

//mongodb connection
mongoose.connect(process.env.MONGO_URL,{
    //to stop warning,needed because standard config is now depreceated
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
    //to stop warning,needed because standard config is now depreceated
})

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});  

app.get('/',(req,res) => {
    res.render('welcome.ejs');
});

//load routers
app.use('/index',require('./router/router'));
app.use('/users',require('./router/users'));

//load assets
app.use("/styles",  express.static(path.join(__dirname, 'assets', 'css')));
app.use("/js",  express.static(path.join(__dirname, 'assets', 'js')));
app.use("/images",  express.static(path.join(__dirname, 'assets', 'images')));

app.listen(PORT,(error) => {
    if(error){
        throw error;
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});