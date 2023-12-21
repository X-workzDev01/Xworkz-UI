import {
  Button,
  MenuItem,
  Select,
  TextField,
  Container,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Form } from "react-bootstrap";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";
import { useLocation } from "react-router-dom";



export const Course = ({ dropdown, formData, setFormData, onNext, onPrevious,batchDetiles }) => {
 const [selectedValue, setSelectedValue] = useState(' ');


  const location = useLocation();

  const email = location.state && location.state.email;

  useEffect(() => {
    if (selectedValue) {
      fetchData();
    }
  }, [selectedValue]);
  const fetchData = async () => {
    try {

      console.log("course" + selectedValue);
      const response = await axios.get(
        Urlconstant.url + `api/getCourseDetails?courseName=${selectedValue}`,
        { headers: { spreadsheetId: Urlconstant.spreadsheetId } }
      );
      const data = await response.data;
      console.log(data.courseName);

      // Update the formData state with fetched data
      setFormData({
        branch: data.branch,
        trainerName: data.trainerName,
        batchType: data.batchType,
        course: data.courseName,
        batchTiming: data.timing,
        startDate: data.startDate,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSelectedValue(e.target.value);
  };

  const setSelect = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };


  const isDisabled = !formData.course || !formData.offeredAs;

  return (
    <Container maxWidth="sm">
      <h2>Course Details</h2>
      <Typography component="div" style={{ height: "50vh" }}>
        <InputLabel id="demo-simple-select-label">Course</InputLabel>
        <Form>
          <Select
            name="course"
            value={formData.course}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
            onChange={handleInputChange}
            >
            {batchDetiles.map((item, index) => (

              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>

          <InputLabel id="demo-simple-select-label">Branch</InputLabel>
          <TextField
            name="branch"
            value={formData.branch}
            required
            aria-readonly
            fullWidth
            onBlur={setSelect}
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          ></TextField>
          <InputLabel id="demo-simple-select-label">Trainer Name</InputLabel>
          <TextField
            name="trainerName"
            value={formData.trainerName}
            required
            onBlur={setSelect}
            aria-readonly
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          ></TextField>
          <InputLabel id="demo-simple-select-label">Batch Type </InputLabel>

          <TextField
            name="batchType"
            onBlur={setSelect}
            value={formData.batchType}
            required
            aria-readonly
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          ></TextField>
          <InputLabel id="demo-simple-select-label">Batch Timing </InputLabel>

          <TextField
            name="batchTiming"
            onBlur={setSelect}
            value={formData.batchTiming}
            required
            aria-readonly
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          ></TextField>
          <InputLabel id="demo-simple-select-label">
            Start date
          </InputLabel>

          <TextField
            name="startTime"
            aria-readonly
            onBlur={setSelect}
            value={formData.startDate}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />
          <InputLabel id="demo-simple-select-label">Offered As</InputLabel>
          <Select
            name="offeredAs"
            value={formData.offeredAs || ""}
            onChange={setSelect}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          >
            {dropdown.offered.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Form>
        <Button
          style={{ marginTop: "20px" }}
          variant="contained"
          onClick={onPrevious}
        >
          Previous
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button
          style={{ marginTop: "20px" }}
          variant="contained"
          disabled={isDisabled}
          onClick={onNext}
        >
          Next
        </Button>
      </Typography>
    </Container>
  );
};

export default Course;
