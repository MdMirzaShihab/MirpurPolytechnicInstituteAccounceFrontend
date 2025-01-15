import React, { useState } from "react";
import { Link } from "react-router-dom";
import mpi from "../assets/mpi.png";
const Nav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false); // Toggle for submenu

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-purple-900 text-white h-screen text-[14px] w-60 transition-width duration-300`}>
        <div className="flex-1 flex flex-row m-3">
          <img src={mpi} className="w-12 h-12" />
          {/* Navbar */}
          <div className="bg-purple-900 text-white px-4 py-2 flex justify-between items-center ">
            <h1 className="text-lg font-semibold">MPI</h1>
          </div>
        </div>

        <nav>
          <ul className="space-y-0">
            <li>
              <Link to="/dashboard" className="block p-4 hover:bg-purple-900">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transation" className="block p-4 hover:bg-purple-900">
                Transactions
              </Link>
            </li>

            <li>
              <Link to="/report" className="block p-4 hover:bg-purple-900">
                Reports
              </Link>
            </li>
            <li>
              <Link to="/settings" className="block p-4 hover:bg-purple-900">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
    </div>
  );
};

export default Nav;
