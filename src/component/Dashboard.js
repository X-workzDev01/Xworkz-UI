import React from "react";
import Registration from "./Registration";
import Sidebar from "./SideBar";

import "./Dashboard.css";
import FollowUp from "./FollowUp";
import Profile from "./Profile";
import ViewTable from "./ViewTable";

import { Route, Routes } from "react-router-dom";
import Absentees from "./Absentees";
import ClientDetails from "./ClientDetails";
import CompanyProfile from "./CompanyProfile";
import Enquiry from "./Enquiry";
import { FeesDetailes } from "./FeesDetailes";
import Header from "./Header";
import ViewAttendance from "./ViewAttendance";
import ViewClient from "./ViewClient";
import ViewHrProfile from "./ViewHrProfile";
import WhatsAppLinkSender from "./WhatsApp";
import Attandance from "./Attandance";
import AttendanceModal from "./AttendanceModal";
import ExportData from "./ExportData";
import { BirthdayInfo } from "./BirthdayInfo";


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
          <Route path="/absentees" element={<Absentees />} />
          <Route path="/attenances" element={<Attandance />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/attenance/:id/:courseName" element={<AttendanceModal />} />
          <Route path="/whatsapp" element={<WhatsAppLinkSender />} />
          <Route path="/feesDetails" element={<FeesDetailes />} />
          <Route path="/company" element={<ClientDetails />} />
          <Route path="/companies" element={<ViewClient />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          <Route path="/company/hr/:id" element={<ViewHrProfile />} />
          <Route path="/exportdata" element={<ExportData />} />
          <Route path="/birthdays" element={<BirthdayInfo />} />
        </Routes>
      </div>


    </div>
  );
};

export default Dashboard;
