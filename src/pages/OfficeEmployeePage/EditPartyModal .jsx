import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";

const EditPartyModal = ({ open, onClose, partyId, onSuccess }) => {
  const inputCls =
    "w-full rounded-sm border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500";

  const labelCls = "block mb-[4px] text-[13px] font-medium text-slate-600";

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
    CameraUrl2: "",
    TestingLive: "",
    IsSoftware: "",
    RawanaNo: "",
    Software: "",
  });

  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [remarksList, setRemarksList] = useState([]);
  const [newRemark, setNewRemark] = useState("");
  const [selectdate, setSelectDate] = useState("");

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
        setRemarksList(parseRemarks(res[0].Remark));

        setSelectDate(res[0].Software || "");
        setShowDate(res[0].IsSoftware === true || res[0].IsSoftware === "true");
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

      const username = auth?.FullName || "User";
      const date = new Date().toLocaleString("en-GB");

      let updatedRemarks = [...remarksList];

      if (newRemark.trim()) {
        updatedRemarks.push({
          text: newRemark,
          username,
          date,
        });
      }

      const finalRemark = buildRemarks(updatedRemarks);

      const payload = {
        ...value,
        Remark: finalRemark,
        ModifiedByUser: auth?.UserID || "1",
        IsSoftware: showDate,
        Software: selectdate,
      };

      const res = await PostWithToken("Party/Update_PartyByEmp", payload);

      if (res) {
         setNewRemark("");
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

  const parseRemarks = (remarkStr) => {
    if (!remarkStr) return [];

    return remarkStr.split("\n").map((line) => {
      const match = line.match(/^\s*\[(.*?)\s*\|\s*(.*?)\]\s*:\s*(.*)$/);
      if (match) {
        return {
          date: match[1] || "",
          username: match[2] || "User",
          text: match[3] || "",
        };
      }

      return {
        date: "",
        username: "User",
        text: line.replace(/^\d+\s*/, "").trim(),
      };
    });
  };

  const buildRemarks = (remarksArr) => {
    return remarksArr
      .map((r) => `[${r.date} | ${r.username}]: ${r.text}`)
      .join("\n");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white w-full max-w-5xl rounded-xl p-6 pt-2 max-h-[90vh] overflow-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
              Edit Party Details
            </h2>
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
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <label className={labelCls}> Web Name</label>
                <input
                  className={`${inputCls} disabled:bg-gray-200 disabled:text-black`}
                  value={value.Name || ""}
                  onChange={handleChange("Name")}
                  disabled
                  placeholder="Enter name"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Owner Name</label>
                <input
                  className={inputCls}
                  value={value.OwnerName || ""}
                  onChange={handleChange("OwnerName")}
                  placeholder="Enter owner name"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Owner Mobile</label>
                <input
                  className={inputCls}
                  value={value.OwnerMobileNo || ""}
                  onChange={handleChange("OwnerMobileNo")}
                  placeholder="Enter owner mobile"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Office Mobile</label>
                <input
                  className={inputCls}
                  value={value.OfficeMobileNo || ""}
                  onChange={handleChange("OfficeMobileNo")}
                  placeholder="Enter office mobile"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Area</label>
                <input
                  className={inputCls}
                  value={value.Area || ""}
                  onChange={handleChange("Area")}
                  placeholder="Enter area"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>ME Office</label>
                <input
                  className={inputCls}
                  value={value.MEOffice || ""}
                  onChange={handleChange("MEOffice")}
                  placeholder="Enter ME office"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>DMG Status</label>
                <input
                  className={inputCls}
                  value={value.DMGWorkStatus || ""}
                  onChange={handleChange("DMGWorkStatus")}
                  placeholder="Enter DMG status"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Work Status</label>
                <input
                  className={inputCls}
                  value={value.WorkStatus || ""}
                  onChange={handleChange("WorkStatus")}
                  placeholder="Enter work status"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Reg No</label>
                <input
                  className={inputCls}
                  value={value.RegNo || ""}
                  onChange={handleChange("RegNo")}
                  placeholder="Enter registration number"
                />
              </div>
              <div className="col-span-4">
                <label className={labelCls}>Request No</label>
                <input
                  className={inputCls}
                  value={value.RequestNo || ""}
                  onChange={handleChange("RequestNo")}
                  placeholder="Enter request number"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Ravana No.</label>
                <input
                  className={inputCls}
                  value={value.RawanaNo || ""}
                  onChange={handleChange("RawanaNo")}
                  placeholder="Enter ravana number"
                />
              </div>
              <div className="col-span-4">
                <label className={labelCls}>Weighbridge No</label>
                <input
                  className={inputCls}
                  value={value.WeighbridgeNo || ""}
                  onChange={handleChange("WeighbridgeNo")}
                  placeholder="Enter weighbridge number"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Status</label>
                <input
                  className={inputCls}
                  value={value.Status || ""}
                  onChange={handleChange("Status")}
                  placeholder="Enter status"
                />
              </div>

              <div className="col-span-4">
                <label className={labelCls}>UltraViewer ID</label>
                <input
                  className={inputCls}
                  value={value.UltraViewerID || ""}
                  onChange={handleChange("UltraViewerID")}
                  placeholder="Enter UltraViewer ID"
                />
              </div>

              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="IsSoftware"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                  />
                  <label className={labelCls} htmlFor="IsSoftware">
                    Is Software
                  </label>
                </div>

                {showDate && (
                  <div className="">
                    <input
                      type="date"
                      className={inputCls}
                      value={selectdate || ""}
                      onChange={(e) => setSelectDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="col-span-4">
                <label className={labelCls}>Is Paid</label>
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

              <div className="col-span-4">
                <label className={labelCls}>Testing Live</label>
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

              <div className="col-span-12">
                <label className={labelCls}>Camera URL Front</label>
                <input
                  className={inputCls}
                  value={value.CameraUrl || ""}
                  onChange={handleChange("CameraUrl")}
                  placeholder="Enter camera URL"
                />
              </div>

              <div className="col-span-12">
                <label className={labelCls}>Camera URL Back</label>
                <input
                  className={inputCls}
                  value={value.CameraUrl2 || ""}
                  onChange={handleChange("CameraUrl2")}
                  placeholder="Enter camera URL"
                />
              </div>

              <div className="col-span-6">
                <label className={labelCls}>SSO ID</label>
                <input
                  className={inputCls}
                  value={value.SsoId || ""}
                  onChange={handleChange("SsoId")}
                  placeholder="Enter SSO ID"
                />
              </div>

              <div className="col-span-6">
                <label className={labelCls}>Password</label>
                <input
                  type="password"
                  className={inputCls}
                  value={value.Password || ""}
                  onChange={handleChange("Password")}
                  placeholder="Enter password"
                />
              </div>

              <div className="col-span-6">
                <label className={labelCls}>Lease Name</label>
                <input
                  className={inputCls}
                  value={value.LeaseName || ""}
                  onChange={handleChange("LeaseName")}
                  placeholder="Enter lease name"
                />
              </div>

              <div className="col-span-6">
                <label className={labelCls}>Lease No</label>
                <input
                  className={inputCls}
                  value={value.LeaseNo || ""}
                  onChange={handleChange("LeaseNo")}
                  placeholder="Enter lease number"
                />
              </div>

              <div className="col-span-12">
                <label className={labelCls}>Remark History</label>

                <div className="border rounded p-3 max-h-60 overflow-auto bg-gray-50 space-y-2">
                  {remarksList.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 border-b pb-2 last:border-none"
                    >
                      <textarea
                        className="flex-1 bg-transparent outline-none text-sm resize-none border rounded p-2"
                        value={item.text}
                        rows={2}
                        onChange={(e) => {
                          const updated = [...remarksList];
                          updated[index].text = e.target.value;
                          setRemarksList(updated);
                        }}
                      />

                      <div className="text-xs text-gray-500 whitespace-nowrap pt-2">
                        [{item.date} | {item.username}]
                      </div>
                    </div>
                  ))}
                </div>

                <textarea
                  className={`${inputCls} mt-2`}
                  value={newRemark}
                  rows={3}
                  onChange={(e) => setNewRemark(e.target.value)}
                  placeholder="Add new remark"
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
