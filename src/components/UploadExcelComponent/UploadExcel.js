
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import TableComponent from "../TableComponent/TableComponent";

const UploadExcel = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [refreshData,setRefreshData]=useState(false)
  const [deletedColumns,setDeletedColumns]=useState(null)

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

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile) {
      uploadFile(excelFile); 
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://localhost:8000/api/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully", response.data);
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      // setExcelData(data.slice(0, 10)); // Set the data for the table
      setRefreshData(!refreshData)
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {setExcelData(response.data.records);setDeletedColumns(response.data.deleted_columns)})
      .catch((error) => console.log("error", error));
      setRefreshData(false)
  }, [refreshData]);

  // const handleAddRow = () => {
  //   if (excelData) {
  //     const newRow = {};
  //     Object.keys(excelData[0]).forEach((key) => {
  //       newRow[key] = "";
  //     });
  //     setExcelData([...excelData, newRow]);
  //   }
  // };

  const refreshDataHandler=(data)=>{
    setRefreshData(!refreshData)

  }
  const addNewRowHandler = (data) => {
    axios
      .post(`http://localhost:8000//api/create_or_update_record/`,data)
      .then((response) => refreshDataHandler(true))
      .catch((error) => console.log("error", error));
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
              sx={{
                maxHeight: "30px",
                marginLeft: "20px",
                backgroundColor: "grey",
              }}
            >
              UPLOAD
            </Button>
            {typeError && <Box>{typeError}</Box>}
          </form>
        </Box>
      </Box>
      {excelData?.length>0 ? (
        <Box>
          <TableComponent
           excelData={excelData} setExcelData={setExcelData} 
           refreshDataHandler={refreshDataHandler}
           deletedColumns={deletedColumns}
           />
          {/* <Button
            onClick={handleAddRow}
            variant="contained"
            sx={{
              maxHeight: "30px",
              margin: "30px 0px 100px 0px",
              alignContent: "center",
              left: "50%",
              backgroundColor: "grey",
            }}
          >
            Add New Row
          </Button> */}
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

