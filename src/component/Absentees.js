import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Urlconstant } from "../constant/Urlconstant";
import { useSelector } from "react-redux";

const Absentees = () => {
  const email = useSelector(state => state.loginDetiles.email)
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reasons, setReasons] = useState({});
  const [errors, setErrors] = useState({});
  const [batchDropdown, setBatchDropdown] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [isSubmitBatch, setSubmitBatch] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isTraineePresent, setIsTraineePresent] = useState(true);
  const [totalClass, setTotalClass] = useState(0);
  const [submittingAttendance, setSubmittingAttendance] = useState(false);
  const [updatingBatchAttendance, setUpdatingBatchAttendance] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      getBatchAttendanceCount();
    }
  }, [selectedBatch]);

  function getBatchAttendanceCount() {
    axios
      .get(
        Urlconstant.url + `api/attendance/getBatchAttendanceCount?courseName=${selectedBatch}`
      )
      .then((response) => {
        const batchAttendanceData = response.data;
        const key = Object.keys(batchAttendanceData)[0];
        const value = batchAttendanceData[key];
        setTotalClass(key);
        setSubmitBatch(value);
      })
      .catch((error) => {
        console.error("Error fetching batch attendance count:", error);
      });
  }

  const handleStudentChange = (event, value) => {
    setSuccessMessage("");
    setErrorMessage("");
    if (value && !selectedStudents.some((student) => student.id === value.id)) {
      setSelectedStudents([...selectedStudents, value]);
      setReasons({ ...reasons, [value.id]: "" });
      setErrors({ ...errors, [value.id]: "" });
      setSubmitDisabled(true);
    }
    
  };
  

  const handleBatchChange = (event) => {
    const selectedBatchValue = event.target.value;
    setSelectedBatch(selectedBatchValue);
    setSelectedStudent(null);
    setReasons({});
    setErrors({});
    setSelectedStudents([]);
    setSubmitDisabled(true);
    setSuccessMessage("")
    axios
      .get(
        Urlconstant.url + `api/attendance/trainee?batch=${selectedBatchValue}`
      )
      .then((response) => {
        const fetchedStudents = response.data;
       
      const sortedStudents = [...fetchedStudents].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
      setErrorMessage("");
      setStudents(sortedStudents);
      setStudentOptions(sortedStudents);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  };

  const handleReasonChange = (studentId, value) => {
    const updatedReasons = { ...reasons, [studentId]: value };
    setReasons(updatedReasons);
    if (value.length > 40) {
      setErrors({
        ...errors,
        [studentId]: "Reason should not exceed 40 characters",
      });
    } else if (value.length > 10) {
      setErrors({ ...errors, [studentId]: "" });
      const areAllReasonsValid = selectedStudents.every(
        (student) => student.id === studentId ? value.length > 8 : reasons[student.id]?.length > 8
      );
      setSubmitDisabled(!areAllReasonsValid);
    } else {
      setErrors({ ...errors, [studentId]: "Reason should be at least 8 characters" });
      setSubmitDisabled(true);
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

  const handleUpdateBatchAttendance = () => {
    setIsTraineePresent(true);
    setUpdatingBatchAttendance(true);
    axios
      .post(
        Urlconstant.url +
        `api/attendance/batchAttendance?courseName=${selectedBatch}&batchAttendanceStatus=${isTraineePresent}`
      )
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.data === "Batch Attendance Update successfully") {
          setSuccessMessage(response.data);
          getBatchAttendanceCount();
          handleBatchChange(selectedBatch);
        } else {
          setErrorMessage(response.data);
          getBatchAttendanceCount();
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      })
      .finally(() => {
        setUpdatingBatchAttendance(false);
      });
  };

  const handleAttendanceSubmit = () => {
    const validationErrors = {};
    let isAllReasonsProvided = true;

    Object.keys(reasons).forEach((studentId) => {
      if (reasons[studentId].trim() === "") {
        validationErrors[studentId] = "Reason should not be empty";
        isAllReasonsProvided = false;
      }
    });
    setErrors(validationErrors);

    if (isAllReasonsProvided) {
      setSubmittingAttendance(true);
      const attendanceData = selectedStudents.map((student) => ({
        id: student.id,
        name: student.name,
        reason: reasons[student.id] || "",
        updatedBy: email,
      }));

      axios
        .post(
          Urlconstant.url +
          `api/attendance/absentees?batch=${selectedBatch}`,
          attendanceData
        )
        .then((response) => {
          console.log("API Response:", response.data);
          setSelectedStudents([]);
          setReasons({});
          setErrors({});
          getBatchAttendanceCount();
          handleBatchChange({ target: { value: selectedBatch } });
          setSuccessMessage("Attendance submitted successfully!");

        })
        .catch((error) => {
          console.error("API Error:", error);
        })
        .finally(() => {
          setSubmittingAttendance(false);
        });
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "100px",
      justifyContent: "center",
      minHeight: "70vh",
    },
    form: {
      maxWidth: 450,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    reasonsColumn: {
      height: "200px",
      overflowY: "auto",
    },
    successMessage: {
      color: "green",
      marginTop: "10px",
    },
    errorMessage: {
      color: "red",
      marginTop: "10px",
    },
    toggleContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "-25px",
    },
    totalClassContainer: {
      marginLeft: "270px",
      marginTop: "-1.7rem"
      ,
    },
    totalClassCircle: {
      display: "inline-block",
      marginRight: "800px",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#e0e0e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      lineHeight: "40px",
    },
    formFields: {
      display: "flex",
      flexDirection: "column",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <div style={styles.formFields}>
          <h1> Absentees Form </h1>{" "}
          {successMessage && (
            <div style={styles.successMessage}> {successMessage} </div>
          )}{" "}
          {errorMessage && (
            <div style={styles.errorMessage}> {errorMessage} </div>
          )}
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
              ))}
            </Select>{" "}

            <h5>
              TotalClass :
              <div style={styles.totalClassContainer}>
                <div style={styles.totalClassCircle}>
                  <p>{totalClass}</p>
                </div>
              </div>
            </h5>
          </FormControl>
          {selectedBatch && (
            <div>
              <div style={styles.toggleContainer}>
                <h3> Trainee Attendance: </h3>{" "}
                <Button
                  disabled={isSubmitBatch || updatingBatchAttendance}
                  variant={isTraineePresent ? "contained" : "outlined"}
                  color="primary"
                  onClick={handleUpdateBatchAttendance}
                >
                  {updatingBatchAttendance ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Yes"
                  )}
                </Button>{" "}
              </div>{" "}
              <h3> Select Students: </h3>{" "}
              <Autocomplete
                options={studentOptions}
                getOptionLabel={(option) => `${option.name} - ${option.email}`}
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
            disabled={!selectedBatch || isSubmitDisabled || submittingAttendance}
          >
            {submittingAttendance ? (
              <CircularProgress size={24} />
            ) : (
              "Submit Attendance"
            )}
          </Button>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default Absentees;
