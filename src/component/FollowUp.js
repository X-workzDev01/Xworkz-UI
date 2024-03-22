import { MoreVert, PersonOutline } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  FormControlLabel

} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import {
  saveFollowUpCallBackDate,
  saveFollowUpCollegeName,
  saveFollowUpCourseName,
  saveFollowUpstatus
} from "../store/followup/FollowUpDropdowns";
import EditFollowUp from "./EditFollowUp";
import Header from "./Header";

export default function FollowUp() {
  const followUpDropDown = useSelector(state => state.followUpDropDown);
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(
    followUpDropDown.followUpStatus
  );
  const [name, setName] = useState("status");
  const [selectCollege, setSelectCollege] = useState(
    followUpDropDown.followUpCollegename
  );
  const [courseName, setCourseName] = React.useState(
    followUpDropDown.followUpCourseName
  );
  const [courseDropdown, setCourseDropdown] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [college, setCollege] = React.useState("");
  const statusList = ["Interested", "RNR", "Not Interested", "Others"];
  const [dropdown, setDropDown] = useState({
    status: [],
    college: []
  });
  const [statusLists, setStatusLists] = useState([
    "New",
    "Not interested",
    "Interested",
    "RNR",
    "Enquiry",
    "Joined",
    "Past followUp",
    "Never followUp",
    "CSR",
    "NonCSR"
  ]);
  const [date, setDate] = useState(followUpDropDown.followUpCallBackDate);
  const initiallySelectedFields = ['traineeName', 'email', 'contactNumber', 'registrationDate', 'currentStatus', 'courseName', 'joiningDate', 'actions'];
  const [displayColumn, setDisplayColumn] = React.useState(initiallySelectedFields);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const initialPageSize = 25;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0
  });


  React.useMemo(
    () => {
      setLoading(true);
      searchServerRows(
        paginationModel.page,
        paginationModel.pageSize,
        name,
        date
      ).then(newGridData => {
        setGridData(newGridData);
        setLoading(false);
      });
    },
    [
      paginationModel.page,
      paginationModel.pageSize,
      searchValue,
      date,
      courseName,
      selectCollege
    ]
  );

  React.useEffect(() => {
    getDropDown();
    getActiveCourse();
  }, []);

  const getActiveCourse = () => {
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId
        }
      })
      .then(response => {
        setCourseDropdown(response.data);
      })
      .catch(() => { });
  };

  const filterData = () => {
    if (status && courseName) {
      getTraineeDetailsByCourseAndStatus(courseName, status);
    }
  };

  const handleInputChange = e => {
    setPaginationModel({ page: 0, pageSize: initialPageSize });
    const { name, value } = e.target;
    setSearchValue(value);
    dispatch(saveFollowUpstatus(value));

    setName(name);
    setStatus(value);
  };

  const handleCourseChange = event => {
    setPaginationModel({ page: 0, pageSize: initialPageSize });
    const { name, value } = event.target;
    setName(name);
    dispatch(saveFollowUpCourseName(value));
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
          spreadsheetId: Urlconstant.spreadsheetId
        }
      };
      const response = await axios.get(apiUrl, requestOptions);
      setGridData({
        rows: response.data.map(row => ({
          id: row.id.toString(),
          ...row
        })),
        rowCount: response.data.length
      });
    } catch (error) {
      setGridData({ rows: [], rowCount: 0 });
    }
  };

  function searchServerRows(page, pageSize, name, date) {
    const startingIndex = page * pageSize;
    const spreadsheetId = Urlconstant.spreadsheetId;

    var apiUrl;
    if (name === "status" || name === "CourseName") {
      apiUrl =
        Urlconstant.url +
        `api/followUp?startingIndex=${startingIndex}&maxRows=25&status=${searchValue}&date=${date}&courseName=${courseName}&collegeName=${selectCollege}`;

      var requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          spreadsheetId: spreadsheetId
        }
      };
    }
    return new Promise((resolve, reject) => {
      fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          const newGridData = {
            rows: data.followUpData.map(row => ({
              id: row.id.toString(),
              ...row
            })),
            rowCount: data.size
          };

          resolve(newGridData);
        }, 1000)
        .catch(error => {
          resolve({ rows: [], rowCount: 0 });
        });
    });
  }
  const getDropDown = () => {
    axios
      .get(Urlconstant.url + "utils/dropdown", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId
        }
      })
      .then(response => {
        setDropDown(response.data);
      })
      .catch(error => { });
  };
  const dateByfollowupStatus = e => {
    const { value } = e.target;
    setPaginationModel({ page: 0, pageSize: initialPageSize });
    dispatch(saveFollowUpCallBackDate(value));
    setDate(value);
  };
  const handleSaveClick = () => {
    setModalOpen(false);
  };

  const handleClear = () => {
    setCourseName(null);
    setSelectCollege(null);
    setSearchValue(null);
    setDate("null");
    dispatch(saveFollowUpCallBackDate(null));
    dispatch(saveFollowUpCollegeName(null));
    dispatch(saveFollowUpCourseName(null));
    dispatch(saveFollowUpstatus(null));
  };
  const handleColegeChange = event => {
    setPaginationModel({ page: 0, pageSize: initialPageSize });
    dispatch(saveFollowUpCollegeName(event.target.value));
    setSelectCollege(event.target.value);
  };

  const columns = [{
    field: "traineeName",
    headerName: "Trainee Name",
    flex: 1,
    valueGetter: params => params.row.basicInfo.traineeName
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    valueGetter: params => params.row.basicInfo.email
  },
  {
    field: "contactNumber",
    headerName: "Contact Number",
    flex: 1,
    valueGetter: params => params.row.basicInfo.contactNumber
  },
  {
    field: "joiningDate",
    headerName: "Joining Date",
    flex: 1,
    valueGetter: params => params.row.joiningDate
  },
  {
    field: "courseName",
    headerName: "Course Name",
    flex: 1,
    valueGetter: params => params.row.courseName
  },
  {
    field: "currentStatus",
    headerName: "Current Status",
    flex: 1,
    valueGetter: params => params.row.currentStatus
  },
  {
    field: "registrationDate",
    headerName: "RegistrationDate",
    flex: 1,
    valueGetter: params => {
      const registrationDate = params.row.registrationDate;
      const datePart = registrationDate.includes('T') ? registrationDate.split('T')[0] : registrationDate.split(' ')[0];
      return datePart;
    }
  }, {
    field: "updatedOn",
    headerName: "Updated On",
    flex: 1,
    valueGetter: params => params.row.adminDto.updatedOn.slice(0,10)
  }, {
    field: "updatedBy",
    headerName: "Updated By",
    flex: 1,
    valueGetter: params => params.row.adminDto.updatedBy
  }, {
    field: "createdBy",
    headerName: "Created By",
    flex: 1,
    valueGetter: params => params.row.adminDto.createdBy
  },
    , {
    field: "createdOn",
    headerName: "Created On",
    flex: 1,
    valueGetter: params => params.row.adminDto.createdOn.slice(0,10)
  }, {
    field: "collegeName",
    headerName: "College Name",
    flex: 1,
    valueGetter: params => params.row.collegeName
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: params =>
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
  }
  ];

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
      <h2>VeiwFollowUp</h2>
      <div
        className="search"
        style={{
          marginTop: "50px",
          marginBottom: "0.5rem",
          display: "flex",
          alignItems: "center"
        }}
      >
        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status Values"
            onChange={handleInputChange}
            name="status"
            value={followUpDropDown.followUpStatus}
            fullWidth
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "14px"
            }}
          >
            <MenuItem value={null}> Select status </MenuItem>
            { }
            {statusLists.map((item, index) =>
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Course Name"
            onChange={handleCourseChange}
            name="CourseName"
            value={followUpDropDown.followUpCourseName}
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "14px"
            }}
          >
            <MenuItem value={null}> Select course </MenuItem>
            {Array.isArray(courseDropdown)
              ? courseDropdown.map((item, k) =>
                <MenuItem value={item} key={k}>
                  {item}
                </MenuItem>
              )
              : null}
          </Select>
        </FormControl>
        {
          <TextField
            type="date"
            name="date"
            value={
              followUpDropDown.followUpCallBackDate ||
              ("null" && dispatch(saveFollowUpCallBackDate(null)))
            }
            label="Select call back date"
            InputLabelProps={{
              shrink: true
            }}
            sx={{ marginRight: "10px" }}
            onChange={dateByfollowupStatus}
          />
        }
        <FormControl>
          <InputLabel id="demo-simple-select-label">Select College</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select College"
            name="college"
            value={followUpDropDown.followUpCollegename}
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "14px"
            }}
            onChange={handleColegeChange}
          >
            <MenuItem value={null}> Select College </MenuItem>
            {dropdown.college.map((item, k) =>
              <MenuItem value={item} key={k}>
                {item}
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <div>
          <Button variant="contained" onClick={handleClear} size="small">
            Clear
          </Button>
        </div>
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
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
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
          }} >
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
            marginLeft: '11%',
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
    </div>

  );
}
