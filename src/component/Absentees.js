import React, { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import { Urlconstant } from "../constant/Urlconstant";
import axios from "axios";
import Switch from "@mui/material/Switch";

const batches = [
  { value: "batch1", label: "Batch 1" },
  { value: "batch2", label: "Batch 2" },
];

const Absentees = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reasons, setReasons] = useState({});
  const [errors, setErrors] = useState({});
  const [batchDropdown, setBatchDropdown] = useState([]);
  const [students, setStudents] = useState([]);
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isTraineePresent, setIsTraineePresent] = useState(true);
  useEffect(() => {
    // Fetch batch data
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        setBatchDropdown(response.data);
      })
      .catch((error) => {
        console.error("Error fetching batch data:", error);
      });
  }, []); // Run only once when the component mounts

  const handleStudentChange = (event, value) => {
    if (value && !selectedStudents.some((student) => student.id === value.id)) {
      setSelectedStudents([...selectedStudents, value]);
      setReasons({ ...reasons, [value.id]: "" });
      setErrors({ ...errors, [value.id]: "" });
    }
  };
  const handleBatchChange = (event) => {
    const selectedBatchValue = event.target.value;
    setSelectedBatch(selectedBatchValue);
    setSelectedStudent(null);
    setReasons({});
    setErrors({});
    setSelectedStudents([]);

    // Fetch student data based on the selected batch
    axios
      .get(
        Urlconstant.url + `api/attendance/trainee?batch=${selectedBatchValue}`
      )
      .then((response) => {
        // Assuming your API response contains an array of student data similar to the 'students' array
        const fetchedStudents = response.data;
        setSuccessMessage("");
        // Update the 'students' state with the fetched data
        setStudents(fetchedStudents);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  };

  const handleReasonChange = (studentId, value) => {
    const updatedReasons = { ...reasons, [studentId]: value };
    setReasons(updatedReasons);

    // Validate reason field
    if (value.length > 20) {
      setErrors({
        ...errors,
        [studentId]: "Reason should not exceed 10 characters",
      });
    } else {
      setErrors({ ...errors, [studentId]: "" });
    }
  };

  const handleCancelReason = (studentId) => {
    const updatedStudents = selectedStudents.filter(
      (student) => student.id !== studentId
    );
    const updatedReasons = { ...reasons };
    const updatedErrors = { ...errors };
    delete updatedReasons[studentId];
    delete updatedErrors[studentId];

    setSelectedStudents(updatedStudents);
    setReasons(updatedReasons);
    setErrors(updatedErrors);
  };

  const handleUpdateAttendance = () => {
    // Simulated API call to update attendance for the entire batch
    const updatedAttendanceData = {
      batch: selectedBatch,
      isPresent: isTraineePresent,
    };

    axios
      .post(
        Urlconstant.url + "api/updateBatchAttendance",
        updatedAttendanceData
      )
      .then((response) => {
        console.log("API Response:", response.data);

        // Set success message
        setSuccessMessage("Attendance updated successfully!");
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const handleAttendanceSubmit = () => {
    // Validate all reason fields before submitting
    const validationErrors = {};
    Object.keys(reasons).forEach((studentId) => {
      if (reasons[studentId].trim() === "") {
        validationErrors[studentId] = "Reason should not be empty";
      }
    });
    setErrors(validationErrors);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with the API call
      const attendanceData = selectedStudents.map((student) => ({
        id: student.id,
        name: student.name,
        reason: reasons[student.id] || "",
        updatedBy: sessionStorage.getItem("userId"),
      }));
      const jsonData = JSON.stringify(attendanceData);
      // Make an API call using the Urlconstant
      axios
        .post(
          Urlconstant.url + `api/attendance/absentees?batch=${selectedBatch}`,
          attendanceData
        )
        .then((response) => {
          console.log("API Response:", response.data);

          setSuccessMessage("Attendance submitted successfully!");
          // Reset state after successful submission
          setSelectedStudents([]);
          setReasons({});
          setErrors({});
        })
        .catch((error) => {
          console.error("API Error:", error);
          // Handle error if needed
        });
    }
  };
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "70vh", // Use minHeight instead of height
    },
    form: {
      maxWidth: 450,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    reasonsColumn: {
      height: "200px", // Set a fixed height for the reasons column
      overflowY: "auto", // Add scroll if the content exceeds the height
    },
    successMessage: {
      color: "green",
      marginTop: "10px",
    },
    toggleContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2> Absentees Form </h2>{" "}
        {successMessage && (
          <div style={styles.successMessage}> {successMessage} </div>
        )}{" "}
        <FormControl style={{ minWidth: 200, marginBottom: 16 }}>
          <InputLabel> Select Batch </InputLabel>{" "}
          <Select
            value={selectedBatch}
            onChange={handleBatchChange}
            label="Select Batch"
          >
            {" "}
            {batchDropdown.map((batch, index) => (
              <MenuItem key={index} value={batch}>
                {" "}
                {batch}{" "}
              </MenuItem>
            ))}{" "}
          </Select>{" "}
        </FormControl>
        {selectedBatch && (
          <div>
            <div style={styles.toggleContainer}>
              <h3> Trainee Attendance: </h3>{" "}
              <Button
                variant={isTraineePresent ? "contained" : "outlined"}
                color="primary"
                onClick={() => setIsTraineePresent(true)}
              >
                Yes{" "}
              </Button>{" "}
              <Button
                variant={!isTraineePresent ? "contained" : "outlined"}
                color="primary"
                onClick={() => setIsTraineePresent(false)}
              >
                No{" "}
              </Button>{" "}
            </div>{" "}
            <h3> Select Students: </h3>{" "}
            <Autocomplete
              options={students}
              getOptionLabel={(option) => option.name}
              value={selectedStudent}
              onChange={handleStudentChange}
              renderInput={(params) => (
                <TextField {...params} label="Select Student" />
              )}
              clearOnBlur
            />
            {selectedStudents.length > 0 && (
              <div style={styles.reasonsColumn}>
                <h3> Reasons: </h3>{" "}
                <List>
                  {" "}
                  {selectedStudents.map((student) => (
                    <ListItem key={student.id}>
                      <TextField
                        type="text"
                        label={`${student.name}`}
                        value={reasons[student.id] || ""}
                        onChange={(e) =>
                          handleReasonChange(student.id, e.target.value)
                        }
                        error={errors[student.id] !== ""}
                        helperText={errors[student.id]}
                      />{" "}
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleCancelReason(student.id)}
                      >
                        Cancel{" "}
                      </Button>{" "}
                    </ListItem>
                  ))}{" "}
                </List>{" "}
              </div>
            )}{" "}
          </div>
        )}{" "}
        <Button
          variant="contained"
          onClick={handleAttendanceSubmit}
          disabled={isSubmitDisabled}
        >
          Submit Attendance{" "}
        </Button>{" "}
      </div>{" "}
    </div>
  );
};

export default Absentees;
