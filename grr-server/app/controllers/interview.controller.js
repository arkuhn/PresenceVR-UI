var Interview = require('../models/interview.model.js');
var  firebase  = require('../../firebase')

exports.create = function(req, res) {
    firebase.authenticateToken(req.headers.authorization).then(({ email, name}) => {
        if({ email, name}) {
            var interview = new Interview({
                host: email,
                details: req.body.data.details,
                occursOnDate: req.body.data.occursOnDate,
                occursAtTime: req.body.data.occursAtTime,
                scheduledOnDate: new Date().toLocaleDateString("en-US"),
                participants: req.body.data.participants,
                loadedAssets: ['test.asset'],
                loadedEnvironments: ['test.env']
                
            });

            interview.save(function(err, data) {
                if(err) {
                    console.log(err);
                    res.status(500).send({message: "Some error occurred while creating the Interview."});
                } else {
                    console.log('Interview saved')
                    res.send(data);
                }
            });
        }
    })
};

exports.delete = function(req, res) {
    firebase.authenticateToken(req.headers.authorization).then(({ email, name}) => {
        if({ email, name}) {
            Interview.findOneAndDelete({'_id': req.body.id}, function(err, interview) { 
                if(err) {
                    console.log(err);
                    res.status(500).send({message: "Some error occurred while deleting the Interview."});
                } else {
                    console.log('Interview deleted')
                    res.send(interview);
                }
            })
        }
    })
};

exports.update = function(req, res) {
    firebase.authenticateToken(req.headers.authorization).then(({ email, name}) => {
        if({ email, name}) {
            const updatedInterview = {
                host: req.body.data.host,
                details: req.body.data.details,
                occursOnDate: req.body.data.occursOnDate,
                occursAtTime: req.body.data.occursAtTime,
                scheduledOnDate: new Date().toLocaleDateString("en-US"),
                participants: req.body.data.participants,
                loadedAssets: ['test.asset'],
                loadedEnvironments: ['test.env']
            }
            
            Interview.findByIdAndUpdate({'_id': req.body.data.id}, updatedInterview, function(err, interview) { 
                if(err) {
                    console.log(err);
                    res.status(500).send({message: "Some error occurred while updating the Interview."});
                } else {
                    console.log('Interview updated')
                    res.send(interview);
                }
            })
        }
    })
};

exports.findAll = function(req, res) {
    firebase.authenticateToken(req.headers.authorization).then(({ email, name}) => {
        if({ email, name}) {
            Interview.find({'host': req.params.host}, function(err, interviews){
                if(err){
                    console.log(err)
                    return res.status(500).send({message: "Some error occurred while retrieving interviews."});
                }
                else if(!interviews) {
                    return res.status(404)
                }
                else {
                    return res.send(interviews);
                }
            });
        }
    })
};