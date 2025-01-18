import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import TransactionReportForm from "./TransactionReportForm";
import ReportSummary from "./ReportSummary";
import TransactionsTable from "./TransactionsTable";
import { generatePDF } from "../utils/ReportGeneratorPDF";
import LoadingAnimation from "./LoadingAnimation";
import { useNavigate } from "react-router-dom";
import Clock from "./Clock";



const Report = () => {

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    search: "",
  });
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const REPORT_API = "http://localhost:5000/api/reports";
  const CATEGORY_API = "http://localhost:5000/api/categories";
  const PAYMENT_METHOD_API = "http://localhost:5000/api/payment-methods";

  useEffect(() => {
    // Fetch categories and payment methods on component mount
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(CATEGORY_API);
        const paymentMethodResponse = await axios.get(PAYMENT_METHOD_API);
        setCategories(categoryResponse.data);
        setPaymentMethods(paymentMethodResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(REPORT_API, {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          type: filters.type,
          category: filters.category,
          paymentMethod: filters.paymentMethod,
          search: filters.search,
        },
      });
      const { transactions, totalDebit, totalCredit, totalBalance } =
        response.data;
      setTransactions(transactions);
      setTotalDebit(totalDebit);
      setTotalCredit(totalCredit);
      setTotalBalance(totalBalance);
    } catch (error) {
      setError("Error fetching report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    generatePDF(transactions, totalDebit, totalCredit, totalBalance);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={` bg-purple-900 text-white h-screen text-[14px] w-60 transition-width duration-300`}>
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-1  flex flex-col ">
        {/* Navbar */}
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-between">
          <Clock />
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white py-1 px-4 rounded-lg">
            Logout
          </button>
        </div>

        {/* Content Area */}

        <main className="p-6 bg-gray-100 flex-1">
          <div className="bg-purple-200 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl text-center text-purple-800 font-bold">
              Transaction Report
            </h1>
            <TransactionReportForm
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              paymentMethods={paymentMethods}
              fetchReport={fetchReport}
              loading={loading}
            />
          </div>
          <ReportSummary
            totalDebit={totalDebit}
            totalCredit={totalCredit}
            totalBalance={totalBalance}
          />
          <div className="">
            {loading ? (
              <LoadingAnimation message="Fetching data..." />
            ) : transactions.length > 0 ? (
              <TransactionsTable transactions={transactions} handlePrint={handlePrint} />
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No transactions available for the selected filters.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Report;
