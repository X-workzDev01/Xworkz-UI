import { DataGrid, GridToolbarDensitySelector } from "@mui/x-data-grid";
import React from "react";
import { Urlconstant } from "../constant/Urlconstant";
import { MoreVert, PersonOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Autocomplete, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Popover, Select, TextField } from "@mui/material";
import axios from "axios";
import { gridStyle } from "../constant/FormStyle";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarFilterButton } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import "./Company.css"
import {
  saveSearchValue,
  saveClientType,
  saveCallBackDate
} from "../store/Client/ClientDetails"
import { useDispatch, useSelector } from "react-redux";

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
  const clientDetails = useSelector(state => state.clientDetails);
  const dispatch = useDispatch();
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
  const [clientType, setClientType] = React.useState(clientDetails.clientType);
  const [dropdown, setDropDown] = React.useState({
    clientType: [],
    sourceOfConnection: [],
    sourceOfLocation: [],
    hrDesignation: [],
    callingStatus: []
  });
  const initiallySelectedFields = ['companyName', 'companyEmail', 'companyLandLineNumber', 'actions'];
  const [displayColumn, setDisplayColumn] = React.useState(initiallySelectedFields);
  const [anchorEl, setAnchorEl] = React.useState(null);
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

  const column = [
    {
      field: "companyName",
      headerName: "Name",
      flex: 1,
      headerClassName: 'bold-header',
      valueGetter: (params) => params.row.companyName,
    },
    {
      field: "companyEmail",
      headerName: " E-mail",
      flex: 1,
      valueGetter: (params) => params.row.companyEmail,
    },
    {
      field: "companyLandLineNumber",
      headerName: "Contact Number",
      flex: 1,
      valueGetter: (params) => params.row.companyLandLineNumber,
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
      field: "companyFounder",
      headerName: "Company Founder",
      flex: 1,
      valueGetter: (params) => params.row.companyFounder,
    },
    {
      field: "sourceOfConnection",
      headerName: "Source Of Connection",
      flex: 1,
      valueGetter: (params) => params.row.sourceOfConnection,
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
      field: "adminDto.createdBy",
      headerName: "Created By",
      flex: 1,
      valueGetter: (params) => params.row.adminDto.createdBy,
    },
    {
      field: "adminDto.createdOn",
      headerName: "Created On",
      flex: 1,
      valueGetter: (params) => params.row.adminDto.createdOn,
    },
    {
      field: "adminDto.updatedBy",
      headerName: "Updated By",
      flex: 1,
      valueGetter: (params) => params.row.adminDto.updatedBy,
    },
    {
      field: "adminDto.updatedOn",
      headerName: "Updated On",
      flex: 1,
      valueGetter: (params) => params.row.adminDto.updatedOn,
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
            to={Urlconstant.navigate + `companies/${params.row.id}`}
          >
            View
          </Button>
        </div>
      ),
    },
  ];


  const handleCallBackDateChange = (event) => {
    setCallBackDate(event.target.value);
    dispatch(saveCallBackDate(event.target.value))
  }
  const handleCompanyType = (event) => {
    setClientType(event.target.value);
    dispatch(saveClientType(event.target.value))
  }
  const handleClear = () => {
    dispatch(saveCallBackDate(null));
    dispatch(saveClientType(null));
    dispatch(saveSearchValue(""));
    setSearchValue("");
    setCallBackDate("null");
    setClientType("null");
    setSelectedOption(null);
  }
  const handleAutoSuggestion = (event, newValue) => {
    setSearchValue(newValue.companyName);
    dispatch(saveSearchValue(newValue.companyName))
  }

  const handleColumnChange = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleChangeColumnVisibility = (field) => {
    let updatedDisplayColumn;
    if (displayColumn.includes(field)) {
      updatedDisplayColumn = displayColumn.filter(col => col !== field);
    } else {
      updatedDisplayColumn = [...displayColumn, field];
    }
    setDisplayColumn(updatedDisplayColumn);
  };
  React.useEffect(() => {
    setDisplayColumn(initiallySelectedFields);
  }, []);

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
          columns={column.filter(col => displayColumn.includes(col.field))}
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

          slots={{
            toolbar: () => (
              <GridToolbarContainer>
                <Button onClick={handleColumnChange}> <MoreVert /> Columns</Button>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
              </GridToolbarContainer>
            )
          }}
          rowSelectionModel={rowSelectionModel}
          loading={loading}
          keepNonExistentRowsSelected
        />

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          sx={{
            position: 'absolute',
            marginTop: '10%',
            marginLeft: '15%',
            marginRight: '10%',
            width: '10%',
          }}
        >
          <h4>COLUMNS</h4>
          {column.map(column => (
            <FormControlLabel
              key={column.field}
              control={
                <Checkbox
                  checked={displayColumn.includes(column.field)}
                  onChange={() => handleChangeColumnVisibility(column.field)}
                />
              }
              label={column.headerName}
            />
          ))}
        </Popover>
      </div>
    </div>
  );
}
