var Interview = require('../models/interview.model.js');


exports.create = function(req, res) {
    // Create and Save a new Note
    console.log(req.body);

    var interview = new Interview({
        host: req.body.host,
        subject: req.body.subject,
        occursOnDate: req.body.occursOnDate,
        occursAtTime: req.body.occursAtTime,
        scheduledOnDate: new Date().toLocaleDateString("en-US"),
        participants: req.body.participants,
        loadedAssets: ['test.asset'],
        loadedEnvironments: ['test.env']
        
    });

    interview.save(function(err, data) {
        if(err) {
            console.log(err);
            res.status(500).send({message: "Some error occurred while creating the Interview."});
        } else {
            console.log('no error')
            res.send(data);
        }
    });
};