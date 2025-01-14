import React from "react";
import Select from "react-select";

const TransactionForm = ({
  formData,
  categories,
  paymentMethods,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
}) => {
  const typeOptions = [
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];

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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
      <div className="grid md:grid-cols-6 gap-6">
        {/* Account Type */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Account Type
          </label>
          <Select
            name="type"
            value={typeOptions.find((option) => option.value === formData.type)}
            onChange={(selectedOption) =>
              handleSelectChange(selectedOption, "type")
            }
            options={typeOptions}
            placeholder="Select Type"
            required
            isSearchable
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "rgb(156 163 175)", // gray-400
                borderRadius: "0.375rem", // rounded-lg
                boxShadow: "none",
                "&:hover": { borderColor: "rgb(107 114 128)" }, // gray-600
              }),
            }}
          />
        </div>

        {/* Account Head */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Account Head
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
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "rgb(156 163 175)",
                borderRadius: "0.375rem",
                boxShadow: "none",
                "&:hover": { borderColor: "rgb(107 114 128)" },
              }),
            }}
          />
        </div>

        {/* Amount */}
        <div className="col-span-1 md:col-span-1">
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Amount
          </label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Amount"
            name="amount"
            value={formData.amount || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Payment Method */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Payment Method
          </label>
          <Select
            name="paymentMethod"
            value={paymentMethodOptions.find(
              (option) => option.value === formData.paymentMethod
            )}
            onChange={(selectedOption) =>
              handleSelectChange(selectedOption, "paymentMethod")
            }
            options={paymentMethodOptions}
            placeholder="Select Payment Method"
            required
            isSearchable
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "rgb(156 163 175)",
                borderRadius: "0.375rem",
                boxShadow: "none",
                "&:hover": { borderColor: "rgb(107 114 128)" },
              }),
            }}
          />
        </div>

        {/* Date */}
        <div className="col-span-1">
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Date
          </label>
          <input
            type="date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-purple-500 focus:border-purple-500"
            value={formData.date}
            onChange={(e) =>
              handleInputChange({
                target: { name: "date", value: e.target.value },
              })
            }
          />
        </div>

        {/* Remarks */}
        <div className="col-span-1 md:col-span-3">
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleInputChange}
            rows="2"
            className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Write your thoughts here..."></textarea>
        </div>
      </div>
      {/* Submit Button */}
      <div className="col-span-1 md:col-span-1 flex justify-center items-center pt-5">
        <button
          type="submit"
          className="bg-purple-900 hover:bg-purple-800 text-white text-sm rounded-lg block w-full p-2.5 hover:shadow-purple-500 font-medium shadow-md transition-all duration-300">
          Save Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
