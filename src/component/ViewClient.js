import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Urlconstant } from "../constant/Urlconstant";
import { PersonOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { gridStyle } from "../constant/FormStyle";
import { GridToolbar } from "@mui/x-data-grid";
import { selectedGridRowsSelector } from "@mui/x-data-grid";
import { gridFilteredSortedRowIdsSelector } from "@mui/x-data-grid";

function loadServerRows(page, pageSize, callBackDate, clientType) {
  const startingIndex = page * pageSize;
  const maxRows = pageSize;
  const apiUrl =
    Urlconstant.url +
    `api/readclientinfomation?startingIndex=${startingIndex}&maxRows=${maxRows}&callBackDate=${callBackDate}&clientType=${clientType}`;
  const requestOptions = {
    method: "GET",
  };
  return new Promise((resolve) => {
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve({
          rows: data.clientData.map((row) => ({
            ...row,
          })),
          rowCount: data.size,
        });
      })
      .catch((error) => {
        resolve({ rows: [], rowCount: 0 });
      });
  });
}

function searchServerRows(searchValue, callBackDate, clientType) {
  const apiUrl =
    Urlconstant.url + `api/getdetailsbycompanyname?companyName=${searchValue}&callBackDate=${callBackDate}&clientType=${clientType}`;
  const requestOptions = {
    method: "GET",
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
        resolve({ rows: [], rowCount: 0 });
      });
  });
}
async function fetchFilteredData(searchValue, callBackDate, clientType) {
  try {
    const apiUrl =
      Urlconstant.url + `api/client/suggestions?companyName=${searchValue}&callBackDate=${callBackDate}&clientType=${clientType}`;
    const requestOptions = {
      method: "GET",
    };
    const response = await axios.get(apiUrl, requestOptions);
    return response.data;
  } catch (error) {
    return [];
  }
}

export default function ViewClient() {
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
  const [searchValue, setSearchValue] = React.useState("");
  const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [callBackDate, setCallBackDate] = React.useState("null");
  const [clientType, setClientType] = React.useState("null");
  const [dropdown, setDropDown] = React.useState({
    clientType: [],
    sourceOfConnection: [],
    sourceOfLocation: [],
    hrDesignation: [],
    callingStatus: []
  });
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
            callBackDate,
            clientType
          );

          if (active) {
            setGridData(newGridData);
            setAutocompleteOptions([]);
            setLoading(false);
          }
        } else {
          const suggestions = await fetchFilteredData(searchValue, callBackDate, clientType, paginationModel.page,
            paginationModel.pageSize,
            setPaginationModel);
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
    refreshPageEveryTime();
  }, [paginationModel.page, paginationModel.pageSize, searchValue, callBackDate, clientType]);

  React.useEffect(() => {
    getDropdown();
  }, []);
  const handleSearchInput = () => {
    searchServerRows(searchValue, callBackDate, clientType).then((newGridData) => {
      setGridData(newGridData);
      setPaginationModel({ page: 0, pageSize: initialPageSize });
    });
  };

  const getDropdown = () => {
    axios.get(Urlconstant.url + `utils/clientdropdown`).then((response) => {
      setDropDown(response.data);
    })
  }

  const columns = [
    //  { headerName: 'ID', field: 'id' },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
      valueGetter: (params) => params.row.companyName,
    },
    {
      field: "companyEmail",
      headerName: " E-mail",
      flex: 1,
      valueGetter: (params) => params.row.companyEmail,
    },
    {
      field: "companyWebsite",
      headerName: "Website",
      flex: 1,
      valueGetter: (params) => params.row.companyWebsite,
    },
    {
      field: "companyType",
      headerName: "Company Type",
      flex: 1,
      valueGetter: (params) => params.row.companyType,
    },
    {
      field: "companyAddress",
      headerName: "Address",
      flex: 1,
      valueGetter: (params) => params.row.companyAddress,
    },
    {
      field: "companyLocation",
      headerName: "Location",
      flex: 1,
      valueGetter: (params) => params.row.companyLocation,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      valueGetter: (params) => params.row.status,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PersonOutline />}
            component={Link}
            to={Urlconstant.navigate + `companylist/${params.row.id}`}
          >
            View
          </Button>
        </div>
      ),
    },
  ];


  const handleCallBackDateChange = (event) => {
    setCallBackDate(event.target.value);
  }
  const handleCompanyType = (event) => {
    setClientType(event.target.value);
  }
  const handleClear = () => {
    setSearchValue(""); // Clear the search value
    setCallBackDate("null");
    setClientType("null");
    setSelectedOption(null);
    sessionStorage.setItem("Search", "null");
    setSelectedOption({ companyName: '' });
  }
  const handleAutoSuggestion = (event, newValue) => {
    setSearchValue(newValue.companyName);
    sessionStorage.setItem("Search", newValue.companyName);
  }


  return (
    <div style={gridStyle}>
      <div
        className="search"
        style={{ display: "flex", alignItems: "center", marginTop: "100px", paddingLeft: "20px" }}
      >
        <Autocomplete
          options={autocompleteOptions}
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          style={{ width: 300 }}
          getOptionLabel={(option) =>
            option.companyName
          }
          value={selectedOption}
          onChange={handleAutoSuggestion}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(event) => {
                const searchInput = event.target.value;
                setSearchValue(searchInput);
                if (searchInput.length >= 3) {
                  setPaginationModel({ page: 0, pageSize: initialPageSize });
                }
                if (searchInput >= 1 && searchInput < 3) {
                  setPaginationModel({ page: 0, pageSize: initialPageSize });
                }
              }}
              label="Search"
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              {option.companyName} - {option.companyEmail}
            </li>
          )}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Company Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select Company Type"
            name="clientType"
            value={clientType}
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              marginLeft: "10px",
              fontSize: "14px",
            }}
            onChange={handleCompanyType}
          >
            <MenuItem value={null}>Select Company type</MenuItem>
            {dropdown.clientType.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          name="callBackDate"
          value={callBackDate}
          label="Select call back date"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ marginLeft: "10px", marginRight: "10px" }}
          onChange={handleCallBackDateChange}
        />
        <div style={{ marginLeft: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSearchInput}
          >
            <span style={{ marginLeft: '5px' }}>Search</span>
          </Button>
        </div>
        <div style={{ marginLeft: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
      <h1></h1>
      <div style={gridStyle}>
        <DataGrid
          style={{ width: "100%" }}
          columns={columns}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[25, 50, 100]}
          rowCount={gridData.rowCount}
          paginationMode={searchValue === "" ? "server" : "client"}
          onPaginationModelChange={setPaginationModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          slots={{ toolbar: GridToolbar }}
          rowSelectionModel={rowSelectionModel}
          loading={loading}
          keepNonExistentRowsSelected
        />
      </div>
    </div>
  );
}
