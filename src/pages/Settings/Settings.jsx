import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import editimg from "../../images/paymentImage/editProfile.png";
import adminicon from "../../images/auth/adminicon.png";
import payment from "../../images/Frame 2085663857.png";
import delete1 from "../../images/paymentImage/deleteRecord.png";
import folder from "../../images/paymentImage/allRecord.png";
import PrivacyPolicy from "../../images/privacyPolicy.png";
import needHelp from "../../images/Mask group (6).png";
import rateUs from "../../images/rateUs.png";
import shareLink from "../../images/shareLink.png";
import { AiFillLock } from "react-icons/ai";

import avatar from "../../images/Group 661 (2).png";

import delUser from "../../images/delete-user.png";
import protection from "../../images/Protection.png";
import power from "../../images/log.png";
import noti from "../../images/Notification.png";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import Toggle from "../../components/Toggle.jsx/Toggle";
import { FaImage } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Cropper from "../../components/Cropper/Cropper";
import axios from "axios";
import { ClipLoader, FadeLoader } from "react-spinners";

import { IoIosInformationCircleOutline } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import { TbMenu2 } from "react-icons/tb";
import more from "../../images/more2.png";

import { MdModeEditOutline } from "react-icons/md";

import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import AlertModal from "../../Modal/AlertModal";
import ResetPasswordModal from "../../Modal/ResetPasswordModal";
import Header from "../../components/Header/Header";
import toast from "react-hot-toast";

import { useTranslation } from "react-i18next";
import "../../i18n.js";

