import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Urlconstant } from "../constant/Urlconstant";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import EditModal from "./EditModal";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import Header from "./Header";
import { PersonOutline } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function loadServerRows(page, pageSize) {
  const startingIndex = page * pageSize;
  const maxRows = pageSize;
  const spreadsheetId = Urlconstant.spreadsheetId;

  const apiUrl =
    Urlconstant.url +
    `api/readData?startingIndex=${startingIndex}&maxRows=${maxRows}`;
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

function searchServerRows(searchValue) {
  const apiUrl = Urlconstant.url + `api/filterData?searchValue=${searchValue}`;
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
async function fetchFilteredData(searchValue) {
  try {
    const apiUrl =
      Urlconstant.url + `api/register/suggestion?value=${searchValue}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        spreadsheetId: Urlconstant.spreadsheetId,
      },
    };

    const response = await axios.get(apiUrl, requestOptions);
    console.log(response);

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
  const [courseName, setCourseName] = React.useState("");
  const [courseDropdown, setCourseDropdown] = React.useState("");

  const handleEditClick = (row) => {
    setEditedRowData(row);
    setModalOpen(true);
  };

  const handleSaveClick = () => {
    setModalOpen(false);
  };

  const handleSearchClick = () => {
    searchServerRows(searchValue).then((newGridData) => {
      setGridData(newGridData);
      setPaginationModel({ page: 0, pageSize: initialPageSize });
      setSearchInputValue("");
    });
  };

  const handleViewProfile = (rowData) => {
    <Profile rowData={rowData} />;
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSearchValue(newValue || "");
  };

  const debouncedFetchSuggestions = React.useMemo(
    (page, pageSize) =>
      debounce(
        (searchValue) =>
          fetchFilteredData(
            searchValue,
            paginationModel.page,
            paginationModel.pageSize,
            setPaginationModel
          )
            .then((suggestions) => {
              console.log(suggestions);

              setAutocompleteOptions(suggestions);
              console.log(autocompleteOptions);

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

  // Define a function to fetch and update data
  async function fetchData(searchValue, page, pageSize, active) {
    try {
      if (searchValue === "") {
        const newGridData = await loadServerRows(page, pageSize);
        if (active) {
          setGridData(newGridData);
          setLoading(false);
          setAutocompleteOptions([]);
          console.log("suggestion set to null");
        }
      } else {
        setLoading(false);
        debouncedFetchSuggestions(searchValue);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (active) {
        setGridData({ rows: [], rowCount: 0 });
        setLoading(false);
      }
    }
  }

  const refreshPageEveryTime = () => {
    let active = true;
    setLoading(true);

    const fetchDataAndUpdateState = async () => {
      try {
        console.log("hareesha");

        if (
          searchValue === "" ||
          (searchValue.length >= 1 && searchValue.length <= 3)
        ) {
          console.log("pagination");
          const newGridData = await loadServerRows(
            paginationModel.page,
            paginationModel.pageSize
          );

          if (active) {
            setGridData(newGridData);
            setAutocompleteOptions([]);
            setLoading(false);
          }
        } else {
          const suggestions = await fetchFilteredData(
            searchValue,
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

  React.useEffect(() => {
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

  // const handleCourseChange = (event) => {
  //   c//onst courseVaue=event.target.value;
  //   //setCourseName(courseVaue);
  //   //getTraineeDetailsByCourse(courseVaue);
  // }
  const handleCourseChange = (event) => {
    const courseValue = event.target.value;
    setCourseName(courseValue);
    getTraineeDetailsByCourse(courseValue);
  };

  const getTraineeDetailsByCourse = async (courseValue) => {
    try {

      console.log("getTraineeDetailsByCourse " + courseValue);
      const apiUrl =
        Urlconstant.url + `api/traineeDetails?courseName=${courseValue}`;
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

  // Inside your component:
  React.useEffect(() => {
    refreshPageEveryTime();
  }, [paginationModel.page, paginationModel.pageSize, searchValue]);
  const columns = [
    // { headerName: "ID", field: "id", flex: 1 },
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
      headerName: "registrationDate",
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

        <Button variant="contained" color="primary" onClick={handleSearchClick}>
          Search
        </Button>
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
        handleSaveClick={handleSaveClick}
      />
    </div>
  );
}
