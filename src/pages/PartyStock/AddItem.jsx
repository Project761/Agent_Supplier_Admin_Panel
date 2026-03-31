import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";
import CreatableSelect from "react-select/creatable";

const AddItem = ({ open, onClose, editData, onSuccess }) => {


    const inputCls =
        "w-full rounded-sm border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500";
    const [items, setItems] = useState([]);
    const [value, setValue] = useState({
        ItemName: "",
        Price: "",
        Qty: "",
        LocationID: "",
        LocationName: "",
        StockDtTm: "",
        Comment: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (key) => (e) => {
        setValue((prev) => ({
            ...prev,
            [key]: e.target.value
        }));
    };
    const handleChanges = (field) => (e) => {
        setValue({ ...value, [field]: e.target.value });
    };
    const handleLocationChange = (e) => {

        const id = e.target.value;

        const location = items.find(
            (item) => item.LocationID == id
        );

        setValue({
            ...value,
            LocationID: location.LocationID,
            LocationName: location.LocationName
        });
    };

    // const validate = () => {
    //     const e = {};
    //     if (!value.ItemName) e.ItemName = "Description  required";
    //     if (!value.Qty) e.Qty = "Quantity required";

    //     setErrors(e);
    //     return Object.keys(e).length === 0;
    // };

    const validate = () => {
        const e = {};

        // if (!value.ItemName) {
        //     e.ItemName = "Description required";
        // }
        if (!value.Qty) {
            e.Qty = "Quantity required";
        }
        // else if (Number(value.Qty) > (editData?.TotalInStock ?? 0)) {
        //     e.Qty = "Quantity cannot be greater than in stock";
        // }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    useEffect(() => {
        if (editData) {
            setValue({
                ItemName: editData.Description ?? "",
                Price: editData.Price ?? "",
                StockDtTm: editData.StockDtTm ?? "",
                LocationID: editData.LocationID ?? "",
                LocationName: editData.LocationName ?? ""
            });
        }
    }, [editData]);

    const GetData_location = async () => {
        const val = {
            LocationID: "",
        };
        try {
            const res = await PostWithToken("ItemOut/GetDropDownData_Locations", val);

            if (res) {
                setItems(res);
            } else {
                setItems([])
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        GetData_location();
    }, [])
    useEffect(() => {
        if (!editData && open) {
            setValue({
                ItemName: "",
                Price: ""
            });
            setErrors({});
        }
    }, [editData, open]);

    const handleSubmit = async () => {

        if (!validate()) return;

        const api =
            "PartyStock/AddStock";


        const payload = {
            // ItemID: editData?.ItemID,
            Description: value.ItemName,
            Qty: value.Qty,
            LocationID: value.LocationID,
            LocationName: value.LocationName,
            Comment: value.Comment,
            StockDtTm: value.StockDtTm ? value.StockDtTm : new Date().toISOString().split("T")[0]
        };


        const res = await PostWithToken(api, payload);

        if (res) {
            toastifySuccess("Stock Added Successfully");
            onClose?.();
            onSuccess?.();
            refreshvalues();
            GetData_location();

        }
    };

    if (!open) return null;

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: 6,
            borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
            boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
            minHeight: 40,
        }),
    };

    const locationOptions = items.map((loc) => ({
        value: loc.LocationID,
        label: loc.LocationName
    }));

    const refreshvalues = () => {
        setValue({
            ItemName: "",
            Price: "",
            Qty: "",
            LocationID: "",
            LocationName: "",
            StockDtTm: "",
            Comment: ""
        });
    }

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
            <div className="relative flex items-center justify-center min-h-screen p-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {editData ? "Add Stock" : "Add Stock"}
                        </h2>

                        <button onClick={onClose}>
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">

                        <div>
                            <label className="text-sm font-medium">
                                Description
                            </label>

                            {
                                editData ? (
                                    <input
                                        type="text"
                                        value={value.ItemName}
                                        onChange={handleChange("ItemName")}
                                        className={`${inputCls} w-full bg-gray-100 cursor-not-allowed`}
                                        placeholder="Enter description"
                                        disabled
                                    />
                                ) : (
                                    <input

                                        type="text"
                                        value={value.ItemName}
                                        onChange={handleChange("ItemName")}
                                        className={`${inputCls} w-full`}
                                        placeholder="Enter description"
                                    />
                                )

                            }

                            {errors.ItemName && (
                                <p className="text-red-500 text-xs">
                                    {errors.ItemName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Location
                            </label>

                            {editData ?
                                (
                                    <CreatableSelect
                                        value={
                                            value.LocationName
                                                ? { label: value.LocationName, value: value.LocationID }
                                                : null
                                        }
                                        onChange={(opt) =>
                                            setValue((prev) => ({
                                                ...prev,
                                                LocationID: opt?.value || "",
                                                LocationName: opt?.label || ""
                                            }))
                                        }
                                        onCreateOption={(inputValue) =>
                                            setValue((prev) => ({
                                                ...prev,
                                                LocationID: "",
                                                LocationName: inputValue
                                            }))
                                        }
                                        options={locationOptions}
                                        placeholder="Select or create location..."
                                        styles={selectStyles}
                                        isClearable
                                        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                                        isDisabled

                                    />
                                ) :
                                (
                                    <CreatableSelect
                                        value={
                                            value.LocationName
                                                ? { label: value.LocationName, value: value.LocationID }
                                                : null
                                        }
                                        onChange={(opt) =>
                                            setValue((prev) => ({
                                                ...prev,
                                                LocationID: opt?.value || "",
                                                LocationName: opt?.label || ""
                                            }))
                                        }
                                        onCreateOption={(inputValue) =>
                                            setValue((prev) => ({
                                                ...prev,
                                                LocationID: "",
                                                LocationName: inputValue
                                            }))
                                        }
                                        options={locationOptions}
                                        placeholder="Select or create location..."
                                        styles={selectStyles}
                                        isClearable
                                        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}


                                    />
                                )
                            }

                            {errors.LocationID && (
                                <p className="text-red-500 text-xs">
                                    {errors.LocationID}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            {/* Label Row */}
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">
                                    Quantity
                                </label>

                                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-green-100 text-green-700">
                                    In Stock: {editData?.TotalInStock ?? 0}
                                </span>
                            </div>

                            {/* Input */}
                            <input
                                type="number"
                                value={value.Qty}
                                onChange={handleChange("Qty")}
                                className={`${inputCls} w-full`}
                                placeholder="Enter quantity"
                            />

                            {/* Error */}
                            {errors.Qty && (
                                <p className="text-red-500 text-xs">
                                    {errors.Qty}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className="text-sm font-medium">
                                Stock Date
                            </label>

                            <input
                                type="date"
                                value={value.StockDtTm ? value.StockDtTm : new Date().toISOString().split("T")[0]}
                                // value={value.StockDtTm}
                                onChange={(e) =>
                                    setValue((prev) => ({
                                        ...prev,
                                        StockDtTm: e.target.value
                                    }))
                                }
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Comment
                            </label>

                            <input
                                type="Comment"
                                value={value.Comment}
                                placeholder="Enter Comment"
                                onChange={(e) =>
                                    setValue((prev) => ({
                                        ...prev,
                                        Comment: e.target.value
                                    }))
                                }
                                className={inputCls}
                            />
                        </div>


                    </div>

                    <div className="flex justify-end mt-6">

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {editData ? "Save" : "Save"}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default AddItem;