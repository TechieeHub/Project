import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import FileUploadIcon from '@mui/icons-material/FileUpload';

const UploadExcel = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        setExcelFile(selectedFile);
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (excelFile) {
      try {
        const formData = new FormData();
        formData.append("file", excelFile);
        await axios.post("http://localhost:8000/api/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        window.location.reload(); // reload after successful upload
      } catch (error) {
        console.error("Error uploading file", error);
      }
    }
  };

  return (
    <Box sx={{ margin: '1rem' }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "150px",
          backgroundColor: "#A9A9A9",
        }}
      >
        <Box>
          <Typography variant="h6">Upload the Excel here</Typography>
          <form onSubmit={handleFileSubmit}>
            <input type="file" required onChange={handleFile} />
            <Button
              type="submit"
              variant="contained"
              sx={{
                maxHeight: "30px",
                marginLeft: "20px",
                backgroundColor: "grey",
              }}
            >
              UPLOAD
              <FileUploadIcon sx={{ marginRight: "3px", fontSize: "20px" }} />
            </Button>
            {typeError && <Box>{typeError}</Box>}
          </form>
          <Box>
            <Typography sx={{ color: "white", fontSize: "10px" }}>Note: You can upload only one document</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadExcel;
