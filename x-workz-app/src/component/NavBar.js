import React from 'react';
import './NavBar.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
function NavBar() {

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="header-social-icon mr-auto">
          <img src='https://www.x-workz.in/Logo.png' width="140" height="70" alt='Xworkz' className='logo-img' />
          <NavLink className="btn btn-primary nav-link" as={Link} to="/">Home</NavLink>
          <NavLink className="btn btn-primary nav-link" as={Link} to="/login">Login</NavLink>
          <NavLink className="btn btn-primary nav-link" as={Link} to="/registration">Register</NavLink>
          <NavLink className="btn btn-primary nav-link" as={Link} to="https://www.facebook.com/xworkzdevelopmentcenter/"><FaFacebook /></NavLink>
          <NavLink className="btn btn-primary nav-link" as={Link} to="/#"><FaInstagram /></NavLink>
          <NavLink className="btn btn-primary nav-link" as={Link} to="https://twitter.com/workz_x"><FaTwitter /></NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;