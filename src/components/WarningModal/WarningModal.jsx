import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoIosWarning } from "react-icons/io";
import "./WarningModal.scss";

function WarningModal({ show, onHide, onConfirm, entityName }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="cancel-modal"
      centered
    >
      <Modal.Body className="cancel-modal">
        <div className="cancel-modal__icon">
          <IoIosWarning size={60} color="#ff9900" />
        </div>
        <h4 className="cancel-modal__title">Are you sure?</h4>
        <p className="cancel-modal__message">Your changes will not be saved.</p>
        <div className="cancel-modal__actions">
          <Button
            variant="secondary"
            className="cancel-modal__cancel"
            onClick={onHide}
          >
            Keep Editing
          </Button>
          <Button
            variant="warning"
            className="cancel-modal__confirm"
            onClick={onConfirm}
          >
            Discard Changes
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WarningModal;
