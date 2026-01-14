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

    // Reset form
    setTitle("");
    setAssignedTo("");
    setEmail("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="assign-task">
      <h2>Assign Task</h2>

      <input
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
        <option value="" hidden>Select User</option>
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
        placeholder="Task details"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows="3"
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

      <button onClick={submitTask}>Assign</button>
    </div>
  );
}

export default AssignTask;
