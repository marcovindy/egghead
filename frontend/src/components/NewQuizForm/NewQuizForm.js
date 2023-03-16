import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const NewQuizForm = () => {
  const [quizData, setQuizData] = useState({
    name: '',
    description: '',
    questions: [],
  });

  const history = useHistory();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleQuestionInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][name] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addNewQuestion = () => {
    const newQuestion = { question: '', answer: '' };
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/quizzes', quizData);
      console.log(response.data);
      history.push('/confirmation-page');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="quizName">
        <Form.Label>Quiz Name</Form.Label>
        <Form.Control type="text" name="name" value={quizData.name} onChange={handleInputChange} />
      </Form.Group>
      <Form.Group controlId="quizDescription">
        <Form.Label>Quiz Description</Form.Label>
        <Form.Control as="textarea" rows={3} name="description" value={quizData.description} onChange={handleInputChange} />
      </Form.Group>
      {quizData.questions.map((question, index) => (
        <div key={index}>
          <Form.Group controlId={`question${index}`}>
            <Form.Label>Question</Form.Label>
            <Form.Control type="text" name="question" value={question.question} onChange={(event) => handleQuestionInputChange(event, index)} />
          </Form.Group>
          <Form.Group controlId={`answer${index}`}>
            <Form.Label>Answer</Form.Label>
            <Form.Control type="text" name="answer" value={question.answer} onChange={(event) => handleQuestionInputChange(event, index)} />
          </Form.Group>
        </div>
      ))}
      <Button variant="primary" type="button" onClick={addNewQuestion}>
        Add New Question
      </Button>
      <Button variant="success" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default NewQuizForm;



// Tento kód představuje formulář pro vytvoření nového kvízu.

// Komponenta používá hook useState pro uchování stavu formuláře. Objekt quizData obsahuje název kvízu, 
// popis a seznam otázek a odpovědí. Tyto položky se aktualizují 
// pomocí funkcí handleInputChange a handleQuestionInputChange, 
// které jsou volány při změně hodnoty v poli vstupů.

// Metoda addNewQuestion přidává novou prázdnou otázku a odpověď do seznamu otázek v objektu quizData.

// Metoda handleSubmit se spouští při odeslání formuláře a odesílá data kvízu na server 
// pomocí knihovny Axios. Po úspěšném odeslání se přesměruje uživatele na stránku s potvrzením.

// Formulář obsahuje několik polí pro vstup dat, jako je název kvízu a popis, a pro každou otázku je vytvořeno 
// samostatné pole vstupu pro otázku a odpověď. Tlačítko "Add New Question" umožňuje 
// uživateli přidávat další otázky.

// Celkově je kód dobře strukturovaný a používá moderní funkce Reactu, jako jsou funkční komponenty a hooky.