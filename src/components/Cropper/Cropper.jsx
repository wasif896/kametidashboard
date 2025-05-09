import React from "react";
import { Box, Modal, Button, Typography } from "@mui/material";
import { ReactCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Cropper = ({
  cropModal,
  handleclosecropper,
  theimg,
  myimg,
  setmyimg,
  setcrop,
  crop,
  aspect,
  setReduxState,
  isCircle,
}) => {
  const getProfileCropImage = async () => {


    const canvas = document.createElement("canvas");
    const scaleX = myimg.naturalWidth / myimg.width;
    const scaleY = myimg.naturalHeight / myimg.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      myimg,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width / pixelRatio,
      canvas.height / pixelRatio
    );

    canvas.toBlob(
      (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Image = reader.result;
          setReduxState(base64Image);
          handleclosecropper();
        };
      },
      "image/jpeg",
      1
    );
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
    bgcolor: "white",
    boxShadow: 24,
    borderRadius: "16px",
    overflow: "hidden",
  };

  const headerStyle = {
    background: "#B08C2A",
    color: "white",
    p: 2,
    textAlign: "center",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  };

  const cropperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    gap: "16px",
  };

  return (
    <Modal
      open={cropModal}
      onClose={handleclosecropper}
      aria-labelledby="crop-modal-title"
      aria-describedby="crop-modal-description"
    >
      <Box sx={modalStyle}>
        <Box sx={headerStyle}>
          <Typography variant="h6" id="crop-modal-title">
            Crop Your Image
          </Typography>
        </Box>
        <Box sx={cropperStyle}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setcrop(c)}
            circularCrop={isCircle}
            aspect={aspect}
            style={{
              maxHeight: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <img
              src={theimg}
              alt="Crop Preview"
              onLoad={(e) => setmyimg(e.target)}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                margin: "0 auto",
                display: "block",
              }}
            />
          </ReactCrop>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleclosecropper}
              sx={{
                flex: 1,
                borderColor: "#000",
                color: "#000",
                height: "35px",
                borderRadius: "5px",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={getProfileCropImage}
              sx={{
                flex: 1,
                background: "#B08C2A",
                "&:hover": { backgroundColor: "#a87f0b" },
                height: "35px",
                borderRadius: "5px",
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default Cropper;
