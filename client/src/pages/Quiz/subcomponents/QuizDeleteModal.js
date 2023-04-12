import { Modal, Button } from 'react-bootstrap';

function QuizDeleteModal({ show, onHide, handleDelete }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Smazat kvíz</Modal.Title>
      </Modal.Header>
      <Modal.Body>Určitě chcete smazat tento kvíz?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Zrušit
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
