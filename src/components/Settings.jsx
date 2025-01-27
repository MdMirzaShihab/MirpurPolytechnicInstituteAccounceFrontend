import React, { useState } from "react";
import Nav from "./Nav";
import CategorySettings from "./CategorySettings";
import PaymentSettings from "./PaymentSettings";
import { useNavigate } from "react-router-dom";
import Clock from "./Clock";
import TransactionSettings from "./TransactionSettings";


const Settings = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("category"); // "category" or "payment"

  const renderContent = () => {
    if (activeTab === "category") {
      return <CategorySettings />;
    } else if (activeTab === "payment") {
      return <PaymentSettings />;
    }
    else if (activeTab === "transaction") {
      return <TransactionSettings />;
    }
    
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className="bg-purple-900 text-white h-screen text-[14px] w-60 transition-width duration-300">
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-between">
          <Clock />
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white py-1 px-4 rounded-lg">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className=" p-4">
          <div className="flex rounded-md justify-center">
            <button
              className={`px-4 py-2 rounded-s-lg ${
                activeTab === "category"
                  ? "bg-purple-900 text-white font-bold"
                  : "bg-purple-200 text-gray-800 border-2 border-purple-900"
              }`}
              onClick={() => setActiveTab("category")}>
              Categories
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "payment"
                  ? "bg-purple-900 text-white font-bold "
                  : "bg-purple-200 text-gray-800 border-2 border-purple-900"
              }`}
              onClick={() => setActiveTab("payment")}>
              Payment Options
            </button>
            <button
              className={`px-4 py-2 rounded-e-lg ${
                activeTab === "transaction"
                  ? "bg-purple-900 text-white font-bold "
                  : "bg-purple-200 text-gray-800 border-2 border-purple-900"
              }`}
              onClick={() => setActiveTab("transaction")}>
              Transactions
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
