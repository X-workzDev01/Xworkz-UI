import { Alert, Button, Dialog, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material"
import { GridCloseIcon } from "@mui/x-data-grid";
import { Urlconstant } from "../constant/Urlconstant";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from 'papaparse';

function generateYearsArray() {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = 2010; year <= currentYear; year++) {
        yearsArray.push(year);
    }
    return yearsArray;
}
const ExportData = ({ open, handleClose }) => {

    const [dropdown, setDropDown] = React.useState({
        course: [],
        qualification: [],
        batch: [],
        stream: [],
        college: [],
    });
    const offeredState = ["CSR Offered",
        "Non-CSR Offered",
        "General",
        "College Referral",
        "Trainer Referral",
        "Trainee Referral",
        "HR Team Referral",
        "Team Referral"];

    const [years, setYears] = useState([new Date().getFullYear()]);
    const [collegeName, setCollegeName] = useState(null);
    const [yearOfPassout, setYearOfPassout] = useState(null);
    const [offeredAs, setOfferedAs] = useState(null);
    const [error, setError] = React.useState("");
    const [courseName, setCourseName] = React.useState(null);
    const [courseDetails,setCourseDetails]=React.useState([]);
    React.useEffect(() => {
        getDropdown();
        setError("");
        getActiveCourse();
        setYears(generateYearsArray());
        const interval = setInterval(() => {
            const newYear = new Date().getFullYear();
            if (!years.includes(newYear)) {
                setYears([...years, newYear]);
            }
        }, 1000); // Update every second, change as needed

        return () => clearInterval(interval);
    }, []);



    const getActiveCourse=()=>{
        axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })

      .then((res) => {
        setCourseDetails(res.data);
      })
      .catch((e) => {});
    }
    const getDropdown = () => {
        axios
            .get(Urlconstant.url + "utils/dropdown", {
                headers: {
                    spreadsheetId: Urlconstant.spreadsheetId,
                },
            })
            .then((response) => {
                setDropDown(response.data);
            })
            .catch((error) => { });
    }

    const handleDataClick = () => {
        const encodedCollegeName = encodeURIComponent(collegeName);
        axios.get(Urlconstant.url + `export/getFilteredData?collegeName=${encodedCollegeName}&offeredAs=${offeredAs}&yearOfPass=${yearOfPassout}&courseName=${courseName}`)
            .then((response) => {
                const csvData = Papa.unparse(response.data);
                const blob = new Blob([csvData], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'X-workz.csv';
                link.click();
                handleClose();
            })
            .catch((error) => {
                setError("Error exporting data:");
            });
    };
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Download Here</DialogTitle>
            <IconButton
                color="inherit"
                onClick={handleClose}
                edge="start"
                aria-label="close"
                style={{ position: "absolute", right: "8px", top: "8px" }}
            >
                <GridCloseIcon />
            </IconButton>
            {error ? <Alert severity="error">{error}</Alert> : " "}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">College Name</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="College Name"
                        name="collegeName"
                        value={collegeName}
                        required
                        variant="outlined"
                        sx={{
                            marginRight: "10px",
                            width: "200px",
                            fontSize: "12px",
                        }}
                        onChange={(e) => setCollegeName(e.target.value)}
                    >
                        <MenuItem value={null} > Select College </MenuItem>
                        {dropdown.college.map((item, index) => (
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Year </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Year"
                        name="yearOfPassout"
                        value={yearOfPassout}
                        required
                        variant="outlined"
                        sx={{
                            marginRight: "10px",
                            width: "200px",
                            fontSize: "12px",
                        }}
                        onChange={(e) => setYearOfPassout(e.target.value)}
                    >
                        <MenuItem value={null} > Select year </MenuItem>
                        {years.map((item, index) => (
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">offered As </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Offered As"
                        name="offeredAs"
                        value={offeredAs}
                        required
                        variant="outlined"
                        sx={{
                            marginRight: "10px",
                            width: "200px",
                            fontSize: "12px",
                        }}
                        onChange={(e) => setOfferedAs(e.target.value)}
                    >
                        <MenuItem value={null} > Select OfferedAs </MenuItem>
                        {offeredState.map((item, index) => (
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Course </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Course Name"
                        name="courseName"
                        value={courseName}
                        required
                        variant="outlined"
                        sx={{
                            marginRight: "10px",
                            width: "200px",
                            fontSize: "12px",
                        }}
                        onChange={(e) => setCourseName(e.target.value)}
                    >
                        <MenuItem value={null} > Select Course  </MenuItem>
                        {courseDetails.map((item, index) => (
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div style={{ paddingLeft: "400px" }}>
                <Button variant="contained" color="primary" onClick={handleDataClick}>Export</Button>
            </div>

        </Dialog>
    )
}
export default ExportData;