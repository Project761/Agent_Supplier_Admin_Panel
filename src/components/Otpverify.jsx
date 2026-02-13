import React, { use, useRef, useState,useEffect } from "react";
import { PostWithToken } from "../ApiMethods/ApiMethods";
import { toastifyError, toastifySuccess } from "../Utility/Utility";

const Otpverify = ({editItemId, onClose, onSuccess}) => {
   
  const [otp, setOtp] = useState(["", "", "", ""]);
 
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const otpInputRefs = useRef([]);
  const isVerifyingRef = useRef(false);
  const lastVerifiedOtpRef = useRef("");
  const mobileNo = sessionStorage.getItem("UserData")
    ? JSON.parse(sessionStorage.getItem("UserData")).MobileNo
    : "";

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 4);
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    if (pastedData.length === 4) {
      otpInputRefs.current[3]?.focus();
    }
  };

  const VerifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toastifyError("Please enter 4-digit OTP");
      return;
    }

    if (isVerifyingRef.current || otpString === lastVerifiedOtpRef.current)
      return;

    try {
      isVerifyingRef.current = true;
      lastVerifiedOtpRef.current = otpString;
      setOtpLoading(true);

      const payload = {
        MobileNo: mobileNo,
        OTP: otpString,
      };

      const res = await PostWithToken("SMS/Check_Otp", payload);
     

      if (res?.[0]?.Message === "OTP verified successfully") {
       
        toastifySuccess("OTP verified successfully");
      Delete_Reference(editItemId);
      
       
      } else {
       
        toastifyError("Invalid OTP. Please try again.");
        resetOtpInputs();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toastifyError("Failed to verify OTP. Please try again.");
      resetOtpInputs();
    } finally {
      setOtpLoading(false);
      isVerifyingRef.current = false;
    }
  };
  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      await SendOTP(mobileNo);
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setResendLoading(false);
    }
  };


   const SendOTP = async (mobileNumber) => {
          try {
              const payload = {
                  MobileNo: mobileNo
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
      useEffect(() => {
      
          if (mobileNo) {
              SendOTP(mobileNo);
          }
      }, [mobileNo]);

      
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


     const Delete_Reference = async (VehicleGPSID) => {
 
   

        try {
            const val = {
                VehicleGPSID: VehicleGPSID,
                IsActive: '',

            }
            const res = await PostWithToken('VehicleGPS/Delete_VehicleGPS', val)
            if (res) {
                toastifySuccess('Vehicle GPS successfully Deleted');
                onClose?.();
                onSuccess?.();
               
            }
        } catch (error) {
           
        }
    }
    const resetOtpInputs = () => {
        setOtp(["", "", "", ""]);
        lastVerifiedOtpRef.current = "";
        otpInputRefs.current[0]?.focus();
    };

  return (
    <>
    <div className="fixed  w-150 h-100 bg-white bg-opacity-50 z-50 flex items-center justify-center">
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Verify OTP</h1>
        <p className="text-sm text-slate-500 mb-8">
          We've sent a verification code to{" "}
          <strong className="text-slate-700">{mobileNo}</strong>
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
          disabled={otpLoading || otp.join("").length !== 4}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {otpLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Didn't receive code?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60 underline"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </div>

      
      </div>
      </div>
    </>
  );
};

export default Otpverify;
