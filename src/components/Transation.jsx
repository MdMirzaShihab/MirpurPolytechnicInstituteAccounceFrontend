import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionForm from "./TransactionForm";
import TodayDebit from "./TodayDebit";
import TodayCredit from "./TodayCredit";
import Nav from "../components/Nav";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import Clock from "./Clock";


const Transaction = () => {
  
  const navigate = useNavigate();
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
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [deleteTransaction, setDeleteTransaction] = useState({
    id: null,
    type: "",
  });

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
        toast.error("Error fetching categories or payment methods.");
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
      toast.error(`Error fetching data from ${url}.`);
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

  const handleDelete = async () => {
    try {
      const url = `http://localhost:5000/api/today-reports/${deleteTransaction.type}s/today/${deleteTransaction.id}`;
      await axios.delete(url);
      toast.success("Transaction deleted successfully.");
      setFilterSaveTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to delete transaction.");
    } finally {
      setShowModal(false);
    }
  };

  const confirmDelete = (id, type) => {
    setDeleteTransaction({ id, type });
    setShowModal(true);
  };

  const handleEdit = (transaction, type) => {
    setFormData({
      type,
      category: transaction.category._id,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod._id,
      remarks: transaction.remarks,
      date: transaction.date.split("T")[0],
    });
    setIsEditing(true);
    setEditId(transaction._id);
  };

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

    const url = isEditing
      ? `http://localhost:5000/api/today-reports/${formData.type}s/today/${editId}`
      : "http://localhost:5000/api/transactions";
    try {
      if (isEditing) {
        await axios.put(url, formData);
        toast.success("Transaction updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(url, formData);
        toast.success("Transaction created successfully!");
      }
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
      toast.error("Failed to create or update transaction.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
          message="Are you sure you want to delete this transaction?"
        />
      )}

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

        <div className="p-6 space-y-6">
          {/* Transaction Form */}
          <div className="bg-purple-200 shadow-lg shadow-purple-300 rounded-lg p-6">
            <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">
              Create or Edit Transaction
            </h2>
            <TransactionForm
              formData={formData}
              categories={categories}
              paymentMethods={paymentMethods}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSubmit={handleSubmit}
            />
          </div>

          {/* Today’s Debit and Credit Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-100 shadow-lg rounded-lg shadow-blue-300 p-6">
              <TodayDebit
                debitAccounts={debitAccounts}
                totalDebit={totalDebit}
                handleDelete={(id) => confirmDelete(id, "debit")}
                handleEdit={(transaction) => handleEdit(transaction, "debit")}
              />
            </div>
            <div className="bg-red-100 shadow-lg rounded-lg shadow-red-300 p-6">
              <TodayCredit
                creditAccounts={creditAccounts}
                totalCredit={totalCredit}
                handleDelete={(id) => confirmDelete(id, "credit")}
                handleEdit={(transaction) => handleEdit(transaction, "credit")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
