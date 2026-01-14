import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

function MyTasks({ user }) {
  const [tasks, setTasks] = useState([]);

const loadTasks = () => {
  fetch(
    `http://localhost:5000/api/tasks?username=${user.username}&role=MY_TASKS`
  )
    .then(res => res.json())
    .then(data => setTasks(data));
};


  useEffect(() => {
    loadTasks();
  }, []);

  // ✅ THIS FUNCTION WAS MISSING
  const handleStatusChange = async (taskId, newStatus) => {
    await fetch("http://localhost:5000/api/tasks/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: taskId,
        status: newStatus
      })
    });

    loadTasks(); // refresh UI
  };

  return (
    <div>
      <h2>My Tasks</h2>

      <div className="task-grid">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            user={user}
            editable={true}   // ✅ only MyTasks is editable
            onReload={loadTasks}
          />



        ))}
      </div>
    </div>
  );
}

export default MyTasks;
