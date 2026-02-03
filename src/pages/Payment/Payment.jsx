import React, { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { FiEye, FiX } from "react-icons/fi";
import { FiPlus, FiMinus } from "react-icons/fi";
import PaymentModal from "./PaymentModal";
import ExpensesModal from "./ExpensesModal";
import { Comman_changeArrayFormat, GetWithToken, PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifyError, toastifySuccess } from "../../Utility/Utility";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { IoMdPrint } from "react-icons/io";
import Select from "react-select";

import { useReactToPrint } from "react-to-print";
import PaymentReceiptPrint from "./PaymentReceiptPrint";
import { useNavigate } from "react-router-dom";
import WorkStatusModal from "./WorkStatusModal";
import { MdConstruction } from "react-icons/md";
import PartySettingModal from "../Party/PartySettingModal";
import { IoSettingsOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";



const Payment = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [viewData, setViewData] = useState([]);
  // console.log(viewData[0]?.PartyID,'sadf')
  const [viewData2, setViewData2] = useState(null);
  // console.log(viewData2, 'viewdata')
  const [amtdeteil, setAmtdetil] = useState(null);
  const [amtdeteil2, setAmtdetil2] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewOpen2, setViewOpen2] = useState(false);
  const [OTPStatus, setOTPStatus] = useState(false);
  const [items, setItems] = useState([]);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterPartyName, setFilterPartyName] = useState("");
  const [filterDue, setFilterDue] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [workstatusopen, setWorkstatusopen] = useState(false);
  const [WorkStatusfilter, setWorkStatusfilter] = useState(null);
  const printRef = useRef(null);
  const [printData, setPrintData] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedPartyID, setSelectedPartyID] = useState(null);
  const [PartyID, setPartyID] = useState(null);


  const [showModal, setShowModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [permissionData, setPermissionData] = useState([]);



  const navigate = useNavigate();


  const otpInputRefs = useRef([]);

  useEffect(() => {
    GetData_Payment();
    GetPartyDropdown();
  }, []);
  // console.log(viewData, 'viewData')
  const GetPartyDropdown = async () => {
    try {
      const res = await PostWithToken("Party/GetData_Party", { IsActive: "1" });
      if (res) {
        const options = res.map((party) => ({
          value: party.PartyID,
          label: party.Name || `Party ${party.PartyID}`,
        }));
        setPartyOptions(options);
      }
    } catch (error) {
      console.error("GetPartyDropdown error:", error);
    }
  };

  const GetData_Payment = async () => {
    const val = {
      FromDtTm: filterFromDate || "",
      ToDtTm: filterToDate || "",
      PartyName: filterPartyName || "",
      Due: filterDue?.value === "No" ? "0" : "1" || "",
      WorkStatus: WorkStatusfilter?.value || "",
      OwnerName: filterPartyName || "",
    };
    try {
      const res = await PostWithToken("Payment/GetData_Payment", val);
      if (res) {
        // console.log(res, 'res')
        setItems(res);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetData_Payment();
  }, [filterFromDate, filterToDate, filterPartyName, filterDue, WorkStatusfilter]);

  const GetSingleData_PartyPayment = async (PartyID) => {
    try {
      const val = { PartyID: PartyID };
      const res = await PostWithToken("Payment/GetSingalData_PartyPayment", val);
      if (res) {
        setViewData(res);
        setViewOpen(true);
      } else {
        toastifySuccess("No payment data found for this party");
      }
    } catch (error) {
      console.error("GetSingleData_PartyPayment error:", error);
    }
  };


  const GetSingleData_PartyPayment2 = async (PartyID) => {
    try {
      const val = { PartyID: PartyID };
      const res = await PostWithToken("ExpensePayment/GetSingalData_PartyExpensePayment", val);
      // console.log("GetSingleData_PartyPayment2 res:", res);
      if (res) {
        setViewData2(res);
        setViewOpen2(true);
      } else {
        toastifySuccess("No payment data found for this party");
      }
    } catch (error) {
      console.error("GetSingleData_PartyPayment error:", error);
    }
  };

  const GetSingleData_PermissionUser = async (PermissionUserID) => {
    try {
      const val = { PermissionUserID: PermissionUserID };
      const res = await PostWithToken("PermissionUser/GetSingleData_PermissionUser", val);

    } catch (error) {
      console.error("GetSingleData_PartyPayment error:", error);
    }
  };

  useEffect(() => {
    PermissionUser_GetDropDown_User();
  }, [])


  const PermissionUser_GetDropDown_User = async () => {
    try {
      const res = await GetWithToken("PermissionUser/GetDropDown_User");
      if (res) {
        setUserList(res || []);
      } else {
        setUserList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showModal) {
      GetData_PermissionUser();
    }
  }, [showModal]);

  const GetData_PermissionUser = async () => {
    try {
      const val = { PartyID };
      const res = await PostWithToken(
        "PermissionUser/GetData_PermissionUser",
        val
      );

      if (res && res.length > 0) {
        setPermissionData(res);

        const preSelected = res.map(item => ({
          value: item.UserID,
          label: item.UserFullName,
          permissionUserID: item.PermissionUserID,
        }));

        setSelectedUser(preSelected);
      } else {
        setSelectedUser([]);
        setPermissionData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const userOptions = userList?.map(user => ({
    value: user.UserID,
    label: user.FullName,
  }));



  const Insert_PermissionUser = async (UserID) => {
    try {
      const val = {
        PartyID: PartyID,
        UserID: UserID
      }; 

      const res = await PostWithToken("PermissionUser/Insert_PermissionUser", val);
      if (res) {
        toastifySuccess("User assigned successfully");
        // setShowModal(false);
      }


    } catch (error) {
      console.error("Insert_PermissionUser error:", error);
    }
  };

  const Delete_PermissionUser = async (permissionUserID) => {
    try {
      const val = {
        PermissionUserID: permissionUserID,
      };

      const res = await PostWithToken(
        "PermissionUser/Delete_PermissionUser",
        val
      );

      if (res) {
        toastifySuccess("Successfully deleted");
      }
    } catch (error) {
      console.error("Delete_PermissionUser error:", error);
    }
  };



  useEffect(() => {
    if (showModal) {
      PermissionUser_GetDropDown_User();
    }
  }, [showModal]);

  const GetDataSingale_PaymentParty = async (item) => {
    const res = await PostWithToken(
      "Payment/GetDataSingale_PaymentParty",
      {
        PaymentID: item.PaymentID,
        PartyID: item.PartyID,
      }
    );

    if (res && res.length > 0) {
      setPrintData(res[0]);
      console.log(res[0], 'res[0]')

      // setTimeout(() => {
      //   handlePrint();
      // }, 300);
    }
  };


  // useEffect(() => {
  //   if (printData && printRef.current) {
  //     handlePrint();
  //   }
  // }, [printData]);


  const onViewItem = (row) => {

    const partyID = row.PartyID;
    if (partyID) {
      GetSingleData_PartyPayment(partyID);
    } else {
      toastifySuccess("Party ID not found");
    }
  };


  const onViewItem2 = (row) => {
    const partyID = row.PartyID;
    if (partyID) {
      GetSingleData_PartyPayment2(partyID);
    } else {
      toastifySuccess("Party ID not found");
    }
  };

  const onAddPayment = (row) => {
    // console.log("Add Payment for row:", row);

    const today = new Date().toISOString().split("T")[0];
    setEditRow({
      PartyID: row.PartyID || "",
      ReamaningAmt: row.RemainingAmt || "",
      expensesamount: row.TotalExpensePayment || 0,
      Paymenttype: "",
      Amt: "",
      ByPayment: "",
      PaymentDtTm: today,
    });
    setEditItemId(null);
    setOpen(true);
  };

  const onExpeses = (row) => {
    // console.log("Add Expenses for row:", row);

    const today = new Date().toISOString().split("T")[0];
    setEditRow({
      PartyID: row.PartyID || "",
      ReamaningAmt: row.RemainingAmt || "",
      expensesamount: row.TotalExpensePayment || 0,
      Paymenttype: "",
      Amt: "",
      ByPayment: "",
      PaymentDtTm: today,
    });
    setEditItemId(null);
    setOpen2(true);
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) => {
      const hay = `${r.Name || ""} ${r.OwnerName || ""} ${r.Area || ""}  ${r.ByPayment || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  // console.log(filteredItems, 'filteredItems')

  const dueOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#cbd5e1",
      minHeight: "42px",
      "&:hover": { borderColor: "#2563eb" },
    }),
  };

  const columns = useMemo(
    () => [
      {
        name: <span className="font-semibold">Party Name</span>,
        selector: (row) => row.Name || "-",
        sortable: true,
        cell: (row) => <div className="font-medium text-slate-800">{row.Name || "-"}</div>,
      },
      {
        name: <span className="font-semibold">Amount</span>,
        selector: (row) => row.FinalAmt || "-",
        sortable: true,
        cell: (row) => (
          <div className="font-medium text-slate-800">
            ₹{row.FinalAmt}
          </div>
        ),

      },
      {
        name: <span className="font-semibold">Remaining Amount</span>,
        selector: (row) => row.RemainingAmt || "-",
        sortable: true,
        cell: (row) => (
          <div className="font-medium text-slate-800">
            ₹{row.RemainingAmt}
          </div>
        ),

      },
      {
        name: <span className="font-semibold">TotalPaid Amount</span>,
        selector: (row) => row.TotalPaid || "-",
        sortable: true,
        cell: (row) => (
          <div className="font-medium text-slate-800">
            ₹{row.TotalPaid}
          </div>
        ),

      },
      {
        name: <span className="font-semibold">Total Expense Payment</span>,
        selector: (row) => row.TotalExpensePayment || "-",
        sortable: true,
        cell: (row) => (
          <div className="font-medium text-slate-800">
            ₹{row.TotalExpensePayment}
          </div>
        ),

      },

      {
        name: <span className="font-semibold">Work Status</span>,
        selector: (row) => row.WorkStatus || "-",
        sortable: true,
        cell: (row) => (
          <div className="font-medium text-slate-800">
            {row.WorkStatus}
          </div>
        ),

      },
      {
        name: <span className="font-semibold">Owner Name</span>,
        selector: (row) => row.OwnerName || "-",
        sortable: true,
        cell: (row) => <div className="font-medium text-slate-800">{row.OwnerName || "-"}</div>,
      },
      {
        name: <span className="font-semibold">Area</span>,
        selector: (row) => row.Area || "-",
        sortable: true,
        cell: (row) => <div className="font-medium text-slate-800">{row.Area || "-"}</div>,
      },
      {
        name: <span className="font-semibold">ME Office</span>,
        selector: (row) => row.MEOffice || "-",
        sortable: true,
      },

      {
        name: "Actions",
        cell: (r) => (
          <div className="flex gap-2">

            <button
              className="rounded-md bg-yellow-600 p-2 text-white hover:bg-yellow-700"
              type="button"
              title="Add Work Status"
              onClick={() => { setShowModal(true); setPartyID(r.PartyID); }}
            >
              <FaEdit className="text-base" />
            </button>


            <button
              className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
              onClick={() => {
                // console.log("Settings clicked for PartyID:", r);
                setSelectedPartyID(r.PartyID);
                setSettingsOpen(true);
              }}
              type="button"
              title="Add Work Status"
            >
              <IoSettingsOutline className="text-base" />
            </button>


            <button
              className="rounded-md bg-yellow-600 p-2 text-white hover:bg-yellow-700"
              onClick={() => onWorkStatus(r)}
              type="button"
              title="Add Work Status"
            >
              <MdConstruction className="text-base" />
            </button>

            <button
              className="rounded-md bg-green-600 p-2 text-white hover:bg-green-700"
              onClick={() => onAddPayment(r)}
              type="button"
              title="Add Payment"
            >
              <FiPlus className="text-base" />
            </button>

            <button
              className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
              onClick={() => { onViewItem(r); setAmtdetil(r); }}
              type="button"
              title="View"
            >
              <FiEye className="text-base" />
            </button>

            <button
              className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
              onClick={() => onExpeses(r)}
              type="button"
              title="Add Expenses"
            >
              <FiMinus className="text-base" />
            </button>


            <button
              className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
              onClick={() => { onViewItem2(r); setAmtdetil2(r); }}
              type="button"
              title="View"
            >
              <FiEye className="text-base" />
            </button>

          </div>
        ), minWidth: "220px",
        grow: 2,
      },
    ],
    [editItemId]
  );

  const tableStyles = {
    headRow: { style: { backgroundColor: "#2563eb", minHeight: "34px" } },
    headCells: {
      style: {
        backgroundColor: "#2563eb",
        color: "#fff",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        borderBottom: "0",
      },
    },
    rows: { style: { minHeight: "52px" } },
    cells: { style: { padding: "1rem 0.75rem" } },
  };


  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.totalAmount += Number(item.FinalAmt || 0);
        acc.totalRemaining += Number(item.RemainingAmt || 0);
        acc.totalPaid += Number(item.TotalPaid || 0);
        acc.TotalExpensePayment += Number(item.TotalExpensePayment || 0);
        return acc;
      },
      { totalAmount: 0, totalRemaining: 0, totalPaid: 0, TotalExpensePayment: 0 }
    );
  }, [items]);

  const netBalance = totals.totalPaid - totals.TotalExpensePayment;

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "Payment_Report.xlsx");
  };


  const onWorkStatus = (row) => {

    const today = new Date().toISOString().split("T")[0];
    setEditRow({
      PartyID: row.PartyID || "",
      ReamaningAmt: row.RemainingAmt || "",
      expensesamount: row.TotalExpensePayment || 0,
      Paymenttype: "",
      Amt: "",
      ByPayment: "",
      PaymentDtTm: today,
    });
    setEditItemId(null);
    setWorkstatusopen(true);
  };


  const paymentTypeOptions = [
    { value: "Civil-Inprogress", label: "Civil-Inprogress" },
    { value: "Civil-Done", label: "Civil-Done" },
    { value: "Hardware-Inprogress", label: "Hardware-Inprogress" },
    { value: "Hardware-Done", label: "Hardware-Done" },
    { value: "Testing-InProgress", label: "Testing-InProgress" },
    { value: "Close", label: "Close" },
  ];

  const workstatusStyles = {
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

  const SingleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(viewData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "Payment_Report.xlsx");
  };

  const SingleExportToExcel2 = () => {
    const worksheet = XLSX.utils.json_to_sheet(viewData2);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "Expenses_Report.xlsx");
  };



  const DeletePaymentById = async (paymentId) => {
    const res = await PostWithToken("ExpensePayment/Delete_ExpensePayment", {
      ExpensePaymentID: paymentId,
    });

    if (res) {
      // toastifySuccess("Expense Payment deleted successfully");
      // GetSingleData_PartyPayment2()
      // setOpen2(false);
      setViewOpen2(false);
    }
  };


  const DeletePaymentById2 = async (paymentId) => {
    const res = await PostWithToken("Payment/Delete_Payment", {
      PaymentID: paymentId,
    });
    if (res) {
      // GetSingleData_PartyPayment()
      setViewOpen(false);
    }
  };

  const SendOTP = async () => {
    try {
      const payload = {
        MobileNo: "7990586879"
      };
      const res = await PostWithToken("SMS/SendMessage", payload);
      if (res) {
        toastifySuccess("OTP sent successfully");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toastifyError("Failed to send OTP");
    }
  };


  const VerifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toastifyError("Please enter 4-digit OTP");
      return;
    }

    try {
      const payload = {
        MobileNo: "7990586879",
        OTP: otpString,
      };

      const res = await PostWithToken("SMS/Check_Otp", payload);
      if (res && res[0]?.Message === "OTP verified successfully") {
        if (deleteTarget?.ExpensePaymentID) {
          await DeletePaymentById(deleteTarget.ExpensePaymentID);
        }
        if (deleteTarget?.PaymentID) {
          await DeletePaymentById2(deleteTarget.PaymentID);
        }
        toastifySuccess("OTP verified & record deleted");
        setOTPStatus(false);
        setDeleteTarget(null);
        setOtp(["", "", "", ""]);
      } else if (res && res[0]?.Message == "Invalid OTP") {
        toastifyError("Invalid OTP. Please try again.");
        otpInputRefs.current[0]?.focus();
        setOtp(["", "", "", ""]);
      }
    } catch (error) {
      console.error("OTP verify error:", error);
      toastifyError("OTP verification failed");
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, "");
    setOtp(newOtp);

    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const otpString = otp.join("");
      if (otpString.length === 4) {
        VerifyOTP();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    if (pastedData.length === 4) {
      otpInputRefs.current[3]?.focus();
    }
  };




  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  // });

  // const handlePrint = () => {
  //   window.print();
  // };


  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  // });
  // console.log("PRINT REF:", printRef.current);


  const PrintFun = (item) => {
    navigate(`/dashboard/PaymentReceiptPrint?PartyID=${item.PartyID ? item.PartyID : item}&PaymentID=${item.PaymentID ? item.PaymentID : "0"}`);
  };


  return (

    <>

      <div className="flex-1 space-y-3 overflow-y-auto px-2 py-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="">


            <div className="mb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                <input
                  // value={filterPartyName}
                  // onChange={(e) => setFilterPartyName(e.target.value)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Payment..."
                  className="w-full h-[32px] rounded-md border border-slate-300 px-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoComplete="off-district"

                />

                <input
                  type="date"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                  placeholder="From Date"
                  className="w-full h-[32px] rounded-md border border-slate-300 px-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoComplete="off-district"

                />

                <input
                  type="date"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                  placeholder="To Date"
                  className="w-full h-[32px] rounded-md border border-slate-300 px-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoComplete="off-district"

                />

                <Select
                  value={filterDue}
                  onChange={setFilterDue}
                  options={dueOptions}
                  placeholder="Due"
                  isClearable
                  styles={{
                    ...selectStyles,
                    control: (base) => ({
                      ...base,
                      minHeight: "32px",
                      height: "32px",
                      fontSize: "12px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "0 6px",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "32px",
                    }),
                  }}
                />

                <Select
                  value={WorkStatusfilter}
                  onChange={setWorkStatusfilter}
                  options={paymentTypeOptions}
                  placeholder="Work"
                  isClearable
                  styles={{
                    ...workstatusStyles,
                    control: (base) => ({
                      ...base,
                      minHeight: "32px",
                      height: "32px",
                      fontSize: "12px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "0 6px",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "32px",
                    }),
                  }}
                />

                <div>
                  <button
                    onClick={exportToExcel}
                    className="mb-3 rounded-md bg-emerald-600 px-6 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Export Excel
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

              <div className="rounded-md border border-slate-300 p-3">
                <p className="text-xs text-slate-700 font-medium">Total Amount</p>
                <p className="text-lg font-semibold text-slate-800">
                  ₹{totals.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="rounded-md border border-slate-300 p-3">
                <p className="text-xs text-slate-700 font-medium">Total Remaining</p>
                <p className="text-lg font-semibold text-slate-800">
                  ₹{totals.totalRemaining.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">

              <div className="rounded-md border border-slate-300 p-3">
                <p className="text-xs text-slate-700 font-medium">Total In Amt</p>
                <p className="text-lg font-semibold text-slate-800">
                  ₹{totals.totalPaid.toFixed(2)}
                </p>
              </div>

              <div className="rounded-md border border-slate-300 p-3">
                <p className="text-xs text-slate-700 font-medium">Total Out Amt</p>
                <p className="text-lg font-semibold text-slate-800">
                  ₹{totals.TotalExpensePayment.toFixed(2)}
                </p>
              </div>

              <div className="rounded-md border border-slate-300 p-3">
                <p className="text-xs text-slate-700 font-medium">Net Balance</p>
                <p className={`text-lg font-semibold ${netBalance < 0 ? "text-red-600" : "text-green-600"}`} >
                  {/* ₹{netBalance.toFixed(2)} */}
                  ₹{Math.abs(netBalance).toFixed(2)}
                </p>
              </div>

            </div>


            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                paginationRowsPerPageOptions={[5, 10, 25, 50]}
                paginationPerPage={5}
                highlightOnHover
                striped
                fixedHeader
                fixedHeaderScrollHeight="400px"
                responsive
                customStyles={tableStyles}
              />
            </div>
          </div>

          <PaymentModal
            open={open}
            onClose={() => {
              setOpen(false);
              setEditRow(null);
            }}
            editData={editRow}
            onSuccess={GetData_Payment}
          />


          <ExpensesModal
            open={open2}
            onClose={() => {
              setOpen2(false);
              setEditRow(null);
            }}
            editData={editRow}
            onSuccess={GetData_Payment}
          />

          <WorkStatusModal
            open={workstatusopen}
            onClose={() => {
              setWorkstatusopen(false);
              setEditRow(null);
            }}
            editData={editRow}
            onSuccess={GetData_Payment}
          />


          <PartySettingModal
            open={settingsOpen}
            onClose={() => {
              setSettingsOpen(false);
              setSelectedPartyID(null);
            }}
            PartyID={selectedPartyID}
          />



          {viewOpen && viewData && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="absolute inset-0 bg-slate-900/40" onClick={() => setViewOpen(false)} />
              <div className="relative mx-auto flex min-h-screen items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-6xl rounded-lg bg-white shadow-xl my-4 max-h-[85vh] overflow-y-auto">

                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-800">
                        Payment Received
                      </h2>
                      <h2 className="text-xl font-semibold text-slate-800 flex flex-wrap gap-2">
                        {amtdeteil && (
                          <>
                            <span className="text-slate-500 font-medium">
                              Party Name:
                            </span>
                            <span className="text-slate-700 font-bold">
                              {amtdeteil.Name}
                            </span>

                            <span className="text-slate-400 mx-1">|</span>

                            <span className="text-slate-500 font-medium">
                              Owner Name:
                            </span>
                            <span className="text-slate-700 font-bold">
                              {amtdeteil.OwnerName}
                            </span>
                          </>
                        )}
                      </h2>


                      <button
                        onClick={() => { setViewOpen(false); }}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        type="button"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                    </div>
                  </div>

                  <div className="p-6">
                    {Array.isArray(viewData) && viewData.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full border-collapse bg-white">
                          <thead>
                            <tr className="bg-blue-600">
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">
                                Amount
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">
                                Remaining Amount
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">
                                Payment Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">
                                By Payment
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">
                                Payment Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase border-r border-blue-500">
                                Created Date
                              </th>


                              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase border-r border-blue-500">
                                Action
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase">
                                Print
                              </th>
                            </tr>
                          </thead>

                          <tbody className="bg-white divide-y divide-slate-200">
                            {viewData.map((item, index) => (
                              <tr key={item.PaymentID || index} className="hover:bg-blue-50 transition-colors">

                                <td className="px-4 py-3 text-sm font-semibold text-green-700 border-r border-slate-200">
                                  ₹{item.Amt ? parseFloat(item.Amt).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-orange-700 border-r border-slate-200">
                                  ₹{item.ReamaningAmt ? parseFloat(item.ReamaningAmt).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                  {item.Paymenttype || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                  {item.ByPayment || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                  {item.PaymentDtTm ? new Date(item.PaymentDtTm).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",


                                  }) : "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800">
                                  {item.CreatedDtTm || "-"}
                                </td>


                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => { setDeleteTarget(item); }}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </td>

                                <td className="px-1  text-center">
                                  <button
                                    // onClick={() => { GetDataSingale_PaymentParty(item) }}
                                    onClick={() => { PrintFun(item) }}
                                    className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                  >
                                    <IoMdPrint />
                                  </button>
                                </td>



                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                        <p className="text-sm text-slate-500">No payment data available</p>
                      </div>
                    )}

                    <div className="mt-6 gap-3 flex justify-end">
                      <button
                        onClick={() => { PrintFun(viewData[0]?.PartyID) }}
                        className="flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all duration-200 shadow-md"
                      >
                        <IoMdPrint className="text-lg" />
                        <span>Print Total Payment Received</span>
                      </button>

                      <button
                        onClick={SingleExportToExcel}
                        className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      // className="mb-3 rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Export Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewOpen(false)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Close
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}


          {viewOpen2 && viewData2 && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="absolute inset-0 bg-slate-900/40" onClick={() => setViewOpen2(false)} />
              <div className="relative mx-auto flex min-h-screen items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-6xl rounded-lg bg-white shadow-xl my-4 max-h-[85vh] overflow-y-auto">

                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-800">
                        Expenses Details
                      </h2>
                      <h2 className="text-xl font-semibold text-slate-800 flex flex-wrap gap-2">
                        {amtdeteil2 && (
                          <>
                            <span className="text-slate-500 font-medium">
                              Party Name:
                            </span>
                            <span className="text-slate-700 font-bold">
                              {amtdeteil2.Name}
                            </span>

                            <span className="text-slate-400 mx-1">|</span>

                            <span className="text-slate-500 font-medium">
                              Owner Name:
                            </span>
                            <span className="text-slate-700 font-bold">
                              {amtdeteil2.OwnerName}
                            </span>
                          </>
                        )}
                      </h2>


                      <button
                        onClick={() => setViewOpen2(false)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        type="button"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                    </div>
                  </div>

                  <div className="p-6">
                    {Array.isArray(viewData2) && viewData2.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full border-collapse bg-white">
                          <thead>
                            <tr className="bg-blue-600">

                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">
                                Amount
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">
                                Payment Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">
                                By Payment
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">
                                Payment Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Created Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {viewData2.map((item, index) => (
                              <tr key={item.PaymentID || index} className="hover:bg-blue-50 transition-colors">

                                <td className="px-4 py-3 text-sm font-semibold text-red-700 border-r border-slate-200">
                                  ₹{item.Amt ? parseFloat(item.Amt).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                                </td>

                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                  {item.Paymenttype || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                  {item.ByPayment || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800 border-r border-slate-200">
                                  {item.PaymentDtTm ? new Date(item.PaymentDtTm).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",


                                  }) : "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800">
                                  {item.CreatedDtTm || "-"}
                                </td>


                                <td className="px-4 py-3 text-center">
                                  <button
                                    // onClick={() => DeletePaymentById(item.ExpensePaymentID)}
                                    onClick={() => { setDeleteTarget(item); }}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </td>



                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                        <p className="text-sm text-slate-500">No payment data available</p>
                      </div>
                    )}

                    {/* <div className="mt-6 gap-3 flex justify-end">
                      <button
                        onClick={SingleExportToExcel2}
                        className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Export Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewOpen2(false)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Close
                      </button>
                    </div> */}

                    <div className="mt-6 flex items-center justify-between gap-3">

                      {/* LEFT SIDE */}
                      <p className="text-sm font-medium text-slate-700">
                        Total Expenses Amount:
                        <span className="ml-1 font-semibold text-red-600">
                          ₹{viewData2
                            .reduce((acc, item) => acc + Number(item.Amt || 0), 0)
                            .toFixed(2)}
                        </span>
                      </p>


                      {/* RIGHT SIDE */}
                      <div className="flex gap-3">
                        <button
                          onClick={SingleExportToExcel2}
                          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Export Excel
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewOpen2(false)}
                          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Close
                        </button>
                      </div>

                    </div>


                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {
          OTPStatus && (

            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
              <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Verify OTP
                  </h1>

                  <p className="text-sm text-slate-500 mb-8">
                    We've sent a verification code to{" "}
                    <strong className="text-slate-700">7990586879</strong>
                  </p>

                  <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-slate-700 text-left">
                      Enter 4-digit OTP
                    </label>

                    <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          autoComplete="off-district"
                          className="w-16 h-16 text-center text-xl font-semibold rounded-lg border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={VerifyOTP}
                    disabled={otp.join("").length !== 4}
                    className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>

          )
        }


        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setDeleteTarget(null)}
            />
            <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white p-4 sm:p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-800">
                Expenses Party
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {deleteTarget.Name || "this party"}
                </span>
                ?
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  No
                </button>
                <button
                  type="button"
                  // onClick={async () => {
                  //   setDeleteTarget(null);
                  //   await SendOTP();
                  //   setTimeout(() => {
                  //     setOTPStatus(true);
                  //   }, 100);
                  // }}
                  onClick={async () => {
                    await SendOTP();
                    setOTPStatus(true);
                  }}



                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Yes, Delete
                </button>

              </div>
            </div>
          </div>
        )}


        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-50"
              // onClick={() => setShowModal(false)}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Assign Permission User
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
                  title="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              {/* <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Assign Permission User
              </h2> */}

              {/* Dropdown */}
              <div className="mb-5">
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Select User
                </label>

                <Select
                  options={userOptions}
                  value={selectedUser}
                  isMulti
                  isClearable
                  placeholder="Select users..."
                  className="text-sm"
                  classNamePrefix="react-select"
                  onChange={async (newValue, actionMeta) => {

                    if (actionMeta.action === "select-option") {
                      const selected = actionMeta.option;
                      if (selected?.value) {
                        await Insert_PermissionUser(selected.value);
                      }
                    }

                    if (actionMeta.action === "remove-value") {
                      const removedUser = actionMeta.removedValue;

                      if (removedUser?.permissionUserID) {
                        await Delete_PermissionUser(removedUser.permissionUserID);
                      }
                    }

                    /* 🧹 DELETE ALL on clear */
                    if (actionMeta.action === "clear") {
                      if (selectedUser?.length > 0) {
                        for (const item of selectedUser) {
                          if (item.permissionUserID) {
                            await Delete_PermissionUser(item.permissionUserID);
                          }
                        }
                      }
                    }

                    setSelectedUser(newValue || []);
                  }}
                />

                {/* <Select
                  options={userOptions}
                  value={selectedUser}
                  isMulti
                  isClearable
                  placeholder="Select users..."
                  className="text-sm"
                  classNamePrefix="react-select"
                  onChange={(newValue, actionMeta) => {
                  
                    if (actionMeta.action === "remove-value") {
                      const removedUser = actionMeta.removedValue;

                      if (removedUser?.permissionUserID) {
                        Delete_PermissionUser(removedUser.permissionUserID);
                      }
                    }
                    if (actionMeta.action === "clear") {
                      selectedUser.forEach(item => {
                        if (item.permissionUserID) {
                          Delete_PermissionUser(item.permissionUserID);
                        }
                      });
                    }

                    setSelectedUser(newValue || []);
                  }}
                />
 */}




              </div>

              {/* Buttons */}
              {/* <div className="flex justify-end gap-3">
                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
                  onClick={Insert_PermissionUser}
                >
                  Submit
                </button>
              </div> */}
            </div>
          </div>
        )}



      </div>


    </>
  );
};

export default Payment;

