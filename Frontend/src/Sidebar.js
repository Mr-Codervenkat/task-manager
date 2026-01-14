import React from "react";

function Sidebar({ setPage }) {
  return (
    <div className="sidebar">
      <h3>Task Manager</h3>

      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("mytasks")}>My Tasks</button>
      <button onClick={() => setPage("assign")}>Assign Task</button>
      <button onClick={() => setPage("history")}>History</button>
      <button onClick={() => window.location.reload()}>Logout</button>
    </div>
  );
}

export default Sidebar;
