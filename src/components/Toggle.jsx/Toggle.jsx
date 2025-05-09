import React from 'react';
import styled from "@emotion/styled";
import { Switch } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';

// Styled component for the custom switch
const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 35,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    color: '#444343 !important',
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#A87F0B !important",
      background:"#F1E5FF",
      "& + .MuiSwitch-track": {
        backgroundColor: theme?.palette?.mode === "dark" ? "#F1E5FF" : "#F1E5FF",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme?.palette?.mode === "light" ? theme?.palette?.grey[100] : theme?.palette?.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme?.palette?.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 15,
    height:15,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme?.palette?.mode === "light" ? "#E9E9EA" : "#F1E5FF",
    opacity: 1,
    transition: theme?.transitions?.create(["background-color"], {
      duration: 500,
    }),
  },
}));

 function Toggle() {
 
  return (
    <>
    <div>
      <IOSSwitch/>
    </div>
  
    </>
  );
}
export default Toggle;