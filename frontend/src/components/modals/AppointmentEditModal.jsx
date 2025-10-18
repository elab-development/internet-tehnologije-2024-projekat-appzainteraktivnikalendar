import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AppointmentEditModal = ({
  show,
  onHide,
  appointment,
  onUpdate,
  onDelete,
}) => {
  const [note, setNote] = useState(appointment?.note || "");

  const handleSave = () => {
    onUpdate({ ...appointment, note });
    onHide();
  };

  const handleDelete = () => {
    onDelete(appointment.id);
    onHide();
  };

  if (!appointment) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Izmena termina</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Datum:</strong> {appointment.date}
        </p>
        <p>
          <strong>Vreme:</strong> {appointment.time}
        </p>
        <Form.Group className="mb-3">
          <Form.Label>Napomena</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          Otkaži termin
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Sačuvaj izmene
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentEditModal;
