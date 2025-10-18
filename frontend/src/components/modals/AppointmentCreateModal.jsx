import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AppointmentCreateModal = ({ show, onHide, selectedDate, onCreate }) => {
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onCreate({ date: selectedDate, note });
    setNote("");
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Novi termin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Datum:</strong> {selectedDate}
        </p>
        <Form.Group className="mb-3">
          <Form.Label>Napomena (opciono)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Otkaži
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Zakaži
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentCreateModal;
