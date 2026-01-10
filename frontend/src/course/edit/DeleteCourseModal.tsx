import React from "react";
import "../styles/DeleteCourseModal.css";

interface DeleteCourseModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>Czy na pewno chcesz usunąć ten kurs?</p>
        <div className="confirm-btns">
          <button type="button" onClick={onConfirm} className="confirm-yes">
            Tak
          </button>
          <button type="button" onClick={onCancel} className="confirm-no">
            Nie
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
