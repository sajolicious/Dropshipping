import { Link } from 'react-router-dom';
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { Logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { Fragment } from 'react';

export const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      window.location.href = '/login'; // Redirect using window.location.href for full page reload
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg'  collapseOnSelect>
        <Container>
          <Link to='/' className='navbar-brand'>
            ProShop
          </Link>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <div className='relative mx-auto my-2 sm:my-0'>
                <SearchBox />
              </div>
              <Link to='/cart' className='nav-link'>
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg='success' className='ms-1'>
                    {cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <Link to='/profile' className='dropdown-item'>
                    Profile
                  </Link>
                  <a href='/' onClick={logoutHandler} className='dropdown-item'>
                    Logout
                  </a>
                </NavDropdown>
              ) : (
                <Link to='/login' className='nav-link'>
                  <FaUser /> Sign In
                </Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <Link to='/admin/productlist' className='dropdown-item'>
                    Products
                  </Link>
                  <Link to='/admin/orderlist' className='dropdown-item'>
                    Orders
                  </Link>
                  <Link to='/admin/userlist' className='dropdown-item'>
                    Users
                  </Link>
                  <Link to='/admin/createproduct' className='dropdown-item'>
                    CreateProduct
                  </Link>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
