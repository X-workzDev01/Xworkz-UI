import React from 'react';
import './NavBar.css';
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
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;