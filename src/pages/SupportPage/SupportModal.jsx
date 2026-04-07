import React, { useEffect, useState } from "react";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toast } from "react-toastify";
import { toastifySuccess,toastifyError } from "../../Utility/Utility";

const SupportModal = ({ open, onClose, editData, refresh }) => {
  const [form, setForm] = useState({
    Heder: "",
    Description: "",
    SupportID: null,
  });

  useEffect(() => {
    if (editData) {
      setForm({
        Heder: editData.Heder,
        Description: editData.Description,
        SupportID: editData.SupportID,
      });
    } else {
      setForm({
        Heder: "",
        Description: "",
        SupportID: null,
      });
    }
  }, [editData]);

  const handleSubmit = async () => {
    try {
      if (!form.Heder || !form.Description) {
         toastifyError("All fields required");
        return;
      }

      if (form.SupportID) {
        await PostWithToken("Support/Update_Support", form);
       toastifySuccess("Support updated successfully");
      } else {
        await PostWithToken("Support/Insert_Support", form);
        toastifySuccess("Support added successfully");
      }

      refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  

  if (!open) return null;

  return (
   <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
  <div className="bg-white w-full max-w-[450px] rounded-xl p-8 shadow-2xl relative">
    
    
    <button
      onClick={onClose}
      className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <span className="text-2xl">✕</span>
    </button>

    
    <h2 className="text-2xl font-bold text-gray-800 mb-8">
      {form.SupportID ? "Edit Support" : "Add Support"}
    </h2>

  
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-[15px] font-medium text-gray-700 mb-2">Header</label>
        <input
          value={form.Heder}
          onChange={(e) => setForm({ ...form, Heder: e.target.value })}
          className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50"
          placeholder="Enter header"
        />
      </div>

      <div>
        <label className="block text-[15px] font-medium text-gray-700 mb-2">Description</label>
        <input
          value={form.Description}
          onChange={(e) => setForm({ ...form, Description: e.target.value })}
          className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50"
          placeholder="Enter description"
        />
      </div>

 
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="bg-[#1d4ed8] hover:bg-blue-700 text-white font-semibold py-2.5 px-10 rounded-lg transition-all shadow-md active:scale-95"
        >
          {form.SupportID ? "Update" : "Save"}
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default SupportModal;