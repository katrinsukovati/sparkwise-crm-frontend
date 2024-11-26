import React from "react";
import "./StatusLabel.scss";

function StatusLabel({ text }) {
  // mapping of statuses to the scss class names
  const statusClasses = {
    "invoice sent": "status-label--invoice-sent",
    "trial completed": "status-label--trial-completed",
    "trial scheduled": "status-label--trial-scheduled",
    "form submitted": "status-label--form-submitted",
    enrolled: "status-label--enrolled",
    "can't reach": "status-label--cant-reach",
    "not a fit": "status-label--not-a-fit",
    "no show": "status-label--no-show",
    "registration form filled": "status-label--registration-form-filled",
  };

  const statusClass =
    statusClasses[text.toLowerCase()] || "status-label--default";

  return <div className={`status-label ${statusClass}`}>{text}</div>;
}

export default StatusLabel;
