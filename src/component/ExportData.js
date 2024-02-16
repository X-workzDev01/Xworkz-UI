import { Alert, Button, CircularProgress, Dialog, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material"
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
    const [courseDetails, setCourseDetails] = React.useState([]);
    const [loading, setLoading] = useState(false);

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



    const getActiveCourse = () => {
        setError("");
        axios
            .get(Urlconstant.url + "api/getCourseName?status=Active", {
                headers: {
                    spreadsheetId: Urlconstant.spreadsheetId,
                },
            })

            .then((res) => {
                setCourseDetails(res.data);
            })
            .catch((e) => { });
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
        setLoading(true);
        const encodedCollegeName = encodeURIComponent(collegeName);
        axios.get(Urlconstant.url + `export/getFilteredData?collegeName=${encodedCollegeName}&offeredAs=${offeredAs}&yearOfPass=${yearOfPassout}&courseName=${courseName}`)
            .then((response) => {
                const csvData = Papa.unparse(response.data);
                const blob = new Blob([csvData], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'X-workz.csv';
                link.click();
                setLoading(false);
                handleClose();
            })
            .catch((error) => {
                setError("Error exporting data:");
                setLoading(false);
            });
    };
    const handleCollegeChange = (event) => {
        const collegeName = event.target.value;
        setCollegeName(collegeName);
    }
    const handleYearOfPass = (event) => {
        const yearOFPass = event.target.value;
        setYearOfPassout(yearOfPassout);
    }
    const handleOfferedAs = (event) => {
        const offeredAs = event.target.value;
        setOfferedAs(offeredAs)
    }
    const handleCourseChange = (event) => {
        const courseName = event.target.value;
        setCollegeName(courseName);
    }
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
                <FormControl fullWidth>
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
                        onChange={handleCollegeChange}
                    >
                        <MenuItem value={null} > Select College </MenuItem>
                        {dropdown.college.map((item, index) => (
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
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
                        onChange={handleYearOfPass}
                    >
                        <MenuItem value={null} > Select year </MenuItem>
                        {years.map((item, index) => (
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
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
                        onChange={handleOfferedAs}
                    >
                        <MenuItem value={null} > Select OfferedAs </MenuItem>
                        {offeredState.map((item, index) => (
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
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
                        onChange={handleCourseChange}
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
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <Button variant="contained" color="primary" onClick={handleDataClick}>
                    {loading ? <CircularProgress size={24} /> : "Export"}
                </Button>
            </div>

        </Dialog>
    )
}
export default ExportData;