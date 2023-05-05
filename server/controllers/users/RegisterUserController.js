const { Users } = require('../../models');
const bcrypt = require('bcrypt');

// Definice asynchronní funkce registerUser, která zpracovává registraci uživatele
const registerUser = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    // Zašifruje heslo pomocí bcrypt s 10 iteracemi salting procesu
    const hash = await bcrypt.hash(password, 10);
    // Vytvoříme nového uživatele v databázi s poskytnutými údaji
    await Users.create({
      username: username,
      email: email,
      password: hash,
      avatar: avatar,
    });

    // Pokud je registrace úspěšná, odešle zpět zprávu o úspěchu
    return res.json("Username successfully created");
  } catch (error) {
    console.log(error.errors[0].message);

    // Podle chybové zprávy rozhodne, jaký typ chyby se vyskytl, a vrátí odpovídající chybovou zprávu
    if (error.errors[0].message === 'email must be unique') {
      return res.status(409).json({ message: 'User with that email already exists' });
    } else if (error.errors[0].message === 'username must be unique') {
      return res.status(400).json({ message: 'User with that username already exists' });
    } else {
      return res.status(500).json({ message: 'An error occurred' });
    }
  }
};

module.exports = {
  registerUser,
};
