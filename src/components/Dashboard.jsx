import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import Nav from "../components/Nav";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
    // Fetch analytics data from the API
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

  // Prepare data for Pie Charts and Bar Chart if analytics data exists
  const debitCategoryData = analytics
    ? {
        labels: analytics.debitByCategory.map((item) => item.category),
        datasets: [
          {
            label: "Debit Categories",
            data: analytics.debitByCategory.map((item) => item.total),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#66BB6A",
              "#FFA726",
            ],
            borderWidth: 1,
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
            backgroundColor: [
              "#4BC0C0",
              "#FF9F40",
              "#FF6384",
              "#9966FF",
              "#36A2EB",
            ],
            borderWidth: 1,
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
            borderWidth: 1,
          },
        ],
      }
    : {};

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-purple-900 text-white h-screen text-[14px] w-60 transition-width duration-300">
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-end items-center">
          <button className="font-bold">logout</button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-scroll grid grid-cols-1 xl:grid-cols-2 gap-6">
          {!analytics ? (
            <div className="flex justify-center items-center h-full w-full">
              {/* Loading Animation */}
              <div className="flex flex-col items-center">
                <AiOutlineLoading3Quarters
                  className="text-purple-600 animate-spin text-6xl mb-4"
                  aria-label="Loading spinner"
                />
                <p className="text-lg text-gray-700 font-semibold">
                  Loading Analytics...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Debit Category Pie Chart */}
                <div className="bg-white shadow-md rounded p-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Debit Breakdown
                  </h2>
                  <Pie data={debitCategoryData} />
                </div>

                {/* Credit Category Pie Chart */}
                <div className="bg-white shadow-md rounded p-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Credit Breakdown
                  </h2>
                  <Pie data={creditCategoryData} />
                </div>
              </div>

              {/* Debit vs Credit Comparison */}
              <div className="mt-6 bg-white shadow-md rounded p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Debit vs Credit Comparison
                </h2>
                <Bar data={debitCreditComparisonData} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
