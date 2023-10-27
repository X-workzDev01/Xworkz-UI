import React, { useState } from "react";
import { Urlconstant } from "../constant/Urlconstant";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import EditFollowUp from "./EditFollowUp";
import { Link } from "react-router-dom";
import { PersonOutline } from "@mui/icons-material";
import Course from "./Course";

export default function FollowUp() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("New");
  const [name, setName] = useState("status");
  const [courseName, setCourseName] = React.useState("");
  const [courseDropdown, setCourseDropdown] = React.useState("");
  const [status,setStatus] =React.useState("");
  const statusList=["Interested","RNR","Not Interested","Others"];
  const [dropdown, setDropDown] = useState({
    status: [],
  });

  const initialPageSize = 10;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0,
  });

  React.useEffect(() => {
    setLoading(true);
    searchServerRows(paginationModel.page, paginationModel.pageSize, name).then(
      (newGridData) => {
        setGridData(newGridData);
        setLoading(false);
      }
    );
  }, [paginationModel.page, paginationModel.pageSize, searchValue, name]);

  React.useEffect(() => {
    getDropDown();
    getActiveCourse();
  }, []);

  const getActiveCourse = () => {
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })

      .then((response) => {
        setCourseDropdown(response.data);
      })
      .catch((error) => { });
  }

  
  const handleCourseChange = (event) => {
    const courseValue = event.target.value;
    setCourseName(courseValue);

    if (status && courseValue) {
      getTraineeDetailsByCourseAndStatus(courseValue, status);
     }
     else if (courseValue) {
      getTraineeDetailsByCourse(courseValue);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValue(value);
    setName(name);
    setStatus(value)

    if (status && courseName) {
      getTraineeDetailsByCourseAndStatus(courseName, status);
    } else if (courseName) {
      getTraineeDetailsByCourse(courseName);
  }
}

  const getTraineeDetailsByCourseAndStatus = async (courseName, status) => {
    try {
      const apiUrl = Urlconstant.url + `api/getByCourseAndStatus?courseName=${courseName}&&status=${status}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      };
      const response = await axios.get(apiUrl, requestOptions);
      setGridData({
        rows: response.data.map((row) => ({
          id: row.id.toString(),
          ...row,
        })),
        rowCount: response.data.length,
      });
    } catch (error) {
      setGridData({ rows: [], rowCount: 0 });
    }
  };


  const getTraineeDetailsByCourse = async (courseValue) => {
    try {
      const apiUrl = Urlconstant.url + `api/getTraineeDetails?courseName=${courseValue}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      };
      const response = await axios.get(apiUrl, requestOptions);
      setGridData({
        rows: response.data.map((row) => ({
          id: row.id.toString(),
          ...row,
        })),
        rowCount: response.data.length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setGridData({ rows: [], rowCount: 0 });
    }
  };

  function searchServerRows(page, pageSize, name) {
    const startingIndex = page * pageSize;
    const spreadsheetId = Urlconstant.spreadsheetId;
    var apiUrl;
    if (name === "status") {
      apiUrl =
        Urlconstant.url +
        `api/followUp?startingIndex=${startingIndex}&maxRows=25&status=${searchValue}`;

      var requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          spreadsheetId: spreadsheetId,
        },
      };
    }
    if (name === "date") {
      apiUrl =
        Urlconstant.url +
        `api/getFollowupstatusByDate?startIndex=${startingIndex}&endIndex=25&date=${searchValue}`;
    }
    return new Promise((resolve, reject) => {
      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Received data from server:", data);
          const newGridData = {
            rows: data.followUpData.map((row) => ({
              id: row.id.toString(),
              ...row,
            })),
            rowCount: data.size,
          };
          resolve(newGridData);
        }, 1000)
        .catch((error) => {
          resolve({ rows: [], rowCount: 0 });
        });
    });
  }
  const getDropDown = () => {
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
  };
  const dateByfollowupStatus = (e) => {
    const { name, value } = e.target;
    setSearchValue(value);
    setName(name);
  };

  const handleSaveClick = () => {
    setModalOpen(false);
  };
  
  return (
    <div>
      <h2>VeiwFollowUp</h2>
      {/* <h2>FollowUp List</h2> */}
      <div
        className="search"
        style={{ marginTop: "50px", display: "flex", alignItems: "center" }}
      >
        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status Values"
            onChange={handleInputChange}
            name="status"
            value={searchValue}
            fullWidth
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "12px",
            }}
          >
            {dropdown.status.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          name="date"
          label="Select call back date"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ marginRight: "10px" }}
          onChange={dateByfollowupStatus}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
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
            onChange={handleCourseChange}
          >
            {Array.isArray(courseDropdown)
              ? courseDropdown.map((item, k) => (
                  <MenuItem value={item} key={k}>
                    {item}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
        {/* <FormControl>
          <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status Values"
            onChange={handleInputChange}
            name="status"
            value={searchValue}
            fullWidth
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "12px",
            }}
          >
            {statusList.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

      </div>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          columns={[
            { headerName: "ID", field: "id", flex: 1 },
            {
              field: "traineeName",
              headerName: "Trainee Name",
              flex: 1,
              valueGetter: (params) => params.row.basicInfo.traineeName,
            },
            {
              field: "email",
              headerName: "Email",
              flex: 1,
              valueGetter: (params) => params.row.basicInfo.email,
            },
            {
              field: "contactNumber",
              headerName: "Contact Number",
              flex: 1,
              valueGetter: (params) => params.row.basicInfo.contactNumber,
            },
            {
              field: "joiningDate",
              headerName: "Joining Date",
              flex: 1,
              valueGetter: (params) => params.row.joiningDate,
            },
            {
              field: "courseName",
              headerName: "Course Name",
              flex: 1,
              valueGetter: (params) => params.row.courseName,
            },
            {
              field: "currentStatus",
              headerName: "Current Status",
              flex: 1,
              valueGetter: (params) => params.row.currentStatus,
            },
            {
              field: "registrationDate",
              headerName: "RegistrationDate",
              flex: 1,
              valueGetter: (params) => params.row.registrationDate,
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 120,
              renderCell: (params) => (
                <div>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<PersonOutline />}
                    component={Link} // Use Link component for navigation

                    to={
                      Urlconstant.navigate +
                      `profile/${params.row.basicInfo.email}`
                    }
                  >
                    View
                  </Button>
                </div>
              ),
            },
          ]}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={gridData.rowCount}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          keepNonExistentRowsSelected
        />
        <EditFollowUp
          open={isModalOpen}
          handleClose={() => setModalOpen(false)}
          rowData={editedRowData}
          setRowData={setEditedRowData}
          handleSaveClick={handleSaveClick}
          dropdown={dropdown}
        />
      </div>
    </div>
  );
}
