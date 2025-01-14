Here I have added two parts, one is Categoty Settings and another is Payment Settings. They both are showing in the same screen. I want a tab selection option at the top so that if the user select category the screen will contain category settings and if the user select payment the screen will contain payment settings secton and if the user select payment the screen will contain payment settings section. Also if I can make new components for category and payment settings and pass props instead of having all the code in one file (Settings component), it will be better for me. Can you please help to separate the components and create a tab selection to switch between the components?.

import React, { useState } from "react";
import axios from "axios";

import Nav from "../components/Nav";
import { components } from "react-select";
const Settings = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("credit");
  const [paymentMethodName, setPaymentMethodName] = useState("");
  const [message, setMessage] = useState("");

  // API endpoints
  const CATEGORY_API = "http://localhost:5000/api/categories";
  const PAYMENT_METHOD_API = "http://localhost:5000/api/payment-methods";

  // Function to handle category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(CATEGORY_API, {
        type: categoryType,
        name: categoryName,
      });
      setMessage(`Category created successfully: ${response.data.name}`);
      setCategoryName(""); // Reset input field
    } catch (error) {
      setMessage(
        `Error creating category: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Function to handle payment method creation
  const handleCreatePaymentMethod = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(PAYMENT_METHOD_API, {
        name: paymentMethodName,
      });
      setMessage(`Payment method created successfully: ${response.data.name}`);
      setPaymentMethodName(""); // Reset input field
    } catch (error) {
      setMessage(
        `Error creating payment method: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={` bg-purple-900 text-white h-screen text-[14px] w-60 transition-width duration-300`}>
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Navbar */}
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-end items-center ">
          <button className=" font-bold ">logout</button>
        </div>

        {/* Content Area */}

        <div className="flex-1 p-4 bg-gray-200">
          {message && (
            <div
              className="mb-4 p-3 text-sm font-medium text-white bg-green-500 rounded-md"
              role="alert">
              {message}
            </div>
          )}

          {/* Categoty Settings */}
          <div className="bg-purple-900 max-w-7xl p-5 rounded mx-auto">
            <form onSubmit={handleCreateCategory}>
              <div className="grid md:grid-cols-3  gap-5 max-w-7xl">
                <div className="col-span-1  gap-5 ">
                  <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                    Account Type
                  </label>

                  <label className="flex mb-3 items-center ">
                    <input
                      type="radio"
                      name="categoryType"
                      value="credit"
                      checked={categoryType === "credit"}
                      onChange={() => setCategoryType("credit")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2"
                    />
                    <span className="ms-2 text-sm font-medium text-white dark:text-gray-300">
                      Credit
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="categoryType"
                      value="debit"
                      checked={categoryType === "debit"}
                      onChange={() => setCategoryType("debit")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2"
                    />
                    <span className="ms-2 text-sm font-medium text-white dark:text-gray-300">
                      Debit
                    </span>
                  </label>
                </div>

                <div className="col-span-1">
                  <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                    Account Head
                  </label>
                  <div>
                    <input
                      type="text"
                      id="categoryName"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    />
                  </div>
                </div>

                <div className="col-span-1 ">
                  <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                    Action
                  </label>
                  <button
                    type="submit"
                    className="bg-green-700 w-[60px] rounded m-1 text-white p-1">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
{/* Payment Settings */}
          <div className="bg-purple-900 max-w-7xl mt-10 p-5 rounded mx-auto">
            <form onSubmit={handleCreatePaymentMethod}>
              <div className="grid md:grid-cols-2  gap-5 max-w-7xl">
                <div className="col-span-1">
                  <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                    Payment
                  </label>
                  <input
                    type="text"
                    id="paymentMethodName"
                    value={paymentMethodName}
                    onChange={(e) => setPaymentMethodName(e.target.value)}
                    placeholder="Enter payment method name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    required
                  />
                </div>

                <div className="col-span-1 ">
                  <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                    Action
                  </label>
                  <button
                    type="submit"
                    className="bg-green-700 w-[60px] rounded m-1 text-white p-1">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;