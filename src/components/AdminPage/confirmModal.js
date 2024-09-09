import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmModal = ({ open, handleClose, handleConfirm }) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <Box sx={modalStyle}>
        <Typography id="confirm-dialog-title" variant="h6" component="h2">
          Confirm Action
        </Typography>
        <Typography id="confirm-dialog-description" sx={{ mt: 2 }}>
          Are you sure you want to proceed?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
          }}
        >
          <Button onClick={handleClose} variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
