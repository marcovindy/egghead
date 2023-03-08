const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// GET api/scores
router.get('/', (req, res) => {
    Score.find()
        .sort({score: -1}) // sort by highest score, desc
        .limit(20)
        .then(scores => res.json(scores));
});

// POST api/score
router.post('/save', (req, res) => {
    console.log("*** REQ BODY ***", req.body);
    const newScore = new Score({
        username: req.body.username,
        score: req.body.score
    });
    newScore.save().then(score => res.json(score));
});

router.put('/update/:username', (req, res) => {
    const { username } = req.params;
    Score.updateOne({username: username}, {$set:{username: req.body.username}}, (err) => {
        if(!err){
            return res.json({ message: `success, username updated to ${req.body.username}` })
        }
    });
});

router.delete('/delete/:username', (req, res) => {
    const { username } = req.params;
    Score.findOneAndDelete({username: username}, 
        (err, result) => {
            if(err) { return res.send(500, err) };
            res.json({ message: `success, user with username: "${username}" got deleted` });
        });
});

module.exports = router;