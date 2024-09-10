import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import VisualizationComponent from "./VisualizationComponent";
import AnomalieComponent from "./AnomalieComponent";
import ChartComponent from "./ChartComponent";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTableData } from "../../Store/excelSlice";
import UploadExcel from "../UploadExcelComponent/UploadExcel";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ChartData = () => {
  const [filteredChartData, setFilteredChartData] = useState(null);
  const [initialChartData, setInitialChartData] = useState(null);
  const [chartTitle, setChartTitle] = useState("Account Balance");

  const dispatch = useDispatch();
  const excelData = useSelector((state) => state.excel.filteredData)?.filter(
    (data) => data.is_deleted !== true
  );

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        dispatch(setTableData(response.data.records));
        setInitialChartData(response.data.records);
      })
      .catch((error) => console.log("error", error));
  }, [dispatch]);

  const handleView = (data) => {
    setFilteredChartData(data);
  };

  const handleChartTitleChange = (title) => {
    setChartTitle(title);
  };

  const handleExport = () => {
    const input = document.getElementById("contentToExport");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfWidth * imgHeight / imgWidth);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfWidth * imgHeight / imgWidth);
        heightLeft -= pdfHeight;
      }

      pdf.save('exported-file.pdf');
    });
  };

  return (
    <>
      <UploadExcel />
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: '1%'
          }}
        >
          <Button
            variant="contained"
            sx={{
              marginTop: "30px",
              backgroundColor: "grey",
              width: "12%",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Roboto',
              '& .button-text': {
                display: 'inline',
                marginLeft: '8px', 
              },
              '&:hover .button-text': {
                display: 'none',
              },
            }}
            onClick={handleExport}
          >
            <PictureAsPdfIcon />
            <span className="button-text">Export to PDF</span>
          </Button>
        </Box>
        <Box id={"contentToExport"}>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              marginLeft: "5px",
              marginRight: "5px",
              padding: "0.5rem",
            }}
          >
            <VisualizationComponent onView={handleView} onChartTitleChange={handleChartTitleChange} />
            <AnomalieComponent onView={handleView} onChartTitleChange={handleChartTitleChange} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              marginTop: "30px",
            }}
          >
            <h2>{chartTitle}</h2>
            {filteredChartData?.length > 0 ? (
              <ChartComponent data={filteredChartData} />
            ) : (
              initialChartData?.length > 0 && <ChartComponent data={excelData} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChartData;
