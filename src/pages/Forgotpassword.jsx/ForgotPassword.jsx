import { useState} from 'react'
import reset from '../../images/reset.png'
import logo from '../../images/layerImage.png';

import passwordIcon from "../../images/auth/password.png";

import emailIcon from '../../images/auth/email.png';
import axios from "axios";


import { RiWhatsappFill } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";

import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';







export default function ForgotPassword() {
    const [confirmPassword, setConfirmPassword] = useState("");

    const [email, setEmail] = useState(""); // Email input
    const [otp, setOtp] = useState(null); // OTP value
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    // const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  
    const [newPassword, setNewPassword] = useState(""); // New password state
    const [enteredOtp, setEnteredOtp] = useState(null); // User entered OTP
    const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP was sent
    const [showEmail, setShowEmail] = useState(true);
    const [showPassFields, setShowPassFields] = useState(false); // State to track if OTP was sent
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;

    

    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    };
  
    const handleSendOTP = async () => {
      setLoading(true); // Start loading
      const generatedOTP = generateOTP();
      setOtp(generatedOTP); // Store OTP for later validation
    
      const payload = {
        email: email, // Send email
        otp: generatedOTP, // Send generated OTP
      };
    
      try {
        const response = await axios.post(`${apiBaseUrl}admin/sendCode`, payload);
        
        if (response.data) {
          console.log("okkkkk");
          setIsOtpSent(true); // Mark OTP as sent
          setShowEmail(false);
          setSuccessMessage("OTP sent successfully! Please check your email");
          setError(""); // Reset error message
        } else {
          setError(response.data.message || "Failed to send OTP.");
          setSuccessMessage(""); // Clear success message
        }
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message);
        setSuccessMessage(""); // Clear success message
      } finally {
        setLoading(false); // Stop loading after request completes
      }
    };
  
    // Handle OTP verification and password setting
    const handleVerifyOtpAndSetPassword = () => {
      console.log(otp, enteredOtp);
      if (enteredOtp == otp) {
        setShowPassFields(true);
        setIsOtpSent(false);
        setSuccessMessage("OTP is correct! Now you can set your new password.");
        setError(""); // Clear any errors
    
        // Remove success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setError("Invalid OTP. Please try again.");
        setSuccessMessage(""); // Clear success message
    
        // Remove error message after 5 seconds
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    };
    
  
    const handleResetPassword = async () => {
      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        setSuccessMessage(""); // Clear success message
        return;
      }
    
      setLoading(true); // Show loader
    
      try {
        const response = await axios.post(`${apiBaseUrl}admin/resetPassword`, {
          email: email, // Make sure this matches API requirements
          password: newPassword, 
        });
    
        console.log(response);
    
        if (response.data) { 
          setSuccessMessage("Password reset successfully!");
          setError(""); // Clear error message
    
          // Clear input fields
          setNewPassword("");
          setConfirmPassword("");
    
          // Remove success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        } else {
          setError(response.data.message || "Something went wrong!");
          setSuccessMessage(""); // Clear success message
    
          // Remove error message after 5 seconds
          setTimeout(() => {
            setError("");
          }, 5000);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.response?.data?.message || "An error occurred. Please try again.");
        setSuccessMessage(""); // Clear success message
    
        // Remove error message after 5 seconds
        setTimeout(() => {
          setError("");
        }, 5000);
      } finally {
        setLoading(false); // Hide loader
      }
    };
    const handleBack = () => {
      navigate(-1);
    };
    
    
  return (
   <>
<div className="flex bg-gradient-to-l from-[#A87F0B] to-[#000000] h-[100vh] justify-center items-center">
  <div className="sm:w-[50%] w-[90%] h-[90vh] flex flex-col justify-center items-center">
    {/* Logo */}

    {/* Heading */}
    <h1 className="text-white text-[40px] sm:text-[50px]  font-bold mb-2 text-center">
      Forgot Password?
    </h1>
    <p className="text-white sm:text-[15px] text-center text-[13px] mb-5">
      Login! No worries, we’ll send you reset instructions to your account.
    </p>

    {/* Toggle Option */}
    {/* <div className="flex w-1/2 sm:w-2/5 items-center relative mb-5">
      <div className="bg-transparent border text-white border-[#fff] rounded-full h-12 w-full flex items-center">
        <button
          className={`rounded-full h-12 w-1/2 text-lg ${
            !emailSelected ? "bg-[#A87F0B] text-white" : "text-white"
          }`}
          onClick={() => setEmailSelected(false)}
        >
          Phone
        </button>
        <button
          className={`rounded-full h-12 w-1/2 text-lg ${
            emailSelected ? "bg-[#A87F0B] text-white" : "text-white"
          }`}
          onClick={() => setEmailSelected(true)}
        >
          Email
        </button>
      </div>
    </div> */}
             {/* <div className="flex w-1/2 sm:w-[240px] items-center relative mb-5">
              <div className="bg-[#181818] border text-white outline-none border-[#A87F0B] rounded-[30px] h-[39px] sm:h-[45px] w-[100%]">
                <button
                  className={`text-white absolute left-0 rounded-[30px] h-[39px] sm:h-[44px] sm:text-[16px] w-[53%] ${
                    !emailSelected ? "bg-[#A87F0B]" : ""
                  }`}
                  style={
                    !emailSelected
                      ? {
                          boxShadow:
                            "-4.2px 5.88px 7.22px 0px rgba(255, 255, 255, 0.34) inset",
                        }
                      : {}
                  }
    
                  onClick={() => {
                    setEmailSelected(false); // Switch to email
                    
                  }}
                   

                >
                  Phone
                </button>

                <button
                  className={`absolute right-0 rounded-[30px] h-[39px] sm:h-[44px] sm:text-[16px] w-[53%] ${
                    emailSelected ? "bg-[#A87F0B] text-white" : "text-white"
                  }`}
                  style={
                    emailSelected
                      ? {
                          boxShadow:
                            "-4.2px 5.88px 7.22px 0px rgba(255, 255, 255, 0.34) inset",
                        }
                      : {}
                  }
                  onClick={() => {
                    setEmailSelected(true); // Switch to email
                  
                  }}
                  
                >
                  Email
                </button>
              </div>
            </div> */}
    

    {/* Input and Button */}
   {/* Display Success or Error Message */}
   {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

    <div className="bg-[#6A6A6A80] flex sm:w-[65%] w-[100%] items-center relative  rounded-[10px] mt-9">
  {/* Dynamically set the image source */}
  {/* <img src="email-icon.png" width="23px" className="ml-4" /> */}

  {/* Email input field or OTP input field */}
  {showEmail && (
        <div className="flex items-center rounded-[10px] h-[50px] sm:w-[70%] w-[100%] p-5 ">
                    <img src={emailIcon} width="23px" className="mr-2" />
                    <input
                      className="w-[100%] outline-none text-white"
                      type="email"
                      placeholder="Enter your email"
      value={email}

                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
  )} 
  { isOtpSent &&
    // OTP input field after OTP is sent
    <input
      className="bg-transparent text-white outline-none h-[50px] w-[100%] p-2"
      type="text"
      placeholder="Enter OTP"
      value={enteredOtp}
      onChange={(e) => setEnteredOtp(e.target.value)} // Capture OTP value
    />
  }

  {/* Show password fields only when OTP is correctly entered */}

 {!showPassFields && (
   <button
   className="bg-[#A87F0B] absolute right-0 rounded-[10px] h-[50px] sm:text-[16px] w-[20%] text-white font-medium flex justify-center items-center"
   style={{
     boxShadow: "-4px -6px 6.8px 0px rgba(0, 0, 0, 0.25) inset",
   }}
   onClick={isOtpSent ? handleVerifyOtpAndSetPassword : handleSendOTP}
   disabled={loading} // Disable button when loading
 >
   {loading ? <ClipLoader size={25} color="#ffffff" /> : isOtpSent ? "Verify OTP" : "Send OTP"}
 </button>
    )}
</div>
<div className="flex flex-col sm:w-[65%] w-[100%] mt-5 space-y-3">

  {showPassFields && (
    <>
     <div  className="bg-[#6A6A6A80] rounded-lg p-3 flex items-center relative">
                  <img src={passwordIcon} width="23px" className="mr-2" />
                  <input
                  required
                    className="w-[100%] outline-none text-white"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {showPassword ? (
                    <FaRegEyeSlash
                      className="text-white ml-2 text-[22px] cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <MdOutlineRemoveRedEye
                      className="text-white ml-2 text-[22px] cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>


                <div className="bg-[#6A6A6A80] rounded-lg p-3 flex items-center relative">
                  <img src={passwordIcon} width="23px" className="mr-2" />
                  <input
                  required
                    className="w-[100%] outline-none text-white"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {showConfirmPassword ? (
                    <FaRegEyeSlash
                      className="text-white ml-2 text-[22px] cursor-pointer"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  ) : (
                    <MdOutlineRemoveRedEye
                      className="text-white ml-2 text-[22px] cursor-pointer"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  )}
                </div>


    </>
  )}

</div>

{showPassFields && (
  <button  
  className="bg-[#A87F0B] rounded-[10px] h-[50px] sm:text-[20px] w-[65%] mt-10 flex justify-center items-center font-medium text-white shadow-md"
  style={{
    boxShadow: "-4px -6px 6.8px 0px rgba(0, 0, 0, 0.25) inset",
  }}
  onClick={handleResetPassword} // Call API on button click
  disabled={loading} // Disable button while loading
>
  {loading ? <ClipLoader size={25} color="#ffffff" /> : "Submit"}
</button>

  )}
    
 

    {/* WhatsApp Support
    <p className="text-[#A87F0B] sm:text-[14px] mt-5 text-center">
      Or Try Our WhatsApp Support?
    </p>
    <p className="text-white sm:text-[13px] text-[13px] text-center mt-2 mb-5">
      Contact us on WhatsApp for the fastest support.
    </p>

    <button className="bg-[#FFFFFF33] rounded-[10px] h-[50px] sm:text-[16px] w-[65%] flex justify-center items-center font-medium text-white shadow-inset-custom">
      <RiWhatsappFill className="sm:text-[30px] mr-1 text-[#07E259]" />
      WhatsApp Support
    </button> */}
 
 <button
      className="bg-[#A87F0B] text-white font-bold rounded-[10px] h-[50px] sm:w-[65%] w-[100%] flex justify-center items-center p-3 sm:mt-3 mt-5"
      style={{
        boxShadow: "-4px -6px 6.8px 0px rgba(0, 0, 0, 0.25) inset",
      }}
      onClick={handleBack} // Navigate to /signin
    >
      <IoArrowBack className="mr-2 text-xl" />
      Back
    </button>
  </div>

  {/* Right Side (Image Section for larger screens) */}
  <div className="hidden sm:flex w-[50%] h-[90vh] justify-center items-center">
    <div className="relative flex justify-center items-center">
      <img className="w-[100%] z-10" src={logo} alt="Laptop" />
    </div>
  </div>
</div>

   </>
  )
}
