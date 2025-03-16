import React from "react";

function DoctorDashboard() {
  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>Welcome, Doctor! Here you can manage your patients and appointments.</p>

      {/* Doctor-specific functionality */}
      <div>
        <h2>Manage Patients</h2>
        <button>View Appointments</button>
        <button>Check Patient Records</button>
        <button>Prescribe Medications</button>
      </div>
    </div>
  );
}

export default DoctorDashboard;
