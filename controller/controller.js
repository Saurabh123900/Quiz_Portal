const model = require('../models/questions');

var questions = [],
    answers = [],
    i=0;

module.exports = {

    getQuestions(req,res){

        //model.aggregate([{$sample: {size:10}}])
		model.find()
            .then(data => {
                if(data.length){
                    questions = data;
                    answers = [];
                    //res.send(data);
                    res.render('quiz',{question:questions[0].question,options:questions[0].options});
                }
                else {
                    //res.send(`404`);
                    res.render('404');
                }
            })
            .catch(err => {
                res.render('500');
                //res.render('500');
            });
    },


    nextQuestion(req,res){

        console.log("questions",questions);
        i = i+1;
        if(req.body.optradio){
            if(i <= questions.length){
                answers.push(req.body.optradio);
            }
            if(i < questions.length){
                res.render('quiz',{question:questions[i].question,options:questions[i].options});
            }
            else {
                i = 0;
                var score = 0;
                for(let j=0;j<questions.length;j++){
                    if(questions[j].answer == answers[j])
                        score++;
                }
                res.render('score',{score:score,total:questions.length})
            }
        }

    },

    addQuestions(req,res){

        var question = req.body.question,
            options = req.body.options,
            answer = req.body.answer;

        var newQuiz = new model({
            question,
            options,
            answer
        });
        newQuiz.save()
            .then(data => {
                if(data){
                    res.status(200).json({
                        data
                    })
                }
                else {
                    res.send("No data found")
                }
            })
            .catch(err => {
                console.log("Error ",err);
            })
    }
}