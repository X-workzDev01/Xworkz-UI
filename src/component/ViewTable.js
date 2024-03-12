import { MoreVert, PersonOutline } from "@mui/icons-material";
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Popover, Select } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import Header from "./Header";
import { GridToolbarFilterButton } from "@mui/x-data-grid";
import { GridToolbarDensitySelector } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { saveCollegeName, saveCourse, saveFollowUpStatus } from "../store/trainee/TraineeDetilesDropdown";


function loadServerRows(page, pageSize, courseName, collegeName,followupStatus) {
  const startingIndex = page * pageSize;
  const maxRows = pageSize;
  const spreadsheetId = Urlconstant.spreadsheetId;
  const apiUrl =
    Urlconstant.url +
    `api/readData?startingIndex=${startingIndex}&maxRows=${maxRows}&courseName=${courseName}&collegeName=${collegeName}&followupStatus=${followupStatus}`;
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

function searchServerRows(searchValue, courseName, collegeName,followupStatus) {
  const apiUrl =
    Urlconstant.url + `api/filterData/${courseName}?searchValue=${searchValue}&&collegeName=${collegeName}&&followupStatus=${followupStatus}`;
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
async function fetchFilteredData(searchValue, courseName, collegeName,followupStatus) {
  try {
    const apiUrl =
      Urlconstant.url +
      `api/register/suggestion/${courseName}?value=${searchValue}&&collegeName=${collegeName}&&followupStatus=${followupStatus}`;
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
  const traineeDropDown = useSelector(state=>state.traineeDropDowns);
  const dispatch=useDispatch();
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
  const [courseName, setCourseName] = React.useState(
    traineeDropDown.courseName);
  const [collegeName, setCollegeName] = React.useState(traineeDropDown.collegeName);

  const [courseDropdown, setCourseDropdown] = React.useState("");
  const [dropdown, setDropDown] = useState({
    course: [],
    qualification: [],
    batch: [],
    stream: [],
    college: [],
  });
  const [isExportModalOpen, setExportModalOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClearClicked, setIsClearClicked] = useState(false);

  const initiallySelectedFields = ['traineeName', 'email', 'contactNumber','course', 'actions'];
  const [displayColumn, setDisplayColumn] = React.useState(initiallySelectedFields);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [followupStatus, setFollowupStatus] = useState(traineeDropDown.followUpstatus);
  const handleSearchClick = () => {
    searchServerRows(searchValue, courseName, collegeName,followupStatus).then((newGridData) => {
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
            collegeName,
            paginationModel.page,
            paginationModel.pageSize,
            setPaginationModel,
            followupStatus
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
            collegeName,
            followupStatus,
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
            collegeName,
            followupStatus,
            paginationModel.page,
            paginationModel.pageSize,
            setPaginationModel,
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
   if(event.target.name==="courseName")
   {
    const courseValue = event.target.value;
    dispatch(saveCourse(event.target.value))
    setCourseName(courseValue);
   }
if(event.target.name==="followUpStatus"){
  dispatch(saveFollowUpStatus(event.target.value))
  setFollowupStatus(event.target.value)
}


  };

  React.useEffect(() => {
    refreshPageEveryTime();
  }, [paginationModel.page, paginationModel.pageSize, searchValue, courseName, collegeName,followupStatus]);
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
      field: "dateOfBirth",
      headerName: "Date Of Birth",
      flex: 1,
      valueGetter: (params) => params.row.basicInfo.dateOfBirth,
    },
    {
      field: "registrationDate",
      headerName: "Registration Date",
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
      field: "trainerName",
      headerName: "Trainer Name",
      flex: 1,
      valueGetter: (params) => params.row.courseInfo.trainerName,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      valueGetter: (params) => params.row.courseInfo.startDate,
    },
    {
      field: "batchTiming",
      headerName: "Batch Timing",
      flex: 1,
      valueGetter: (params) => params.row.courseInfo.batchTiming,
    },
    {
      field: "offeredAs",
      headerName: "Offered As",
      flex: 1,
      valueGetter: (params) => params.row.courseInfo.offeredAs,
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
      field: "othersDto.referalName",
      headerName: "Referal Name",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.referalName,
    },
    {
      field: "othersDto.referalContactNumber",
      headerName: "Referal Contact Number",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.referalContactNumber,
    },
    {
      field: "othersDto.comments",
      headerName: "Comments",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.comments,
    },
    {
      field: "othersDto.xworkzEmail",
      headerName: "X-workz Email",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.xworkzEmail,
    },
    {
      field: "othersDto.working",
      headerName: "Working",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.working,
    },
    {
      field: "othersDto.preferredLocation",
      headerName: "Preferred Location",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.preferredLocation,
    },
    {
      field: "othersDto.preferredClassType",
      headerName: "Preferred Class Type",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.preferredClassType,
    },

    {
      field: "othersDto.sendWhatsAppLink",
      headerName: "Send WhatsAppLink",
      flex: 1,
      valueGetter: (params) => params.row.othersDto.sendWhatsAppLink,
    },
    
    {
      field: "othersDto.followupStatus",
      headerName: "FollowupStatus",
      flex: 1,
      valueGetter: (params) => params.row.followupStatus,
    },
    // {
    //   field: "percentageDto.sslcPercentage",
    //   headerName: "SSLC Percentage",
    //   flex: 1,
    //   valueGetter: (params) => params.row.percentageDto.sslcPercentage,
    // },
    // {
    //   field: "percentageDto.pucPercentage",
    //   headerName: "PUC Percentage",
    //   flex: 1,
    //   valueGetter: (params) => params.row.percentageDto.pucPercentage,
    // },
    // {
    //   field: "percentageDto.degreePercentage",
    //   headerName: "Degree Percentage",
    //   flex: 1,
    //   valueGetter: (params) => params.row.percentageDto.degreePercentage,
    // },
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
  dispatch(saveCourse(null))
  dispatch(saveCollegeName(null))
  dispatch(saveFollowUpStatus(null))
  setCollegeName(null)
  setFollowupStatus(null)
  setCourseName(null)

    setSearchValue("");
    setSelectedOption({ basicInfo: { traineeName: '' } });
  };
  const handleExportClickModal = () => {
    setExportModalOpen(false);
  }
  const handleExportClick = () => {
    setExportModalOpen(true);
  }
  const handleAutocompleteChange = (event, newValue) => {
    setSelectedOption(isClearClicked ? null : newValue);
    sessionStorage.setItem("searchValue", newValue?.basicInfo?.traineeName);
    setIsClearClicked(false); // Reset clear clicked state
    setSearchValue(newValue?.basicInfo?.email || '');
  };
  const handleCollegeChange = (event) => {
   dispatch(saveCollegeName(event.target.value))
    setCollegeName(event.target.value);

  }

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
  const handleColumnChange = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

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
          value={selectedOption}
          onChange={handleAutocompleteChange}
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
            value={traineeDropDown.courseName}
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "14px",
            }}
            onChange={handleCourseChange}
          >
            <MenuItem value={null} > Select course </MenuItem>
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
            value={traineeDropDown.collegeName}
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "14px",
            }}
            onChange={handleCollegeChange}
          >
            <MenuItem value={null} > Select College </MenuItem>
            {dropdown.college.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Select FollowUp Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="FollowUp Status"
            name="followUpStatus"
            value={traineeDropDown.followUpstatus}
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "14px",
            }}
            onChange={handleCourseChange}
          >
            <MenuItem value={null} > Select course </MenuItem>
            {dropdown && dropdown.status
              ? dropdown.status.map((item, k) => (
                <MenuItem value={item} key={k}>
                  {item}
                </MenuItem>
              ))
              : null}
          </Select>
        </FormControl>
        <div style={{ marginLeft: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </div>
        <div style={{ marginLeft: "10px" }}>
          <Button variant="contained" color="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
        {/* <div style={{ marginLeft: "35%" }}>
          <Button variant="contained" color="primary" onClick={handleExportClick}>Export Data</Button>
        </div> */}

      </div>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          style={{ width: "100%" }}
          columns={columns.filter(col => displayColumn.includes(col.field))}
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
          rowSelectionModel={rowSelectionModel}
          loading={loading}
          keepNonExistentRowsSelected
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
        >
        </DataGrid>
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
            width: '11%',
          }}
        >
          <h4>COLUMNS</h4>
          {columns.map(column => (
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
      {/* <ExportData
        open={isExportModalOpen}
        handleClose={() => setExportModalOpen(false)}
        handleSaveClick={handleExportClickModal}
      /> */}
    </div>
  );
}