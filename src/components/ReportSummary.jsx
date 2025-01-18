import React from "react";
import { FaArrowDown, FaArrowUp, FaEquals } from "react-icons/fa";

const ReportSummary = ({ totalDebit, totalCredit, totalBalance }) => (
  <div className="mx-auto max-w-7xl">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-6 bg-gray-100 ">

      <div className="flex items-center justify-between bg-green-100 border-green-300 shadow-green-400 border  p-4 rounded-lg shadow-md ">
        <div>
          <h3 className="text-lg font-medium text-gray-600">Total Credit</h3>
          <p className="text-2xl font-bold text-green-600">
            ৳ {totalCredit.toLocaleString()}
          </p>
        </div>
        <FaArrowUp className="text-green-500 text-3xl" />
      </div>

      <div className="bg-red-100 border-red-300 shadow-red-400 border flex items-center justify-between p-4 rounded-lg shadow-md ">
        <div>
          <h3 className="text-lg font-medium text-gray-600">Total Debit</h3>
          <p className="text-2xl font-bold text-red-600">
            ৳ {totalDebit.toLocaleString()}
          </p>
        </div>
        <FaArrowDown className="text-red-500 text-3xl" />
      </div>

      <div className="flex items-center justify-between bg-yellow-100 border-yellow-300 shadow-yellow-400 border  p-4 rounded-lg shadow-md ">
        <div>
          <h3 className="text-lg font-medium text-gray-600">Total Balance</h3>
          <p className="text-2xl font-bold text-yellow-600">
            ৳ {totalBalance.toLocaleString()}
          </p>
        </div>
        <FaEquals className="text-yellow-500 text-3xl" />
      </div>
    </div>
  </div>
);

export default ReportSummary;
