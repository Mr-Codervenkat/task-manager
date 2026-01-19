import React, { useState } from "react";

function TopBar({ user, setUser }) {
  const [openProfile, setOpenProfile] = useState(false);

  const logout = () => {
    setUser(null);
  };

  return (
    <div className="topbar">
      <div className="topbar-right">

        {/* 🔔 Notification */}
        <div className="icon-wrapper">
          <span className="icon">🔔</span>
          <span className="badge">2</span>
        </div>

        {/* 👤 Profile */}
        <div
          className="profile"
          onClick={() => setOpenProfile(!openProfile)}
        >
          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="username">{user.username}</span>

          {openProfile && (
            <div className="profile-dropdown">
              <p><b>{user.username}</b></p>
              <p className="role">{user.role}</p>
              <hr />
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default TopBar;
