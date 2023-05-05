const { Users } = require('../../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

// Definice asynchronní funkce loginUser, která zpracovává přihlášení uživatele
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findOne({ where: { username: username } });

        if (!user) return res.status(404).json({ error: "User Doesn't Exist" });

        if (user) {
            bcrypt.compare(password, user.password).then(async (match) => {
                if (!match) return res.status(401).json({ error: "Wrong Username And Password Combination" });
                const accessToken = sign(
                    { username: user.username, id: user.id },
                    "importantsecret"
                );
                return res.json({ token: accessToken, username: username, id: user.id, email: user.email, experience: user.experience, level: user.level, role: user.role });
            });
        } else {
            return res.status(404).json({ error: 'An error occurred' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    loginUser,
};
