import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaCommentAlt,
  FaList,
  FaRegChartBar,
  FaTh,
  FaUserAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";

import { NavLink, useLocation } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import "./SideBar.css";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const email = sessionStorage.getItem("userId");

  const [defaultSelected, setDefaultSelected] = useState("display");

  useEffect(() => {
    setDefaultSelected(location.pathname.replace(Urlconstant.navigate, ""));
  }, [location.pathname]);

  const menuItem = [
    {
      path: "register",
      name: "Register",
      icon: <FaTh />,
    },
    {
      path: "display",
      name: "Trainee Details",
      icon: <FaUserAlt />,
    },
    {
      path: "followup",
      name: "Follow Up Details",
      icon: <FaRegChartBar />,
    },
    {
      path: "enquiry",
      name: "Enquiry",
      icon: <FaCommentAlt />,
    },

    {
      path: "absentees",
      name: "Add Absentees",
      icon: <FaList />,
    },
    {
      path: "attenances",
      name: "Absentees Details",
      icon: <FaRegChartBar />
    },
    {
      path: "whatsapp",
      name: "WhatsApp",
      icon: <FaWhatsapp />,
    },
    {
      path: "company",
      name: "Company Register",
      icon: <FaTh />,
    },
    {
      path: "companies",
      name: "Company Details",
      icon: <FaUserAlt />,
    },
    {
      path: "feesDetails",
      name: "Fees Details",
      icon: <MdAccountBalanceWallet />,
    },
  ];
  const click = () => {};
  return (
    <div className="">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={{ pathname: item.path }}
            key={index}
            className="link"
            activeClassName="active"
          >
            <div
              className={`icon ${
                defaultSelected === item.path ? "active" : ""
              }`}
            >
              {item.icon}
            </div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className={`link_text ${
                defaultSelected === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
