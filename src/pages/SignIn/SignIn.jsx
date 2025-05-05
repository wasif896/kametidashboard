import React, { useState } from 'react';
import signup from '../../images/signup.png';
import laptop from '../../images/layerImage.png';
import kametilogo from '../../images/logo1.png';

import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import axios from 'axios';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';


import phoneIcon from '../../images/auth/phone.png';
import passwordIcon from '../../images/auth/password.png';
import emailIcon from '../../images/auth/email.png';
import addressIcon from '../../images/auth/address.png';
import nameIcon from '../../images/auth/name.png';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnLoader, setBtnLoader] = useState(false);
  const [responseMessage, setresponseMessage] = useState('');

  let navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const validateEmail = (email) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(?:\.[a-zA-Z]{2,8})?$/;
  
    // Perform basic regex test
    if (!emailRegEx.test(email)) {
      return false;
    }
  
    // Additional invalid cases
    if (
      email.includes(" ") || // No spaces allowed
      email.startsWith(".") || // No leading dot
      email.endsWith(".") || // No trailing dot
      email.startsWith("@") || // No leading '@'
      email.endsWith("@") || // No trailing '@'
      email.includes("..") || // No multiple dots in a row
      email.indexOf("@") !== email.lastIndexOf("@") || // No multiple '@' symbols
      !email.includes(".") || // Must contain a dot after the '@'
      email.match(/[@.]{2,}/) // No multiple consecutive '@' or '.' characters
    ) {
      return false;
    }
  
    return true;
  };

  const handleSignIn = async () => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      return;
    }
    try {
      setBtnLoader(true);
      const response = await axios.post(`${apiBaseUrl}admin/login`, {
        email: email,
        password: password,
      });
      toast.success("Sign in successful!");
    
      setBtnLoader(false);

      console.log(response?.data?.data?.type);
      localStorage.setItem('id', response?.data?.data?.id);
      localStorage.setItem('roleType', response?.data?.data?.admin?.type);
      localStorage.setItem('token', response?.data?.data?.token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
      setBtnLoader(false);
  
    }
  };

  
  let screenwidth =window.innerWidth
  return (
    <>
     <div className="flex h-[100vh] justify-center items-center">
  {/* Left Section: Laptop and Mobile */}
    {/* Right Section: Sign-up Form */}
    <div className="sm:w-[50%] w-[90%] h-[100vh]  flex flex-col justify-center items-center bg-black">
    <h1 className="text-[40px] text-[#A87F0B] font-bold">Login</h1>
    <p className="text-[#6E6E6E] mb-5 mt-5 text-center">Please write your <br></br> credentials to contiue</p>
    {responseMessage && <p className="text-white sm:mt-3 mt-5 w-[59%]">{responseMessage}</p>}
  <div className="bg-[#FFFFFF2B] opacity-[17] flex items-center  rounded-[10px] h-[58px] sm:w-[60%] w-[100%] p-5 sm:mt-3 mt-5">
  <img src={emailIcon} width="21px" className='mr-2'/>

    <input
        className="bg-transparent w-[100%] outline-none text-white"
      
      type="email"
      
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />
    </div>
    <div className="bg-[#FFFFFF2B] opacity-[17] flex items-center  rounded-[10px] h-[59px] sm:w-[60%] w-[100%] p-5 sm:mt-3 mt-5">
  <img src={passwordIcon} width="21px" className='mr-2'/>

      <input
        className="bg-transparent w-[100%] outline-none text-white"
        type={showPassword ? "password" : "text"}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
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
    <div className='w-[100%]'>
    <div onClick={()=>{
      navigate('/Forgot-Password')
    }} className='text-white flex items-end justify-end self-end mt-2 sm:w-[80%] overflow-hidden cursor-pointer '>Forgot Password?</div>
    </div>
    <button
    disabled={btnLoader}
      className="bg-[#A87F0B] text-white rounded-[10px] h-[43px] sm:w-[60%] w-[100%] flex justify-center items-center p-3 sm:mt-3  mt-2 sm:mt-9"
      style={{ boxShadow: '-4px -6px 6.8px 0px rgba(0, 0, 0, 0.25) inset' }}
      onClick={handleSignIn}
    >
    {btnLoader ?  <ClipLoader size={24} color='white' /> :"Login"}
    </button>
<h2 className="text-white absolute bottom-6">Powered by Avicenna Enterprise Solutions</h2>
  </div>
  {screenwidth > 430 && (
  <div className="w-[50%] h-[100vh] flex justify-center items-center relative bg-gradient-to-t from-[#A87F0B] to-[#141111] ">
  <div className="absolute flex justify-center items-center top-0 left-0 right-0">
    <div className="text-center mt-[95px]">
      <h1 className="text-[40px] font-bold text-white">Welcome To Dashboard</h1>
      <div className="flex justify-center items-center">
  <img src={kametilogo} alt="Kameti Logo" className="w-[25%] z-10" />
</div>
    </div>
  </div>

  <div className="absolute flex justify-end items-end bottom-0 right-[0px]">
    <img className="w-[83%] z-10" src={laptop} alt="Laptop" />
  </div>
</div>


  )}


</div>

    </>
  );
}
