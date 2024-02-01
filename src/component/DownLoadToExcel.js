import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import Papa from "papaparse";
import React from "react";
import { Urlconstant } from "../constant/Urlconstant";

const DownLoadToExcel = () => {
  const offeredAs = [
    "CSR Offered",
    "Non-CSR Offered",
    "General",
    "College Referral",
    "Triner Referral",
    "Trinee Referral",
    "HR Team Referral",
    "Team Referral",
  ];
  const [details, setDetails] = React.useState();
  const [error, setError] = React.useState();

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    TraineeDetails(inputValue);
  };
  const TraineeDetails = (selectedInput) => {
    console.log(selectedInput);
    axios
      .get(Urlconstant.url + `api/csrdetails?offeredAs=${selectedInput}`)
      .then((response) => {
        if (response.data.length > 0) {
          setDetails(response.data);
        } else {
          setError("Not Found");
        }
      });
  };
  const handleDownLoadClick = () => {
    const csvData = Papa.unparse(details);
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "StudentData.csv";
    link.click();
  };

  return (
    <div>
      <div>
        <h1>Download Data</h1>
      </div>
      <div style={{ paddingLeft: "10px" }}>
        <InputLabel id="demo-simple-select-label">Select</InputLabel>
        <Select
          name="collegeName"
          placeholder="College Name"
          fullWidth
          required
          id="outlined-basic"
          variant="outlined"
          onChange={handleInputChange}
          style={{ height: "5vh", width: "50vh" }}
        >
          {offeredAs.map((item, index) => (
            <MenuItem value={item} key={index}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <Button variant="contained" onClick={handleDownLoadClick}>
          Download
        </Button>
      </div>
    </div>
  );
};
export default DownLoadToExcel;
