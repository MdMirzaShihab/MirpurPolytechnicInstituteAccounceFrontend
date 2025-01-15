import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import Nav from "../components/Nav";
import LoadingAnimation from "./LoadingAnimation";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/analytics/monthly"
        );
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  const debitCategoryData = analytics
    ? {
        labels: analytics.debitByCategory.map((item) => item.category),
        datasets: [
          {
            label: "Debit Categories",
            data: analytics.debitByCategory.map((item) => item.total),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A"],
          },
        ],
      }
    : {};

  const creditCategoryData = analytics
    ? {
        labels: analytics.creditByCategory.map((item) => item.category),
        datasets: [
          {
            label: "Credit Categories",
            data: analytics.creditByCategory.map((item) => item.total),
            backgroundColor: ["#4BC0C0", "#FF9F40", "#FF6384", "#9966FF"],
          },
        ],
      }
    : {};

  const debitCreditComparisonData = analytics
    ? {
        labels: ["Debits", "Credits"],
        datasets: [
          {
            label: "Amount",
            data: [analytics.totalDebits, analytics.totalCredits],
            backgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      }
    : {};

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="bg-purple-900 text-white h-screen w-60">
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-end">
          <button className="font-bold">Logout</button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 grid gap-6 overflow-hidden">
          {/* Check for loading */}
          {!analytics ? (
            <LoadingAnimation message="Fetching data..." />
          ) : (
            <>
              {/* KPI Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-1/4">
                <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Total Debits
                  </h2>
                  <p className="text-2xl font-bold text-red-600">
                    ৳ {analytics.totalDebits.toLocaleString()}
                  </p>
                  <AiOutlineArrowDown className="text-red-600 text-xl" />
                </div>
                <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Total Credits
                  </h2>
                  <p className="text-2xl font-bold text-green-600">
                    ৳ {analytics.totalCredits.toLocaleString()}
                  </p>
                  <AiOutlineArrowUp className="text-green-600 text-xl" />
                </div>
                <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Total Transactions
                  </h2>
                  <p className="text-2xl font-bold text-yellow-600">
                    {analytics.totalTransactions}
                  </p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-3/4 overflow-hidden">
                <div className="bg-white shadow rounded p-4 flex flex-col justify-between h-full">
                  <h2 className="text-lg font-semibold mb-4">
                    Debit Breakdown by Category
                  </h2>
                  <div className="flex-1">
                    <Pie data={debitCategoryData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>

                <div className="bg-white shadow rounded p-4 flex flex-col justify-between h-full">
                  <h2 className="text-lg font-semibold mb-4">
                    Credit Breakdown by Category
                  </h2>
                  <div className="flex-1">
                    <Pie data={creditCategoryData} options={{ maintainAspectRatio: true }} />
                  </div>
                </div>

                <div className="bg-white shadow rounded p-4 flex flex-col justify-between h-full">
                  <h2 className="text-lg font-semibold mb-4">
                    Total Debits vs Credits
                  </h2>
                  <div className="flex-1">
                    <Bar
                      data={debitCreditComparisonData}
                      options={{ maintainAspectRatio: true }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
