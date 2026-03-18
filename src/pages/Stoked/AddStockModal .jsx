import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";
import CreatableSelect from "react-select/creatable";

const AddStockModal = ({ open, onClose, editData, onSuccess }) => {

    const inputCls =
        "w-full rounded-sm border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500";
    const [items, setItems] = useState([]);
    const [value, setValue] = useState({
        ItemName: "",
        Price: "",
        Qty: "",
        LocationID: "",
        LocationName: ""
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

    const validate = () => {
        const e = {};
        if (!value.ItemName) e.ItemName = "Item Name required";
        // if (!value.Price) e.Price = "Price required";
        if (!value.Qty) e.Qty = "Quantity required";
        // if (!value.LocationID) e.LocationID = "Location required";


        setErrors(e);
        return Object.keys(e).length === 0;
    };

    useEffect(() => {
        if (editData) {
            setValue({
                ItemName: editData.ItemName ?? "",
                Price: editData.Price ?? ""
            });
        }
    }, [editData]);

    const GetData_location = async () => {
        const val = {
            LocationID: "",
        };
        try {
            const res = await PostWithToken("ItemOut/GetDropDownData_Locations", val);
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
            "ItemStock/Insert_ItemStock";


        const payload = {
            ItemID: editData?.ItemID,
            ItemName: value.ItemName,
            Qty: value.Qty,
            CreatedByUser: 1,
            LocationID: value.LocationID,
            LocationName: value.LocationName
        };


        const res = await PostWithToken(api, payload);

        if (res) {
            toastifySuccess("Stock Added Successfully");
            onClose?.();
            onSuccess?.();
            refreshvalues();
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
            LocationName: ""
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
                                Item Name
                            </label>

                            <input
                                value={value.ItemName}
                                onChange={handleChange("ItemName")}
                                className={inputCls}
                            />

                            {errors.ItemName && (
                                <p className="text-red-500 text-xs">
                                    {errors.ItemName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Quantity
                            </label>

                            <input
                                type="number"
                                value={value.Qty}
                                onChange={handleChange("Qty")}
                                className={inputCls}
                            />

                            {errors.Qty && (
                                <p className="text-red-500 text-xs">
                                    {errors.Qty}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Location
                            </label>

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
                                        LocationID: "",        // new location
                                        LocationName: inputValue
                                    }))
                                }
                                options={locationOptions}
                                placeholder="Select or create location..."
                                styles={selectStyles}
                                isClearable
                                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                            />

                            {errors.LocationID && (
                                <p className="text-red-500 text-xs">
                                    {errors.LocationID}
                                </p>
                            )}
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

export default AddStockModal;