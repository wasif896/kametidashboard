import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  RadioGroup,
  InputAdornment,
  Radio,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import { ClipLoader } from 'react-spinners';
import axios from "axios";
import { Close } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect } from "react";
const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem("token");

const CreateRole = ({
  open,
  handleClose,
  fetchRoles,
  update,
  editData,
  action,
  edit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [roleName, setRoleName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState();
  const [roleType, setRoleType] = useState();
  const [errors, setErrors] = useState({});
  const [btnLoader, setBtnLoader] = useState(false);


  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    setEmail("")
    setRoleName("")
    setPassword("")
    setDescription("")
    setRoleType("")
  },[update])

  useEffect(() => {
    if (edit) {
      setRoleId(editData.id || null);
      setRoleName(editData.name || "");
      setEmail(editData.email || "");
      setDescription(editData.description || "");
      setRoleType(editData.type || "");
  
    } else {
      setRoleId("");
      setRoleName("");
      setEmail("");
      setDescription("");
      setPassword("");
      setRoleType("subadmin");
    }
  }, [edit]);

  const handleStatusChange = (event) => {
    setRoleType(event.target.value);
  };

  const validateEmail = (email) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return emailRegEx.test(email);
  };
  
  const handleSubmit = async () => {
    setErrors({}); // clear previous errors

    toast.dismiss()
 
    if(!roleName){
      toast.error("Please enter Role Name.")
      return;
    }
    if(!email){
      toast.error("Please enter your Email.")
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }
    if(!password){
      toast.error("Please enter your Password.")
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if(!roleType){
      toast.error("Please select Role.")
      return;
    }
    const formData = {
      name: roleName,
      email: email,
      password: password,
      description: description,
      type: roleType,
    };

    // Determine the API endpoint based on roleType
    const endpoint = roleType === "subadmin" ? "create/admin" : `create/user`;
    setBtnLoader(true)
    try { 
      const response = await axios.post(`${apiBaseUrl}${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      setBtnLoader(false)
      setRoleName("");
      setEmail("");
      setPassword("");
      setDescription("");
      setRoleType("");

      handleClose();
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      setBtnLoader(false)
    }
  };

  const handleEditRole = async () => {
    toast.dismiss()
 
    if(!roleName){
      toast.error("Please enter Role Name.")
      return;
    }
    if(!email){
      toast.error("Please enter your Email.")
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }
    if(!password){
      toast.error("Please enter your Password.")
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if(!roleType){
      toast.error("Please select Role.")
      return;
    }
    const formData = {
      name: roleName,
      email: email,
      password: password,
      description: description,
      type: roleType,
    };
    setBtnLoader(true)
    try {
      const response = await axios.post(
        `${apiBaseUrl}admin/editrole/${roleId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Close modal (if applicable)
      handleClose();
      
      // Refresh roles
      fetchRoles();
  
      // Show success toast
      toast.success("Role updated successfully!");
      setBtnLoader(false)
    } catch (error) {
      console.error("Error updating role:", error);
      setBtnLoader(false)
      // Optionally, show error toast if something goes wrong
      toast.error("Error updating role. Please try again.");
    }
  };

  let screenwidth = window.innerWidth;
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#2B2B2B",
          borderRadius: 2,
          boxShadow: 24,
          width: screenwidth > 450 ? "50%" : "90%",
          maxHeight: "95vh",
          overflow: "scroll",
        }}
      >
        
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#B08C2A",
            p: 2,
            borderRadius: "8px 8px 0 0",
            color: "white",
          }}
        >
          <Typography variant="h6" className="text-white" fontWeight="bold">
            Create New Role
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        {/* {errors} */}

        {/* Content */}
        <Box sx={{ p: 2 }}>
          <Typography fontWeight="bold" className="text-white" mb={1}>
            Role Name
          </Typography>
          <TextField
  fullWidth
  variant="outlined"
  placeholder="Enter Role Name"
  size="small"
  sx={{
    mb: 2,
    "& input": {
      color: "white !important", // Force text color to remain black
      backgroundColor: "transparent !important",
      "&::placeholder": {
        color: "#ffffff", // placeholder color
          opacity: 0.7, // Ensure it's not faded
      },
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "gray", // Default border color
      },
      "&:hover fieldset": {
        borderColor: "gray !important", // Remove hover effect
      },
      "&.Mui-focused fieldset": {
        borderColor: "gray !important", // Remove blue focus border
        boxShadow: "none", // Remove focus shadow
      },
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px white inset !important",
      WebkitTextFillColor: "white !important",
    },
  }}
  value={roleName}
  onChange={(e) => {
    const input = e.target.value;
    const cleanedName = input
    .replace(/^\s+/, "")       
    .replace(/\s{2,}/g, "")   
    .replace(/\s+$/, " ");      

    setRoleName(cleanedName);
}}
  autoComplete="name"
