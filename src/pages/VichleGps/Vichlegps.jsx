import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import VichlegpsModel from "./VichlegpsModel";
import { toastifySuccess } from "../../Utility/Utility";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { useNavigate } from "react-router-dom";
import Otpverify from "../../components/Otpverify";

const Vichlegps = () => {
    const navigate = useNavigate();
   

    const [items, setItems] = useState();


    useEffect(() => {
        GetData_Gps()
    }, [])

    useEffect(()=>{
        setOpen(false);
    },[])

    const GetData_Gps = async () => {
        const val = {
            CreatedByUser: "1",
        };
        try {
            const res = await PostWithToken("VehicleGPS/GetData_VehicleGPS", val);
        
            if (res) {
                setItems(res);
            } else {
                setItems([])
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [editItemId, setEditItemId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [otpverifyOpen, setOtpverifyOpen] = useState(false);
    const[deleteId,setDeleteId]=useState(null);



    const makeId = () =>
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;


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
const handleDownload = async (url, fileName = "vehicle.jpg") => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Download failed", error);
    }
};


    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter((r) => {
            const hay = `${r.item} ${r.rate} ${r.company} ${r.modelNo} ${r.description}`.toLowerCase();
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
    name: <span className="font-semibold">AddharPic</span>,
    cell: (row) => {
        if (!row.AadharPic) return "-";

        const imageUrl = formatUrl(row.AadharPic);

        return (
            <div className="flex flex-col items-center gap-1">
                <img
                    src={imageUrl}
                    alt="Aadhar Pic"
                    className="w-20 h-14 object-cover rounded border"
                />

                <a
                    href={imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs underline"
                >
                    Download
                </a>
            </div>
        );
    },
    sortable: false,
    width: "120px",
},
            {
    name: <span className="font-semibold">VehiclePic</span>,
    cell: (row) => {
        if (!row.VehiclePic) return "-";

        const imageUrl = formatUrl(row.VehiclePic);

        return (
            <div className="flex flex-col items-center gap-1">
                <img
                    src={imageUrl}
                    alt="Vehicle Pic"
                    className="w-14 h-10 object-cover rounded border"
                />

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
}
,
{
    name: <span className="font-semibold">RCPic</span>,
    cell: (row) => {
        if (!row.RCPic) return "-";

        const imageUrl = formatUrl(row.RCPic);

        return (
            <div className="flex flex-col items-center gap-1">
                <img
                    src={imageUrl}
                    alt="RC Pic"
                    className="w-10 h-10 object-cover rounded border"
                />

                <a
                    href={imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs underline"
                >
                    Download
                </a>
            </div>
        );
    },
    sortable: false,
}

,


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
                            className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                            onClick={() => onDeleteRequest(r)}
                            type="button"
                            title="Delete"
                        >
                            <FiTrash2 className="text-base" />
                        </button>
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


    const Delete_Reference = async (VehicleGPSID) => {
  setOtpverifyOpen(true);
   
    }



    return (
        <div className="flex-1 space-y-3 overflow-y-auto px-2 py-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">


                <div className="">
                    <div className="mb-2 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search agent..."
                            className="w-full sm:w-64 md:w-72 rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        /> */}
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
                    { otpverifyOpen && (
        <Otpverify
          open={otpverifyOpen}
          onClose={() => setOtpverifyOpen(false)}
          editItemId={deleteId}
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
              

             { open && <VichlegpsModel
                    open={open}
                    onClose={() => setOpen(false)}
                    onSave={handleSaveItem}
                    editData={editRow}
                    onSuccess={GetData_Gps}
                />} 

                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={() => setDeleteTarget(null)}
                        />
                        <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white p-4 sm:p-5 shadow-xl">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Delete Vehicle GPS
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">
                                    {deleteTarget.VehicleNo}
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
        </div>
    );
}

export default Vichlegps;