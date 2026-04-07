import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toastifySuccess,toastifyError } from "../../Utility/Utility";
import { toast } from "react-toastify";

const SupportModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    Heder: "",
    Description: "",
    SupportID: null,
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    if (open) getData();
  }, [open]);

  
  const getData = async () => {
    try {
      const res = await PostWithToken("Support/GetData_Support", {
        IsActive: true,
      });
      setData(res || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  
  const handleSubmit = async () => {
    try {
      if (!form.Heder || !form.Description) {
        
            toastifyError("All fields required");
        return;
      }

      if (form.SupportID) {
       
        await PostWithToken("Support/Update_Support", form);
        toastifySuccess("Support updated successfully");
      } else {
       
        await PostWithToken("Support/Insert_Support", form);
        toastifySuccess("Support added successfully");
      }

      setForm({ Heder: "", Description: "", SupportID: null });
      getData();
    } catch (err) {
      console.error(err);
    }
  };


  const handleEdit = async (row) => {
    try {
      const res = await PostWithToken(
        "Support/GetSingleData_Support",
        { SupportID: row.SupportID }
      );

      const d = res[0] || res;

      setForm({
        Heder: d.Heder,
        Description: d.Description,
        SupportID: d.SupportID,
      });
    } catch (err) {
      console.error(err);
    }
  };

  
 const handleDelete = (id) => {
  toast.warn(
    <div>
      <p  style={{ fontSize: "14px",fontWeight: "bold" }} className="text-sm text-black">
        Are you sure you want to delete?
      </p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={async () => {
            try {
              await PostWithToken("Support/Delete_Support", {
                SupportID: id,
              });
              getData();
              toast.dismiss();
              toast.success("Deleted successfully");
            } catch (err) {
              console.error(err);
            }
          }}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs text-black"
        >
          Yes
        </button>

        <button
          onClick={() => toast.dismiss()}
          className="bg-gray-300 px-2 py-1 rounded text-xst text-black"
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

 
  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (p) => p.node.rowIndex + 1,
      width: 80,
    },
    {
      headerName: "Heading",
      field: "Heder",
      flex: 1,
    },
    {
      headerName: "Description",
      field: "Description",
      flex: 2,
    },
    {
      headerName: "Action",
      width: 120,
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white p-1 rounded cursor-pointer hover:bg-blue-700 "
            onClick={() => handleEdit(params.data)}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-600 text-white p-1 rounded cursor-pointer hover:bg-red-700"
            onClick={() => handleDelete(params.data.SupportID)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];
 const labelCls = "block mb-[4px] text-[13px] font-medium text-slate-600";
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        
  <div className="bg-white w-[75%] max-w-[1100px] h-[90vh] rounded-2xl shadow-xl flex flex-col m-4 p-6 overflow-hidden relative">

  
    <button
      onClick={onClose}
      className="absolute top-3 right-4 text-gray-500 hover:text-red-700 text-xl font-bold"
    >
      ✕
    </button>

    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">
      Support Management
    </h2>

   
    <div className="grid grid-cols-3 gap-2 items-end">
     <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">
      Heading
    </label>
    <input
      placeholder="Enter heading"
      value={form.Heder}
      onChange={(e) =>
        setForm({ ...form, Heder: e.target.value })
      }
      className="border p-2 rounded h-10"
    />
  </div>

  
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">
      Description
    </label>
    <input
      placeholder="Enter description"
      value={form.Description}
      onChange={(e) =>
        setForm({ ...form, Description: e.target.value })
      }
      className="border p-2 rounded h-10"
    />
  </div>

      <div className="flex justify-start">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-1 rounded h-10 text-sm whitespace-nowrap"
        >
          {form.SupportID ? "Update" : "Add"}
        </button>
      </div>

    </div>

   
    <div className="ag-theme-alpine mt-4 flex-1">
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        headerHeight={35}
              rowHeight={35}
              enableCellTextSelection={true}
      />
    </div>

   
    <div className="flex justify-end mt-2">
      <button
        onClick={onClose}
        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
      >
        Close
      </button>
    </div>

  </div>
</div>
  );
};

export default SupportModal;