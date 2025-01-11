import React, { useState, useEffect } from "react";
import axios from "axios";
import mpi from "../assets/mpi.png";
import Nav from "../components/Nav";
import Select from "react-select";
import { jsPDF } from "jspdf";

const Report = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

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

  // Filter categories based on selected type
  const categoryOptions = filters.type
    ? categories
        .filter(
          (category) =>
            category.type.toLowerCase() === filters.type.toLowerCase()
        )
        .map((category) => ({
          value: category._id,
          label: category.name,
        }))
    : categories.map((category) => ({
        value: category._id,
        label: category.name,
      }));

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method._id,
    label: method.name,
  }));

  const typeOptions = [
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];

  const handlePrint = () => {
    const doc = new jsPDF("landscape");
  
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    let startY = 10; // Starting Y position for the content
    let pageNumber = 1;
  
    // Add the MPI logo
    const logoWidth = 20; // Width of the logo
    const logoHeight = 20; // Height of the logo
    const logoX = (pageWidth - logoWidth) / 2; // Center the logo horizontally
  
    doc.addImage(mpi, "PNG", logoX, startY, logoWidth, logoHeight);
    startY += logoHeight + 10; // Add some space after the logo
  
    // Company Info Section
    const companyName = "MIRPUR POLYTECHNIC INSTITUTE";
    const companyAddress =
      "Mukto Bangla Shopping Complex, Mirpur-1, Dhaka-1216";
    const documentHeader =
      "Consolidated Statement of Credit-Debit (Academinic)";
  
    // Set the company name to a larger, bold font
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    const companyNameWidth = doc.getTextWidth(companyName);
    doc.text(companyName, (pageWidth - companyNameWidth) / 2, startY);
    startY += 6;
  
    // Set a smaller, regular font for the address
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const companyAddressWidth = doc.getTextWidth(companyAddress);
    doc.text(companyAddress, (pageWidth - companyAddressWidth) / 2, startY);
    startY += 10;
  
    // Set the company name to a larger, bold font
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const documentHeaderWidth = doc.getTextWidth(documentHeader);
    doc.text(documentHeader, (pageWidth - documentHeaderWidth) / 2, startY);
    startY += 10;
  
    // Add some space before the summary table
    startY += 10;
  
    // Transaction Table Header
    const headers = [
      "Date",
      "Type",
      "Category",
      "Payment Method",
      "Remarks",
      "Amount",
    ];
    const headerSpacing = 40; // Spacing between each column
    const cellHeight = 10; // Height of each cell
  
    // Calculate the total width of the header (using headerSpacing)
    const totalWidth = headerSpacing * headers.length;
    const startX = (pageWidth - totalWidth) / 2; // Start position for the table
  
    // Draw Table Header (Bold)
    doc.setFont("helvetica", "bold"); // Set headers to bold font
    doc.setFontSize(12); // Set font size for the headers
    headers.forEach((header, index) => {
      const xPos = startX + index * headerSpacing;
      const headerWidth = doc.getTextWidth(header);
      // Draw the header box
      doc.rect(xPos, startY, headerSpacing, cellHeight);
      // Center the header text inside the box
      doc.text(header, xPos + (headerSpacing - headerWidth) / 2, startY + 6);
    });
  
    // Check if there are transactions, if not, display "No Data" message
    if (transactions.length === 0) {
      startY += cellHeight;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("No Data Available", (pageWidth - doc.getTextWidth("No Data Available")) / 2, startY + 6);
    } else {
      // Table Rows
      startY += cellHeight; // Move down to the next row
      transactions.forEach((transaction, rowIndex) => {
        const rowData = [
          new Date(transaction.date).toLocaleDateString("en-GB"),
          transaction.type,
          transaction.category.name,
          transaction.paymentMethod.name,
          transaction.remarks || "N/A",
          transaction.amount.toLocaleString("en-GB"),
        ];
  
        // Calculate the maximum height required for the row
        let rowHeight = cellHeight;
        const wrappedRowData = rowData.map((data, index) => {
          const cellWidth = headerSpacing - 4; // Slightly smaller to account for padding
          const wrappedText = doc.splitTextToSize(data, cellWidth); // Wrap text to fit cell width
          const requiredHeight = wrappedText.length * 6; // Estimate height (6px per line of text)
          rowHeight = Math.max(rowHeight, requiredHeight); // Adjust row height for the tallest cell
          return wrappedText; // Return wrapped text for drawing
        });
  
        // Draw the cells with the wrapped text
        wrappedRowData.forEach((wrappedText, index) => {
          const xPos = startX + index * headerSpacing;
          doc.rect(xPos, startY, headerSpacing, rowHeight); // Draw the cell box
          wrappedText.forEach((line, lineIndex) => {
            const yPos = startY + 6 + lineIndex * 4; // Position each line within the cell
            doc.text(line, xPos + 2, yPos); // Add padding inside the cell
          });
        });
  
        startY += rowHeight; // Move to the next row
  
        // Check if a new page is needed
        if (startY + cellHeight > pageHeight - 30) {
          doc.addPage();
          startY = 30; // Reset startY after adding a new page
          pageNumber++;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 20);
  
          // Re-draw headers on the new page
          startY += 10;
          doc.setFont("helvetica", "bold"); // Set headers to bold font
          doc.setFontSize(12); // Set font size for the headers
          headers.forEach((header, index) => {
            const xPos = startX + index * headerSpacing;
            const headerWidth = doc.getTextWidth(header);
            // Draw the header box again
            doc.rect(xPos, startY, headerSpacing, cellHeight);
            // Center the header text inside the box
            doc.text(
              header,
              xPos + (headerSpacing - headerWidth) / 2,
              startY + 6
            );
          });
          // Reset font for rows
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          startY += cellHeight; // Move to the next row after header
        }
      });
    }
  
    // Add space before the summary table
    startY += 10;
  
    // Total Debit and Credit Table
    const summaryHeaders = ["Total Debit", "Total Credit", "Total Balance"];
    const summaryData = [
      `${totalDebit.toLocaleString("en-GB")}`,
      `${totalCredit.toLocaleString("en-GB")}`,
      `${totalBalance.toLocaleString("en-GB")}`,
    ];
  
    const summaryCellWidth = headerSpacing * 2;
    const summaryCellHeight = 10;
    const summaryStartX =
      (pageWidth - summaryHeaders.length * summaryCellWidth) / 2;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
  
    // Draw Summary Headers
    summaryHeaders.forEach((header, index) => {
      const xPos = summaryStartX + index * summaryCellWidth;
      doc.rect(xPos, startY, summaryCellWidth, summaryCellHeight);
      doc.text(
        header,
        xPos + (summaryCellWidth - doc.getTextWidth(header)) / 2,
        startY + 6
      );
    });
  
    // Draw Summary Data
    startY += summaryCellHeight;
    doc.setFont("helvetica", "normal");
    summaryData.forEach((data, index) => {
      const xPos = summaryStartX + index * summaryCellWidth;
      doc.rect(xPos, startY, summaryCellWidth, summaryCellHeight);
      doc.text(
        data,
        xPos + (summaryCellWidth - doc.getTextWidth(data)) / 2,
        startY + 6
      );
    });
  
    // Final page footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 20);
  
    // Save the PDF
    doc.save("transaction_report.pdf");
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
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-end items-center ">
          <button className=" font-bold ">logout</button>
        </div>

        {/* Content Area */}

        <div className="flex-1  p-4 bg-gray-200">
          <div className="mx-auto max-w-7xl mt-10 bg-purple-900 shadow ">
            <div className="grid md:grid-cols-9 p-5 gap-5">
              <div className="col-span-2">
                <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                  From{" "}
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                  To
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                  Payment Method
                </label>
                <Select
                  options={paymentMethodOptions}
                  value={paymentMethodOptions.find(
                    (option) => option.value === filters.paymentMethod
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("paymentMethod", selectedOption)
                  }
                  placeholder="Select Payment Method"
                  isClearable
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                  Transaction Type
                </label>
                <Select
                  options={typeOptions}
                  value={typeOptions.find(
                    (option) => option.value === filters.type
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("type", selectedOption)
                  }
                  placeholder="Select Type"
                  isClearable
                  isSearchable
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                  Account Head
                </label>
                <Select
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (option) => option.value === filters.category
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("category", selectedOption)
                  }
                  placeholder="Select Category"
                  isClearable
                  isSearchable
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">
                  Search Remarks
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleInputChange}
                  placeholder="Search by remarks"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-1 gap-10 flex items-center justify-center mt-7">
                <button
                  onClick={fetchReport}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600">
                  {loading ? "Loading..." : "View"}
                </button>
              </div>
              <svg
                onClick={handlePrint}
                className="w-[30px] h-[30px] fill-white cursor-pointer"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
              </svg>
            </div>
          </div>

          {/* Total Debit and Credit */}
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mt-6 bg-white shadow p-4 px-20 rounded">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Total Debit:
                </h3>
                <p className="text-lg font-bold text-red-600">
                  ৳ {totalDebit.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Total Credit:
                </h3>
                <p className="text-lg font-bold text-green-600">
                  ৳ {totalCredit.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Total Balance:
                </h3>
                <p className="text-lg font-bold text-yellow-600">
                  ৳ {totalBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          {error && <div className="text-red-500 mt-4">{error}</div>}

          {/* If transactions are loading, show a loading indicator */}
          {loading ? (
            <div className="text-center mt-10">Loading...</div>
          ) : (
            <div className="flex flex-col overflow-clip mt-10 mx-auto max-w-7xl h-96">
              {/* Check if there are transactions */}
              {transactions.length === 0 ? (
                <div className="text-center mt-10 text-lg text-gray-500">
                  No Data Available
                </div>
              ) : (
                <>
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

                  <div className="flex overflow-y-auto">
                    {/* To make the tbody scrollable */}
                    <table className="w-full table-fixed">
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr
                            key={transaction._id}
                            className="bg-white border-b">
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString(
                                "en-GB"
                              )}
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
