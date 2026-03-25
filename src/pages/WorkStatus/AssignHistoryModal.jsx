import React, { useState, useEffect } from "react";
import { GetWithToken, PostWithToken } from "../../ApiMethods/ApiMethods";
import { FiX } from "react-icons/fi";
import { toastifySuccess } from "../../Utility/Utility";
import CreatableSelect from "react-select/creatable";

const AssignHistoryModal = ({
  open,
  onClose,
  rowData,
  onSuccess,
  editData,
}) => {
  const [value, setValue] = useState({
    EmployeeID: "",
    WorkStatus: "",
    WorkStatusID: "",
    Description: "",
    AssignID: "",
  });
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [errors, setErrors] = useState({});

  const GetData_Employess = async () => {
    try {
      const res = await GetWithToken("PermissionUser/GetDropDown_User");
      console.log(res, "res1");

      if (res) {
        setItems(res);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetData_Status = async () => {
    const val = {
      IsPartyStatus: 1,
    };
    try {
      const res = await PostWithToken("AssignHistory/GetDropDown_Staus", val);
      console.log(res, "res2");
      if (res) {
        setItems2(res);
      } else {
        setItems2([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    GetData_Employess();
    GetData_Status();
  }, []);
  const inputCls =
    "w-full rounded-sm border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500";
  useEffect(() => {
    if (rowData) {
      setValue({
        EmployeeID: rowData.EmployeeID,
        WorkStatus: rowData.WorkStatus,
        WorkStatusID: rowData.WorkStatusID,
        AssignID: rowData.AssignID,
        Description: "",
      });
    }
  }, [rowData]);
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 6,
      borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
      minHeight: 40,
    }),
  };

  const handleChange = (key) => (e) => {
    setValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      EmployeeID: value.EmployeeID,
      WorkStatus: value.WorkStatus,
      WorkStatusID: value.WorkStatusID,
      Description: value.Description,
      AssignID: value.AssignID,
      CreatedByUser: "1",
    };

    try {
      const res = await PostWithToken(
        "AssignHistory/Insert_AssignHistory",
        payload,
      );

      if (res) {
        toastifySuccess("Assign Work Status Updated Successfully");
        onClose();
        onSuccess?.();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleLocationChange = (e) => {
    console.log(e.target.value, "selected employee id");

    const id = e.target.value;
    console.log(items, "items");
    const location = items.find((item) => item.UserID == id);

    setValue({
      ...value,
      EmployeeID: location.UserID,
      LocationName: location.FullName,
    });
  };
  const driverOptions = items2.map((d) => ({
    value: d.WorkStatusID,
    label: d.Description,
  }));

  if (!open) return null;

  return (
    <>
      <div className=" fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className=" max-h-150 overflow-y-auto  bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Assign WorkStatus</h2>

              <button onClick={onClose}>
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Employee Name</label>

                <select
                  value={value.UserID}
                  onChange={handleLocationChange}
                  className={inputCls}
                >
                  <option value="">Select Employee</option>

                  {items.map((loc) => (
                    <option key={loc.UserID} value={loc.UserID}>
                      {loc.FullName || "NaN"}
                    </option>
                  ))}
                </select>
                {errors.EmployeeID && (
                  <p className="text-red-500 text-xs">{errors.EmployeeID}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">WorkStatus</label>

                <CreatableSelect
                  value={
                    value.WorkStatus
                      ? { label: value.WorkStatus, value: value.WorkStatusID }
                      : null
                  }
                  onChange={(opt) =>
                    setValue((prev) => ({
                      ...prev,
                      WorkStatusID: opt?.value || "",
                      WorkStatus: opt?.label || "",
                    }))
                  }
                  onCreateOption={(inputValue) =>
                    setValue((prev) => ({
                      ...prev,
                      WorkStatusID: "",
                      WorkStatus: inputValue,
                    }))
                  }
                  options={driverOptions}
                  placeholder="Select or create WorkStatus..."
                  styles={selectStyles}
                  isClearable
                  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>

                <input
                  type="text"
                  value={value.Description}
                  onChange={handleChange("Description")}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editData ? "Edit" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignHistoryModal;
