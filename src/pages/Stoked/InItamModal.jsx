import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";

const InItamModal = ({ open, onClose, editData, onSuccess }) => {

    const inputCls =
        "w-full rounded-sm border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500";

    const [value, setValue] = useState({
        ItemName: "",
        Price: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (key) => (e) => {
        setValue((prev) => ({
            ...prev,
            [key]: e.target.value
        }));
    };

    const validate = () => {
        const e = {};
        if (!value.ItemName) e.ItemName = "Item Name required";
        if (!value.Price) e.Price = "Price required";

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

        const api = editData
            ? "MasterItems/Update_MasterItems"
            : "MasterItems/Insert_MasterItems";

        const payload = {
            ItemName: value.ItemName,
            Price: value.Price
        };

        if (editData) {
            payload.ItemId = editData.ItemID;
            payload.ModifiedByUser = 1;
        } else {
            payload.CreatedByUser = 1;
        }

        const res = await PostWithToken(api, payload);

        if (res) {
            toastifySuccess(editData ? "Item Updated Successfully" : "Item Added Successfully");
            onClose?.();
            onSuccess?.();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">

            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <div className="relative flex items-center justify-center min-h-screen p-4">

                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

                    <div className="flex justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {editData ? "Update Item" : "Add Item"}
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
                                Price
                            </label>

                            <input
                                type="number"
                                value={value.Price}
                                onChange={handleChange("Price")}
                                className={inputCls}
                            />

                            {errors.Price && (
                                <p className="text-red-500 text-xs">
                                    {errors.Price}
                                </p>
                            )}
                        </div>

                    </div>

                    <div className="flex justify-end mt-6">

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {editData ? "Update" : "Save"}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default InItamModal;