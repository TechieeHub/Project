import { Box, Button, Modal, Typography } from "@mui/material";

const ConfirmModal = ({ open, handleClose, handleConfirm,title,data }) => {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Confirm Action
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {title}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="primary"
            //   onClick={()=>handleClose()}
            onClick={() => handleConfirm(false, data)}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
            //   onClick={()=>handleConfirm(true)}
            onClick={() => handleConfirm(true, data)}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };


  export default ConfirmModal
  