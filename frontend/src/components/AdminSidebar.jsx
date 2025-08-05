import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen fixed">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                    isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/stores"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                    isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Stores
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/admin/catalog"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                    isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Catalog
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/reviews"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                    isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md hover:bg-gray-700 ${
                    isActive ? 'bg-gray-900' : ''
                  }`
                }
              >
                Analytics
              </NavLink>
            </li> */}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;