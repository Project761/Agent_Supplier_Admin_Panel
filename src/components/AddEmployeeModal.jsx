import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddEmployeeModal({ open, onClose, onSubmit }) {
    const inputCls =
        "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm " +
        "outline-none transition " +
        "focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb]";

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        department: null,
        designation: "",
        joiningDate: null,
        status: { value: "Active", label: "Active" },
        address: "",
        photo: null,
    });

    useEffect(() => {
        if (!open) return;
        const onEsc = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    const departmentOptions = useMemo(
        () => [
            { value: "HR", label: "HR" },
            { value: "Engineering", label: "Engineering" },
            { value: "Sales", label: "Sales" },
            { value: "Accounts", label: "Accounts" },
        ],
        []
    );

    const statusOptions = useMemo(
        () => [
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
        ],
        []
    );

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: 42,
            borderRadius: 12,
            borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
            boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
            ":hover": { borderColor: state.isFocused ? "#2563eb" : "#cbd5e1" },
            fontSize: 14,
        }),
        valueContainer: (base) => ({ ...base, padding: "0 12px" }),
        placeholder: (base) => ({ ...base, color: "#94a3b8" }),
        singleValue: (base) => ({ ...base, color: "#0f172a" }),
        menu: (base) => ({ ...base, borderRadius: 12, overflow: "hidden" }),
    };

    if (!open) return null;

    const handleChange = (key) => (e) =>
        setForm((p) => ({ ...p, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            department: form.department?.value || "",
            designation: form.designation,
            joiningDate: form.joiningDate
                ? form.joiningDate.toISOString().slice(0, 10)
                : "",
            status: form.status?.value || "Active",
            address: form.address,
            photo: form.photo,
        };

        onSubmit?.(payload);
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* backdrop */}
            <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

            {/* modal */}
            <div className="relative mx-auto flex min-h-screen items-center justify-center p-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
                    style={{ maxHeight: '90vh' }}
                >
                    {/* header */}
                    <div className="flex-shrink-0 border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Add Employee
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-2 text-slate-500 cursor-pointer hover:bg-slate-100"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* body */}
                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                        {/* Full Name */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={handleChange("fullName")}
                                placeholder="Enter full name"
                                className={inputCls}
                            />
                        </div>

                        {/* Email + Phone */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    placeholder="example@email.com"
                                    className={inputCls}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    placeholder="+91XXXXXXXXXX"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {/* Department + Designation */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">
                                    Department
                                </label>
                                <Select
                                    value={form.department}
                                    onChange={(opt) => setForm((p) => ({ ...p, department: opt }))}
                                    options={departmentOptions}
                                    placeholder="Select Department"
                                    styles={selectStyles}
                                    isSearchable
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    value={form.designation}
                                    onChange={handleChange("designation")}
                                    placeholder="e.g. Software Engineer"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {/* Joining Date (react-datepicker) + Employment Status */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">
                                    Joining Date
                                </label>

                                {/* Make DatePicker full width */}
                                <div className="w-full">
                                    <DatePicker
                                        selected={form.joiningDate}
                                        onChange={(date) =>
                                            setForm((p) => ({ ...p, joiningDate: date }))
                                        }
                                        placeholderText="Select date"
                                        dateFormat="dd/MM/yyyy"
                                        className={inputCls}
                                        wrapperClassName="w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-600">
                                    Employment Status
                                </label>
                                <Select
                                    value={form.status}
                                    onChange={(opt) => setForm((p) => ({ ...p, status: opt }))}
                                    options={statusOptions}
                                    styles={selectStyles}
                                    isSearchable={false}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">
                                Address
                            </label>
                            <textarea
                                rows={3}
                                value={form.address}
                                onChange={handleChange("address")}
                                placeholder="Enter address"
                                className={inputCls + " resize-none"}
                            />
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">
                                Profile Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        photo: e.target.files?.[0] || null,
                                    }))
                                }
                                className={
                                    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm " +
                                    "file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 " +
                                    "file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 " +
                                    "hover:file:bg-slate-200 " +
                                    "focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb] outline-none"
                                }
                            />
                        </div>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