export default function Settings() {
  const [btnloader, setbtnloader] = useState(false);
  let [cropModal, setcropModal] = useState(false);
  const [profile, setProfile] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  let [myprflimg, setmyprflimg] = useState(null);
  const [allKametiCounts, setAllKametiCounts] = useState(0);
  const [key, setKey] = useState("");
  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  const handleOpen = () => setResetPasswordModal(true);
  const handleClose = () => setResetPasswordModal(false);
  let [cropPrfl, setCropPrfl] = useState({
    unit: "%",
    x: 50,
    y: 50,
    width: 25,
    height: 25,
  });
  const handleclosecropper = () => {
    setcropModal(false);
  };

  let [tempimg, settempimg] = useState(null);
  const [loading, setLoading] = useState(false);

  let handleImageChange = (event) => {
    // profileImage
    setProfile("");
    const { files } = event.target;

    // setKey(key + 1);
    if (files && files?.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.addEventListener("load", () => {
        setProfile(reader.result);
        setKey(key + 1);
        setcropModal(true);
      });
    } else {
      // If no file selected (e.g., user canceled cropping), clear the input field
      event.target.value = null;
    }
  };

  const navigate = useNavigate();
  let handleLogoutout = () => {
    console.log("logout");
    localStorage.removeItem("id");
    navigate("/signin");
  };
  const [logoutAlert, setLogoutAlert] = useState(false);
  const handleLogoutAlert = () => {
    setLogoutAlert(!logoutAlert);
  };
  const [edit, setEdit] = useState(false);
  const handleedit = () => {
    setEdit(!edit);
  };

  const [delAccountAlert, setDelAccountAlert] = useState(false);
  const handleDelAccountAlert = () => {
    setDelAccountAlert(!delAccountAlert);
  };
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("id");
      navigate("/signin");
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  let [name, setName] = useState("");
  let [username, setUsername] = useState("");
  let [tempUsername, setTempUsername] = useState("");
  let [tempPhone, setTempPhone] = useState("");

  setTempPhone;
  let [address, setAddress] = useState("");
  let [phone, setPhone] = useState("");
  let [email, setEmail] = useState("");
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem("token");

  // console.log(tempimg)

  const base64ToFile = async (base64String, fileName) => {
    const res = await fetch(base64String);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const [isToggled, setIsToggled] = useState(false); // Track toggle state

  const handleProfileUpdate = async (newValue, isToggleAction = false) => {
    if (btnloader) return; // Prevent multiple clicks while loading

    setbtnloader(true); // Start loading state

    try {
      let file;

      if (tempimg === "remove") {
        // If "remove" is set, send "remove" to remove the profile image
        file = "remove";
      } else if (!tempimg) {
        // If no image (user deleted it)
        file = ""; // Send empty string to clear the image
      } else if (tempimg?.startsWith("data:image")) {
        // If new image is selected (base64)
        file = await base64ToFile(tempimg, "profileImage.jpg");
      } else {
        file = userData?.profileUrl; // Keep existing image URL
      }

      const formData = new FormData();
      formData.append("id", userData?.id);
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("fcmtoken", newValue ? "abcd" : "");

      // Append image conditionally
      if (file === "remove") {
        formData.append("profileUrl", "remove"); // Send "remove" to remove image
      } else if (file === "") {
        formData.append("profileUrl", ""); // Send empty string to clear the image
      } else if (typeof file === "string") {
        formData.append("profileUrl", file);
      } else if (file) {
        formData.append("profileUrl", file);
      }

      const response = await axios.post(
        `${apiBaseUrl}admin/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();
      toast.success(response?.data?.message || "Profile updated successfully!");

      fetchAdminProfile(); // Refresh user data
      setEdit(!edit);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setbtnloader(false);
    }
  };

  // console.log(userData)
  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}admin/getProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setUserData(response?.data?.data);
      settempimg(response?.data?.data.profileUrl);
      setPhone(response?.data?.data.phone);
      setTempPhone(response?.data?.data.username);
      setEmail(response?.data?.data.email);
      setAddress(response?.data?.data.address);
      setName(response?.data?.data.name);
      setUsername(response?.data?.data.username);
      setTempUsername(response?.data?.data.username);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  let handleCloseshare = () => {
    setisModalOpen(false);
    setInfo(false);
    setShare(false);
    setDeleteInfo(false);
    setRecordinfo(false);
  };
  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        // Get the current base URL
        const baseUrl = window.location.origin;

        await navigator.share({
          title: "Share Kameti Link",
          text: "Check out this Kameti link:",
          url: baseUrl, // Use the current base URL
        });

        console.log("Link shared successfully!");
      } catch (error) {
        console.error("Error sharing link:", error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  let screenwidth = window.innerWidth;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const [open, setOpen] = useState(false);

  const handleDleteModalOpen = () => setOpen(true);
  const handleCloseDleteModal = () => setOpen(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Kameti link",
          text: "Check out this Kameti link:",
          url: "https://play.google.com/store/apps/details?id=com.ranamrameez.kameti",
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported on this browser.");
    }
  };
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowModal(false);
  };
  const handleDeleteImage = () => {
    setProfile("");
    settempimg("");
    const input = document.getElementById("img");
    if (input) input.value = ""; // Reset the file input
  };

  return (
    <>
      <Cropper
        cropModal={cropModal}
        handleclosecropper={handleclosecropper}
        theimg={profile}
        myimg={myprflimg}
        setmyimg={setmyprflimg}
        setcrop={setCropPrfl}
        crop={cropPrfl}
        aspect={1 / 1}
        setReduxState={settempimg}
        isCircle={true}
      />
      <div className="w-[100%] h-[100vh] flex justify-center items-center bg-black">
        <div className="w-[100%] h-[100vh] flex  ">
          {screenwidth > 430 && <Sidebar />}

          <div className="sm:w-[80%] w-[100%] h-[100vh] overflow-y-scroll sm:pb-3  sm:rounded-l-[0px] rounded-l-[20px] rounded-r-[20px] ">
            <Header
              screenwidth={screenwidth}
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
              title={t("Settings")}
              img={payment}
            />

            <div className="w-[100%] p-1 flex justify-center items-center flex-col">
              <div className="w-[100%] sm:w-[95%] rounded-[10px] sm:rounded-md h-[120px] bg-[#343434] mt-6 flex justify-between items-center">
                <div className="flex justify-center items-center ml-5">
                  <img
                    className="sm:w-[90px] sm:h-[90px] w-[80px] h-[80px] rounded-full"
                    src={userData?.profileUrl ? userData?.profileUrl : avatar}
                  />
                  <div className="flex justify-center items-start flex-col sm:ml-5 ml-3">
                    <h1 className="text-white font-bold text-[16px]">
                      {userData?.name == "null" ? "" : userData?.name}
                    </h1>
                    <p className="text-[white] text-[12px]">
                      {userData?.phone}
                    </p>
                    {userData?.email && (
                      <p className="text-[white] text-[12px]">
                        {userData?.email}
                      </p>
                    )}
                    <p className="text-[white] text-[12px]">
                      {userData?.address == "null" ? "" : userData?.address}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {/* Button visible only on screens larger than mobile */}
                  <button
                    onClick={handleedit}
                    style={{
                      boxShadow: "-4.2px 5.88px 7.22px 0px #00000038 inset",
                    }}
                    className="hidden sm:flex mr-5 justify-center items-center sm:w-[130px] w-[100px] h-[38px] rounded-[30px] hover:bg-gray-700  text-white text-[13px] bg-[#626262] shadow-custom-inset"
                  >
                    <img className="w-[15px]" src={editimg} />
                    {"\u00A0"}Edit Profile
                  </button>

                  {/* Image visible only on mobile */}
                  <img
                    className="block sm:hidden w-[20px] mr-[25px] sm:w-[35px]"
                    src={editimg}
                    alt="Edit Icon"
                    onClick={handleedit}
                  />
                </div>
              </div>
              <div className="w-[100%] sm:w-[95%] rounded-[10px] sm:rounded-md flex justify-center items-center bg-[#343434] mt-4">
                <div className="flex  items-center w-[100%] flex-wrap pl-[6px] sm:p-[20px]">
                  {/* <div
                      style={{ boxShadow: "0px 0px 20px 0px #00000040" }}
                onClick={handleDleteModalOpen}
                      className="sm:sm:w-[17%] w-[42%] m-3 relative h-[130px] sm:h-[150px] cursor-pointer rounded-[18px] bg-[#444343] flex justify-center items-center flex-col"
                    >
                     

                      <img className="w-[40px] sm:w-[45px]" src={delete1} />
                      <h2 className="text-white sm:text-[13px] text-[12px] mt-1">
                        Deleted Account
                      </h2>
                    </div> */}

                  <div
                    onClick={handleOpen}
                    style={{ boxShadow: "0px 0px 20px 0px #00000040" }}
                    className="sm:sm:w-[17%]  w-[42%] m-3 relative  h-[130px] sm:h-[150px] cursor-pointer rounded-[18px]  bg-[#444343] flex justify-center items-center flex-col"
                  >
                    <img className="w-[38px] sm:w-[43px]" src={needHelp} />

                    <h2 className="text-white sm:text-[13px] text-[12px] mt-1">
                      Change Password
                    </h2>
                  </div>

                  <div
                    onClick={() => setShowModal(true)}
                    style={{ boxShadow: "0px 0px 20px 0px #00000040" }}
                    className="sm:sm:w-[17%]  w-[42%] m-3 relative  h-[130px] sm:h-[150px] cursor-pointer rounded-[18px]  bg-[#444343] flex justify-center items-center flex-col"
                  >
                    <img className="w-[35px] sm:w-[35px]" src={shareLink} />

                    <h2 className="text-white sm:text-[13px] text-[12px] mt-1">
                      {t("Language")}
                    </h2>
                  </div>
                  <div>
                    {/* Language Selection Modal */}
                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-[300px] text-center z-10000">
                          <h2 className="text-xl font-semibold mb-4">
                            {t("Select Language")}
                          </h2>
                          <button
                            className="block w-full p-2 bg-blue-500 text-white rounded mb-2"
                            onClick={() => changeLanguage("en")}
                          >
                            English
                          </button>
                          <button
                            className="block w-full p-2 bg-green-500 text-white rounded"
                            onClick={() => changeLanguage("ur")}
                          >
                            اردو
                          </button>
                          <button
                            className="mt-4 text-red-500"
                            onClick={() => setShowModal(false)}
                          >
                            {t("Cancel")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={handleShare}
                    style={{ boxShadow: "0px 0px 20px 0px #00000040" }}
                    className="sm:sm:w-[17%]  w-[42%] m-3 relative  h-[130px] sm:h-[150px] cursor-pointer rounded-[18px]  bg-[#444343] flex justify-center items-center flex-col"
                  >
                    <img className="w-[35px] sm:w-[35px]" src={shareLink} />

                    <h2 className="text-white sm:text-[13px] text-[12px] mt-1">
                      Share App Link
                    </h2>
                  </div>

                  {/* <div className="sm:sm:w-[17%]  w-[40%] m-3 relative  h-[130px] sm:h-[150px] cursor-pointer rounded-[18px] flex justify-center items-center flex-col">
                      <div className=" justify-center items-center">
                        <Toggle />

                        <h2 className="text-white sm:text-[13px] text-[12px] mt-1 mr-2">
                          Remove Ads
                        </h2>
                        <p className="text-[8px] text-[#FFFFFF66]">
                          Help cover the server and maintenance cost associate
                          with your account by having ads
                        </p>
                      </div>
                    </div> */}
                  {/* <div className="sm:sm:w-[17%]  w-[40%] m-3 relative  h-[130px] sm:h-[150px] cursor-pointer rounded-[18px] flex justify-center items-center flex-col">
                      <div className="justify-center items-center">
                        <button
                          onClick={async () => {
                            const newValue = !isToggled;
                            setIsToggled(newValue); 
                            await handleProfileUpdate(newValue , true); // Pass the new value to the update function
                          }}
                          className={`${
                            isToggled ? "bg-white" : "bg-white"
                          } w-12 h-6 rounded-full flex items-center justify-${
                            isToggled ? "end" : "start"
                          } px-1 transition-colors`}
                        >
                          <div className="w-4 h-4 bg-[#A87F0B] rounded-full"></div>
                        </button>

                        <h2 className="text-white sm:text-[13px] text-[12px] mt-1 mr-2">
                          Notifications
                        </h2>
                        <p className="text-[8px] text-[#FFFFFF66]">
                          Help support server and maintenance costs by enabling
                          notifications with ads.
                        </p>
                      </div>
                    </div> */}

                  {/* <div
                      style={{ boxShadow: "0px 0px 20px 0px #00000040" }}
                      className="sm:sm:w-[17%]  w-[40%] m-3 relative h-[150px] cursor-pointer rounded-[18px]  bg-[#444343] flex justify-center items-center flex-col"
                    >
                        <img className="w-[45px]" src={logout} />
                    
                      <h2 className="text-white sm:text-[13px] text-[12px] mt-1 ">
                        Logout
                      </h2>
                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={logoutAlert} onClose={handleLogoutAlert}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "430px",
            width: "90%",
            bgcolor: "#373737",
            color: "white",
            outline: "none",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h7" component="h2">
            Are you sure you want to logout this account?
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <button
              className="bg-[#4B5563] text-white mr-5 h-[35px] rounded-md w-[100px]"
              onClick={handleLogoutAlert}
            >
              No
            </button>
            <button
              className="bg-[#A87F0B] h-[35px] rounded-md w-[100px]"
              onClick={() => {
                return handleLogoutout();
              }}
            >
              Yes
            </button>
          </Box>
        </Box>
      </Modal>

      <Modal open={delAccountAlert} onClose={handleDelAccountAlert}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "430px",
            width: "90%",
            bgcolor: "#373737",
            color: "white",
            outline: "none",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h7" component="h2">
            Are you sure you want to parmanently delete this account?
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <button
              className="bg-[#4B5563] text-white mr-5 h-[35px] rounded-md w-[100px]"
              onClick={handleDelAccountAlert}
            >
              No
            </button>
            <button
              className="bg-[#A87F0B] h-[35px] rounded-md w-[100px]"
              onClick={() => {
                return handleDeleteAccount();
              }}
            >
              Yes
            </button>
          </Box>
        </Box>
      </Modal>

      <Modal open={edit} onClose={handleedit}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "430px",
            width: "90%",
            bgcolor: "rgb(52 52 52)",
            color: "white",
            outline: "none",
            borderRadius: "10px",
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
          }}
        >
          <div className="flex justify-center flex-col items-center w-[100%]">
            <div className="flex w-full pt-4 sm:pt-0 pt-4">
              {" "}
              {/* Adjust padding for smaller screens */}
              <div className="flex justify-center items-center w-full relative">
                <p className="text-[#A87F0B] font-[700] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[22px]">
                  Edit Profile
                </p>
                <div
                  onClick={handleedit}
                  className="flex justify-center items-center w-[25px] h-[25px] rounded-full bg-[#747474] absolute right-0"
                >
                  <IoClose />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center flex-col mt-12 sm:mt-1 w-[100%]">
              <div className="h-[120px] w-[120px] border rounded-full absolute top-[60px] relative">
                {/* Image Circle */}
                <div onClick={() => document.getElementById("img").click()}>
                  <img
                    src={tempimg && tempimg != "remove" ? tempimg : avatar}
                    className="rounded-full w-[120px] h-[119px] object-cover"
                    alt="profile"
                  />
                </div>

                <div className="absolute top-[93px] left-[86px]">
                  {tempimg && tempimg != "remove" ? (
                    <button
                      className="cursor-pointer border rounded-full w-[22px] h-[22px] flex justify-center items-center text-white bg-red-500 text-sm font-bold"
                      onClick={handleDeleteImage}
                    >
                      −
                    </button>
                  ) : (
                    <div
                      className=" cursor-pointer border rounded-full w-[22px] h-[22px] flex justify-center items-center text-white bg-green-500 text-sm font-bold"
                      onClick={() => document.getElementById("img").click()}
                    >
                      +
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name="img"
                  id="img"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex justify-center flex-col mt-[80px] items-center w-[100%]">
                <div className="bg-[#FFFFFF2B] w-[100%] mt-5 rounded-[10px]">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name === "null" ? "" : name}
                    onChange={(e) => {
                      const input = e.target.value;
                      const cleanedName = input
                        .replace(/^\s+/, "")
                        .replace(/\s{2,}/g, "")
                        .replace(/\s+$/, " ");

                      setName(cleanedName);
                    }}
                    className="w-[100%] outline-none rounded-[60px] h-[40px] pl-3 pr-6 bg-[#191717] text-[#FFFFFF]"
                  />
                </div>
                {/* <div className="relative bg-[#FFFFFF2B] w-full mt-5 rounded-[10px]">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={tempUsername !== ""}
                    className={`w-full outline-none rounded-[60px] h-[40px] pl-3 pr-10 ${
                      tempUsername !== ""
                        ? "text-white-500 cursor-not-allowed"
                        : "bg-[#191717] text-[#FFFFFF]"
                    }`}
                  />
                  {tempUsername !== "" && (
                    <AiFillLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-500" />
                  )}
                </div> */}

                <div className="relative bg-[#FFFFFF2B] w-full mt-5 rounded-[10px]">
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    className="w-full outline-none rounded-[60px] h-[40px] pl-3 pr-10 bg-gray-400 text-white-500 cursor-not-allowed"
                  />
                  <AiFillLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-500" />
                </div>
                <div className="relative bg-[#FFFFFF2B] w-full mt-5 rounded-[10px]">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => {
                      // Allow only numeric input
                      const newPhone = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                      if (newPhone.length <= 11) {
                        setPhone(newPhone); // Update state only if the newPhone is valid
                      }
                    }}
                    className="w-full outline-none rounded-[60px] h-[40px] pl-3 pr-10 bg-[#191717] text-[#FFFFFF]"
                  />

                  {/* <AiFillLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-500" /> */}
                </div>

                {/* <input type='text' placeholder='Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} className='w-[100%] outline-none rounded-[60px] h-[40px] pl-6 pr-6 mt-5 bg-[#333333] text-[#FFFFFF]' /> */}
                {/* 
                <div className="w-[100%] outline-none h-[40px] pl-3 pr-6 mt-5 bg-[#FFFFFF2B] text-[#FFFFFF] flex items-center rounded-[10px]">
                  <PhoneInput
                    country={"us"}
                    value={phone}
                    onChange={setPhone}
                    inputStyle={{
                      background: "#191717",
                      color: "#FFFFFF",
                      border: "none",
                      width: "100%",
                      height: "100%",
                    }}
                    buttonStyle={{
                      background: "#191717",
                      border: "none",
                    }}
                    containerStyle={{
                      width: "100%",
                    }}
                    dropdownStyle={{
                      background: "#191717",
                      color: "#FFFFFF",
                    }}
                  />
                </div> */}
                <div className="bg-[#FFFFFF2B] w-[100%] mt-5 rounded-[10px]">
                  <input
                    type="text"
                    placeholder="Address"
                    value={address == "null" ? "" : address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-[100%] outline-none rounded-[60px] h-[40px] pl-3 pr-6  bg-[#191717] text-[#FFFFFF]"
                  />
                </div>
                <div className="flex justify-center mt-5 items-center w-[100%]">
                  <button
                    onClick={handleedit}
                    className="bg-[#5B5B5B] text-white py-2 px-4 w-[190px] h-[35px] flex justify-center items-center rounded-[10px] mr-2  transition duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleProfileUpdate}
                    disabled={btnloader} // Disables button while loading
                    className="bg-[#A87F0B] text-white py-2 px-4 w-[190px] h-[35px] flex justify-center items-center rounded-[10px]  transition duration-200"
                  >
                    {btnloader ? (
                      <div>
                        <ClipLoader
                          size={20}
                          color="#181818"
                          className="mt-2"
                        />
                      </div>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <AlertModal
        open={open}
        handleClose={handleCloseDleteModal}
        title="Are you sure you want to delete this account?"
        onConfirm={handleCloseDleteModal}
      />
      <ResetPasswordModal handleClose={handleClose} open={resetPasswordModal} />
    </>
  );
}
