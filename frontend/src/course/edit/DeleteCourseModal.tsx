import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/DeleteCourseModal.css";

interface DeleteCourseModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{t("delete_modal.question")}</p>
        <div className="confirm-btns">
          <button type="button" onClick={onConfirm} className="confirm-yes">
            {t("delete_modal.confirm")}
          </button>
          <button type="button" onClick={onCancel} className="confirm-no">
            {t("delete_modal.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
