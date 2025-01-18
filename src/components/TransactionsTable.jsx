import React from "react";
import { AiOutlinePrinter } from "react-icons/ai";

const TransactionsTable = ({ transactions, handlePrint }) => (
  <div className="bg-white shadow-lg rounded-lg mt-2">
    <div className="flex items-center justify-between bg-purple-200 px-6 py-3">
      <h2 className="text-lg font-bold text-gray-600">Transactions</h2>
      <div className="flex justify-end">
        <button onClick={handlePrint} className="flex items-center font-bold px-6 text-green-900 hover:text-green-700 ">
          <AiOutlinePrinter className="mr-2 w-10 h-10 " />
        Print
        </button>
      </div>
    </div>
    <table className="w-full table-fixed bg-white">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
            Payment Method
          </th>
          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
            Remarks
          </th>
          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
            Amount
          </th>
        </tr>
      </thead>
    </table>

    <div className="flex overflow-y-auto h-64">
      {/* To make the tbody scrollable */}
      <table className="w-full table-fixed">
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="bg-white border-b odd:bg-gray-100">
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString("en-GB")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {transaction.type}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {transaction.category.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {transaction.paymentMethod.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {transaction.remarks || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                ৳ {transaction.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TransactionsTable;
