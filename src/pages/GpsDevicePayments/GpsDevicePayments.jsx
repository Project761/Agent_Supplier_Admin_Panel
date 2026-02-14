import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { toastifySuccess, toastifyError } from "../../Utility/Utility";
import { AddDeleteUpadate, PostWithToken } from "../../ApiMethods/ApiMethods";
import DataTable from "react-data-table-component";
import { CgLayoutGrid } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
//----------1------------------------------------
export default function GpsDevicePayments() {

    const [GpsDevicePayData, setGpsDevicePayData] = useState();
    const [search, setSearch] = useState("");
    const [PaymentGPSID, setPaymentGPSID] = useState("");
    const [PaymentGPSSingleData, setPaymentGPSSingleData] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [editValue, setEditValue] = useState({});
    const [openReceiptModal, setOpenReceiptModal] = useState(false);


    const textareaRefs = useRef([]);

    // Use useCallback to prevent unnecessary re-renders
    const handleFieldChange = useCallback((fieldIndex, fieldValue) => {
        setvalue(prev => {
            const updatedValue = { ...prev };
            switch (fieldIndex) {
                case 0: updatedValue.VehicleNo = fieldValue; break;
                case 1: updatedValue.LeaseNo = fieldValue; break;
                case 2: updatedValue.LeaseName = fieldValue; break;
                case 3: updatedValue.ContactNo = fieldValue; break;
                case 4: updatedValue.Payment = fieldValue; break;
            }
            return updatedValue;
        });
    }, []);

    // Handle DataTable row click
    const handleDataTableRowClick = (row) => {
        console.log(row)
        setEditingRow(row);
        setEditValue(row);

        // Only set PaymentGPSID if exists, don't make API call
        if (row.PaymentGPSID) {
            setPaymentGPSID(row.PaymentGPSID);
        }
    };

    const handleEditChange = (field, value) => {
        setEditValue(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            moveToNextRow();
        }
    };
    console.log(PaymentGPSSingleData[0]?.MEOffice)
    const moveToNextRow = () => {
        const dataToUse = PaymentGPSSingleData && PaymentGPSSingleData.length > 0 ? PaymentGPSSingleData : ('', []);
        const dataArray = Array.isArray(dataToUse) ? dataToUse : [dataToUse];

        if (editingRow !== null) {
            const currentIndex = dataArray.findIndex(item => item === editingRow);
            if (currentIndex !== -1 && currentIndex < dataArray.length - 1) {
                const nextRow = dataArray[currentIndex + 1];
                setEditingRow(nextRow);
                setEditValue(nextRow);

                // Focus on the first textarea of the next row
                setTimeout(() => {
                    const firstTextarea = document.querySelector(`tr[data-row-index="${currentIndex + 1}"] textarea`);
                    if (firstTextarea) {
                        firstTextarea.focus();
                    }
                }, 0);
            }
            // Removed automatic saveEdit call - user should click Save button explicitly
        }
    };

    const cancelEdit = () => {
        // Reset editing states
        setEditingRow(null);
        setEditValue({});
        setPaymentGPSID("");

        // Clear table single data
        setPaymentGPSSingleData([]);

        // Clear header values
        setHeaderValues({
            ReceiptNo: "Auto Generated",
            MEOffice: "",
            PaymentDate: ""
        });

        // Clear input row values
        setvalue({
            VehicleNo: "",
            LeaseNo: "",
            LeaseName: "",
            ContactNo: "",
            Payment: ""
        });

        // Optional: Clear textarea DOM manually (extra safe)
        textareaRefs.current.forEach((el) => {
            if (el) el.value = "";
        });
    };

    //----------------------------------2----------------------------------------------

    const [value, setvalue] = useState({
        VehicleNo: "", LeaseNo: "", LeaseName: "", ContactNo: "",
        Payment: ""
    });

    const [headerValues, setHeaderValues] = useState({
        ReceiptNo: "Auto Generated", MEOffice: "", PaymentDate: ""
    });

    useEffect(() => {
        GetData_GpsDevicePayments()
    }, [])

    const GetData_GpsDevicePayments = async () => {
        const val = { IsActive: "1", };
        console.log("Calling API with:", val);
        try {
            const res = await PostWithToken("VehicleGPS/GetData_PaymentGPSReceipt", val);
            console.log("API Response:", res);
            if (res) {
                console.log("Setting GpsDevicePayData with:", res.length, "items");
                setGpsDevicePayData(res);
            } else {
                console.log("API returned null/undefined, setting empty array");
                setGpsDevicePayData([]);
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    };
    useEffect(() => {
        GetData_GpsDeviceSingle(PaymentGPSID)
    }, [PaymentGPSID])

    const GetData_GpsDeviceSingle = async (PaymentGPSID) => {
        const val = { PaymentGPSID: PaymentGPSID, };
        try {
            const res = await PostWithToken("VehicleGPS/GetSingleData_PaymentGPSReceipt", val);
            console.log(res, "res");
            if (res) {
                setPaymentGPSSingleData(res);
            } else {
                setPaymentGPSSingleData([])
            }
        } catch (error) {
            console.error(error);
        }
    };


    const Add_Type = async () => {
        const MEOffice = editValue.MEOffice || headerValues.MEOffice;
        const PaymentDate = editValue.PaymentDate || headerValues.PaymentDate;

        // 🔴 Validation
        if (!MEOffice?.trim()) {
            toastifyError("Please enter ME Office");
            return;
        }

        if (!PaymentDate) {
            toastifyError("Please select Payment Date");
            return;
        }

        const val = {
            ReceiptNo: headerValues.ReceiptNo,
            MEOffice: MEOffice,
            PaymentDate: PaymentDate,
        };

        try {
            const res = await AddDeleteUpadate(
                'VehicleGPS/Insert_PaymentGPSReceipt',
                val
            );

            if (res.success && res.data) {
                const parsed = JSON.parse(res.data);
                const tableData = parsed?.Table?.[0];
                if (tableData) {
                    const newPaymentID = tableData.PaymentGPSID;
                    setPaymentGPSID(newPaymentID);
                    toastifySuccess("Inserted Successfully");
                    cancelEdit();
                    await saveEdit(newPaymentID);
                }
            }
        } catch (error) {
            console.error("Insert Error:", error);
        }
    };


    const saveEdit = async (newPaymentID) => {
        try {
            // Split all fields by new line
            const vehicleNos = value.VehicleNo?.split("\n") || [];
            const leaseNos = value.LeaseNo?.split("\n") || [];
            const leaseNames = value.LeaseName?.split("\n") || [];
            const contactNos = value.ContactNo?.split("\n") || [];
            const payments = value.Payment?.split("\n") || [];

            // Find maximum length (important if uneven rows)
            const maxLength = Math.max(
                vehicleNos.length,
                leaseNos.length,
                leaseNames.length,
                contactNos.length,
                payments.length
            );

            for (let i = 0; i < maxLength; i++) {
                const val = {
                    VehicleNo: vehicleNos[i]?.trim() || "",
                    LeaseNo: leaseNos[i]?.trim() || "",
                    LeaseName: leaseNames[i]?.trim() || "",
                    ContactNo: contactNos[i]?.trim() || "",
                    Payment: payments[i]?.trim() || "",
                    PaymentGPSID: newPaymentID
                };

                // Skip empty rows
                if (!val.VehicleNo && !val.LeaseNo && !val.Payment) continue;

                await AddDeleteUpadate(
                    "VehicleGPS/Insert_PaymentGPSReceipt",
                    val
                );
            }

            toastifySuccess("All rows inserted successfully");
            GetData_GpsDevicePayments(); setOpenReceiptModal(false)

        } catch (error) {
            console.error("Error inserting multiple rows:", error);
        }

        setEditingRow(null);
        setEditValue({});
    };


    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const dataToPrint = PaymentGPSSingleData && PaymentGPSSingleData.length > 0
            ? PaymentGPSSingleData
            : [];

        const dataArray = Array.isArray(dataToPrint) ? dataToPrint : [dataToPrint];
        const totalPayment = dataArray.reduce((sum, item) => {
            const payment = parseFloat(item.Payment) || 0;
            return sum + payment;
        }, 0);

        // Create HTML content for printing
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>GPS Payment Receipt</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        font-size: 12px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header h2 {
                        margin: 0;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .header p {
                        margin: 5px 0;
                        font-size: 12px;
                    }
                   .receipt-title {
  background-color: rgb(253 224 71);
  padding: 6px 20px;
  font-weight: bold;
  font-size: 14px;
  display: block;
  width: fit-content;
  margin: 0 auto 20px auto;   /* 🔥 THIS WILL CENTER */
  text-align: center;
}
                    .receipt-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                        gap: 10px;
                    }
                    .receipt-info input {
                        border: 1px solid black;
                        padding: 4px 8px;
                        font-size: 12px;
                        width: 150px;
                    }
                  table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black; /* outer border */
}
                    thead th {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
  font-weight: bold;
  background-color: #f0f0f0;
 
  /* Print color fix */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
                  th {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
  font-weight: bold;
  background-color: #f0f0f0;
}
 
/* Body rows no border */
tbody td {
  border: none;
  padding: 8px;
}
 
                   .total-row td {
  border-top: 1px solid black;
  font-weight: bold;
}
                    .transaction-info {
                        margin-top: 20px;
                    }
                    .transaction-info input {
                        // border: 1px solid black;
                        padding: 4px 8px;
                        font-size: 12px;
                        width: 200px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>ARUSTU TECHNOLOGY</h2>
                    <p>624 Mansarovar Plaza Jaipur</p>
                </div>
               
                <div class="receipt-title">GPS Payment Receipt</div>
               
                <div class="receipt-info">
                    <input type="text" value="${editValue.ReceiptNo || headerValues.ReceiptNo || 'Auto Generated'}" readonly />
                    <input type="text" value="${editValue.MEOffice || headerValues.MEOffice || ''}" readonly />
                    <input type="date" value="${editValue.PaymentDate || headerValues.PaymentDate || ''}" readonly />
                </div>
               
                <table>
                    <thead>
                        <tr>
                            <th>Vehicle No</th>
                            <th>Lease No</th>
                            <th>Lease Name</th>
                            <th>Contact#</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                   <tbody>
    ${dataArray.map((item) => `
        <tr>
            <td>${item.VehicleNo || '-'}</td>
            <td>${item.LeaseNo || '-'}</td>
            <td>${item.LeaseName || '-'}</td>
            <td>${item.ContactNo || '-'}</td>
            <td>${item.Payment || '-'}</td>
        </tr>
    `).join('')}
 
    <tr class="total-row">
        <td colspan="4" style="text-align: right;"><strong>Total Payment:</strong></td>
        <td><strong>${totalPayment.toFixed(2)}</strong></td>
    </tr>
</tbody>
 
                </table>
               
                <div class="transaction-info">
                    <input type="text" value="TransactionID: ${editValue.TransactionId || ''}" readonly />
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load, then print
        printWindow.onload = function () {
            printWindow.print();
            printWindow.close();
        };
    };


    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return GpsDevicePayData || [];
        return (GpsDevicePayData || []).filter((r) => {
            const hay = `${r.VehicleNo} ${r.LeaseNo} ${r.LeaseName} ${r.ContactNo} ${r.ReceiptNo} ${r.MEOffice} ${r.Payment} ${r.PaymentDate}`.toLowerCase();
            return hay.includes(q);
        });
    }, [GpsDevicePayData, search]);


    const columns = useMemo(
        () => [
            {
                name: <span className="font-semibold">Receipt No</span>,
                selector: (row) => editingRow === row ? (
                    <input
                        type="text"
                        className="w-full text-sm border-none outline-none"
                        value={editValue.ReceiptNo || ""}
                        onChange={(e) => handleEditChange("ReceiptNo", e.target.value)}
                        onKeyPress={handleKeyPress}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (row.ReceiptNo || "-"),
                sortable: true,
            },
            {
                name: <span className="font-semibold">ME Office</span>,
                selector: (row) => editingRow === row ? (
                    <input
                        type="text"
                        className="w-full text-sm border-none outline-none"
                        value={editValue.MEOffice || ""}
                        onChange={(e) => handleEditChange("MEOffice", e.target.value)}
                        onKeyPress={handleKeyPress}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (row.MEOffice || "-"),
                sortable: true,
            },
            // {
            // name: <span className="font-semibold">Transaction Id</span>,
            // selector: (row) => editingRow === row ? (
            // <input
            // type="text"
            // className="w-full text-sm border-none outline-none"
            // value={editValue.TransactionId || ""}
            // onChange={(e) => handleEditChange("TransactionId", e.target.value)}
            // onKeyPress={handleKeyPress}
            // onClick={(e) => e.stopPropagation()}
            // />
            // ) : (row.TransactionId || "-"),
            // sortable: true,
            // },

            {
                name: <span className="font-semibold">Payment Date</span>,
                selector: (row) => editingRow === row ? (
                    <input
                        type="date"
                        className="w-full text-sm border-none outline-none"
                        value={editValue.PaymentDate || ""}
                        onChange={(e) => handleEditChange("PaymentDate", e.target.value)}
                        onKeyPress={handleKeyPress}
                        onClick={(e) => { e.stopPropagation(); GetData_GpsDeviceSingle() }}
                    />
                ) : (row.PaymentDate || "-"),
                sortable: true,
            },
            {
                name: <span className="font-semibold">Action</span>,
                cell: (row) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setOpenReceiptModal(true); GetData_GpsDeviceSingle(row.PaymentGPSID);
                                setPaymentGPSID(row.PaymentGPSID); handleDataTableRowClick(row);
                            }}
                            className="rounded-md bg-green-600 p-2 text-white hover:bg-green-700"
                        >
                            <FaPlus size={16} />
                        </button>

                    </div>
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },

        ],
        []
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


    return (
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 border border-slate-200 bg-white shadow-sm font-sans">


            {openReceiptModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                    {/* Modal Box */}
                    <div className="bg-white w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto rounded shadow-lg p-6 relative">

                        {/* Close Button */}
                        <button
                            onClick={() => { setOpenReceiptModal(false); cancelEdit() }}
                            className="absolute top-3 right-3 text-xl font-bold"
                        >
                            ✕
                        </button>

                        {/* ================= RECEIPT CONTENT START ================= */}
                        {/* Header */}
                        <h2 className="text-center font-bold text-lg">
                            ARUSTU TECHNOLOGY
                        </h2>
                        <p className="text-center text-sm">
                            624 Mansarovar Plaza Jaipur
                        </p>

                        <div className="w-full text-center mb-4">
                            <p className="inline-block bg-yellow-300 px-6 py-1 font-semibold text-sm">
                                GPS Payment Receipt
                            </p>
                        </div>

                        <div className="flex justify-between items-center my-3">
                            <input
                                type="text"
                                className=" rounded-sm border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500disabled:bg-slate-100 disabled:text-slate-500"
                                placeholder="Auto Generated"
                                disabled
                                value={editValue.ReceiptNo || headerValues.ReceiptNo}
                                onChange={(e) => setHeaderValues(prev => ({ ...prev, ReceiptNo: e.target.value }))}
                            />
                            <div className="flex items-center gap-4">
                                <label htmlFor="">ME Office</label>
                                <input
                                    type="text"
                                    className="border rounded-sm border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="ME Office"
                                    // value={editValue.MEOffice}
                                    value={editValue.MEOffice || headerValues.MEOffice}

                                    onChange={(e) => setHeaderValues(prev => ({ ...prev, MEOffice: e.target.value }))}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label htmlFor="">Payment Date</label>
                                <input
                                    type="date"
                                    name="Payment Date"
                                    className="border rounded-sm border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    // value={editValue.PaymentDate}
                                    value={editValue.PaymentDate || headerValues.PaymentDate}

                                    onChange={(e) => setHeaderValues(prev => ({ ...prev, PaymentDate: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="text-sm font-semibold">
                                    <th className="border border-black p-2">Vehicle No</th>
                                    <th className="border border-black p-2">Lease No</th>
                                    <th className="border border-black p-2">Lease Name</th>
                                    <th className="border border-black p-2">Contact#</th>
                                    <th className="border border-black p-2">Payment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Data Rows */}
                                {(() => {
                                    // Use PaymentGPSSingleData if available, otherwise use GpsDevicePayData
                                    const dataToUse = PaymentGPSSingleData && PaymentGPSSingleData.length > 0 ? PaymentGPSSingleData : ('', []);
                                    const dataArray = Array.isArray(dataToUse) ? dataToUse : [dataToUse];
                                    console.log("Table Data:", dataArray, "PaymentGPSSingleData:", PaymentGPSSingleData,);

                                    return dataArray && dataArray.length > 0 && dataArray.map((item, index) => (
                                        <tr
                                            key={index}
                                            data-row-index={index}
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => {
                                                // setEditingRow(item);
                                                setEditValue(item);
                                            }}
                                        >
                                            <td className=" p-2 text-sm">
                                                {editingRow === item ? (
                                                    <textarea
                                                        className="w-full text-sm border-none outline-none resize-none"
                                                        value={editValue.VehicleNo || ""}
                                                        onChange={(e) => handleEditChange("VehicleNo", e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        onClick={(e) => e.stopPropagation()}
                                                        rows={2}
                                                        style={{ minHeight: '40px' }}
                                                    />
                                                ) : (
                                                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {item.VehicleNo || "-"}
                                                    </div>
                                                )}
                                            </td>
                                            <td className=" p-2 text-sm">
                                                {editingRow === item ? (
                                                    <textarea
                                                        className="w-full text-sm border-none outline-none resize-none"
                                                        value={editValue.LeaseNo || ""}
                                                        onChange={(e) => handleEditChange("LeaseNo", e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        onClick={(e) => e.stopPropagation()}
                                                        rows={2}
                                                        style={{ minHeight: '40px' }}
                                                    />
                                                ) : (
                                                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {item.LeaseNo || "-"}
                                                    </div>
                                                )}
                                            </td>
                                            <td className=" p-2 text-sm">
                                                {editingRow === item ? (
                                                    <textarea
                                                        className="w-full text-sm border-none outline-none resize-none"
                                                        value={editValue.LeaseName || ""}
                                                        onChange={(e) => handleEditChange("LeaseName", e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        onClick={(e) => e.stopPropagation()}
                                                        rows={2}
                                                        style={{ minHeight: '40px' }}
                                                    />
                                                ) : (
                                                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {item.LeaseName || "-"}
                                                    </div>
                                                )}
                                            </td>
                                            <td className=" p-2 text-sm">
                                                {editingRow === item ? (
                                                    <textarea
                                                        className="w-full text-sm border-none outline-none resize-none"
                                                        value={editValue.ContactNo || ""}
                                                        onChange={(e) => handleEditChange("ContactNo", e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        onClick={(e) => e.stopPropagation()}
                                                        rows={2}
                                                        style={{ minHeight: '40px' }}
                                                    />
                                                ) : (
                                                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {item.ContactNo || "-"}
                                                    </div>
                                                )}
                                            </td>
                                            <td className=" p-2 text-sm">
                                                {editingRow === item ? (
                                                    <textarea
                                                        className="w-full text-sm border-none outline-none resize-none"
                                                        value={editValue.Payment || ""}
                                                        onChange={(e) => handleEditChange("Payment", e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        onClick={(e) => e.stopPropagation()}
                                                        rows={2}
                                                        style={{ minHeight: '40px' }}
                                                    />
                                                ) : (
                                                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {item.Payment || "-"}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ));
                                })()}

                                {/* Input Row */}
                                <tr>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <td
                                            key={i}
                                            className=" h-[250px] p-0 align-top"
                                        >
                                            <textarea
                                                ref={el => textareaRefs.current[i] = el}
                                                className="w-full h-full resize-none outline-none border-none text-sm p-2"
                                                onChange={(e) => {
                                                    const fieldValue = e.target.value;
                                                    handleFieldChange(i, fieldValue);
                                                }}
                                                value={[
                                                    value.VehicleNo, value.LeaseNo, value.LeaseName, value.ContactNo,
                                                    value.Payment
                                                ][i] || ""}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>


                        </table>

                        <div className="flex justify-between items-center mt-2">
                            <input
                                type="text"
                                className=" rounded-sm border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500disabled:bg-slate-100 disabled:text-slate-500"
                                placeholder="TransactionID"
                                disabled
                                // editValue.VehicleNo
                                // value={editValue.TransactionId}
                                value={editValue.TransactionId || ""}

                                onChange={(e) => setHeaderValues(prev => ({ ...prev, TransactionId: e.target.value }))}
                            />
                            <div className="flex items-center gap-4">
                                <label htmlFor="">Total</label>
                                <input
                                    type="text"
                                    className=" rounded-sm border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500disabled:bg-slate-100 disabled:text-slate-500"
                                    placeholder="Total"
                                    disabled
                                    value={(() => {
                                        const dataToUse = PaymentGPSSingleData && PaymentGPSSingleData.length > 0 ? PaymentGPSSingleData : ('', []);
                                        const dataArray = Array.isArray(dataToUse) ? dataToUse : [dataToUse];
                                        const total = dataArray.reduce((sum, item) => {
                                            const payment = parseFloat(item.Payment) || 0;
                                            return sum + payment;
                                        }, 0);
                                        return total.toFixed(2);
                                    })()}
                                />
                            </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-4 print:hidden">
                            {editingRow !== null ? (
                                <>
                                    {/* <button
                                        onClick={Add_Type}
                                        disabled={!headerValues.MEOffice || !headerValues.PaymentDate}
                                        className="px-4 py-2 border border-black text-sm font-medium
hover:bg-black hover:text-white transition
disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button> */}


                                    <button
                                        onClick={handlePrint}
                                        className="px-4 py-2 bg-black text-white text-sm font-medium hover:opacity-80 transition"
                                    >
                                        Print
                                    </button>

                                    {/* <button
                                        onClick={cancelEdit}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                                    >
                                        Cancel
                                    </button> */}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={Add_Type}
                                        className="px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition"
                                    >
                                        save
                                    </button>

                                    {/* <button
                                        onClick={handlePrint}
                                        className="px-4 py-2 bg-black text-white text-sm font-medium hover:opacity-80 transition"
                                    >
                                        Print
                                    </button> */}

                                    <button
                                        onClick={cancelEdit}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>




                    </div>
                </div>
            )}





            <div>
                <div className="flex justify-end items-center">
                    <button
                        onClick={() => setOpenReceiptModal(true)}
                        className="px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition"
                    >
                        Add Receipt
                    </button>
                </div>
                <div className="overflow-x-auto mt-3">
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
                        onRowClicked={handleDataTableRowClick}
                    />
                </div>
            </div>




        </div>
    );
}
