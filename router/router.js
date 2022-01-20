const express = require('express')
const router = express.Router()
const controller = require('../controller/controller');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req,res)=>{
    res.render('index.ejs');
});

// get all quiz questions
router.get('/quiz', ensureAuthenticated , controller.getQuestions);

// add one quiz question
router.post('/quiz/add', ensureAuthenticated ,controller.addQuestions);

// goto next question
router.post('/quiz/next', ensureAuthenticated ,controller.nextQuestion);

module.exports = router;