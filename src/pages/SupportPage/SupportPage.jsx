import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { FaEdit, FaTrash } from "react-icons/fa";
import SupportModal from "./SupportModal";
import { toast } from "react-toastify";

const SupportPage = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await PostWithToken("Support/GetData_Support", {
        IsActive: true,
      });
      setData(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleDelete = (id) => {
    toast.warn(
      <div>
        <p style={{ fontSize: "14px",fontWeight: "bold" }} className="text-sm font-semibold text-black">
          Are you sure you want to delete?
        </p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              await PostWithToken("Support/Delete_Support", {
                SupportID: id,
              });
              getData();
              toast.dismiss();
              toast.success("Deleted successfully");
            }}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs text-black"
          >
            Yes
          </button>

          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-2 py-1 rounded text-xs text-black"
          >
            No
          </button>
        </div>
      </div>,
      {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
    }
    );
  };

 
  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Header",
      selector: (row) => row.Heder,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.Description,
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      width: "120px",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white p-1 rounded cursor-pointer hover:bg-blue-700"
            onClick={() => {
              setEditData(row);
              setIsModalOpen(true);
            }}
          >
            <FaEdit />
          </button>

          <button
            className="bg-red-600 text-white p-1 rounded cursor-pointer hover:bg-red-700"
            onClick={() => handleDelete(row.SupportID)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

   const tableStyles = {
    headRow: { style: { backgroundColor: "#2563eb", minHeight: "34px" } },
    headCells: {
      style: {
        backgroundColor: "#2563eb",
        color: "#fff",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "0.875rem",
        letterSpacing: "0.05em",
        borderBottom: "0",
      },
    },
    rows: { style: { minHeight: "52px",fontSize: "0.875rem", } },
    cells: { style: { padding: "1rem 0.75rem" } },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white rounded-xl shadow p-5">

      
        <div className="flex justify-between mb-4">
         <h2 className="text-xl font-semibold text-gray-800">
            Support Page
          </h2>

          <button
            onClick={() => {
              setEditData(null);
              setIsModalOpen(true);
            }}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap"
           
          >
            Add Support
          </button>
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
            //   fixedHeaderScrollHeight="400px"
              responsive
              customStyles={tableStyles}
        />
</div>
      </div>

     
      <SupportModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
        refresh={getData}
      />
    </div>
  );
};

export default SupportPage;