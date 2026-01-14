import React, { useState } from "react";

function AssignTask({ user }) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const submitTask = async () => {
    if (!title || !assignedTo || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        assigned_by: user.username,
        assigned_to: assignedTo,
        email,
        start_date: startDate,
        end_date: endDate,
        role: user.role
      })
    });

    alert("Task assigned successfully");

    setTitle("");
    setAssignedTo("");
    setEmail("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="assign-wrapper">
      <div className="assign-card">
        <h2 className="assign-title">Assign Task</h2>

        <div className="assign-grid">
          <input
            placeholder="Task Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
          >
            <option value="">Select User</option>
            <option value="pm">Project Manager</option>
            <option value="lead">Team Lead</option>
            <option value="member1">Member 1</option>
            <option value="member2">Member 2</option>
          </select>

          <input
            placeholder="Email ID"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Task Details"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <div className="assign-action">
          <button onClick={submitTask}>Assign Task</button>
        </div>
      </div>
    </div>
  );
}

export default AssignTask;
