import React, { useState } from "react";
import Nav from "../components/Nav";
import CategorySettings from "./CategorySettings";
import PaymentSettings from "./PaymentSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("category"); // "category" or "payment"

  const renderContent = () => {
    if (activeTab === "category") {
      return <CategorySettings />;
    } else if (activeTab === "payment") {
      return <PaymentSettings />;
    }
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
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-end items-center">
          <button className="font-bold">Logout</button>
        </div>

        {/* Tabs */}
        <div className=" p-4">
          <div className="flex rounded-md justify-center">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "category"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("category")}>
              Category Settings
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "payment"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("payment")}>
              Payment Settings
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
