import React, { useState, useEffect } from "react";
import {
  FaTh,
  FaBars,
  FaUserAlt,
  FaRegChartBar,
  FaCommentAlt,
  FaWhatsapp,
  FaList,
} from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";

import "./SideBar.css";
import { NavLink, useLocation } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const email = sessionStorage.getItem("userId");

  const [defaultSelected, setDefaultSelected] = useState("display");

  useEffect(() => {
    setDefaultSelected(location.pathname.replace(Urlconstant.navigate , ""));
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
      path: "companylist",
      name: "Company Details",
      icon: <FaUserAlt />,
    },
    {
      path: "feesDetailes",
      name: "Fees Detailes",
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
