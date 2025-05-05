import React from "react";
import { Box, Modal, Typography, Button, CircularProgress } from "@mui/material";

const AlertModal = ({ open, handleClose, title, onConfirm, btnloader }) => {
  return (
    <Modal open={open} onClose={handleClose}>
     
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#222222",
          border: "1px solid #ffffff26",
          boxShadow: 24,
          borderRadius: "12px",
          p: 4,
          width: "90%",
          maxWidth: "420px",
          textAlign: "center",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Alert Message */}
        <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500", mb: 3 }}>
          {title}
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleClose}
            disabled={btnloader}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "#ffffff40",
              width: "110px",
              height: "42px",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "#ffffff20" },
              "&:focus": { outline: "none", ring: "2px solid gray" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={btnloader}
            variant="contained"
            sx={{
              width: "110px",
              height: "42px",
              fontSize: "14px",
              fontWeight: "600",
              backgroundColor: "#a87f0b",
              boxShadow: "lg",
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "#c29010" },
              "&:focus": { outline: "none", ring: "2px solid yellow" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {btnloader ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Confirm"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AlertModal;
