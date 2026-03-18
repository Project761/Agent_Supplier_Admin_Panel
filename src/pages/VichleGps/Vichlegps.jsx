import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import VichlegpsModel from "./VichlegpsModel";
import { toastifySuccess } from "../../Utility/Utility";
import { GetWithToken, PostWithToken } from "../../ApiMethods/ApiMethods";
import { useNavigate } from "react-router-dom";
import Otpverify from "../../components/Otpverify";
import { IoMdCloudDownload } from "react-icons/io";
import Select from "react-select";
import { FaUserCheck } from "react-icons/fa6";

const Vichlegps = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [otpverifyOpen, setOtpverifyOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [permissionData, setPermissionData] = useState([]);

  useEffect(() => {
    GetData_Gps();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    PermissionUser_GetDropDown_User();
  }, []);

  useEffect(() => {
    if (showModal && editItemId) {
      GetData_PermissionUser(editItemId);
    }
  }, [showModal, editItemId]);

  const GetData_PermissionUser = async (editItemId) => {
    try {
      const val = { VehicleGPSID: editItemId };
      const res = await PostWithToken("PermissionUserGPS/GetData_PermissionUserGPS", val);

      if (res && res.length > 0) {
        setPermissionData(res);
        const preSelected = res.map((item) => ({
          value: item.UserID,
          label: item.FullName,
          PermissionUserGPSID: item.PermissionUserGPSID,
        }));
        setSelectedUser(preSelected);
      } else {
        setSelectedUser([]);
        setPermissionData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PermissionUser_GetDropDown_User = async () => {
    try {
      const res = await GetWithToken("PermissionUser/GetDropDown_User");
      if (res) {
        setUserList(res || []);
      } else {
        setUserList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetData_Gps = async () => {
      const auth = JSON.parse(sessionStorage.getItem("UserData"));
    const val = {
      CreatedByUser: auth?.UserID || "1",
    };
    try {
      const res = await PostWithToken("VehicleGPS/GetData_VehicleGPS", val);

      if (res) {
        setItems(res);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const makeId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  const handleSaveItem = (payload) => {
    if (payload.id) {
      setItems((prev) => prev.map((x) => (x.id === payload.id ? payload : x)));
    } else {
      setItems((prev) => [{ ...payload, id: makeId() }, ...prev]);
    }
  };

  const onEditItem = (row) => {
    setEditItemId(row.VehicleGPSID);

    setOpen(true);
    setEditRow(row);
  };

  const onDeleteRequest = (row) => {
    setDeleteId(row.VehicleGPSID);
    setDeleteTarget(row);
  };

  const formatUrl = (url) => {
    if (!url) return "";

    let fixedUrl = url.replace(/\\/g, "/");

    if (!fixedUrl.startsWith("http://") && !fixedUrl.startsWith("https://")) {
      fixedUrl = "http://" + fixedUrl;
    }

    return fixedUrl;
  };

  const urls = window.location.origin;
  async function handleDownload(url) {
    try {
      const response = await fetch(
        urls === "https://automation.arustu.com" ? "https://automationapi.arustu.com/api/VehicleGPS/Downland_VehicleFile" : "http://autoapi.arustu.com/api/VehicleGPS/Downland_VehicleFile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageUrl: url }),
        },
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(downloadUrl);
      toastifySuccess("Download");
    } catch (error) {
      console.error("Download error:", error);
    }
  }

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) => {
      const hay = `${r.VehicleNo} ${r.IEMINo} ${r.Amount} ${r.AadharNo} ${r.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const columns = useMemo(
    () => [
      {
        name: <span className="font-semibold">VehicleNo</span>,
        selector: (row) => row.VehicleNo || "-",
        sortable: true,
        cell: (row) => <div className="font-medium text-slate-800">{row.VehicleNo}</div>,
      },

      {
        name: <span className="font-semibold">IEMI No</span>,
        selector: (row) => row.IEMINo || "-",
        sortable: true,
      },
      {
        name: <span className="font-semibold">Amount</span>,
        selector: (row) => row.Amount || "-",
        sortable: true,
      },
      {
        name: <span className="font-semibold">AadharNo</span>,
        selector: (row) => row.AadharNo || "-",
        sortable: true,
      },
      {
        name: <span className="font-semibold">ContactNo</span>,
        selector: (row) => row.ContactNo || "-",
        sortable: true,
      },
      {
        name: <span className="font-semibold">Refernce</span>,
        selector: (row) => row.Refernce || "-",
        sortable: true,
      },
      {
        name: <span className="font-semibold">Addhar Pic</span>,
        cell: (row) => {
          if (!row.AddharPic) return "-";

          const imageUrl = formatUrl(row.AddharPic);

          return (
            <div className="flex flex-col items-center gap-1">
              <img src={imageUrl} alt="AddharPic " className="w-14 h-10 object-cover rounded border" />
              <a href={imageUrl} download target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                <span className="flex items-center gap-1">view</span>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(imageUrl);
                }}
                className="text-blue-600 text-[10px] underline cursor-pointer"
              >
                Download
              </button>
            </div>
          );
        },
        sortable: false,
        width: "90px",
      },
      {
        name: <span className="font-semibold">Vehicle Pic</span>,
        cell: (row) => {
          if (!row.VehiclePic) return "-";

          const imageUrl = formatUrl(row.VehiclePic);

          return (
            <div className="flex flex-col items-center gap-1">
              <img src={imageUrl} alt="Vehicle Pic" className="w-14 h-10 object-cover rounded border" />
              <a href={imageUrl} download target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                <span className="flex items-center gap-1">view</span>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(imageUrl);
                }}
                className="text-blue-600 text-[10px] underline cursor-pointer"
              >
                Download
              </button>
            </div>
          );
        },
        sortable: false,
        width: "90px",
      },
      {
        name: <span className="font-semibold">RCPic</span>,
        cell: (row) => {
          if (!row.RCPic) return "-";

          const imageUrl = formatUrl(row.RCPic);

          return (
            <div className="flex flex-col items-center gap-1">
              <img src={imageUrl} alt="RCPic " className="w-14 h-10 object-cover rounded border" />
              <a href={imageUrl} download target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                <span className="flex items-center gap-1">view</span>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(imageUrl);
                }}
                className="text-blue-600 text-[10px] underline cursor-pointer"
              >
                Download
              </button>
            </div>
          );
        },
        sortable: false,
        width: "90px",
      },

      {
        name: <span className="font-semibold">Device Pic</span>,
        cell: (row) => {
          if (!row.DevicePic) return "-";

          const imageUrl = formatUrl(row.DevicePic);

          return (
            <div className="flex flex-col items-center gap-1">
              <img src={imageUrl} alt="Device Pic" className="w-14 h-10 object-cover rounded border" />
              <a href={imageUrl} download target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                <span className="flex items-center gap-1">view</span>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(imageUrl);
                }}
                className="text-blue-600 text-[10px] underline cursor-pointer"
              >
                Download
              </button>
            </div>
          );
        },
        sortable: false,
        width: "90px",
      },

      {
        name: "Actions",

        cell: (r) => (
          <div className="flex gap-2">
            <button className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700" onClick={() => onEditItem(r)} type="button" title="Edit">
              <FaRegEdit className="text-base" />
            </button>
            <button
              className="rounded-md bg-yellow-600 p-2 text-white hover:bg-yellow-700"
              type="button"
              title="Add Permission"
              onClick={() => {
                setShowModal(true);
                setEditItemId(r.VehicleGPSID);
              }}
            >
              <FaUserCheck className="text-base" />
            </button>
            <button className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700" onClick={() => onDeleteRequest(r)} type="button" title="Delete">
              <FiTrash2 className="text-base" />
            </button>
          </div>
        ),
      },
    ],
    [editItemId],
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
  const userOptions = userList?.map((user) => ({
    value: user.UserID,
    label: user.FullName,
  }));

  const Insert_PermissionUser = async (UserID) => {
    try {
      const val = {
        VehicleGPSID: editItemId,
        UserID: UserID,
        // CompanyID: CompanyID,
      };

      const res = await PostWithToken("PermissionUserGPS/Insert_PermissionUserGPS", val);
      if (res) {
        toastifySuccess("User assigned successfully");
        // setShowModal(false);
      }
    } catch (error) {
      console.error("Insert_PermissionUser error:", error);
    }
  };
  const Delete_Reference = async (VehicleGPSID) => {
    setOtpverifyOpen(true);
  };

  const Delete_PermissionUser = async (PermissionUserGPSID) => {
    try {
      const val = {
        PermissionUserGPSID: PermissionUserGPSID,
      };

      const res = await PostWithToken("PermissionUserGPS/Delete_PermissionUserGPS", val);

      if (res) {
        toastifySuccess("Successfully deleted");
      }
    } catch (error) {
      console.error("Delete_PermissionUser error:", error);
    }
  };

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-2 py-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="">
          <div className="mb-2 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-64 md:w-72 rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div></div>
            <button
              onClick={() => {
                setEditItemId(null);
                setOpen(true);
                setEditRow(null);
              }}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Add Vehicle Gps
            </button>
          </div>
          {otpverifyOpen && (
            <Otpverify
              open={otpverifyOpen}
              onClose={() => setOtpverifyOpen(false)}
              editItemId={deleteId}
              deletename="Vehicle GPS"
              onSuccess={async () => {
                setOtpverifyOpen(false);
                await GetData_Gps();
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

        {open && <VichlegpsModel open={open} onClose={() => setOpen(false)} onSave={handleSaveItem} editData={editRow} onSuccess={GetData_Gps} />}

        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setDeleteTarget(null)} />
            <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white p-4 sm:p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-800">Delete Vehicle GPS</h2>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete <span className="font-semibold">{deleteTarget.VehicleNo}</span>?
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  No
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await Delete_Reference(deleteTarget.VehicleGPSID);
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-50"></div>

          {/* Modal */}
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Assign Permission User</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100" title="Close">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            {/* Dropdown */}
            <div className="mb-5">
              <label className="mb-1 block text-sm font-medium text-gray-600">Select User</label>

              <Select
                options={userOptions}
                value={selectedUser}
                isMulti
                isClearable
                placeholder="Select users..."
                className="text-sm"
                classNamePrefix="react-select"
                onChange={async (newValue, actionMeta) => {
                  if (actionMeta.action === "select-option") {
                    const selected = actionMeta.option;
                    if (selected?.value) {
                      await Insert_PermissionUser(selected.value);
                    }
                  }

                  if (actionMeta.action === "remove-value") {
                    const removedUser = actionMeta.removedValue;

                    if (removedUser?.PermissionUserGPSID) {
                      await Delete_PermissionUser(removedUser.PermissionUserGPSID);
                    }
                  }
                  /* 🧹 DELETE ALL on clear */
                  if (actionMeta.action === "clear") {
                    if (selectedUser?.length > 0) {
                      for (const item of selectedUser) {
                        if (item.PermissionUserGPSID) {
                          await Delete_PermissionUser(item.PermissionUserGPSID);
                        }
                      }
                    }
                  }
                  setSelectedUser(newValue || []);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vichlegps;
