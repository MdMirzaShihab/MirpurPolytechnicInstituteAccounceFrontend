import React, { useEffect, useState } from "react";
import axios from "axios";

import Select from "react-select";
import Nav from "../components/Nav";

const Transaction = () => {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    paymentMethod: "",
    remarks: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [debitAccounts, setDebitAccounts] = useState([]);
  const [creditAccounts, setCreditAccounts] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [filterSaveTrigger, setFilterSaveTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:5000/api/categories"
        );
        const paymentMethodResponse = await axios.get(
          "http://localhost:5000/api/payment-methods"
        );
        setCategories(categoryResponse.data);
        setPaymentMethods(paymentMethodResponse.data);

        const cashPaymentMethod = paymentMethodResponse.data.find(
          (method) => method.name.toLowerCase() === "cash"
        );
        if (cashPaymentMethod) {
          setFormData((prevData) => ({
            ...prevData,
            paymentMethod: cashPaymentMethod._id,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories or payment methods:", error);
      }
    };

    fetchData();
  }, [formData.type]);

  const fetchData = async (url, setter, totalSetter, totalKey) => {
    try {
      const response = await axios.get(url);
      setter(response.data.transactions || []);
      totalSetter(response.data[totalKey] || 0);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          "http://localhost:5000/api/today-reports/debits/today",
          setDebitAccounts,
          setTotalDebit,
          "totalDebit"
        ),
        fetchData(
          "http://localhost:5000/api/today-reports/credits/today",
          setCreditAccounts,
          setTotalCredit,
          "totalCredit"
        ),
      ]);
    };

    fetchAllData();
  }, [filterSaveTrigger]);

  const handleDelete = async (id, type) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      const url = `http://localhost:5000/api/today-reports/${type}s/today/${id}`;
      await axios.delete(url);
      alert("Transaction deleted successfully");
      setFilterSaveTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction.");
    }
  };

  const renderTableRows = (data, type) =>
    data.map((transaction) => (
      <tr
        key={transaction._id}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4">{transaction.category.name}</td>
        <td className="px-6 py-4">{transaction.amount}</td>
        <td className="px-6 py-4">{transaction.paymentMethod.name}</td>
        <td className="px-6 py-4">
          <button
            onClick={() => handleDelete(transaction._id, type)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
            Delete
          </button>
        </td>
      </tr>
    ));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? (value ? parseFloat(value) : "") : value,
    });
  };

  const handleSelectChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/transactions", formData);
      alert("Transaction created successfully!");
      setFormData({
        type: "",
        category: "",
        amount: "",
        paymentMethod: "",
        remarks: "",
        date: new Date().toISOString().split("T")[0],
      });
      setFilterSaveTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction.");
    }
  };

  const categoryOptions = categories
    .filter((cat) => cat.type.toLowerCase() === formData.type.toLowerCase())
    .map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method._id,
    label: method.name,
  }));

  const typeOptions = [
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];

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
          <div className="mx-auto max-w-7xl mt-10 bg-gray-100 shadow rounded">
            <div className="bg-purple-900 p-2">
              <h1 className="text-white font-bold text-center">Transation</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-6 p-5 gap-5">
                <div className="col-span-1">
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Accounts Type
                  </label>
                  <Select
                    name="type"
                    value={typeOptions.find(
                      (option) => option.value === formData.type
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, "type")
                    }
                    options={typeOptions}
                    placeholder="Select Type"
                    required
                    isSearchable
                    className="w-full"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Accounts Head
                  </label>
                  <Select
                    name="category"
                    value={categoryOptions.find(
                      (option) => option.value === formData.category
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, "category")
                    }
                    options={categoryOptions}
                    placeholder="Select Head"
                    isDisabled={!formData.type}
                    isSearchable
                    className="w-full"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Amount"
                    name="amount"
                    value={formData.amount || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Payment Method
                  </label>
                  <Select
                    placeholder="Payment Method"
                    isSearchable
                    className="w-full"
                    name="paymentMethod"
                    value={paymentMethodOptions.find(
                      (option) => option.value === formData.paymentMethod
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, "paymentMethod")
                    }
                    options={paymentMethodOptions}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date
                  </label>
                  <input
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your message
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks || ""}
                    onChange={handleInputChange}
                    rows="2"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."></textarea>
                </div>
                <div className="col-span-5 "></div>
                <div className="col-span-1 ">
                  <button
                    type="submit"
                    className="bg-green-500  ms-auto border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="grid md:grid-cols-2 max-w-7xl mx-auto gap-5 ">
            {/* Credit Accounts Table */}
            <div className="relative w-full max-w-7xl col-span-1 mt-10 mb-20 mx-auto ">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white bg-red-500 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Account Head</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Payment Method</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creditAccounts.length > 0 ? (
                    renderTableRows(creditAccounts, "credit")
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center px-6 py-4">
                        No credit accounts available
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 font-bold">
                      Total Credit
                    </td>
                    <td className="px-6 py-4 font-bold">{totalCredit}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Debit Accounts Table */}
            <div className="relative w-full max-w-7xl col-span-1 mt-10 mb-20 mx-auto overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white bg-blue-500 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Account Head</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Payment Method</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {debitAccounts.length > 0 ? (
                    renderTableRows(debitAccounts, "debit")
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center px-6 py-4">
                        No debit accounts available
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 font-bold">
                      Total Debit
                    </td>
                    <td className="px-6 py-4 font-bold">{totalDebit}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="max-w-7xl mx-auto gap-5 flex justify-between"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
