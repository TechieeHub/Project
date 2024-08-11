import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import * as XLSX from "xlsx";
import TableComponent from "../TableComponent/TableComponent";

const UploadExcel = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
    }
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "150px",
          backgroundColor: "orange",
        }}
      >
        <Box>
          <Typography variant="h6">Upload & View Excel Sheets</Typography>
          <form onSubmit={handleFileSubmit}>
            <input type="file" required onChange={handleFile} />
            <Button
              type="submit"
              variant="contained"
              sx={{ maxHeight: "30px" }}
            >
              UPLOAD
            </Button>
            {typeError && <Box>{typeError}</Box>}
          </form>
        </Box>
      </Box>
      {excelData ? (
        <Box>
          <TableComponent data={excelData} />
          <Button
            // type="submit"
            variant="contained"
            sx={{
              maxHeight: "30px",
              margin: "30px 0px 100px 0px",
              alignContent: "center",
              left: "50%",
            }}
          >
            Add New Row
          </Button>
        </Box>
      ) : (
        <Box sx={{ height: "40px", background: "#D3D3D3", marginTop: "3px" }}>
          No File is uploaded yet!
        </Box>
      )}
    </Box>
  );
};
export default UploadExcel;
