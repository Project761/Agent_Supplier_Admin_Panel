import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import Topbar from "../../components/Topbar";
import * as XLSX from "xlsx";

const Userpage = () => {
  const parsedUserData = JSON.parse(sessionStorage.getItem("UserData"));
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPermissionUsers();
  }, []);

  const getPermissionUsers = async () => {
    try {
      const val = { UserID: parsedUserData?.UserID };
      const res = await PostWithToken(
        "PermissionUser/GetData_PermissionUser",
        val
      );
      setItems(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error(error);
      setItems([]);
    }
  };


  const filteredItems = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((r) =>
      `${r.Name} ${r.OwnerName} ${r.OfficeMobileNo} ${r.District}`
        .toLowerCase()
        .includes(q)
    );
  }, [items, search]);







  const columns = useMemo(
    () => [
      {
        name: "S.No.",
        selector: (row) => row.no,
        sortable: true,
      },
      {
        name: "No.",
        selector: (row) => row.Name,
        sortable: true,
      },
      {
        name: "Weighbridge No",
        selector: (row) => row.WeighbridgeNo,
        sortable: true,
        wrap: true,
      },
      {
        name: "Owner Name",
        selector: (row) => row.OwnerName,
        sortable: true,
      },
      {
        name: "Owner Mobile No",
        selector: (row) => row.OwnerMobileNo || "-",
      },
      {
        name: "Status",
        cell: (row) => (
          <span
            className={`px-2 py-1 text-xs rounded-full font-semibold
            ${row.WorkStatus === "Close"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
              }`}
          >
            {row.WorkStatus}
          </span>
        ),
      },
      // {
      //   name: "District",
      //   selector: (row) => row.District || "-",
      // },
      // {
      //   name: "Address",
      //   selector: (row) => row.Address || "-",
      // },
      // {
      //   name: "Actions",
      //   cell: (row) => (
      //     <div className="flex gap-2">
      //       <button
      //         className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
      //         title="Edit"
      //       >
      //         <FaRegEdit />
      //       </button>
      //       <button
      //         className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
      //         title="Delete"
      //       >
      //         <FiTrash2 />
      //       </button>
      //     </div>
      //   ),
      // },
    ],
    []
  );

  /* ================= TABLE STYLES ================= */
  const tableStyles = {
    headRow: {
      style: {
        backgroundColor: "#2563eb",
        minHeight: "42px",
      },
    },
    headCells: {
      style: {
        color: "#fff",
        fontWeight: 600,
        fontSize: "12px",
        textTransform: "uppercase",
      },
    },
    rows: {
      style: {
        minHeight: "52px",
      },
    },
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "WeighBridge Automation.xlsx");
  };

  return (
    <>
      <Topbar />
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-4">
          {/* Header */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* <h2 className="text-lg font-semibold text-gray-800">
              Permission Users
            </h2> */}

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <div>
              <button
                onClick={exportToExcel}
                className="mb-3 rounded-md bg-emerald-600 px-6 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 25]}
            highlightOnHover
            striped
            responsive
            fixedHeader
            fixedHeaderScrollHeight="420px"
            customStyles={tableStyles}
            noDataComponent={
              <div className="py-6 text-gray-500 text-sm">
                No records found
              </div>
            }
          />
        </div>
      </div>
    </>
  );

};

export default Userpage;
