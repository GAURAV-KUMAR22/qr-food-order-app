import React, { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

export const PhoneVerify = ({ onChange }) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupReCaptcha = () => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, phone, recaptchaVerifier);
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!phone) return alert("Please enter a valid phone number");

    try {
      setupReCaptcha(); // ✅ make sure this runs before signIn
      const appVerifier = window.recaptchaVerifier;
      console.log(appVerifier);
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      console.log(result);
      setConfirmationResult(result);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error: " + error.message);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) return alert("No confirmation result found");
    if (!code) return alert("Please enter the OTP");

    try {
      await confirmationResult.confirm(code);
      alert("Phone number verified!");
    } catch (err) {
      console.error(err);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Phone Verification</h2>
      <input
        className="w-[70%] h-10 border rounded-md pl-1 border-gray-500 mr-1.5"
        type="tel"
        value={phone}
        onChange={(e) => [setPhone(e.target.value)]}
        placeholder="+91XXXXXXXXXX"
      />
      <button onClick={sendOTP}>Send OTP</button>

      <div id="recaptcha-container"></div>

      <input
        className="w-[70%] h-10 border rounded-md pl-1 border-gray-500 mr-1.5"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={verifyOTP}>Verify OTP</button>
    </div>
  );
};
