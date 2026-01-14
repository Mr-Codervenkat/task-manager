import React, { useEffect, useState } from "react";

function TaskHistory({ user }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/history?role=${user.role}`)
      .then(res => res.json())
      .then(data => setRows(data));
  }, [user]);

  return (
    <div className="history-page">
      <h2>Task History</h2>

      <table className="history-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned By</th>
            <th>Assigned To</th>
            <th>Old Status</th>
            <th>New Status</th>
            <th>Changed By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>{row.assigned_by}</td>
              <td>{row.assigned_to}</td>
              <td>{row.old_status}</td>
              <td>{row.new_status}</td>
              <td>{row.changed_by}</td>
              <td>
                {new Date(row.changed_at).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskHistory;
