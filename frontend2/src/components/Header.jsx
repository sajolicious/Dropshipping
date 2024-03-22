import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { Logout } from '../slices/authSlice';
import SearchBox from './SearchBox';

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
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <Link to='/' className='text-xl font-bold'>
          ProShop
        </Link>
        <button className="block lg:hidden focus:outline-none">
          <FaShoppingCart className="text-2xl" />
        </button>
        <div className="hidden lg:block flex-grow">
          <div className='relative mx-auto my-2 sm:my-0'>
            <SearchBox />
          </div>
        </div>
        <div className="flex items-center">
          <Link to='/cart' className='flex items-center px-4 py-2'>
            <FaShoppingCart className="mr-2" /> Cart
            {cartItems.length > 0 && (
              <span className="ml-1 bg-green-500 text-white font-bold px-2 rounded-full">
                {cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div className="ml-4 relative">
              <button className="px-4 py-2" id="user-menu" aria-label="User menu" aria-haspopup="true">
                {userInfo.name}
              </button>
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 divide-y divide-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                <Link to='/profile' className='block px-4 py-2 hover:bg-gray-100' role="menuitem">Profile</Link>
                <button onClick={logoutHandler} className='block px-4 py-2 hover:bg-gray-100 text-red-500' role="menuitem">Logout</button>
              </div>
            </div>
          ) : (
            <Link to='/login' className='px-4 py-2 flex items-center'>
              <FaUser className="mr-2" /> Sign In
            </Link>
          )}
          {userInfo && userInfo.isAdmin && (
            <div className="ml-4 relative">
              <button className="px-4 py-2" id="admin-menu" aria-label="Admin menu" aria-haspopup="true">
                Admin
              </button>
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 divide-y divide-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="admin-menu">
                <Link to='/admin/productlist' className='block px-4 py-2 hover:bg-gray-100' role="menuitem">Products</Link>
                <Link to='/admin/orderlist' className='block px-4 py-2 hover:bg-gray-100' role="menuitem">Orders</Link>
                <Link to='/admin/userlist' className='block px-4 py-2 hover:bg-gray-100' role="menuitem">Users</Link>
                <Link to='/admin/createproduct' className='block px-4 py-2 hover:bg-gray-100' role="menuitem">Create Product</Link>
                <Link to='/admin/createcoupon' className='block px-4 py-2 hover:bg-gray-100' role="menuitem">Create Coupon</Link>
                <Link to='/admin/allcoupons' className='block px-4 py-2 hover:bg-gray-100' role="menuitem">All Coupons</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
