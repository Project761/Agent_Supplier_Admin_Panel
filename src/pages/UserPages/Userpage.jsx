import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import Topbar from "../../components/Topbar";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const Userpage = () => {
  const parsedUserData = JSON.parse(sessionStorage.getItem("UserData"));
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsGps, setItemsGps] = useState([]);
  const [activeTab, setActiveTab] = useState("party");





  // "party" | "gps"
  useEffect(() => {
    getPermissionUsers();
    getPermissionUsersGps();
  }, []);

  const getPermissionUsers = async () => {
    try {
      const val = { UserID: parsedUserData?.UserID };
      const res = await PostWithToken("PermissionUser/GetData_PermissionUser", val);
      setItems(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error(error);
      setItems([]);
    }
  };

  const getPermissionUsersGps = async () => {
    try {
      const val = { UserID: parsedUserData?.UserID };
      const res = await PostWithToken("PermissionUserGPS/GetData_PermissionUserGPS", val);
      setItemsGps(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error(error);
      setItemsGps([]);
    }
  };

  // const filteredItems = useMemo(() => {
  //   if (!search) return items;
  //   const q = search.toLowerCase();
  //   return items.filter((r) => `${r.Name} ${r.OwnerName} ${r.OfficeMobileNo} ${r.District}`.toLowerCase().includes(q));
  // }, [items, search]);

  const filteredItems = useMemo(() => {
    const dataToFilter = activeTab === "party" ? items : itemsGps;

    if (!search) return dataToFilter;

    const q = search.toLowerCase();

    return dataToFilter.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q));
  }, [items, itemsGps, search, activeTab]);

  const columns = useMemo(
    () => [
      {
        name: "S.No.",
        selector: (row) => row.no,
        sortable: true,
      },
       {
        name: "Web.Name",
        selector: (row) => row.Name||"-",
        sortable: true,
      },
       {
        name: "Reg.No.",
        selector: (row) => row.RegNo ||"-",
        sortable: true,
      },
       {
        name: "Lease.No.",
        selector: (row) => row.LeaseNo || "-",
        sortable: true,
      },
       {
        name: "Lease Name",
        selector: (row) => row.LeaseName || "-",
        sortable: true,
      },
      {
        name: "ReQ. No",
        selector: (row) => row.RequestNo || "-",
        sortable: true,
      },
      {
        name: "Web. No",
        selector: (row) => row.WeighbridgeNo || "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Owner Name",
        selector: (row) => row.OwnerName || "-",
        sortable: true,
      },
      {
        name: "Owner Mob.No",
        selector: (row) => row.OwnerMobileNo || "-",
        sortable: true,
      },
      {
        name: "Status",
        cell: (row) => (
          <span
            className={`px-2 py-1 text-xs rounded-full font-semibold
            ${row.DMGWorkStatus === "Close" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
          >
            {row.DMGWorkStatus}
          </span>
        ),
        sortable: true,
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
    [],
  );

  const columnsGps = useMemo(
    () => [
      {
        name: "S.No.",
        selector: (row) => row.no,
        sortable: true,
      },
      {
        name: "IEMI No",
        selector: (row) => row.IEMINo,
        sortable: true,
      },
      {
        name: "Vehicle No",
        selector: (row) => row.VehicleNo,
        sortable: true,
      },
      {
        name: "Owner Name",
        selector: (row) => row.OwnerName,
        sortable: true,
      },
    ],
    [],
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

  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(items);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const data = new Blob([excelBuffer], {
  //     type: "application/octet-stream",
  //   });

  //   saveAs(data, "WeighBridge Automation.xlsx");
  // };

  const exportToExcel = () => {
    let formattedData = [];
    let fileName = "";

    if (activeTab === "party") {
      formattedData = filteredItems.map((item, index) => ({
        "S.No.": index + 1,
        "No.": item.Name,
        "Weighbridge No": item.WeighbridgeNo,
        "Owner Name": item.OwnerName,
        "Owner Mobile No": item.OwnerMobileNo || "-",
        Status: item.WorkStatus,
      }));

      fileName = "Party_Master.xlsx";
    } else {
      formattedData = itemsGps.map((item, index) => ({
        "S.No.": index + 1,
        "IEMI No": item.IEMINo || "-",
        "Owner Name": item.OwnerName,
        "Contact No": item.ContactNo || "-",
      }));

      fileName = "GPS_Vehicle.xlsx";
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, fileName);
  };




const navigate = useNavigate();

 useEffect(() => {
  const push = () => {
    window.history.pushState(null, "", window.location.href);
  };

  
  for (let i = 0; i < 20; i++) push();

  const handlePopState = () => {
    push();
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);




  return (
    <>
      <Topbar />
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-2 flex gap-2 ">
          <button
            onClick={() => setActiveTab("party")}
            className={`rounded-md px-6 py-1.5 text-sm font-semibold text-white 
    ${activeTab === "party" ? "bg-blue-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            Party Master
          </button>

          <button
            onClick={() => setActiveTab("gps")}
            className={`rounded-md px-6 py-1.5 text-sm font-semibold text-white 
    ${activeTab === "gps" ? "bg-blue-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            Gps Vehicle
          </button>
        </div>
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
              <button onClick={exportToExcel} className="mb-3 rounded-md bg-emerald-600 px-6 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
                Export Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={activeTab === "party" ? columns : columnsGps}
            data={filteredItems}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 25]}
            highlightOnHover
            striped
            responsive
            fixedHeader
            persistTableHead
            noDataComponent={"No Data Available"}
            fixedHeaderScrollHeight="420px"
            customStyles={tableStyles}
            // noDataComponent={<div className="py-6 text-gray-500 text-sm">No records found</div>}
          />
        </div>
      </div>
    </>
  );
};

export default Userpage;
