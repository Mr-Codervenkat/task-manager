import React, { useState, useEffect } from "react";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

function TaskCard({ task, user, onReload, editable }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(task.status);

  // keep local state in sync if parent reloads
  useEffect(() => {
    setStatus(task.status);
  }, [task.status]);

  const canUpdateStatus =
    editable &&
    user &&
    user.username &&
    task.assigned_to &&
    user.username.toLowerCase() === task.assigned_to.toLowerCase();

const updateStatus = async (newStatus) => {
  setStatus(newStatus);

  await fetch("http://localhost:5000/api/tasks/status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: task.id,
      status: newStatus,
      changed_by: user.username   // ✅ ADD THIS
    })
  });

  onReload();
};



  return (
    <>
      <div className="task-card" onClick={() => setOpen(true)}>
        <h4>{task.title}</h4>
        <h3>{task.assigned_to}</h3>
        <div className={`task-status status-${status.replace(" ", "")}`}>
          {status}
        </div>
        <small>Due: {formatDate(task.end_date)}</small>
      </div>

      {open && (
        <div className="modal">
          <div className="modal-content">
            <h3>{task.title}</h3>

            <p><b>Description:</b> {task.description || "N/A"}</p>
            <p><b>Assigned By:</b> {task.assigned_by}</p>
            <p><b>Assigned To:</b> {task.assigned_to}</p>
            <p><b>Email:</b> {task.email || "N/A"}</p>
            <p><b>Start:</b> {formatDate(task.start_date)}</p>
            <p><b>End:</b> {formatDate(task.end_date)}</p>

            <p>
              <b>Status:</b>{" "}
              {canUpdateStatus ? (
                <select
                  value={status}
                  onChange={(e) => updateStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                status
              )}
            </p>

            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
