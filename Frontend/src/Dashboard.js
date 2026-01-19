import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import TopBar from "./TopBar";

function Dashboard({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadTasks = () => {
    fetch(
      `http://localhost:5000/api/tasks?username=${user.username}&role=${user.role}`
    )
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <TopBar user={user} setUser={setUser} />

      <h2 className="welcome">Welcome {user.username} ({user.role})</h2>

      <input
        className="search-input"
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="task-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              user={user}
              editable={false}
              onReload={loadTasks}
            />
          ))
        ) : (
          <p style={{ marginTop: "20px", color: "#777" }}>
            No tasks found
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
