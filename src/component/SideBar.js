import React, { useState, useEffect } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
} from "react-icons/fa";
import './SideBar.css';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    const location = useLocation();
    const [defaultSelected, setDefaultSelected] = useState("display"); // Set "display" as the default

    useEffect(() => {
        // Update the defaultSelected when the component mounts
        setDefaultSelected(location.pathname.replace('/x-workz/', ''));
    }, [location.pathname]);


    const menuItem = [
        {
            path: "register",
            name: "Register",
            icon: <FaTh />
        },
        {
            path: "display",
            name: "Trainee Table",
            icon: <FaUserAlt />
        },
        {
            path: "followup",
            name: "Follow Up Table",
            icon: <FaRegChartBar />
        },
        {
            path: "enquiry",
            name: "Enquiry",
            icon: <FaCommentAlt />
        }
    ];

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
                        to={item.path}
                        key={index}
                        className="link"
                        activeClassName="active"
                    >
                        <div className={`icon ${defaultSelected === item.path ? 'active' : ''}`}>{item.icon}</div>
                        <div
                            style={{ display: isOpen ? "block" : "none" }}
                            className={`link_text ${defaultSelected === item.path ? 'active' : ''}`}
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
