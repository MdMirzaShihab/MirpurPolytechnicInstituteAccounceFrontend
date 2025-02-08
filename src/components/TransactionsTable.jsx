import React from "react";
import { AiOutlinePrinter } from "react-icons/ai";

const TransactionsTable = ({
  transactions,
  handlePrint,
  includeOpeningBalance,
  setIncludeOpeningBalance,
  loadingTotalBalance,
}) => (
  <div className="bg-white shadow-lg rounded-lg mt-10 -mr-4 pl-20 ">
    <div className="flex items-center justify-between bg-purple-200 gap-4 px-3 md:px-6 py-3 rounded-t-lg">
      <h2 className="text-md md:text-lg font-bold text-gray-600">Transactions</h2>
      <div className="flex items-center space-x-2 md:space-x-4">
        <label className="flex items-center text-xs md:text-sm font-bold text-gray-600">
          <input
            type="checkbox"
            checked={includeOpeningBalance}
            onChange={() => setIncludeOpeningBalance(!includeOpeningBalance)}
            className="mr-2"
            disabled={loadingTotalBalance}
          />
          Include Net Balance
        </label>
        <button
          onClick={handlePrint}
          className="flex items-center font-bold text-green-900 hover:text-green-700">
          <AiOutlinePrinter className="mr-2 w-10 h-10" />
          Print
        </button>
      </div>
    </div>
    <div className="">
      <div className="bg-purple-100 shadow-md">
        <div className="h-96 w-full overflow-auto">
          <table className="min-w-full text-left text-gray-700">
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
    </div>
  </div>
);

export default TransactionsTable;
