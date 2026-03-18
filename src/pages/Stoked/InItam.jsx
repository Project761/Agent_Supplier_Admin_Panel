import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";

import { FaLocationPin } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import InItamModal from "./InItamModal";
import AddStockModal from "./AddStockModal ";
// import AddStockModal from "./AddStockModal";




const InItam = () => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        GetData_Adminuser()
    }, [])


    const GetData_Adminuser = async () => {
        const val = {
            LocationID: "",
        };
        try {
            const res = await PostWithToken("MasterItems/GetData_MasterItems", val);
            // console.log(res, "res");
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
    const [stokopen, setStokOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [editItemId, setEditItemId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [viewData, setViewData] = useState(null);
      const [viewOpen, setViewOpen] = useState(false);
  


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
        setEditItemId(row.UserID);
        setStokOpen(true);
        setEditRow(row);
    };

    const onDeleteRequest = (row) => {

        setDeleteTarget(row);
    };


     const onViewItem = (row) => {
        const ItemID = row.ItemID;
        console.log(row, "view row");
        if (ItemID) {
          GetSingleData_Stockdata(ItemID);
        } else {
          toastifySuccess("Item ID not found");
        }
      };
     const GetSingleData_Stockdata = async (ItemID) => {
        try {
          const val = { ItemID: ItemID };
          const res = await PostWithToken("ItemStock/GetData_ItemStock", val);
          if (res) {
            setViewData(res);
            setViewOpen(true);
          } else {
            toastifySuccess("No stock data found for this item");
          }
        } catch (error) {
          console.error("GetSingleData_Stockdata error:", error);
        }
      };


    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;

        return items.filter((r) => {
            const hay = `${r.ItemName} ${r.Qty} ${r.Price}`.toLowerCase();
            return hay.includes(q);
        });
    }, [items, search]);

    const columns = [
        {
            name: <span className="font-semibold">Item Name</span>,
            selector: (row) => row.ItemName,
            sortable: true,
        },
        {
            name: <span className="font-semibold">StockData</span>,
            selector: (row) => row.StockData || "-",
            sortable: true,
        },
         {
            name: <span className="font-semibold">OutStock</span>,
            selector: (row) => row.OutStock || "-",
            sortable: true,
        },
         {
            name: <span className="font-semibold">RemaingStock</span>,
            selector: (row) => row.RemaingStock || "-",
            sortable: true,
        },
        {
            name: <span className="font-semibold">Price</span>,
            selector: (row) => row.Price || "-",
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
                         title="Add Stock"
                    >
                        
                         <FiPlus className="text-base" /> 
                         
                    </button>

                    <button
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                        onClick={() => onViewItem(r)}
                        type="button"
                         title="View Stock"
                    >
                   <FiEye className="text-base" />
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
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                borderBottom: "0",
            },
        },
        rows: { style: { minHeight: "52px" } },
        cells: { style: { padding: "1rem 0.75rem" } },
    };


    const Delete_Reference = async (ItemID) => {
        try {
            const val = {
                DeleteByUser: "",
                IsActive: '',
                ItemId: ItemID,

            }
            const res = await PostWithToken('MasterItems/Delete_MasterItems', val)
            if (res) {
                toastifySuccess('Admin user successfully Deleted');
                await GetData_Adminuser();
            }
        } catch (error) {
            console.log(error, 'error')
        }
    }



    return (
        <div className="flex-1 space-y-3 overflow-y-auto px-2 py-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">


                <div className="">
                    <div className="mb-2 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Admin user..."
                            className="w-full sm:w-64 md:w-72 rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        /> */}
                        <div></div>
                        <button
                            onClick={() => {
                                setEditRow(null);
                                setEditItemId(null);
                                setOpen(true);

                            }}
                            className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                        >
                            Add Item
                        </button>
                    </div>

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


                <InItamModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSave={handleSaveItem}
                    editData={editRow}
                    onSuccess={GetData_Adminuser}
                />
                <AddStockModal
                    open={stokopen}
                    onClose={() => setStokOpen(false)}
                    onSave={handleSaveItem}
                    editData={editRow}
                    onSuccess={GetData_Adminuser}
                />

                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={() => setDeleteTarget(null)}
                        />
                        <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white p-4 sm:p-5 shadow-xl">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Delete Reference
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">
                                    {deleteTarget.ItemName}
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
                                        await Delete_Reference(deleteTarget.ReferenceID);
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

               {viewOpen && viewData && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setViewOpen(false)} />
            <div className="relative mx-auto flex min-h-screen items-center justify-center p-2 sm:p-4">
              <div className="w-full max-w-6xl rounded-lg bg-white shadow-xl my-4 max-h-[85vh] overflow-y-auto">

                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">
                        Stock Details - {viewData[0]?.ItemName || "Item"}
                    </h2>
                    <button
                      onClick={() => setViewOpen(false)}
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
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full border-collapse bg-white">
                        <thead>
                          <tr className="bg-blue-600">

                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">
                              Item Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">
                             Location Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">
                              Quantity
                            </th>
                          
                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                              Created Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {viewData.map((item, index) => (
                            <tr key={item.StockID || index} className="hover:bg-blue-50 transition-colors">

                              <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                {item.ItemName || "-"}
                              </td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                {item.LocationName || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                {item.Qty || "-"}
                              </td>
                              
                             
                              <td className="px-4 py-3 text-sm text-slate-800">
                                {item.CreatedDtTm || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                      <p className="text-sm text-slate-500">No Stock data available</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setViewOpen(false)}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


            </div>
        </div>
    );
}

export default InItam;