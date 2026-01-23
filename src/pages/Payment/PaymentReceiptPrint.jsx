import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiPrinter } from 'react-icons/fi'
import { PostWithToken } from '../../ApiMethods/ApiMethods';
import { useNavigate, useSearchParams } from 'react-router-dom';

import "./PaymentReceiptPrint.css";

const PaymentReceiptPrint = () => {

  const [searchParams] = useSearchParams();
  const PartyID = searchParams.get("PartyID");
  const PaymentID = searchParams.get("PaymentID");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [printData, setPrintData] = useState([]); // 👈 array

  useEffect(() => {
    if (PartyID || PaymentID) {
      GetDataSingale_PaymentParty();
    }
  }, [PartyID, PaymentID]);

  const GetDataSingale_PaymentParty = async () => {
    try {
      const res = await PostWithToken(
        "Payment/GetDataSingale_PaymentParty",
        {
          PaymentID: PaymentID || "",
          PartyID: PartyID || "",
        }
      );

      if (Array.isArray(res) && res.length > 0) {
        setPrintData(res);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const headerData = printData[0]; // 👈 header ke liye

  return (
    <div className="invoice-page">

      {/* TOP BUTTONS (print me hide ho jayenge CSS se) */}
      <div className="print-button-container" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '10px 20px' }}>
        <button
          onClick={() => navigate('/dashboard/payment')}
          className="print-button"
          style={{
            backgroundColor: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '6px',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <FiArrowLeft />
          Back to Payment List
        </button>

        <button className="print-button" onClick={handlePrint}>
          <FiPrinter />
          Print
        </button>
      </div>

      <div className="print-area">
        {!loading && printData.length > 0 && (

          <div className="receipt-wrapper">

            {/* ===== HEADER (ONLY ONCE) ===== */}
            <div className="print-title">PAYMENT RECEIPT</div>

            {/* ===== MULTIPLE RECEIPTS ===== */}
            {printData.map((item, index) => (
              <div key={index} className="receipt-box">

                {/* Row 1 */}
                <div className="row">
                  <div className="col">
                    <span className="label">Receipt No</span>
                    <span className="colon">:</span>
                    <span className="value">{item.ReceiptNo ?? '__________'}</span>
                  </div>
                  <div className="col">
                    <span className="label">Date</span>
                    <span className="colon">:</span>
                    <span className="value">{item.PaymentDtTm}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="row full">
                  <span className="label">Received from</span>
                  <span className="colon">:</span>
                  <span className="value">{item.ByPayment ?? '-'}</span>
                </div>

                {/* Row 3 */}
                <div className="row">
                  <div className="col">
                    <span className="label">Amount Paid</span>
                    <span className="colon">:</span>
                    <span className="value">₹ {item.Amt ?? '-'}</span>
                  </div>
                  <div className="col">
                    <span className="label">Mode of Payment</span>
                    <span className="colon">:</span>
                    <span className="value">{item.Paymenttype ?? '-'}</span>
                  </div>
                </div>

                <div className="divider" />

                {/* Bottom */}
                <div className="row full">
                  <span className="label">For weighbridge No</span>
                  <span className="colon">:</span>
                  <span className="value">{item.WeighbridgeNo ?? '__________'}</span>
                </div>

                <div className="signature-row">
                  <span className="label">Vendor / integrator Name & Signature</span>
                  <span className="colon">:</span>
                  <span className="value">Arustu technology</span>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
};

export default PaymentReceiptPrint;
