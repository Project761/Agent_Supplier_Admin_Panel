import React, { useEffect,  useState } from 'react'
import {
  PostWithToken,
} from "../../ApiMethods/ApiMethods";
import DataTable from 'react-data-table-component';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const RemainingpaymentReport = () => {
const [data,setData]=useState([])


useEffect(()=>{
  GetData_RemainingReport()
},[])


const tableStyles = {
    headRow: { style: { backgroundColor: "#2563eb", minHeight: "34px" } },
    headCells: {
      style: {
        backgroundColor: "#2563eb",
        color: "#fff",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        borderBottom: "0",
      },
    },
    rows: { style: { minHeight: "52px" } },
    cells: { style: { padding: "1rem 0.75rem" } },
  };


const totalFinalAmt = data.reduce(
  (sum, row) => sum + Number(row.FinalAmt || 0),
  0
);

const totalPaidAmt = data.reduce(
  (sum, row) => sum + Number(row.PaidAmt || 0),
  0
);

const totalRemainingAmt = data.reduce(
  (sum, row) => sum + Number(row.ReamaningAmt || 0),
  0
);


   const columns =  [
        {
          name: <span className="font-semibold">Webridge Name</span>,
          selector: (row) => row.Name || "-",
          sortable: true,
          cell: (row) => (
            <div className="font-medium text-slate-800">{row.Name || "-"}</div>
          ),
        },
        {
          name: <span className="font-semibold">Owner Name</span>,
          selector: (row) => row.OwnerName || "-",
          sortable: true,
          cell: (row) => (
            <div className="font-medium text-slate-800">{row.OwnerName || "-"}</div>
          ),
        },
        {
          name: <span className="font-semibold">Owner Mob.No</span>,
          selector: (row) => row.OwnerMobileNo || "-",
          sortable: true,
          cell: (row) => (
            <div className="font-medium text-slate-800">{row.OwnerMobileNo || "-"}</div>
          ),
        },


        {
          name: <span className="font-semibold">Final Amount</span>,
          selector: (row) => row.FinalAmt || "-",
          sortable: true,
          cell: (row) => (
            <div className="font-medium text-slate-800">₹{row.FinalAmt}</div>
          ),
        },
       
  
        
       
        {
          name: <span className="font-semibold">Paid Amount</span>,
          selector: (row) => row.PaidAmt || "-",
          sortable: true,
          cell: (row) => (
            <div className="font-medium text-slate-800">₹{row.PaidAmt}</div>
          ),
        },

           {
          name: <span className="font-semibold">Remaining Amount</span>,
          selector: (row) => row.ReamaningAmt || "-",
          sortable: true,
          cell: (row) => (
            <div className="font-medium text-slate-800">₹{row.ReamaningAmt}</div>
          ),
        },
       
      ]
      
    ;
  

const GetData_RemainingReport = async () => {
    try {
      const res = await PostWithToken("Payment/ReamaningReport", {});
    
      if (res) {
       
        setData(res);

      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
 const exportToExcel = () => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  
  const excelData = data.map((row) => ({
    "Webridge Name": row.Name || "-",
    "Owner Name": row.OwnerName || "-",
    "Owner Mobile": row.OwnerMobileNo || "-",
    "Final Amount": row.FinalAmt || 0,
    "Paid Amount": row.PaidAmt || 0,
    "Remaining Amount": row.ReamaningAmt || 0,
  }));

 
  excelData.push({});

 
  excelData.push({
    "Webridge Name": "",
    "Owner Name": "",
    "Owner Mobile": "TOTAL",
    "Final Amount": totalFinalAmt,
    "Paid Amount": totalPaidAmt,
    "Remaining Amount": totalRemainingAmt,
  });

 
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  
  const colWidths = [
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
  ];
  worksheet["!cols"] = colWidths;


  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Remaining Report");

 
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, "Remaining_Payment_Report.xlsx");
};
//for print 
const handlePrint = () => {
  if (!data || data.length === 0) {
    alert("No data to print");
    return;
  }

  const rows = data.map((row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.Name || "-"}</td>
      <td>${row.OwnerName || "-"}</td>
      <td>${row.OwnerMobileNo || "-"}</td>
      <td>₹${row.FinalAmt || 0}</td>
      <td>₹${row.PaidAmt || 0}</td>
      <td>₹${row.ReamaningAmt || 0}</td>
    </tr>
  `).join("");

  const printWindow = window.open("", "", "width=1000,height=700");

  printWindow.document.write(`
    <html>
      <head>
        <title>Remaining Payment Report</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .logo {
            height: 60px;
          }

          .title {
            text-align: center;
            flex: 1;
          }

          h2 {
            margin: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 14px;
          }

          th {
            background-color:white;
            color: black;
          }

          .totals {
            margin-top: 20px;
            font-weight: bold;
          }

          .totals div {
            margin-bottom: 5px;
          }

          .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 12px;
          }
        </style>
      </head>

      <body>

        <div class="header">
         
          <div class="title">
            <h2>Remaining Payment Report</h2>
          
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Webridge Name</th>
              <th>Owner Name</th>
              <th>Mobile</th>
              <th>Final Amt</th>
              <th>Paid Amt</th>
              <th>Remaining Amt</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="totals">
          <div>Total Final Amount: ₹${totalFinalAmt.toFixed(2)}</div>
          <div>Total Paid Amount: ₹${totalPaidAmt.toFixed(2)}</div>
          <div>Total Remaining Amount: ₹${totalRemainingAmt.toFixed(2)}</div>
        </div>


      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

  return (
    <>
   
    <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-gray-800">
      Remaining Payment Report
    </h2>




  </div>
 <div id="printable-area">
<div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
              <div
                
                
        className=" rounded-md border border-slate-300 p-3 transition"
              >
                <p className="text-xs text-slate-700 font-medium">
                  Total Final Amt
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  ₹{totalFinalAmt.toFixed(2)}
                </p>
              </div>

              <div
               
               className=" rounded-md border border-slate-300 p-3 transition"

              >
                <p className="text-xs text-slate-700 font-medium">
                  Total Paid Amt
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  ₹{totalPaidAmt.toFixed(2)}
                </p>
              </div>

              <div
              
                className=" rounded-md border border-slate-300 p-3 transition"
              >
                <p className="text-xs text-slate-700 font-medium">
                  Total Remaining Amt
                </p>
                <p
                  className="text-lg font-semibold text-slate-800"
                >
                  
                  ₹{totalRemainingAmt.toFixed(2)}
                </p>
              </div>

<div className="flex gap-2">
  <button 
    onClick={exportToExcel}
    className="mb-1 ml-6 rounded-md bg-emerald-600 px-6 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
    Export Excel
  </button>

  <button 
    onClick={handlePrint}
    className="mb-1 rounded-md bg-blue-600 px-6 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
    Print
  </button>
</div>

            </div>

     <div className="overflow-x-auto">
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationRowsPerPageOptions={[5, 10, 25, 50]}
                    paginationPerPage={5}
                    highlightOnHover
                    striped
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    responsive
                    customStyles={tableStyles}
                  />
                </div>

    </div>
    </>
    
  )
}

export default RemainingpaymentReport