const { Users } = require("../../models");

exports.getLeaderboard = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || "level";
        let order;

        if (sortBy === "level") {
            order = [
                ["level", "DESC"],
                ["experience", "DESC"],
            ];
        } else {
            order = [
                ["rank", "DESC"],
            ];
        }

        const users = await Users.findAll({
            attributes: ["id", "username", "level", "experience", "rank"],
            order: order,
            limit: 10,
        });

        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching leaderboard data." });
    }
};
