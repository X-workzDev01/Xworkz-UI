import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Urlconstant } from "../constant/Urlconstant";
import { PersonOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Autocomplete, Button, TextField } from "@mui/material";
import axios from "axios";
import { buttonPadding, gridStyle } from "../constant/FormStyle";
import HRFollowUpStatusGrid from "./HRFollowUpStatusGrid";

function loadServerRows(page, pageSize) {
  const startingIndex = page * pageSize;
  const maxRows = pageSize;
  const apiUrl =
    Urlconstant.url +
    `api/readclientinfomation?startingIndex=${startingIndex}&maxRows=${maxRows}`;
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

function searchServerRows(searchValue) {
  const apiUrl =
    Urlconstant.url + `api/getdetailsbycompanyname?companyName=${searchValue}`;
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
async function fetchFilteredData(searchValue) {
  try {
    const apiUrl =
      Urlconstant.url + `api/client/suggestions?companyName=${searchValue}`;
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
  const [onChangeSearchValue, setOnChangeSearchValue] = React.useState("");
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
            paginationModel.pageSize
          );

          if (active) {
            setGridData(newGridData);
            setAutocompleteOptions([]);
            setLoading(false);
          }
        } else {
          const suggestions = await fetchFilteredData(searchValue);
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
  }, [paginationModel.page, paginationModel.pageSize, searchValue]);

  const handleSearchInput = () => {
    searchServerRows(searchValue).then((newGridData) => {
      setGridData(newGridData);
      setPaginationModel({ page: 0, pageSize: initialPageSize });
    });
  };

  const column = [
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
      headerName: " Website",
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
      headerName: " Address",
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

  return (
    <div style={gridStyle}>
      <div
        className="search"
        style={{ display: "flex", alignItems: "center", marginTop: "100px" }}
      >
        <Autocomplete
          freeSolo
          autoSelect
          id="free-solo-2-demo"
          disableClearable
          style={{ width: 300 }}
          options={autocompleteOptions}
          getOptionLabel={(option) =>
            option.companyName ? option.companyName : ""
          }
          onChange={(a, val) => {
            setSearchValue(val);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(event) => {
                const searchInput = event.target.value;
                if (searchInput.length >= 3) {
                  setSearchValue(searchInput);
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSearchInput}
        >
          Search
        </Button>
      </div>
      <h1></h1>
      <div style={gridStyle}>
        <DataGrid
          style={{ width: "100%" }}
          columns={column}
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
    </div>
  );
}
