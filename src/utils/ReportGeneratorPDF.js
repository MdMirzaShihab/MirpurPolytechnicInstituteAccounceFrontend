import jsPDF from "jspdf";
import mpi from "../assets/mpi.png";

export const generatePDF = (
  transactions,
  totalDebit,
  totalCredit,
  totalBalance
) => {
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
  const companyAddress = "Mukto Bangla Shopping Complex, Mirpur-1, Dhaka-1216";
  const documentHeader = "Consolidated Statement of Credit-Debit (Academinic)";

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
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  // Check if there are transactions, if not, display "No Data" message
  if (transactions.length === 0) {
    startY += cellHeight;
    doc.text(
      "No Data Available",
      (pageWidth - doc.getTextWidth("No Data Available")) / 2,
      startY + 6
    );
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

          // Check if this is the "Amount" column
          if (headers[index] === "Amount") {
            const textWidth = doc.getTextWidth(line); // Calculate the text width
            doc.text(line, xPos + headerSpacing - textWidth - 2, yPos); // Align right with padding
          } else {
            doc.text(line, xPos + 2, yPos); // Default left-aligned text
          }
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

  const summaryCellHeight = 10;
  const summaryStartX = startX + headerSpacing * summaryHeaders.length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  // Draw Summary Headers
  summaryHeaders.forEach((header, index) => {
    const xPos = summaryStartX + index * headerSpacing;
    doc.rect(xPos, startY, headerSpacing, summaryCellHeight);
    doc.text(
      header,
      xPos + (headerSpacing - doc.getTextWidth(header)) / 2,
      startY + 6
    );
  });

  // Draw Summary Data
  startY += summaryCellHeight;
  doc.setFont("helvetica", "normal");
  summaryData.forEach((data, index) => {
    const xPos = summaryStartX + index * headerSpacing;
    doc.rect(xPos, startY, headerSpacing, summaryCellHeight);
    doc.text(
      data,
      xPos + (headerSpacing - doc.getTextWidth(data)) / 2,
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
