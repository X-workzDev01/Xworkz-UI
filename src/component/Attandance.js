import { PersonOutline } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import EditModal from "./EditModal";
import Header from "./Header";
import AttendanceModal from "./AttendanceModal";


// Function to load data from the server based on pagination
async function loadServerRows(page, pageSize, courseName) {
  const startingIndex = page * pageSize;
  const maxRows = pageSize;
  const apiUrl =
    Urlconstant.url +
    `api/attendance/readData?startingIndex=${startingIndex}&maxRows=${maxRows}&courseName=${courseName}`;

  return new Promise((resolve) => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        resolve({
          rows: data.attendanceData.map((row) => ({
            ...row,
            id: row.id.toString(), // Make sure to include a unique identifier
          })),
          rowCount: data.size,
        });
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
        resolve({ rows: [], rowCount: 0 });
      });
  });
}

async function fetchFilteredData(searchValue, courseName) {
  try {
    const apiUrl =
      Urlconstant.url +
      `api/attendance/suggestion/${courseName}?value=${searchValue}`;

    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}


function searchServerRows(searchValue, courseName) {
  const apiUrl =
    Urlconstant.url + `api/attendance/filterData/${courseName}?searchValue=${searchValue}`;
  return new Promise((resolve) => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        resolve({
          rows: data.map((row) => ({ id: row.id.toString(), ...row })),
          rowCount: data.size,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        resolve({ rows: [], rowCount: 0 });
      });
  });
}

// ... (Other utility functions)

export default function ControlledSelectionServerPaginationGrid() {
  const initialPageSize = 25;
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = React.useState({
    rows: [],
    rowCount: 0,
  });
  const [handleOpen, setHandleOpen] = useState(false)
  const [loading, setLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);
  const [courseName, setCourseName] = React.useState(
    sessionStorage.getItem("courseValue")
  );
  const [courseDropdown, setCourseDropdown] = React.useState("");
  const [totalClass, setTotalClass] = useState(0);
  const [course, setCourse] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    refreshPageEveryTime();
    getActiveCourse();
  }, []);

  useEffect(() => {
    if (courseName) {
      getTotalClass();
    }
  }, [courseName])

  const handleCourseChange = (event) => {
    const courseValue = event.target.value;
    sessionStorage.setItem("courseValue", courseValue);
    setCourseName(courseValue);
  };

  function getTotalClass() {
    axios
      .get(Urlconstant.url + `api/getTotalClass?courseName=${courseName}`)
      .then((response) => {
        setTotalClass(response.data);

      })
      .catch((error) => {
        console.error("Error fetching total class data:", error);
      });
  }

  const refreshPageEveryTime = () => {
    let active = true;
    setLoading(true);
    const fetchDataAndUpdateState = async () => {
      try {
        const newGridData = await loadServerRows(
          paginationModel.page,
          paginationModel.pageSize,
          courseName
        );

        if (active) {
          setGridData(newGridData);
          setAutocompleteOptions([]);
          setLoading(false);
        } else {
            const suggestions = await fetchFilteredData(
              searchValue,
              courseName,
              paginationModel.page,
              paginationModel.pageSize,
              setPaginationModel
            );

            if (active) {
              setAutocompleteOptions(suggestions);
              setLoading(false);
            }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (active) {
          setGridData({ rows: [], rowCount: 0 });
          setAutocompleteOptions([]);
          setLoading(false);
        }
      }
    };
    fetchDataAndUpdateState();
    return () => {
      active = false;
    };
  };

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
  };
  const handleSearchClick = () => {
    searchServerRows(searchValue, courseName).then((newGridData) => {
      setGridData(newGridData);
      setPaginationModel({ page: 0, pageSize: initialPageSize });
      setSearchInputValue("");
    });
  };
  const handleModelOpen = (batch, id) => {
    setHandleOpen(true);
    setCourse(batch);
    setId(id);


  }
  const handleClear = () => {
    setCourseName("null");
    setTotalClass(0);
  };
  React.useEffect(() => {
    refreshPageEveryTime();
  }, [paginationModel.page, paginationModel.pageSize, searchValue, courseName]);

  const columns = [
    {
      field: "traineeName",
      headerName: "Trainee Name",
      width: 450,
      valueGetter: (params) => params.row.traineeName,
    },
    {
      field: "course",
      headerNam1e: "Course",
      width: 550,
      valueGetter: (params) => params.row.course,
    },

    {
      field: "totalAbsent",
      headerName: "Total Absent",
      width: 300,
      valueGetter: (params) => params.row.totalAbsent,
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
            onClick={() => { handleModelOpen(params.row.course, params.row.id) }}
          >
            View
          </Button>
        </div>
      ),
    },

  ];


  const styles = {
    totalClassContainer: {
      marginLeft: "900px",
      marginTop: '-1.7rem',
    },
    totalClassCircle: {
      display: 'inline-block',
      marginRight: '600px',
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#e0e0e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: 'center',
      marginTop: '-30px'


    },
  }

  return (
    <div>
      <Header />

      <div
        className="search"
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <Autocomplete
          options={autocompleteOptions}
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          getOptionLabel={(option) => option.traineeName}
          style={{ width: "22rem", padding: "10px 20px" }}
          onChange={(event, newValue) => {
            sessionStorage.setItem("name", newValue.traineeName);
            setSearchValue(newValue.course);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              type="text"
              onChange={(e) => {
                const value = e.target.value;

                if (value.length >= 3) {
                  setSearchValue(value);
                  setPaginationModel({
                    page: 0,
                    pageSize: initialPageSize,
                  });
                }
                if (value.length >= 1 && value.length <= 3) {
                  setPaginationModel({
                    page: 0,
                    pageSize: initialPageSize,
                  });
                }
              }}
              placeholder="Search..."
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              {option.traineeName} - {option.email} - {option.totalAbsent} - {option.totalAttendance}
            </li>
          )}
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
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </div>
        <div style={{ paddingLeft: "10px" }}>
          <Button variant="contained" color="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
      <div style={{ marginTop: "-35px" }}>TotalClass :
        <div style={styles.totalClassContainer}>
          <div style={styles.totalClassCircle}>
            <p>{totalClass}</p>
          </div>
        </div>
      </div>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          style={{ width: "100%" }}
          columns={columns}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={gridData.rowCount}
          paginationMode={searchValue === "" ? "server" : "client"}
          onPaginationModelChange={setPaginationModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          loading={loading}
          keepNonExistentRowsSelected
        />
      </div>
      <EditModal
        open={isModalOpen}
        handleClose={() => setModalOpen(false)}
        rowData={editedRowData}
        setRowData={setEditedRowData}
        handleSaveClick={() => {
          // Your save logic here
          setModalOpen(false);
        }}
      />
      {id && course ?
        <AttendanceModal
          open={handleOpen}
          handleClose={() => setHandleOpen(false)}
          id={id}
          batch={course}


        />
        : ""}

    </div>
  );
}
