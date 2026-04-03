import DataTable from "react-data-table-component";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import Topbar from "../../components/Topbar";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditPartyModal from "./EditPartyModal ";

const OfficeEmployeePage = () => {
  const parsedUserData = JSON.parse(sessionStorage.getItem("UserData"));
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsGps, setItemsGps] = useState([]);
  const [activeTab, setActiveTab] = useState("party");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState(null);

  useEffect(() => {
    getPermissionUsers();
  }, []);

  const Editfunction = (row) => {
    setSelectedPartyId(row.PartyID);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log("model open state changed:", isModalOpen);
  }, [isModalOpen]);

  const getPermissionUsers = async () => {
    try {
      const val = { UserID: parsedUserData?.UserID };
      const res = await PostWithToken(
        "PermissionUser/GetData_PermissionUser",
        val,
      );

      const updatedData = (Array.isArray(res) ? res : []).map(
        (item, index) => ({
          ...item,
          serialNo: index + 1,
        }),
      );

      setItems(updatedData);
    } catch (error) {
      console.error(error);
      setItems([]);
    }
  };

  const filteredItems = useMemo(() => {
    const dataToFilter = activeTab === "party" ? items : itemsGps;

    if (!search) return dataToFilter;

    const q = search.toLowerCase();

    return dataToFilter.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(q),
    );
  }, [items, itemsGps, search, activeTab]);

  const statusColors = {
    "Work Order Received": {
      bg: "#e0f2fe",
      text: "#0284c7",
    },
    "Civil Work Started": {
      bg: "#fef9c3",
      text: "#ca8a04",
    },
    "Hardware Started": {
      bg: "#ede9fe",
      text: "#7c3aed",
    },
    "Hardware Done": {
      bg: "#dcfce7",
      text: "#101110",
    },
    "Testing Pending": {
      bg: "#fee2e2",
      text: "#dc2626",
    },
    "Testing Done": {
      bg: "#bbf7d0",
      text: "#15803d",
    },
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No.",
        field: "serialNo",
        minWidth: 80,
        sortable: true,
      },
        {
        headerName: "Actions",
        field: "actions",
        minWidth: 120,
        cellRenderer: (params) => {
          const isPaid =
            params.data?.IsPaid === true || params.data?.IsPaid === "True";

          return (
            <div className="flex gap-2">
              <button
                className={`rounded-md p-2 text-white ${
                  isPaid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => {
                  if (!isPaid) {
                    Editfunction(params.data);
                  }
                }}
                disabled={isPaid}
                title={isPaid ? "Already Paid" : "Edit"}
              >
                <FaEdit className="text-base" />
              </button>
            </div>
          );
        },
      },
       {
        headerName: "Reg.No.",
        field: "RegNo",
        minWidth: 135,
        valueGetter: (p) => p.data?.RegNo ?? "-",
      },
      {
        headerName: "Rawana No.",
        field: "RawanaNo",
        minWidth: 135,
        valueGetter: (p) => p.data?.RawanaNo ?? "-",
      },
       {
        headerName: "Web.Name",
        field: "Name",
        flex: 1,
        minWidth: 250,
        valueGetter: (params) => params.data?.Name ?? "-",
      },
       {
        headerName: "Area",
        field: "Area",
        flex: 1,
        minWidth: 160,
        valueGetter: (params) => params.data?.Area ?? "-",
      },
       {
        headerName: "OwnerName",
        field: "OwnerName",
        flex: 1,
        minWidth: 160,
        valueGetter: (params) => params.data?.OwnerName ?? "-",
      },
      {
        headerName: "Web. No",
        field: "WeighbridgeNo",
        minWidth: 135,
        wrapText: true,
        autoHeight: true,
        valueGetter: (p) => p.data?.WeighbridgeNo ?? "-",
      },
       {
        headerName: "ReQ. No",
        field: "RequestNo",
        minWidth: 135,
        valueGetter: (p) => p.data?.RequestNo ?? "-",
      },
      
      {
        headerName: "DMG Status",
        field: "DMGWorkStatus",
        minWidth: 200,
        cellRenderer: (params) => {
          const value = params.value ?? "-";

          const colors = statusColors[value] || {
            bg: "#e5e7eb",
            text: "#374151",
          };

          return (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              {value}
            </span>
          );
        },
      },
{
  headerName: "Remark",
  field: "LastRemark",
  minWidth: 180,
  cellRenderer: (p) => {
    const remark = p.data?.LastRemark;
    if (!remark) return "-";

    const firstLine = remark.split("\n")[0];
    const text = firstLine.split("]:")[1]?.trim() || "-";

    return (
      <div
        title={text} 
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {text}
      </div>
    );
  },
}
    
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

  const columnDefsGps = [
    {
      headerName: "S.No.",
      field: "no",
      valueGetter: (p) => p.data?.no ?? "-",
    },
    {
      headerName: "IEMI No",
      field: "IEMINo",
      valueGetter: (p) => p.data?.IEMINo ?? "-",
    },
    {
      headerName: "Vehicle No",
      field: "VehicleNo",
      valueGetter: (p) => p.data?.VehicleNo ?? "-",
    },
    {
      headerName: "Owner Name",
      field: "OwnerName",
      valueGetter: (p) => p.data?.OwnerName ?? "-",
    },
  ];

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
    let formattedData = [];
    let fileName = "";

    if (activeTab === "party") {
      formattedData = filteredItems.map((item, index) => ({
        "S.No.": index + 1,
       
        "Reg No": item.RegNo || "-",
        "Rawana No": item.RawanaNo || "-",
        "Web Name": item.Name || "-",
        "Web. No": item.WeighbridgeNo || "-",
        "Request No": item.RequestNo || "-",
        "DMG Status": item.DMGWorkStatus || "-",
       
      }));

      fileName = "Party_Details.xlsx";
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
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

          <div style={{ height: "calc(100vh - 200px)", width: "100%" }} className="ag-theme-alpine rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <AgGridReact
              rowData={filteredItems}
              columnDefs={columnDefs}
              enableCellTextSelection={true}
              pagination={true}
              paginationPageSize={100}
              paginationPageSizeSelector={[5, 10, 25, 50, 100]}
              // domLayout="autoHeight"
              headerHeight={45}
              rowHeight={45}
              defaultColDef={{
                sortable: true,
                resizable: true,
                flex: 1,
                minWidth: 120,
              }}
            />

            <EditPartyModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              partyId={selectedPartyId}
              onSuccess={getPermissionUsers}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OfficeEmployeePage;
