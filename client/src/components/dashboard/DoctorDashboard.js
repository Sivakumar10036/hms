import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AppointmentsList from '../appointments/AppointmentsList';
import PatientForm from '../patients/PatientForm';
import DoctorForm from '../doctors/DoctorForm';

const DoctorDashboard = ({ profile }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="doctor-dashboard">
      <div className="profile-header">
        <h2>Dr. {profile?.firstName} {profile?.lastName}</h2>
        <p>{profile?.specialization}</p>
      </div>

      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList>
          <Tab>My Appointments</Tab>
          <Tab>My Availability</Tab>
          <Tab>My Profile</Tab>
        </TabList>

        <TabPanel>
          <AppointmentsList doctorId={profile?._id} />
        </TabPanel>
        <TabPanel>
          <DoctorForm doctor={profile} isEdit />
        </TabPanel>
        <TabPanel>
          <DoctorForm doctor={profile} isEdit />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;