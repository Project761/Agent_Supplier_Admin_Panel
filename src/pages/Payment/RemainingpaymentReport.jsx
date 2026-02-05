import React, { useEffect,  useState } from 'react'
import {
  PostWithToken,
} from "../../ApiMethods/ApiMethods";
import DataTable from 'react-data-table-component';

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


   const columns =  [
        {
          name: <span className="font-semibold">Party Name</span>,
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
          name: <span className="font-semibold">Work Status</span>,
          selector: (row) => row.WorkStatus || "-",
          sortable: true,
          cell: (row) => (
            <div className="font-medium text-slate-800">
              {row.WorkStatus}
            </div>
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

  return (
    <>
    <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-gray-800">
      Remaining Payment Report
    </h2>
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

    
    </>
  )
}

export default RemainingpaymentReport