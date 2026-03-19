import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";
import Otpverify from "../../components/Otpverify";
import PartyModal from "../Party/PartyModal";
import PartySettingModal from "../Party/PartySettingModal";
import AddWorkStatusModal from "./AddWorkStatusModal";
import AssignHistoryModal from "./AssignHistoryModal";
 //changes
const WorkStatus = () => {  
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [items, setItems] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedPartyID, setSelectedPartyID] = useState(null);

   const [otpverifyOpen, setOtpverifyOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [histroydetail, setHistroydetail] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewData, setViewData] = useState([]);


  useEffect(() => {
    GetData_Status();
  }, []);

 const onViewItem = (row) => {
    const AssignID = row.AssignID;
    if (AssignID) {
      GetSingleData_AssignWork(AssignID);
    } else {
      toastifySuccess("Assign ID not found");
    }
  };

  const GetSingleData_AssignWork = async (AssignID) => {
    try {
      const val = { AssignID: AssignID };
      const res = await PostWithToken("AssignHistory/GetData_AssignHistory", val);
      if (res) {
        setViewData(res);
        setViewOpen(true);
      } else {
        toastifySuccess("No assign work data found ");
      }
    } catch (error) {
      console.error("GetSingleData_AssignWork error:", error);
    }
  };
  const GetData_Status = async () => {
    const val = {
      IsActive: "1",
    };
    try {
      const res = await PostWithToken("AssignWork/GetData_AssignWork", val);
      if (res) {
        setItems(res);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetSingleData_Party = async (ID) => {
    try {
      const val = { AssignID: ID };
      const res = await PostWithToken("AssignWork/GetSingleData_AssignWork", val);
      if (res) {
        setEditRow(res[0]);
        setOpen(true);
      }
    } catch (error) {
      console.error("GetSingleData_Party error:", error);
    }
  };

  const onEditItem = (row) => {
    setEditItemId(row.PartyID);
    GetSingleData_Party(row.AssignID);
  };

  const onDeleteRequest = (row) => {
    setDeleteTarget(row);
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) => {
      const hay = `${r.PartyName || ""} ${r.OwnerName || ""} ${r.WorkStatus || ""}  ${r.GSTNo || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const columns = useMemo(
    () => [

    
      {
        name: <span className="font-semibold">Party Name</span>,
        selector: (row) => row.PartyName || "-",
        sortable: true,
        cell: (row) => <div className="font-medium text-slate-800">{row.PartyName || "-"}</div>,
      },
      {
        name: <span className="font-semibold">Owner Name</span>,
        selector: (row) => row.OwnerName || "-",
        sortable: true,
      },
      {
        name: <span className="font-semibold">WorkStatus</span>,
        selector: (row) => row.WorkStatus || "-",
        sortable: true,
      },
      {
        name: <span className="font-semibold">Datetime</span>,
        selector: (row) => row.Datetime || "-",
        sortable: true,
      },
     
      {
        name: "Actions",
        cell: (r) => (
          <div className="flex gap-2">
            <button
              className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
              onClick={() => onEditItem(r)}
              type="button"
              title="Edit"
            >
              <FaRegEdit className="text-base" />
            </button>
            <button
  className="rounded-md bg-green-700 p-2 text-white hover:bg-green-700"
  onClick={() => {
    setSelectedRow(r);
    setAssignModalOpen(true);
  }}
  type="button"
  title="Assign WorkStatus"
>
  <FiPlus className="text-base" />
</button>

 <button
              className="rounded-md bg-red-600 p-2 text-white hover:bg-red-600"
              onClick={() => {
                onViewItem(r);
                console.log(r, "row data for history");
                setHistroydetail(r);
              }}
              type="button"
              title="View Status History"
            >
              <FiEye className="text-base" />
            </button>

            {/* <button
              className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
              onClick={() => onDeleteRequest(r)}
              type="button"
              title="Delete"
            >
              <FiTrash2 className="text-base" />
            </button> */}
          </div>
        ),
      },

    ],
    [editItemId]
  );

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

  const Delete_Party = async (PartyID) => {
    console.log("Delete_Party called with PartyID:", PartyID);
    setDeleteId(PartyID);
   setOtpverifyOpen(true);
  };

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-2 py-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="">
          <div className="mb-2 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search work status..."
              className="w-full sm:w-64 md:w-72 rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoComplete="off-district"

            />

            <button
              onClick={() => {
                setEditItemId(null);
                setOpen(true);
                setEditRow(null);
              }}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Add WorkStatus
            </button>
          </div>

 {otpverifyOpen && (
            <Otpverify
              open={otpverifyOpen}
              onClose={() => setOtpverifyOpen(false)}
              editItemId={deleteId}
              deletename="Party"
              onSuccess={async () => {
                setOtpverifyOpen(false);
                await GetData_Status();
              }}
            />
          )}


          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredItems}
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

        <AddWorkStatusModal
          open={open}
          onClose={() => {
            setOpen(false);
            setEditRow(null);
          }}
          editData={editRow}
          onSuccess={GetData_Status}
        />

<AssignHistoryModal
  open={assignModalOpen}
  onClose={() => setAssignModalOpen(false)}
  rowData={selectedRow}
  onSuccess={GetData_Status}
  editData={editRow}
/>


        <PartySettingModal
          open={settingsOpen}
          onClose={() => {
            setSettingsOpen(false);
            setSelectedPartyID(null);
          }}
          PartyID={selectedPartyID}
        />

        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setDeleteTarget(null)}
            />
            <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white p-4 sm:p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-800">
                Delete Party
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {deleteTarget.Name || "this party"}
                </span>
                ?
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await Delete_Party(deleteTarget.PartyID);
                    setDeleteTarget(null);
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


 {viewOpen && viewData && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="absolute inset-0 bg-slate-900/40" onClick={() => setViewOpen(false)} />
              <div className="relative mx-auto flex min-h-screen items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-6xl rounded-lg bg-white shadow-xl my-4 max-h-[85vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-800">Work Status history</h2>
                      <h2 className="text-xl font-semibold text-slate-800 flex flex-wrap gap-2">
                        {histroydetail && (
                          <>
                            <span className="text-slate-500 font-medium">Party Name:</span>
                            <span className="text-slate-700 font-bold">{histroydetail.PartyName}</span>

                            <span className="text-slate-400 mx-1">|</span>

                            <span className="text-slate-500 font-medium">Owner Name:</span>
                            <span className="text-slate-700 font-bold">{histroydetail.OwnerName}</span>
                          </>
                        )}
                      </h2>

                      <button
                        onClick={() => {
                          setViewOpen(false);
                        }}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        type="button"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {Array.isArray(viewData) && viewData.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-400">
                        <table className="w-full border-collapse bg-white">
                          <thead>
                            <tr className="bg-blue-600">
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">PartyName</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">EmployeeName</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">WorkStatus</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">Description</th>
                             
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">Created Date</th>

            
                            </tr>
                          </thead>

                          <tbody className="bg-white divide-y divide-slate-200">
                            {viewData.map((item, index) => (
                              <tr key={item.AssignID || index} className="hover:bg-blue-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">{item.PartyName || "-"}</td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">{item.EmployeeName || "-"}</td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">{item.WorkStatus || "-"}</td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">{item.Description || "-"}</td>
                               
                                
                                <td className="px-4 py-3 text-sm text-slate-800">{item.CreatedDtTm || "-"}</td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                        <p className="text-sm text-slate-500">No WorkStatus data available</p>
                      </div>
                    )}

                   
                  </div>
                </div>
              </div>
            </div>
          )}



    </div>
  );
};

export default WorkStatus;

