import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifyError, toastifySuccess } from "../../Utility/Utility";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

const VehicleGPSModal = ({ open, onClose, editData, onSuccess }) => {
 
   


  const [value, setValue] = useState({
    VehicleNo: editData?.VehicleNo || "",
    IEMINo: editData?.IEMINo || "",
    AadharNo: editData?.AadharNo || "",
    ContactNo: editData?.ContactNo || "",
    Address: editData?.Address || "",
    Vendor: editData?.Vendor || "",
    Refernce: editData?.Refernce || "",
    Amount: editData?.Amount || "",
    LeaseName: editData?.LeaseName || "",
    LeaseNo: editData?.LeaseNo || "",
  });

 
  const [errors, setErrors] = useState({});

  const handleChange = (key) => (e) => {
    setValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!value.VehicleNo) newErrors.VehicleNo = "Vehicle No is required";
    if (!value.IEMINo) newErrors.IEMINo = "IEMI No is required";
    if (!value.Amount) newErrors.Amount = "Amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
const handleSubmit = async () => {
  if (!validate()) return;

  const api = editData
    ? "VehicleGPS/Update_VehicleGPS"
    : "VehicleGPS/Insert_VehicleGPS";

  const formdata = new FormData();

  const payload = {
    VehicleNo: value.VehicleNo,
    IEMINo: value.IEMINo,
    AadharNo: value.AadharNo,
    ContactNo: value.ContactNo,
    Address: value.Address,
    Vendor: value.Vendor,
    Refernce: value.Refernce,
    Amount: value.Amount,
    LeaseName: value.LeaseName,
    LeaseNo: value.LeaseNo,
  };

  
  if (editData) {
    payload.VehicleGPSID = editData.VehicleGPSID;
  }

  
  formdata.append("Data", JSON.stringify(payload));

  const res = await PostWithToken(api, formdata);
 
  if (res?.[0]?.Message === "Inserted Successfully" || res?.[0]?.Message === " Updated Successfully") {
    toastifySuccess(
      editData ? "Vehicle GPS Updated" : "Vehicle GPS Added"
    );
    onClose?.();
    onSuccess?.();
  }
  else if(res?.[0]?.Message === " Alreday Insert " || res?.[0]?.Message === " Alreday Update ") {
    toastifyError(" Vehicle No & IEMI No already exists");
};

}



  return (
    <div className="fixed inset-0 z-50">
    
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />

      
      <div className="relative mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
         
          <div className="mb-4 flex justify-between">
            <h2 className="text-lg font-semibold">
              {editData ? "Update Vehicle GPS" : "Add Vehicle GPS"}
            </h2>
            <button onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>

         
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["VehicleNo", "Vehicle No"],
              ["IEMINo", "IEMI No"],
              ["Amount", "Amount", "number"],
              ["AadharNo", "Aadhar No"],
              ["ContactNo", "Contact No"],
              ["Vendor", "Vendor"],
              ["Refernce", "Reference"],
               ["LeaseName", "Lease Name"],
              ["LeaseNo", "Lease No"],

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
                  <p className="text-xs text-red-500">{errors[key]}</p>
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

        
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {editData ? "Update" : "Save"}
            </button>
             <button
              onClick={onClose}
              className="ml-2 rounded-xl bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
             close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleGPSModal;
