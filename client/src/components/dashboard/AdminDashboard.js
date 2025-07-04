import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PatientsList from '../patients/PatientsList';
import DoctorsList from '../doctors/DoctorsList';
import AppointmentsList from '../appointments/AppointmentsList';
import BillingForm from '../billing/BillingForm';
import AppointmentReports from '../reports/AppointmentReports';
import FinancialReports from '../reports/FinancialReports';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="admin-dashboard">
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList>
          <Tab>Patients</Tab>
          <Tab>Doctors</Tab>
          <Tab>Appointments</Tab>
          <Tab>Billing</Tab>
          <Tab>Reports</Tab>
        </TabList>

        <TabPanel>
          <PatientsList />
        </TabPanel>
        <TabPanel>
          <DoctorsList />
        </TabPanel>
        <TabPanel>
          <AppointmentsList />
        </TabPanel>
        <TabPanel>
          <BillingForm />
        </TabPanel>
        <TabPanel>
          <div className="reports-container">
            <AppointmentReports />
            <FinancialReports />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;