import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";

const EditPartyModal = ({ open, onClose, partyId, onSuccess }) => {
  const inputCls =
    "w-full rounded-sm border border-black text-black px-4 py-2.5 text-sm " +
    "outline-none focus:ring-1 focus:ring-black";

  const [value, setValue] = useState({
    Name: "",
    OwnerName: "",
    OwnerMobileNo: "",
    OfficeMobileNo: "",
    Address: "",
    District: "",
    GSTNo: "",
    MEOffice: "",
    ReferenceID: "",
    Area: "",
    Remark: "",
    WeighbridgeNo: "",
    WorkStatus: "",
    RequestNo: "",
    RegNo: "",
    LeaseNo: "",
    LeaseName: "",
    WebName: "",
    DMGWorkStatus: "",
    Status: "",
    IsPaid: "",
    UltraViewerID: "",
    SsoId: "",
    Password: "",
    CameraUrl: "",
    TestingLive: "",
    Software: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && partyId) {
      getData();
    }
  }, [open, partyId]);

  const getData = async () => {
    try {
      setLoading(true);

      const res = await PostWithToken("Party/GetSingleData_PartyByEmp", {
        PartyID: partyId,
      });

      if (res && res[0]) {
        setValue(res[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key) => (e) => {
    setValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const auth = JSON.parse(sessionStorage.getItem("UserData"));

      const payload = {
        ...value,
        ModifiedByUser: auth?.UserID || "1",
      };

      const res = await PostWithToken("Party/Update_PartyByEmp", payload);

      if (res) {
        toastifySuccess("Updated Successfully");
        onClose();
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white w-full max-w-5xl rounded-xl p-6 max-h-[90vh] overflow-auto">
          <div className="flex justify-between mb-4">
           <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Edit Party Details</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
              title="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label> Web Name</label>
                <input
                  className={`${inputCls} disabled:bg-gray-200 disabled:text-black`}
                  value={value.Name || ""}
                  onChange={handleChange("Name")}
                  disabled
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label>Owner Name</label>
                <input
                  className={inputCls}
                  value={value.OwnerName || ""}
                  onChange={handleChange("OwnerName")}
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label>Owner Mobile</label>
                <input
                  className={inputCls}
                  value={value.OwnerMobileNo || ""}
                  onChange={handleChange("OwnerMobileNo")}
                  placeholder="Enter owner mobile"
                />
              </div>

              <div>
                <label>Office Mobile</label>
                <input
                  className={inputCls}
                  value={value.OfficeMobileNo || ""}
                  onChange={handleChange("OfficeMobileNo")}
                  placeholder="Enter office mobile"
                />
              </div>

              <div>
                <label>GST No</label>
                <input
                  className={inputCls}
                  value={value.GSTNo || ""}
                  onChange={handleChange("GSTNo")}
                  placeholder="Enter GST number"
                />
              </div>

              <div>
                <label>Area</label>
                <input
                  className={inputCls}
                  value={value.Area || ""}
                  onChange={handleChange("Area")}
                  placeholder="Enter area"
                />
              </div>

              <div>
                <label>District</label>
                <input
                  className={inputCls}
                  value={value.District || ""}
                  onChange={handleChange("District")}
                  placeholder="Enter district"
                />
              </div>

              <div>
                <label>Address</label>
                <input
                  className={inputCls}
                  value={value.Address || ""}
                  onChange={handleChange("Address")}
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label>ME Office</label>
                <input
                  className={inputCls}
                  value={value.MEOffice || ""}
                  onChange={handleChange("MEOffice")}
                  placeholder="Enter ME office"
                />
              </div>

              <div>
                <label>Reference ID</label>
                <input
                  className={inputCls}
                  value={value.ReferenceID || ""}
                  onChange={handleChange("ReferenceID")}
                  placeholder="Enter reference ID"
                />
              </div>

              <div>
                <label>Weighbridge No</label>
                <input
                  className={inputCls}
                  value={value.WeighbridgeNo || ""}
                  onChange={handleChange("WeighbridgeNo")}
                  placeholder="Enter weighbridge number"
                />
              </div>

              <div>
                <label>Work Status</label>
                <input
                  className={inputCls}
                  value={value.WorkStatus || ""}
                  onChange={handleChange("WorkStatus")}
                  placeholder="Enter work status"
                />
              </div>

              <div>
                <label>Request No</label>
                <input
                  className={inputCls}
                  value={value.RequestNo || ""}
                  onChange={handleChange("RequestNo")}
                  placeholder="Enter request number"
                />
              </div>

              <div>
                <label>Reg No</label>
                <input
                  className={inputCls}
                  value={value.RegNo || ""}
                  onChange={handleChange("RegNo")}
                  placeholder="Enter registration number"
                />
              </div>

              <div>
                <label>Lease No</label>
                <input
                  className={inputCls}
                  value={value.LeaseNo || ""}
                  onChange={handleChange("LeaseNo")}
                  placeholder="Enter lease number"
                />
              </div>

              <div>
                <label>Lease Name</label>
                <input
                  className={inputCls}
                  value={value.LeaseName || ""}
                  onChange={handleChange("LeaseName")}
                  placeholder="Enter lease name"
                />
              </div>


              <div>
                <label>DMG Status</label>
                <input
                  className={inputCls}
                  value={value.DMGWorkStatus || ""}
                  onChange={handleChange("DMGWorkStatus")}
                  placeholder="Enter DMG status"
                />
              </div>

              <div>
                <label>Status</label>
                <input
                  className={inputCls}
                  value={value.Status || ""}
                  onChange={handleChange("Status")}
                  placeholder="Enter status"
                />
              </div>

              <div>
                <label>UltraViewer ID</label>
                <input
                  className={inputCls}
                  value={value.UltraViewerID || ""}
                  onChange={handleChange("UltraViewerID")}
                  placeholder="Enter UltraViewer ID"
                />
              </div>

              <div>
                <label>SSO ID</label>
                <input
                  className={inputCls}
                  value={value.SsoId || ""}
                  onChange={handleChange("SsoId")}
                  placeholder="Enter SSO ID"
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  className={inputCls}
                  value={value.Password || ""}
                  onChange={handleChange("Password")}
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label>Camera URL</label>
                <input
                  className={inputCls}
                  value={value.CameraUrl || ""}
                  onChange={handleChange("CameraUrl")}
                  placeholder="Enter camera URL"
                />
              </div>

              <div>
                <label>Software</label>
                <input
                  className={inputCls}
                  value={value.Software || ""}
                  onChange={handleChange("Software")}
                  placeholder="Enter software name"
                />
              </div>

              <div>
                <label>Is Paid</label>
                <select
                  className={inputCls}
                  value={value.IsPaid || ""}
                  onChange={handleChange("IsPaid")}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label>Testing Live</label>
                <select
                  className={inputCls}
                  value={value.TestingLive || ""}
                  onChange={handleChange("TestingLive")}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-span-1 sm:col-span-3">
                <label>Remark</label>
                <textarea
                  className={inputCls}
                  value={value.Remark || ""}
                  onChange={handleChange("Remark")}
                  placeholder="Enter remark"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-red-600 px-4 py-2 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 px-4 py-2 text-white rounded"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPartyModal;
