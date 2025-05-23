// src/components/Navbar.js
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa'; // Add react-icons for a small icon



export default function CustomNavbar() {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        padding: '0.8rem 1.5rem',
        letterSpacing: '0.05em',
        fontWeight: '500',
      }}
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          style={{ fontSize: '1.4rem' }}
        >
          <FaUtensils style={{ marginRight: '8px', color: '#ff6347' }} />
          Recipe Finder
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="mx-2"
              style={{ transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.target.style.color = '#ff6347')}
              onMouseLeave={e => (e.target.style.color = '')}
            >
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/add-recipe">Add Recipe</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
