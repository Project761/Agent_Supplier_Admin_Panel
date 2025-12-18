import React, { useCallback, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";

/**
 * Props:
 * open: boolean
 * onClose: () => void
 * onSave: (itemPayload) => void              // item save (table)
 * editData?: item row to edit (optional)
 * onSaveSupplier?: (supplierPayload) => void // optional (top form)
 */
export default function SupplierModal({
    open,
    onClose,
    onSave,
    editData,
    onSaveSupplier,
}) {
    const inputCls =
        "w-full rounded-sm border border-slate-200 px-4 py-2.5 text-sm " +
        "outline-none transition " +
        "focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb]";

    /* ---------------- Supplier Form (TOP) ---------------- */
    const [supplierForm, setSupplierForm] = useState({
        fullName: "",
        mobile: "",
        firmName: "",
        email: "",
        gst: "",
        address: "",
    });

    const [rows, setRows] = useState([
        {
            id: "1",
            item: "Cement",
            rate: 420,
            company: "UltraTech, ACC",
            modelNo: "CM-101",
            description: "OPC 53 Grade",
        },
        {
            id: "2",
            item: "Steel",
            rate: 61000,
            company: "Tata",
            modelNo: "ST-500",
            description: "TMT Bars 500D",
        },
    ]);

    const handleSupplierChange = (key) => (e) => {
        let v = e.target.value;

        if (key === "mobile") {
            v = v.replace(/\D/g, "").slice(0, 10);
        }

        setSupplierForm((p) => ({ ...p, [key]: v }));
    };

    const clearSupplier = () =>
        setSupplierForm({
            fullName: "",
            mobile: "",
            firmName: "",
            email: "",
            gst: "",
            address: "",
        });

    const saveSupplier = () => {
        if (!supplierForm.fullName.trim()) return alert("Name required");
        if (!supplierForm.mobile.trim()) return alert("Mobile required");
        if (supplierForm.mobile.length !== 10) return alert("Mobile must be 10 digits");

        onSaveSupplier?.({
            fullName: supplierForm.fullName.trim(),
            mobile: supplierForm.mobile.trim(),
            firmName: supplierForm.firmName.trim(),
            email: supplierForm.email.trim(),
            gst: supplierForm.gst.trim(),
            address: supplierForm.address.trim(),
        });
    };

    /* ---------------- Item Form + Table (BOTTOM) ---------------- */
    const [localEdit, setLocalEdit] = useState(null);
    const activeEdit = editData ?? localEdit;

    const initialForm = useMemo(
        () => ({
            item: activeEdit?.item ? { value: activeEdit.item, label: activeEdit.item } : null,
            rate: activeEdit?.rate?.toString?.() ?? "",
            company: activeEdit?.company
                ? String(activeEdit.company)
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean)
                    .map((x) => ({ value: x, label: x }))
                : [],
            modelNo: activeEdit?.modelNo ?? "",
            description: activeEdit?.description ?? "",
        }),
        [activeEdit]
    );

    const [form, setForm] = useState(initialForm);
    const [search, setSearch] = useState("");

    useEffect(() => setForm(initialForm), [initialForm]);

    useEffect(() => {
        if (!open) return;
        const onEsc = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            setLocalEdit(null);
            setSearch("");
        }
    }, [open]);

    const itemOptions = [
        { value: "Cement", label: "Cement" },
        { value: "Steel", label: "Steel" },
        { value: "Sand", label: "Sand" },
    ];

    const companyOptions = [
        { value: "UltraTech", label: "UltraTech" },
        { value: "Ambuja", label: "Ambuja" },
        { value: "ACC", label: "ACC" },
        { value: "Tata", label: "Tata" },
    ];

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            width: "100%",
            borderRadius: 6,
            borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
            boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
            minHeight: 42,
            paddingLeft: 6,
            paddingRight: 6,
            fontSize: 14,
            transition: "all 150ms",
            "&:hover": { borderColor: state.isFocused ? "#2563eb" : "#e2e8f0" },
        }),
        valueContainer: (base) => ({ ...base, padding: "2px 6px" }),
        input: (base) => ({ ...base, margin: 0, padding: 0 }),
        placeholder: (base) => ({ ...base, color: "#94a3b8" }),
        multiValue: (base) => ({ ...base, borderRadius: 6, backgroundColor: "#f1f5f9" }),
        multiValueLabel: (base) => ({ ...base, fontSize: 12, color: "#0f172a" }),
        multiValueRemove: (base) => ({
            ...base,
            borderRadius: 10,
            ":hover": { backgroundColor: "#e2e8f0", color: "#0f172a" },
        }),
        menu: (base) => ({ ...base, borderRadius: 6, overflow: "hidden" }),
    };

    const handleChange = (key) => (e) => {
        const value = e.target.value;
        if (key === "rate") {
            if (!/^\d*\.?\d*$/.test(value)) return;
        }
        setForm((p) => ({ ...p, [key]: value }));
    };

    const handleAddOrUpdate = (e) => {
        e.preventDefault();

        if (!form.item) return alert("Item required");
        if (!form.rate.trim()) return alert("Rate required");
        if (Number(form.rate) <= 0) return alert("Rate must be greater than 0");

        const id = activeEdit?.id ?? String(Date.now());

        const payload = {
            id,
            item: form.item.label,
            rate: Number(form.rate),
            company: (form.company || []).map((c) => c.label).join(", "),
            modelNo: form.modelNo.trim(),
            description: form.description.trim(),
        };

        setRows((prev) => {
            const exists = prev.some((r) => r.id === id);
            if (exists) return prev.map((r) => (r.id === id ? payload : r));
            return [payload, ...prev];
        });

        onSave?.(payload);

        setLocalEdit(null);
        setForm({ item: null, rate: "", company: [], modelNo: "", description: "" });
    };

    const handleEdit = useCallback((row) => setLocalEdit(row), []);
    const handleDelete = useCallback((row) => {
        if (!window.confirm("Delete this item?")) return;
        setRows((p) => p.filter((x) => x.id !== row.id));
    }, []);

    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => {
            const hay = `${r.item} ${r.rate} ${r.company} ${r.modelNo} ${r.description}`.toLowerCase();
            return hay.includes(q);
        });
    }, [rows, search]);

    const columns = useMemo(
        () => [
            { name: "Item", selector: (r) => r?.item || "", sortable: true, },
            { name: "Rate", selector: (r) => (r?.rate ?? ""), sortable: true, },
            { name: "Company", selector: (r) => r?.company || "", },
            { name: "Model No.", selector: (r) => r?.modelNo || "", },
            { name: "Description", selector: (r) => r?.description || "", },
            {
                name: "Action",
                width: "120px",
                cell: (row) =>
                    row?.id ? (


                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
                                title="Edit"
                            >
                                <FaRegEdit className="text-base" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(row)}
                                className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                                title="Delete"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ) : null,
            },
        ],
        [handleDelete, handleEdit]
    );

    const tableData = (filteredItems && filteredItems.length > 0) ? filteredItems : [{}];

    const tableStyles = {
        headRow: { style: { backgroundColor: "#2563eb", minHeight: "44px" } },
        headCells: {
            style: {
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.06em",
                borderBottom: "0",
            },
        },
        rows: { style: { minHeight: "52px" } },
        cells: { style: { padding: "12px" } },
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

            <div className="relative mx-auto flex min-h-screen items-center justify-center">
                <div className="w-full max-w-6xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">

                    {/* content */}

                    {/* ===== TOP BOX ===== */}
                    <div className="p-2 mt-2">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                            <div className="grid grid-cols-6 items-center gap-3">
                                <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={supplierForm.fullName}
                                    onChange={handleSupplierChange("fullName")}
                                    placeholder="Enter full name"
                                    className={inputCls + " col-span-4"}
                                />
                            </div>

                            <div className="grid grid-cols-6 items-center gap-3">
                                <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                    Mobile <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={supplierForm.mobile}
                                    onChange={handleSupplierChange("mobile")}
                                    placeholder="Enter mobile number"
                                    className={inputCls + " col-span-4"}
                                />
                            </div>

                            <div className="grid grid-cols-6 items-center gap-3">
                                <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                    Firm Name
                                </label>
                                <input
                                    type="text"
                                    value={supplierForm.firmName}
                                    onChange={handleSupplierChange("firmName")}
                                    placeholder="Enter firm name"
                                    className={inputCls + " col-span-4"}
                                />
                            </div>

                            <div className="grid grid-cols-6 items-center gap-3">
                                <label className="col-span-2 text-right text-sm font-medium text-slate-600 whitespace-nowrap">
                                    GST No.
                                </label>
                                <input
                                    type="text"
                                    value={supplierForm.gst}
                                    onChange={handleSupplierChange("gst")}
                                    placeholder="Enter GST number"
                                    className={inputCls + " col-span-4"}
                                />
                            </div>

                            <div className="sm:col-span-2 grid grid-cols-12 items-start gap-3">
                                <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right pt-2">
                                    Address
                                </label>
                                <textarea
                                    rows={1}
                                    value={supplierForm.address}
                                    onChange={handleSupplierChange("address")}
                                    placeholder="Enter address"
                                    className={inputCls + " col-span-10 resize-none"}
                                />
                            </div>
                        </div>


                        {/* ===== BOTTOM BOX ===== */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mt-2">
                            <form onSubmit={handleAddOrUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                                    {/* Item */}
                                    <div className="grid grid-cols-6 items-center gap-3">
                                        <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                            Name
                                        </label>
                                        <div className="col-span-4">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={form.name}
                                                onChange={handleChange("rate")}
                                                placeholder="Enter rate"
                                                className={inputCls + " col-span-4"}
                                            />
                                        </div>
                                    </div>
                                    {/* Company Name */}


                                    {/* Rate */}
                                    <div className="grid grid-cols-6 items-center gap-3">
                                        <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                            Serial No.
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={form.rate}
                                            onChange={handleChange("rate")}
                                            placeholder="Enter rate"
                                            className={inputCls + " col-span-4"}
                                        />
                                    </div>

                                    {/* Model No (row 2 col 1) */}
                                    <div className="grid grid-cols-6 items-center gap-3">
                                        <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                            Model No.
                                        </label>
                                        <input
                                            type="text"
                                            value={form.modelNo}
                                            onChange={handleChange("modelNo")}
                                            placeholder="Enter model no."
                                            className={inputCls + " col-span-4"}
                                        />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-3">
                                        <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                            SHN Code
                                        </label>
                                        <input
                                            type="text"
                                            value={form.description}
                                            onChange={handleChange("description")}
                                            placeholder="Enter description"
                                            className={inputCls + " col-span-4"}
                                        />
                                    </div>

                                    <div className="grid grid-cols-6 items-center gap-3">
                                        <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                            Company
                                        </label>
                                        <div className="col-span-4">
                                            <Select
                                                isMulti
                                                value={form.company}
                                                onChange={(opts) => setForm((p) => ({ ...p, company: opts || [] }))}
                                                options={companyOptions}
                                                placeholder="Select..."
                                                styles={selectStyles}
                                            />
                                        </div>
                                    </div>

                                    {/* Description (row 2 col 2) ✅ */}
                                    <div className="grid grid-cols-6 items-center gap-3">
                                        <label className="col-span-2 text-sm font-medium text-slate-600 whitespace-nowrap text-right">
                                            Specification
                                        </label>
                                        <input
                                            type="text"
                                            value={form.description}
                                            onChange={handleChange("description")}
                                            placeholder="Enter description"
                                            className={inputCls + " col-span-4"}
                                        />
                                    </div>

                                    <div className="sm:col-span-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleAddOrUpdate}
                                            className="rounded-xl py-2 bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            Add Item
                                        </button>
                                    </div>




                                </div>



                            </form>

                            <div className="mt-4">
                                <DataTable
                                    columns={columns}
                                    data={tableData}
                                    pagination={filteredItems?.length > 0}
                                    highlightOnHover={filteredItems?.length > 0}
                                    striped
                                    fixedHeader
                                    fixedHeaderScrollHeight="320px"
                                    responsive
                                    customStyles={tableStyles}
                                    noDataComponent={null}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
}
