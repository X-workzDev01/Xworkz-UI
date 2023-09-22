import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Urlconstant } from "../constant/Urlconstant";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import EditModal from "./EditModal";
import Profile from "./Profile";
import { Link, Router, useLocation } from "react-router-dom";
import context from "react-bootstrap/esm/AccordionContext";
import Header from "./Header";

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
            id: row.id.toString(),
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
  const location = useLocation();
  const email = location.state && location.state.email;
  const [loading, setLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);

  

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
    () =>
      debounce(
        (searchValue) =>
          fetchFilteredData(searchValue)
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

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    if (searchValue === "") {
      loadServerRows(paginationModel.page, paginationModel.pageSize)
        .then((newGridData) => {
          if (active) {
            setGridData(newGridData);
            setLoading(false);

            setAutocompleteOptions([]);
            console.log("suggestion set to null");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          if (active) {
            setGridData({ rows: [], rowCount: 0 });
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
      debouncedFetchSuggestions(searchValue);
    }

    return () => {
      active = false;
    };
  }, [paginationModel.page, paginationModel.pageSize, searchValue]);

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
            setSearchValue(newValue.basicInfo.traineeName);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              type="text"
              onChange={(e) => {
                const value = e.target.value;

                if (value.length >= 3) {
                  setSearchValue(value);
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
        <Button variant="contained" color="primary" onClick={handleSearchClick}>
          Search
        </Button>
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
                    component={Link} 
                    to={`/x-workz/profile/${params.row.basicInfo.email}`} 
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
