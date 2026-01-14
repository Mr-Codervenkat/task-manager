import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);

  // ✅ DEFINE loadTasks HERE
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

  return (
    <div>
      <h2>Welcome {user.username} ({user.role})</h2>

      <h3 style={{ marginTop: "20px" }}>All Tasks</h3>

      <div className="task-grid">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            user={user}
            editable={false}   // ❌ no status edit
            onReload={loadTasks}
          />

        ))}
      </div>
    </div>
  );
}

export default Dashboard;
