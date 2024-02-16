import { PersonOutline } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import EditModal from "./EditModal";
import Header from "./Header";
import { GridToolbar } from "@mui/x-data-grid";

function loadServerRows(page, pageSize, courseName, collegeName) {
  const startingIndex = page * pageSize;
  const maxRows = pageSize;
  const spreadsheetId = Urlconstant.spreadsheetId;
  const apiUrl =
    Urlconstant.url +
    `api/readData?startingIndex=${startingIndex}&maxRows=${maxRows}&courseName=${courseName}&collegeName=${collegeName}`;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      spreadsheetId: spreadsheetId,
    },
  };
  return new Promise((resolve) => {
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve({
          rows: data.sheetsData.map((row) => ({
            ...row,
          })),
          rowCount: data.size,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        resolve({ rows: [], rowCount: 0 });
      });
  });
}

function loadClientRows(page, pageSize, allData) {
  const startingIndex = page * pageSize;
  const endingIndex = Math.min(startingIndex + pageSize, allData.length);

  return new Promise((resolve) => {
    resolve({
      rows: allData,
      rowCount: allData.length,
    });
  });
}

function searchServerRows(searchValue, courseName) {
  const apiUrl =
    Urlconstant.url + `api/filterData/${courseName}?searchValue=${searchValue}`;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      spreadsheetId: Urlconstant.spreadsheetId,
    },
  };

  return new Promise((resolve) => {
    fetch(apiUrl, requestOptions)
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
async function fetchFilteredData(searchValue, courseName) {
  try {
    const apiUrl =
      Urlconstant.url +
      `api/register/suggestion/${courseName}?value=${searchValue}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        spreadsheetId: Urlconstant.spreadsheetId,
      },
    };

    const response = await axios.get(apiUrl, requestOptions);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function debounce(func, delay) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

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
  const [collegeName, setCollegeName] = React.useState("null");
  const [courseDropdown, setCourseDropdown] = React.useState("");
  const [dropdown, setDropDown] = useState({
    course: [],
    qualification: [],
    batch: [],
    stream: [],
    college: [],
  });

  const handleSaveClick = () => {
    setModalOpen(false);
  };

  const handleSearchClick = () => {
    searchServerRows(searchValue, courseName).then((newGridData) => {
      setGridData(newGridData);
      setPaginationModel({ page: 0, pageSize: initialPageSize });
      setSearchInputValue("");
    });
  };

  const debouncedFetchSuggestions = React.useMemo(
    (page, pageSize) =>
      debounce(
        (searchValue) =>
          fetchFilteredData(
            searchValue,
            courseName,
            paginationModel.page,
            paginationModel.pageSize,
            setPaginationModel
          )
            .then((suggestions) => {
              setAutocompleteOptions(suggestions);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching suggestions:", error);
              setAutocompleteOptions([]);
              setLoading(false);
            }),
        500
      ),

    []
  );

  const refreshPageEveryTime = () => {
    let active = true;
    setLoading(true);

    const fetchDataAndUpdateState = async () => {
      try {
        if (
          searchValue === "" ||
          (searchValue.length >= 1 && searchValue.length <= 3)
        ) {
          const newGridData = await loadServerRows(
            paginationModel.page,
            paginationModel.pageSize,
            courseName,
            collegeName
          );

          if (active) {
            setGridData(newGridData);
            setAutocompleteOptions([]);
            setLoading(false);
          }
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

  React.useEffect(() => {
    getActiveCourse();
    getDropdown();
  }, []);
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

  const handleCourseChange = (event) => {
    const courseValue = event.target.value;
    sessionStorage.setItem("courseValue", courseValue);
    setCourseName(courseValue);
  };

  React.useEffect(() => {
    refreshPageEveryTime();
  }, [paginationModel.page, paginationModel.pageSize, searchValue, courseName, collegeName]);
  const columns = [
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
      field: "registrationDate",
      headerName: "RegistrationDate",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.registrationDate,
    },
    {
      field: "qualification",
      headerName: "Qualification",
      flex: 1,
      valueGetter: (params) => params.row.educationInfo.qualification,
    },
    {
      field: "stream",
      headerName: "Stream",
      flex: 1,
      valueGetter: (params) => params.row.educationInfo.stream,
    },
    {
      field: "yearOfPassout",
      headerName: "Year of Passout",
      flex: 1,
      valueGetter: (params) => params.row.educationInfo.yearOfPassout,
    },
    {
      field: "collegeName",
      headerName: "College Name",
      flex: 1,
      valueGetter: (params) => params.row.educationInfo.collegeName,
    },
    {
      field: "course",
      headerName: "Course",
      flex: 1,
      valueGetter: (params) => params.row.courseInfo.course,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      valueGetter: (params) => params.row.courseInfo.branch,
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 1,
      valueGetter: (params) => params.row.courseInfo.batchType,
    },
    {
      field: "usnNumber",
      headerName: "USN number",
      flex: 1,
      valueGetter: (params) => params.row.csrDto.usnNumber,
    },
    {
      field: "alternateContactNumber",
      headerName: "AlternateContactNumber",
      flex: 1,
      valueGetter: (params) => params.row.csrDto.alternateContactNumber,
    },
    {
      field: "uniqueId",
      headerName: "Unique Id",
      flex: 1,
      valueGetter: (params) => params.row.csrDto.uniqueId,
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
            component={Link}
            to={Urlconstant.navigate + `profile/${params.row.basicInfo.email}`}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  const handleClear = () => {
    sessionStorage.setItem("courseValue", "null");
    sessionStorage.setItem("name", "null");
    setCourseName("null");
    setCollegeName("null");
    setSearchValue("");
  };

  const handleCollegeChange = (event) => {
    const collegeName = event.target.value;
    setCollegeName(collegeName);
  }
  return (
    <div>
      <Header />

      <div
        className="search"
        style={{ display: "flex", alignItems: "center", marginTop: "100px" }}
      >
        <Autocomplete
          options={autocompleteOptions}
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          getOptionLabel={(option) => option.basicInfo.traineeName}
          style={{ width: "22rem", padding: "10px 20px" }}
          onChange={(event, newValue) => {
            sessionStorage.setItem("name", newValue.basicInfo.traineeName);
            setSearchValue(newValue.basicInfo.email);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              type="text"
              onChange={(e) => {
                const value = e.target.value;

                if (value.length >= 3) {
                  setSearchValue(value);
                  setPaginationModel({ page: 0, pageSize: initialPageSize });
                }
                if (value.length >= 1 && value.length <= 3) {
                  setPaginationModel({ page: 0, pageSize: initialPageSize });
                }
              }}
              placeholder="Search..."
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              {option.basicInfo.traineeName} - {option.basicInfo.email}
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
            onChange={handleCollegeChange}
          >
            {dropdown.college.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
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
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          style={{ width: "100%" }}
          columns={columns}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[25,50,100]}
          rowCount={gridData.rowCount}
          paginationMode={searchValue === "" ? "server" : "client"}
          onPaginationModelChange={setPaginationModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          loading={loading}
          keepNonExistentRowsSelected
          slots={{ toolbar: GridToolbar }}

        />

      </div>
      <EditModal
        open={isModalOpen}
        handleClose={() => setModalOpen(false)}
        rowData={editedRowData}
        setRowData={setEditedRowData}
        handleSaveClick={handleSaveClick}
      />
    </div>
  );
}
