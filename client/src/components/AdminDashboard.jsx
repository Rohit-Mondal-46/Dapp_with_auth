import React from "react";

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage users, doctors, and the system settings.</p>

      {/* Admin-specific functionality */}
      <div>
        <h2>Manage Users</h2>
        <button>View All Users</button>
        <button>Manage Doctors</button>
        <button>System Settings</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
