import React, { useEffect, useMemo, useState } from "react";
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
  const [componentData,setComponentData]=useState(null)
  const [deletedColumns, setDeletedColumns] = useState(null);

  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(
    localStorage.getItem("anomalyDataValue")
      ? parseInt(localStorage.getItem("anomalyDataValue"), 10)
      : 10
  );
  const excelData = useSelector((state) => state.excel.filteredData)?.filter(
    (data) => data.is_deleted !== true
  );
  const anamolyValue = useSelector((state) => state.excel.anomalyValue);
  const anomalyDataValue = anamolyValue ? anamolyValue : sliderValue;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        dispatch(setTableData(response.data.records));
        setInitialChartData(response.data.records);
        setDeletedColumns(response.data.deleted_columns);
        setComponentData(response.data.records)
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
  const convertToNumber = (str) => {
    if (str == null) return 0;
    const cleanedStr = String(str).replace(/[^0-9.-]+/g, "");
    const number = parseFloat(cleanedStr);
    return isNaN(number) ? 0 : number;
  };
  // const calculateColumns = (data) => {
  //   const activeColumns = Object.keys(componentData[0] || {}).filter(
  //     (key) => !deletedColumns?.includes(key) && key.startsWith("EODBalance")
  //   );

  //   return data?.map((row) => {
  //     const projectedBalance =
  //       convertToNumber(row["Available Balance"] || 0) -
  //       convertToNumber(row["Scheduled Out Balance"] || 0);

  //     const total = activeColumns.reduce(
  //       (sum, columnKey) => sum + convertToNumber(row[columnKey] || 0),
  //       0
  //     );
  //     const average5Day =
  //       activeColumns.length > 0 ? total / activeColumns.length : 0;

  //     const deviation5DayToday =
  //       average5Day === 0
  //         ? 0
  //         : ((projectedBalance - average5Day) / average5Day) * 100;

  //     return {
  //       ...row,
  //       "Projected Balance": projectedBalance,
  //       "5-Day average": Math.round(average5Day * 100) / 100,
  //       "5-Day Deviation": isNaN(deviation5DayToday)
  //         ? 0
  //         : Math.round(deviation5DayToday * 100) / 100,
  //       Anomaly:
  //         deviation5DayToday < 0
  //           ? "EOD Balance less than 5 day average end of day balance"
  //           : deviation5DayToday > anomalyDataValue
  //           ? `EOD balance more than 5 day average end of day balance by ${anomalyDataValue}%`
  //           : "",
  //     };
  //   });
  // };


  const calculateColumns = (data) => {
    if (!componentData || componentData.length === 0) return [];
  
    const activeColumns = Object.keys(componentData[0] || {}).filter(
      (key) => !(deletedColumns || []).includes(key) && key.startsWith("EODBalance")
    );
  
    return data?.map((row) => {
      const projectedBalance =
        convertToNumber(row["Available Balance"] || 0) -
        convertToNumber(row["Scheduled Out Balance"] || 0);
  
      const total = activeColumns.reduce(
        (sum, columnKey) => sum + convertToNumber(row[columnKey] || 0),
        0
      );
      const average5Day =
        activeColumns.length > 0 ? total / activeColumns.length : 0;
  
      const deviation5DayToday =
        average5Day === 0
          ? 0
          : ((projectedBalance - average5Day) / average5Day) * 100;
  
      return {
        ...row,
        "Projected Balance": projectedBalance,
        "5-Day average": Math.round(average5Day * 100) / 100,
        "5-Day Deviation": isNaN(deviation5DayToday)
          ? 0
          : Math.round(deviation5DayToday * 100) / 100,
        Anomaly:
          deviation5DayToday < 0
            ? "EOD Balance less than 5 day average end of day balance"
            : deviation5DayToday > anomalyDataValue
            ? `EOD balance more than 5 day average end of day balance by ${anomalyDataValue}%`
            : "",
      };
    });
  };
  
  const updatedExcelData = useMemo(
    () => calculateColumns(componentData),
    [componentData, anomalyDataValue]
  );
  const filteredData = useMemo(
    () => updatedExcelData?.filter((row) => !row.is_deleted),
    [componentData, anomalyDataValue]
  );

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
            <VisualizationComponent  data={filteredData} onView={handleView} onChartTitleChange={handleChartTitleChange} />
            <AnomalieComponent data={filteredData} onView={handleView} onChartTitleChange={handleChartTitleChange} />
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
              initialChartData?.length > 0 && <ChartComponent data={filteredData} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChartData;
