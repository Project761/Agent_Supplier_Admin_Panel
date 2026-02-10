import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";  

const AdminUserModel = ({ open, onClose, editData, onSuccess }) => {

  const inputCls =
    "w-full rounded-sm border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb]";

  const [value, setValue] = useState({
    UserNames: "",
    Passwords: "",
    MobileNo: "",
    EmailID: "",
    Address: "",
    FullName: "",
    CompanyID: "",
    CompanyName: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key) => (e) => {
    let v = e.target.value;

    if (key === "MobileNo") {
      v = v.replace(/\D/g, "").slice(0, 10);
    }

    setValue((p) => ({ ...p, [key]: v }));
  };

  const validate = () => {
    const e = {};
    if (!value.UserNames) e.UserNames = "UserNames is required";
    if (!value.Passwords && !editData) e.Passwords = "Passwords is required";
    if (!value.MobileNo || value.MobileNo.length < 10) e.MobileNo = "Valid MobileNo required";
    if (!value.FullName) e.FullName = "FullName is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    if (editData) {
      setValue({
        UserNames: editData.UserName ?? "",
        Passwords: editData.Password ?? "",
        MobileNo: editData.MobileNo ?? "",
        EmailID: editData.EmailID ?? "",
        Address: editData.Address ?? "",
        FullName: editData.FullName ?? "",
        CompanyID: editData.CompanyID ?? "",
        CompanyName: editData.CompanyName ?? "",
      });
    }
  }, [editData]);


useEffect(() => {
  if (!editData && open) {
    setValue({
      UserNames: "",
      Passwords: "",
      MobileNo: "",
      EmailID: "",
      Address: "",
      FullName: "",
      CompanyID: "",
      CompanyName: "",
    });
    setErrors({});
  }
}, [editData, open]);


 const handleSubmit = async () => {
  if (!validate()) return;

  const api = editData
    ? "User/Update_User"
    : "User/Insert_User";

  const payload = {
    UserName: value.UserNames,
    Password: value.Passwords,
    MobileNo: value.MobileNo,
    EmailID: value.EmailID,
    Address: value.Address,
    FullName: value.FullName,
    CompanyID: value.CompanyID,
    CompanyName: value.CompanyName,
  };

  if (editData) {
    payload.UserID = editData.UserID;
  }

  const res = await PostWithToken(api, payload);

  if (res) {
    toastifySuccess(editData ? "Admin User Updated" : "Admin User Added");
    onClose?.();
    onSuccess?.();
  }
};



   console.log("Insert editData:", editData);
console.log("Form value:", value);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editData ? "Update Admin User" : "Add Admin User"}
            </h2>
            <button onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["UserNames", "User Name"],
              ["Passwords", "Passwords", "Passwords"],
              ["FullName", "Full Name"],
              ["MobileNo", "Mobile No"],
              ["EmailID", "Email ID", "email"],
              ["CompanyID", "Company ID"],
              ["CompanyName", "Company Name"],
            ].map(([key, label, type = "text"]) => (
              <div key={key}>
                <label className="text-sm font-medium">{label}</label>
                <input
                  type={type}
                  value={value[key]}
                  onChange={handleChange(key)}
                  className={inputCls}
                />
                {errors[key] && (
                  <p className="text-red-500 text-xs">{errors[key]}</p>
                )}
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <textarea
                value={value.Address}
                onChange={handleChange("Address")}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {editData ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserModel;
