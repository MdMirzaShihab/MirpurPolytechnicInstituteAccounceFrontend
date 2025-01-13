import React from "react";

const TodayDebit = ({
  debitAccounts,
  totalDebit,
  handleDelete,
  handleEdit,
}) => {
  const renderTableRows = (data) =>
    data.map((transaction) => (
      <tr key={transaction._id} className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-4">{transaction.category.name}</td>
        <td className="px-6 py-4">{transaction.amount}</td>
        <td className="px-6 py-4">{transaction.paymentMethod.name}</td>
        <td className="px-6 py-4 flex gap-2">
          <button
            onClick={() => handleEdit(transaction, transaction.type)}
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
            Edit
          </button>
          <button
            onClick={() => handleDelete(transaction._id, "debit")}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded">
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Today's Debits
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600 border rounded-lg">
          <thead className="text-xs uppercase text-white bg-blue-500">
            <tr>
              <th className="px-6 py-3">Account Head</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {debitAccounts.length > 0 ? (
              renderTableRows(debitAccounts)
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center px-6 py-4 text-gray-500 italic">
                  No debit accounts available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan="3" className="px-6 py-4 font-bold text-gray-700">
                Total Debit
              </td>
              <td className="px-6 py-4 font-bold text-gray-700">
                {totalDebit}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TodayDebit;
