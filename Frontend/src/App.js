import React, { useState } from "react";
import Login from "./Login";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import MyTasks from "./MyTasks";
import AssignTask from "./AssignTask";
import TaskHistory from "./TaskHistory";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  // IF NOT LOGGED IN → SHOW LOGIN
  if (!user) {
    return <Login setUser={setUser} />;
  }

  // AFTER LOGIN → SHOW APP
  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />

      <div style={{ flex: 1, padding: "20px" }}>
        {page === "dashboard" && <Dashboard user={user} />}
        {page === "mytasks" && <MyTasks user={user} />}
        {page === "assign" && <AssignTask user={user} />}
        {page === "history" && <TaskHistory user={user} />}

      </div>
    </div>
  );
}

export default App;
