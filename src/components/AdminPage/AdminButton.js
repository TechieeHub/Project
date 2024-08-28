import { Box, Button } from '@mui/material'
import React from 'react'

const AdminButton = () => {

    const approveAllDeleteions=()=>{
        return;
    }
  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          maxHeight: "30px",
          marginLeft: "20px",
          marginTop: "30px",
          backgroundColor: "grey",
        }}
        onClick={()=>approveAllDeleteions()}
      >
        Approve All Deletions
      </Button>
    </Box>
  )
}

export default AdminButton
