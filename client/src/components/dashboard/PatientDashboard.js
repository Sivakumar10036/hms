import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AppointmentsList from '../appointments/AppointmentsList';
import AppointmentForm from '../appointments/AppointmentForm';
import PatientForm from '../patients/PatientForm';

const PatientDashboard = ({ profile }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="patient-dashboard">
      <div className="profile-header">
        <h2>{profile?.firstName} {profile?.lastName}</h2>
        <p>Patient ID: {profile?._id}</p>
      </div>

      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList>
          <Tab>My Appointments</Tab>
          <Tab>Book Appointment</Tab>
          <Tab>My Profile</Tab>
        </TabList>

        <TabPanel>
          <AppointmentsList patientId={profile?._id} />
        </TabPanel>
        <TabPanel>
          <AppointmentForm patientId={profile?._id} />
        </TabPanel>
        <TabPanel>
          <PatientForm patient={profile} isEdit />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;