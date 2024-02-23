import {  Link, useNavigate } from 'react-router-dom';
import {Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { FaUser} from 'react-icons/fa';
import { BsHandbag } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { Logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import {useSelector, useDispatch} from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';

export const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } =useSelector((state)=> state.auth);
  
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  
  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
        await logoutApiCall().unwrap();
        dispatch(Logout());
        nevigate('/login');
    } catch (err) {
        console.log(err)
    }
  }
  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              
              ProShop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
