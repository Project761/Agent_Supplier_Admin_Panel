import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import AgentModal from "../components/AgentModal";

export default function Agent() {
    const [supplierForm, setSupplierForm] = useState({
        fullName: "",
        email: "",
        mobile: "",
        phone: "",
        gst: "",
        address: "",
    });

    // ✅ Items list (modal se yahi update hoga)
    const [items, setItems] = useState([
        {
            id: "1",
            item: "Cement",
            rate: 350,
            company: "UltraTech",
            modelNo: "UT-101",
            description: "Test description",
        },
    ]);

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    // ✅ item edit support
    const [editItemId, setEditItemId] = useState(null);

    const inputCls =
        "w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-700 shadow-sm " +
        "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

    const makeId = () =>
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const handleSupplierChange = (field) => (e) => {
        setSupplierForm((p) => ({ ...p, [field]: e.target.value }));
    };

    const resetAll = () => {
        setSupplierForm({
            fullName: "",
            email: "",
            mobile: "",
            phone: "",
            gst: "",
            address: "",
        });
        setItems([]);
        setEditItemId(null);
    };

    // ✅ Save supplier (ab real submit)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!supplierForm.fullName.trim()) return alert("Name required");
        if (!supplierForm.mobile.trim()) return alert("Mobile required");

        alert("Supplier Saved ✅ (ab aap yaha API call bhi kar sakte ho)");
        // yaha backend save / API call
    };

    // ✅ Modal se item add/update
    const handleSaveItem = (payload) => {
        if (payload.id) {
            // edit mode
            setItems((prev) => prev.map((x) => (x.id === payload.id ? payload : x)));
        } else {
            // add mode
            setItems((prev) => [{ ...payload, id: makeId() }, ...prev]);
        }
    };

    const onEditItem = (row) => {
        setEditItemId(row.id);
        setOpen(true);
    };

    const onDeleteItem = (id) => {
        if (!confirm("Delete this item?")) return;
        setItems((prev) => prev.filter((x) => x.id !== id));
        if (editItemId === id) setEditItemId(null);
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
                name: <span className="font-semibold">Name</span>,
                selector: (row) => row.Name,
                sortable: true,
                cell: (row) => <div className="font-medium text-slate-800">{row.Name}</div>,
            },
            {
                name: <span className="font-semibold">Company Name</span>,
                selector: (row) => row.company || "-",
                sortable: true,
            },

            {
                name: <span className="font-semibold">Model No.</span>,
                selector: (row) => row.modelNo || "-",
                sortable: true,
            },
            {
                name: <span className="font-semibold">Rate</span>,
                selector: (row) => row.rate,
                sortable: true,
            },
            {
                name: <span className="font-semibold">Description</span>,
                selector: (row) => row.description || "-",
                cell: (row) => (
                    <div className="truncate max-w-xs" title={row.description}>
                        {row.description || "-"}
                    </div>
                ),
            },
            {
                name: "Actions",
                button: true,
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
                            onClick={() => onDeleteItem(r.id)}
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

    const editingItem = editItemId ? items.find((x) => x.id === editItemId) : null;

    return (
        <div className="flex-1 space-y-3 overflow-y-auto px-2 py-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            

                {/* ✅ Items Table */}
                <div className="">
                    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search item..."
                            className="w-full sm:w-72 rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />

                        <button
                            onClick={() => {
                                setEditItemId(null);
                                setOpen(true);
                            }}
                            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                        >
                            Add Agent
                        </button>
                    </div>

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
                

                {/* ✅ Modal */}
                <AgentModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSave={handleSaveItem}
                    editData={editingItem} // null = add mode
                />
            </div>
        </div>
    );
}
