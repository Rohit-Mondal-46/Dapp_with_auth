import React from "react";

function PatientDashboard() {
  return (
    <div>
      <h1>Patient Dashboard</h1>
      <p>Welcome, Patient! Here you can view your appointments and health records.</p>

      {/* Patient-specific functionality */}
      <div>
        <h2>Your Health Information</h2>
        <button>View Appointments</button>
        <button>Check Health Records</button>
        <button>Book a Doctor's Appointment</button>
      </div>
    </div>
  );
}

export default PatientDashboard;
