import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLaptop, FaTshirt, FaHome } from 'react-icons/fa';

const categories = [
  { id: 1, name: 'Electronics', icon: <FaLaptop />, link: '/category/1' },
  { id: 2, name: 'Clothing', icon: <FaTshirt />, link: '/category/2' },
  { id: 3, name: 'Home Decor', icon: <FaHome />, link: '/category/3' },
  { id: 1, name: 'Electronics', icon: <FaLaptop />, link: '/category/1' },
  { id: 2, name: 'Clothing', icon: <FaTshirt />, link: '/category/2' },
  { id: 3, name: 'Home Decor', icon: <FaHome />, link: '/category/3' },
  { id: 1, name: 'Electronics', icon: <FaLaptop />, link: '/category/1' },
  { id: 2, name: 'Clothing', icon: <FaTshirt />, link: '/category/2' },
  { id: 3, name: 'Home Decor', icon: <FaHome />, link: '/category/3' },
  { id: 1, name: 'Electronics', icon: <FaLaptop />, link: '/category/1' },
  { id: 2, name: 'Clothing', icon: <FaTshirt />, link: '/category/2' },

  // Add more categories as needed
];

const ProductCategorySection = () => {
  return (
    <Navbar bg="light" expand="lg" className="mb-5">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ">
            {categories.map(category => (
              <Nav.Link key={category.id} as={Link} to={category.link}>
                <div className="d-flex flex-column align-items-center">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ProductCategorySection;
