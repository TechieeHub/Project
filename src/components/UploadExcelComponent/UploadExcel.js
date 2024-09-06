import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import TableComponent from "../TableComponent/TableComponent";
import { useDispatch } from "react-redux";
import { setTableData } from "../../Store/excelSlice";
import { useLocation } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';

const UploadExcel = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [deletedColumns, setDeletedColumns] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  // console.log('lkjancdjhdaic',location?.pathname==='/admin)
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
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setRefreshData(!refreshData);
      window.location.reload(); // to reload the page
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        setExcelData(response.data.records);
        setDeletedColumns(response.data.deleted_columns);
        dispatch(setTableData(response.data.records));
      })
      .catch((error) => console.log("error", error));
    setRefreshData(false);
  }, [refreshData, dispatch]);

  const refreshDataHandler = (data) => {
    setRefreshData(!refreshData);
  };

  return (
    <Box sx={{margin:'1rem'}}>
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
      < Typography sx={{ color:"white", fontSize: "10px" }}>Note: You can upload only one document</Typography>
      </Box>
        </Box>
      </Box>
     
      {excelData?.length > 0 ? (
        <Box>
          <TableComponent
            excelData={excelData}
            setExcelData={setExcelData}
            refreshDataHandler={refreshDataHandler}
            deletedColumns={deletedColumns}
            location={location}
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
