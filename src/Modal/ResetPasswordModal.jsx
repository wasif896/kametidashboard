import React, { useState } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { IoEyeOutline, IoEyeOffOutline, IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";



const ResetPasswordModal = ({ open, handleClose }) => {
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
  const [btnLoader, setBtnLoader] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
  toast.dismiss()
    setSuccess("");
     
    if (!passwords.oldPassword) {
      toast.error("Current password field is required!");
      return;
    }
    if (!passwords.newPassword) {
      toast.error("New password field is required!");
      return;
    }
    if (!passwords.confirmPassword) {
      toast.error("Confirm password field is required!");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setBtnLoader(true)
    try {
      console.log()
      const response = await axios.post(
        `${apiBaseUrl}changePassword`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.data.status) {
        toast.success("Password updated successfully.");
        setBtnLoader(false)
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
      console.log(error);
      setBtnLoader(false)
    }
  };
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="reset-password-title"
      aria-describedby="reset-password-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#1f1f1f",
          borderRadius: 2,
          p: 4,
          boxShadow: 24,
          color: "white",
        }}
      >
        {/* Close Icon */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "white",
          }}
        >
          <IoCloseOutline size={24} />
        </IconButton>

        <Typography
  id="reset-password-title"
  variant="h6"
  component="h2"
  textAlign="center"
  sx={{ mb: 2, color: "#a87f0b" }}
>
  Change Password
</Typography>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
      {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
        <div key={field} className="mb-3 relative">
          <label className="block text-white mb-1">
            {field === "oldPassword"
              ? "Current Password"
              : field === "newPassword"
              ? "New Password"
              : "Confirm Password"}
          </label>
          <input
            type={showPassword[field] ? "text" : "password"}
            name={field}
            value={passwords[field]}
            onChange={handleChange}
            placeholder={
              field === "oldPassword"
                ? "Current password"
                : field === "newPassword"
                ? "New password"
                : "Confirm password"
            }
            className="w-full p-2 pl-3 pr-10 rounded bg-[#565656] text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
          />
          <span
            className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-400"
            onClick={() => togglePasswordVisibility(field)}
          >
            {showPassword[field] ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>
      ))}

    

      <Button
        type="submit"
        fullWidth
        disabled={btnLoader}
        sx={{
          backgroundColor: "#A87F0B",
          color: "white",
          "&:hover": { backgroundColor: "#a87f0b" },
          py: 1.5,
          fontSize: "14px",
          borderRadius: 3,
          marginTop: 1,
        }}
      >
      {btnLoader ? (
        <ClipLoader
        size={23}
      
    color='#ffffff'
        className=" mt-[1px] text-white"
      />
      ) : (
      "Update"
      )}
      </Button>
    </form>
      </Box>
    </Modal>
  );
};

export default ResetPasswordModal;
