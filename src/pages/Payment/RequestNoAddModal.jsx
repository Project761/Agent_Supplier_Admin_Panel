import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import { PostWithToken, Comman_changeArrayFormat } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";

const RequestNoAddModal = ({ open, onClose, editData, onSuccess }) => {
console.log(editData,"editData")
  const inputCls =
    "w-full rounded-sm border border-slate-200 px-4 py-2.5 text-sm " +
    "outline-none focus:border-[#2563eb]";

  const [value, setvalue] = useState({
    RequestNo: "",
    RegNo: "",
    LeaseNo: "",
    LeaseName: "",
    WebName: "",
    WeighbridgeNo: "",
    PartyID: null,
  });

  const [errors, setErrors] = useState({});
  const [partyOptions, setPartyOptions] = useState([]);

  
  useEffect(() => {
    if (open) {
      GetPartyDropdown();
    }
  }, [open]);

  const GetPartyDropdown = async () => {
    try {
      const res = await PostWithToken("Party/GetData_Party", { IsActive: "1" });
      if (res) {
        setPartyOptions(Comman_changeArrayFormat(res, "PartyID", "Name"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  useEffect(() => {
    if (!open) return;

    if (editData) {
      const partyOption = partyOptions.find(
        (opt) => opt.value == editData.PartyID
      );

      setvalue({
        RequestNo: editData.RequestNo || "",
        RegNo: editData.RegNo || "",
        LeaseNo: editData.LeaseNo || "",
        LeaseName: editData.LeaseName || "",
        WebName: editData.WebName || "",
        WeighbridgeNo: editData.WeighbridgeNo || "",
        PartyID: partyOption || null,
      });
    } else {
      setvalue({
        RequestNo: "",
        RegNo: "",
        LeaseNo: "",
        LeaseName: "",
        WebName: "",
        WeighbridgeNo: "",
        PartyID: null,
      });
    }
  }, [editData, open, partyOptions]);

  
  const handleChange = (key) => (e) => {
    setvalue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

 
  const Check_validate = () => {
    const newErrors = {};

    if (!value.RequestNo) newErrors.RequestNo = " Request no is Required";
   
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      Update_RequestParty();
    }
  };


  const Update_RequestParty = async () => {
    try {
      const payload = {
        RequestNo: value.RequestNo,
        RegNo: value.RegNo,
        LeaseNo: value.LeaseNo,
        LeaseName: value.LeaseName,
        // WebName: value.WebName,
        WeighbridgeNo: value.WeighbridgeNo,

        PartyID: value.PartyID?.value || "",
        ModifiedByUser: "1",
      };

      const res = await PostWithToken("Party/Update_RequestParty", payload);

      if (res) {
        toastifySuccess("Updated successfully");
        onClose();
        onSuccess();
        setErrors({}); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl bg-white rounded-xl p-6">

        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {editData ? "Update Request Number" : "Add Request Number"}
          </h2>
          <FiX onClick={onClose} className="cursor-pointer" />
        </div>

        
       <div className="grid grid-cols-2 gap-4">

  
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium">Webbridge Name</label>
    <Select
      value={value.PartyID}
      onChange={(option) =>
        setvalue((p) => ({ ...p, PartyID: option }))
      }
      options={partyOptions}
      placeholder="Select Party"
      isDisabled={true}
    />
  </div>


  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium">Request Number</label>
    <input
      className={inputCls}
      placeholder="Request No"
      value={value.RequestNo}
      onChange={handleChange("RequestNo")}
    />
    {errors.RequestNo && (
      <p className="mt-1 text-xs text-red-500">
        {errors.RequestNo}
      </p>
    )}
  </div>

  
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium">Registration Number</label>
    <input
      className={inputCls}
      placeholder="Reg No"
      value={value.RegNo}
      onChange={handleChange("RegNo")}
    />
    
  </div>


  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium">Lease Number</label>
    <input
      className={inputCls}
      placeholder="Lease No"
      value={value.LeaseNo}
      onChange={handleChange("LeaseNo")}
    />
  
  </div>

  
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium">Lease Name</label>
    <input
      className={inputCls}
      placeholder="Lease Name"
      value={value.LeaseName}
      onChange={handleChange("LeaseName")}
    />
    
  </div>


  {/* <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium">Webbridge Name</label>
    <input
      className={inputCls}
      placeholder="Webbridge Name"
      value={value.WebName}
      onChange={handleChange("WebName")}
    />
   
  </div> */}
   <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium">Webbridge Number</label>
    <input
      className={inputCls}
      placeholder="Webbridge Number"
      value={value.WeighbridgeNo}
      onChange={handleChange("WeighbridgeNo")}
    />
   
  </div>

</div>

       
        <div className="mt-5 text-right">
          <button
            onClick={Check_validate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default RequestNoAddModal;