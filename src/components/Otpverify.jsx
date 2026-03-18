import React, { useRef, useState, useEffect } from "react";
import { PostWithToken } from "../ApiMethods/ApiMethods";
import { toastifyError, toastifySuccess } from "../Utility/Utility";

const Otpverify = ({ editItemId, onClose, onSuccess, deletename }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const otpInputRefs = useRef([]);
  const isVerifyingRef = useRef(false);
  const lastVerifiedOtpRef = useRef("");

  const mobileNo = sessionStorage.getItem("UserData")
    ? JSON.parse(sessionStorage.getItem("UserData")).MobileNo
    : "";

  
  useEffect(() => {
    if (mobileNo) {
      SendOTP();
    }
  }, [mobileNo]);

  const SendOTP = async () => {
    try {
      setResendLoading(true);
      const res = await PostWithToken("SMS/SendMessage", {
        MobileNo: mobileNo,
      });
      if (res) toastifySuccess("OTP sent successfully");
    } catch {
      toastifyError("Failed to send OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const VerifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toastifyError("Enter 4-digit OTP");
      return;
    }

    if (isVerifyingRef.current || otpString === lastVerifiedOtpRef.current)
      return;

    try {
      isVerifyingRef.current = true;
      lastVerifiedOtpRef.current = otpString;
      setOtpLoading(true);

      const res = await PostWithToken("SMS/Check_Otp", {
        MobileNo: mobileNo,
        OTP: otpString,
      });

      if (res?.[0]?.Message === "OTP verified successfully") {
        toastifySuccess("OTP verified successfully");

        
        if (deletename === "Party") {
          await Delete_Party(editItemId);
        }

        if (deletename === "Vehicle GPS") {
          await Delete_Reference(editItemId);
        }

       
        onClose?.();
        onSuccess?.();

      } else {
        toastifyError("Invalid OTP");
        resetOtp();
      }
    } catch {
      toastifyError("Verification failed");
      resetOtp();
    } finally {
      setOtpLoading(false);
      isVerifyingRef.current = false;
    }
  };

  const Delete_Reference = async (id) => {
    try {
      const res = await PostWithToken("VehicleGPS/Delete_VehicleGPS", {
        VehicleGPSID: id,
        IsActive: "",
      });
      if (res) toastifySuccess("Vehicle GPS deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const Delete_Party = async (id) => {
    try {
      const res = await PostWithToken("Party/Delete_Party", {
        PartyID: id,
      });
      if (res) toastifySuccess("Party deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (i, val) => {
    if (val.length > 1) return;

    const newOtp = [...otp];
    newOtp[i] = val.replace(/[^0-9]/g, "");
    setOtp(newOtp);

    if (val && i < 3) {
      otpInputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpInputRefs.current[i - 1]?.focus();
    }
    if (e.key === "Enter") VerifyOTP();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 4);
    setOtp(data.split(""));
  };

  const resetOtp = () => {
    setOtp(["", "", "", ""]);
    otpInputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

     
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-6">

       
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2 text-slate-800">
          Verify OTP
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Sent to <b>{mobileNo}</b>
        </p>

       
        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => (otpInputRefs.current[i] = el)}
              value={d}
              maxLength={1}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-14 h-14 text-center text-xl border-2 rounded-lg focus:border-blue-500 outline-none"
            />
          ))}
        </div>

       
        <button
          onClick={VerifyOTP}
          disabled={otpLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {otpLoading ? "Verifying..." : "Verify OTP"}
        </button>

        
        <div className="mt-4 text-center">
          <button
            onClick={SendOTP}
            disabled={resendLoading}
            className="text-blue-600 underline text-sm"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otpverify;
   
   
   
   
   
   
   
   
   
   