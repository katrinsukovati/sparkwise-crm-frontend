import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoIosWarning } from "react-icons/io";
import "./DeleteConfirmationModal.scss";

function DeleteConfirmationModal({
  show,
  onHide,
  onDelete,
  entityName,
  entityType,
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="delete-modal"
      centered
    >
      <Modal.Body className="delete-modal">
        <div className="delete-modal__icon">
          <IoIosWarning size={60} color="#f5365c" />
        </div>
        <h4 className="delete-modal__title">Are you sure?</h4>
        <p className="delete-modal__message">
          Do you really want to delete <strong>{entityName}</strong>{" "}
          {entityType}? This action cannot be undone.
        </p>
        <div className="delete-modal__actions">
          <Button
            variant="secondary"
            className="delete-modal__cancel"
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="delete-modal__confirm"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteConfirmationModal;
