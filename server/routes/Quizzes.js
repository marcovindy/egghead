const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name'
});

// connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
    return;
  }
  console.log('Connected to MySQL database.');
});

// define the API routes for quizzes
router.post('/quizzes', (req, res) => {
  const quizData = req.body;
  const { name, description, questions } = quizData;

  // validate the quiz data
  if (!name || !description || !questions || questions.length === 0) {
    res.status(400).send({ error: 'Invalid quiz data.' });
    return;
  }

  // save the quiz data to the database
  const insertQuizQuery = `INSERT INTO quizzes (name, description) VALUES ("${name}", "${description}")`;
  connection.query(insertQuizQuery, (error, result) => {
    if (error) {
      console.error('Error saving quiz data to the database:', error);
      res.status(500).send({ error: 'Error saving quiz data to the database.' });
      return;
    }

    const quizId = result.insertId;
    const insertQuestionQuery = `INSERT INTO questions (quiz_id, question, answer) VALUES ?`;
    const questionValues = questions.map((question) => [quizId, question.question, question.answer]);
    connection.query(insertQuestionQuery, [questionValues], (error, result) => {
      if (error) {
        console.error('Error saving question data to the database:', error);
        res.status(500).send({ error: 'Error saving question data to the database.' });
        return;
      }

      console.log('Quiz data saved to the database:', quizData);
      res.status(201).send({ message: 'Quiz data saved successfully.' });
    });
  });
});

module.exports = router;
