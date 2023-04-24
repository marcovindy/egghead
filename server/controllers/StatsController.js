const Stats = require('../models/Stats');

exports.saveStats = async (req, res) => {
    const stats = new Stats(req.body);

    try {
        await stats.save();
        res.status(200).json({ message: 'Quiz stats saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save quiz stats' });
    }
};
