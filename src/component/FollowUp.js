import { PersonOutline } from "@mui/icons-material";
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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import EditFollowUp from "./EditFollowUp";
import Course from "./Course";
import Header from "./Header";

export default function FollowUp() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(
    sessionStorage.getItem("status")
  );
  const [name, setName] = useState("status");
  const [courseName, setCourseName] = React.useState(
    sessionStorage.getItem("course")
  );
  const [courseDropdown, setCourseDropdown] = React.useState("");
  const [status, setStatus] = React.useState("");
  const statusList = ["Interested", "RNR", "Not Interested", "Others"];
  const [dropdown, setDropDown] = useState({
    status: [],
  });
  const  [statusLists, setStatusLists] = useState(["New", "Not interested", "Interested", "RNR", "Enquiry","Joined"]);
  const [date, setDate] = useState("");
  const initialPageSize = 25;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0,
  });

  React.useMemo(() => {
    setLoading(true);
    searchServerRows(paginationModel.page, paginationModel.pageSize, name,date).then(
      (newGridData) => {
        setGridData(newGridData);
        setLoading(false);
      }
    );
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
    date,
    courseName,
  ]);

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
      .catch((error) => {});
  };

  const filterData = () => {
    if (status && courseName) {
      getTraineeDetailsByCourseAndStatus(courseName, status);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValue(value);
    sessionStorage.setItem("status", value);
    setName(name);
    setStatus(value);

    setCourseName("null");
  };

  const handleCourseChange = (event) => {
    const { name, value } = event.target;
    setName(name);
    sessionStorage.setItem("course", value);
    setCourseName(value);
  };

  const getTraineeDetailsByCourseAndStatus = async (courseName, status) => {
    console.log(courseName, status);
    try {
      const apiUrl =
        Urlconstant.url +
        `api/getByCourseAndStatus?status=${status}&date=${date}&courseName=${courseName}`;
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

  function searchServerRows(page, pageSize, name,date) {
    const startingIndex = page * pageSize;
    const spreadsheetId = Urlconstant.spreadsheetId;

    var apiUrl;
    if (name === "status" || name === "CourseName") {
      apiUrl =
        Urlconstant.url +
        `api/followUp?startingIndex=${startingIndex}&maxRows=25&status=${searchValue}&date=${date}&courseName=${courseName}`;

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
        `api/getFollowupstatusByDate?startIndex=${startingIndex}&endIndex=25&date=${date}`;
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
      .catch((error) => {});
  };
  const dateByfollowupStatus = (e) => {
    const { name, value } = e.target;
    setName(name);
    setDate(value);
  };

  const handleSaveClick = () => {
    setModalOpen(false);
  };

  const handleClear = () => {
    setCourseName("null");
    sessionStorage.setItem("course", "null");
  };

  return (
    <div>
      <Header />
      <h2>VeiwFollowUp</h2>
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
            {statusLists.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Course Name"
            name="CourseName"
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
            {/* <MenuItem value="null">Select</MenuItem> */}
            {Array.isArray(courseDropdown)
              ? courseDropdown.map((item, k) => (
                  <MenuItem value={item} key={k}>
                    {item}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
        { <TextField
          type="date"
          name="date"
          label="Select call back date"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ marginRight: "10px" }}
          onChange={dateByfollowupStatus}
        /> }

        <div>
          <Button variant="contained" onClick={handleClear} size="small">
            Clear
          </Button>
        </div>

       
      </div>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          columns={[
            //  { headerName: "ID", field: "id", flex: 1 },
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