/>

          <Typography fontWeight="bold" className="text-white" mb={1}>
            Email
          </Typography>
          <TextField
            fullWidth
            type="email"
            variant="outlined"
            placeholder="Enter email to assign role"
            size="small"
            sx={{
              mb: 2,
              "& input": {
                color: "white !important", // Force text color to remain black
                backgroundColor: "transparent !important",
                "&::placeholder": {
        color: "#ffffff", // placeholder color
        opacity: 0.7, // Ensure it's not faded
      },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "gray !important", // Remove hover effect
                },
                "&.Mui-focused fieldset": {
                  borderColor: "gray !important", // Remove blue focus border
                  boxShadow: "none", // Remove focus shadow
                },
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0px 1000px white inset !important",
                WebkitTextFillColor: "white !important",
              },
            }}
            value={email}
            onChange={(e) => {
              const input = e.target.value;
              const cleaned = input.replace(/\s/g, "");
              setEmail(cleaned);
            }}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
            }}
            autoComplete="email" // Ensures browser suggests email addresses
          />
          <Typography fontWeight="bold" className="text-white" mb={1}>
            Password
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter password"
            size="small"
            sx={{
              mb: 2,
              "& input": {
                color: "white !important", // Force text color to remain black
                backgroundColor: "transparent !important",
                "&::placeholder": {
        color: "#ffffff", // placeholder color
          opacity: 0.7, // Ensure it's not faded
      },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "gray !important", // Remove hover effect
                },
                "&.Mui-focused fieldset": {
                  borderColor: "gray !important", // Remove blue focus border
                  boxShadow: "none", // Remove focus shadow
                },
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0px 1000px white inset !important",
                WebkitTextFillColor: "white !important",
              },
            }}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff className="text-white" /> : <Visibility className="text-white" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="new-password" // Ensures correct autofill behavior
          />

          <Typography fontWeight="bold" className="text-white" mb={1}>
            Description
          </Typography>
          <TextField
          fullWidth
          variant="outlined"
          placeholder="Write some text"
          multiline
          rows={3}
          size="small"
          sx={{
            mb: 2,
            "& .MuiInputBase-root": {
              color: "white", // text color
            },
            "& .MuiInputBase-root textarea": {
              color: "white", // text color inside textarea
              backgroundColor: "transparent",
              "&::placeholder": {
                color: "#ffffff",
                  opacity: 0.7,
              },
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "gray",
              },
              "&:hover fieldset": {
                borderColor: "gray !important",
              },
              "&.Mui-focused fieldset": {
                borderColor: "gray !important",
                boxShadow: "none",
              },
            },
          }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoComplete="off"
        />
        

          <Typography fontWeight="bold" className="text-white">Status</Typography>
          <RadioGroup
  row
  value={roleType}
  onChange={handleStatusChange}
  sx={{ alignItems: "center" }}
>
  <FormControlLabel
    value="subadmin"
    control={<Radio  sx={{
      color: "white", // default (unselected) color
      '&.Mui-checked': {
        color: '#A87F0B', // color when selected
      },
    }}/>}
    label={
      <Typography
        sx={{
          color: "white",
          backgroundColor: "transparent",
          px: 1,
          borderRadius: 1,
        }}
      >
        SubAdmin
      </Typography>
    }
    sx={{ backgroundColor: "transparent", borderRadius: 1, px: 1 }}
  />
  <FormControlLabel
    value="manager"
    control={<Radio
      sx={{
        color: "white", // default (unselected) color
        '&.Mui-checked': {
          color: '#A87F0B', // color when selected
        },
      }}
    />
     }
    label={
      <Typography
        sx={{
          color: "white",
          backgroundColor: "transparent",
          px: 1,
          borderRadius: 1,
        }}
      >
        Manager
      </Typography>
    }
    sx={{ backgroundColor: "transparent", borderRadius: 1, px: 1 }}
  />
  <FormControlLabel
  value="user"
  control={<Radio
    sx={{
      color: "white", // default (unselected) color
      '&.Mui-checked': {
        color: '#A87F0B', // color when selected
      },
    }}
  />
   }
  label={
    <Typography
      sx={{
        color: "white",
        backgroundColor: "transparent",
        px: 1,
        borderRadius: 1,
      }}
    >
      User
    </Typography>
  }
  sx={{ backgroundColor: "transparent", borderRadius: 1, px: 1 }}
/>
</RadioGroup>


          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                marginRight: 4,
                width: "150px",
                height: "40px",
                "&:hover": { backgroundColor: "#ffffff75" },
              }}
            >
              Cancel
            </Button>
            <Button
            disabled={btnLoader}
              onClick={edit ? handleEditRole : handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#B08C2A",
                width: "150px",
                height: "40px",
                "&:hover": { backgroundColor: "#8D6E1F" },
              }}
            >
            {btnLoader ? (
              <ClipLoader
              size={23}
            
          color='#ffffff'
              className=" mt-[1px] text-white"
            />
            ) : (
              action === "edit" ? "Update" : "Save"
            )}
            
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateRole;
