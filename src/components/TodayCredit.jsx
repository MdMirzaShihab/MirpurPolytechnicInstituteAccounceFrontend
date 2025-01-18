import React from "react";

const TodayCredit = ({
  creditAccounts,
  totalCredit,
  handleDelete,
  handleEdit,
}) => {
  const renderTableRows = (data) =>
    data.map((transaction) => (
      <tr key={transaction._id} className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-4">{transaction.category.name}</td>
        <td className="px-6 py-4 text-end">{transaction.amount}</td>
        <td className="px-6 py-4 text-center">
          {transaction.paymentMethod.name}
        </td>
        <td className="px-6 py-4 flex justify-center gap-2">
          <button
            onClick={() => handleEdit(transaction, transaction.type)}
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
            Edit
          </button>
          <button
            onClick={() => handleDelete(transaction._id, "credit")}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded">
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Today's Credit
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600 border rounded-lg">
          <thead className="text-xs uppercase text-white bg-red-500">
            <tr>
              <th className="px-6 py-3">Account Head</th>
              <th className="px-6 py-3 text-center">Amount</th>
              <th className="px-6 py-3 text-center">Payment Method</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creditAccounts.length > 0 ? (
              renderTableRows(creditAccounts)
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center px-6 py-4 text-gray-500 italic">
                  No credit accounts available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan="3" className="px-6 py-4 font-bold text-gray-700">
                Total Credit
              </td>
              <td className="px-6 py-4 font-bold text-end text-gray-700">
                {totalCredit}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TodayCredit;
