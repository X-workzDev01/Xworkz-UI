import React from 'react';
import Sidebar from './SideBar';
import Registration from './Registration';

import ViewTable from './ViewTable';
import FollowUp from './FollowUp';
import Profile from './Profile';
import   './Dashboard.css';

import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Attandance from './Attandance';
import Enquiry from './Enquiry';
import ViewAttendance from './ViewAttendance';
import WhatsApp from './WhatsApp';
import WhatsAppLinkSender from './WhatsApp';
import ClientDetails from './ClientDetails';
import ViewClient from './ViewClient';
import CompanyProfile from './CompanyProfile';



const Dashboard = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return null; 
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="Sidebar">
      <Sidebar />
      </div>
      <div className="content">
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/display" element={<ViewTable />} />
        <Route path="/followup" element={<FollowUp />} />
        <Route path="/profile/:email" element={<Profile />} />
        <Route path="/attendance" element={<Attandance />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/attenance/:email" element={<ViewAttendance/>}/>
        <Route path="/whatsapp" element={<WhatsAppLinkSender />} />
        <Route path="/client" element={<ClientDetails/>}/>
        <Route path="/displayclient" element={<ViewClient/>}/>
        <Route path="/clientprofile/:id" element={<CompanyProfile/>}/>
      </Routes>

      
    </div>

    </div>
  );
}

export default Dashboard;





