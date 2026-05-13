import React, { useState, useEffect } from "react";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import DataTable from "react-data-table-component";

const ServiceStartStop = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await PostWithToken("AssignWork/LoadClients");
   
      setData(res || []);
    } catch (err) {
      console.error(err);
    }
  };

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

  const [loadingMap, setLoadingMap] = useState({});

  const handleSendCommand = async (row, commandValue) => {
    try {
      const wb = row.WeighbridgeNo;
      setLoadingMap((prev) => ({ ...prev, [wb]: commandValue }));
      const payload = { CommandValue: commandValue, WeighbridgeNo: wb };
      const res = await PostWithToken("AssignWork/SendCommand", payload);
    
      getData();
    } catch (err) {
      console.error(err);
    } finally {
      const wb = row.WeighbridgeNo;
      setLoadingMap((prev) => ({ ...prev, [wb]: false }));
    }
  };

  const columns = [
    {
      name: <span className="font-semibold">Weighbridge No</span>,
      selector: (row) => row.WeighbridgeNo || "-",
      sortable: true,
    },
    {
      name: <span className="font-semibold">Weighbridge Name</span>,
      selector: (row) => row.WeighbridgeName || "-",
      sortable: true,
    },
    {
      name: <span className="font-semibold">Machine Name</span>,
      selector: (row) => row.MachineName || "-", 
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-semibold">Online Status</span>,
      selector: (row, index) => row.OnlineStatus || "-",
      width: "80px",
    },
    {
      name: <span className="font-semibold">Software Status</span>,
      selector: (row) => row.SoftwareStatus || "-",
      sortable: true,
    },
    {
      name: <span className="font-semibold">Last Heartbeat</span>,
      selector: (row) => row.LastHeartbeat || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2 flex-nowrap items-center whitespace-nowrap">
          <button
            className={`px-3 py-1 text-white rounded-sm hover:opacity-90 transition bg-green-600 whitespace-nowrap`}
            onClick={() => handleSendCommand(row, 1)}
            disabled={loadingMap[row.WeighbridgeNo]}
          >
            {loadingMap[row.WeighbridgeNo] === 1 ? "Starting..." : "Start"}
          </button>
          <button
            className={`px-3 py-1 text-white rounded-sm hover:opacity-90 transition bg-red-600 whitespace-nowrap`}
            onClick={() => handleSendCommand(row, 0)}
            disabled={loadingMap[row.WeighbridgeNo]}
          >
            {loadingMap[row.WeighbridgeNo] === 0 ? "Stopping..." : "Stop"}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Weighbridge Status
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
          responsive
          customStyles={tableStyles}
        />
      </div>
    </div>
  );
};

export default ServiceStartStop;
