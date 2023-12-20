import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import "./Attandance.css";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";
import { json } from "react-router-dom";
import Header from "./Header";

const Attandance = () => {
  const [clickedButtonIds, setClickedButtonIds] = useState(new Set());
  const [value, setValue] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    render();
  }, []);

  const initialPageSize = 10;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const refresh = (select) => {
    setLoading(true);
    setPaginationModel({ page: 0, pageSize: initialPageSize });
    searchServerRows(0, initialPageSize, select).then((newGridData) => {
      setGridData(newGridData);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    setLoading(true);
    searchServerRows(
      paginationModel.page,
      paginationModel.pageSize,
      searchValue
    ).then((newGridData) => {
      setGridData(newGridData);
      setLoading(false);
    });
  }, [paginationModel.page, paginationModel.pageSize, searchValue]);

  function searchServerRows(page, pageSize, select) {
    const startingIndex = page * pageSize;
    console.log(
      "Loading server rows with page:",
      page,
      "pageSize:",
      pageSize,
      "status:",
      select
    );

    return new Promise((resolve, reject) => {
      axios(
        Urlconstant.url +
          `api/byBatch?batch=${select}&startIndex=${startingIndex}&maxRows=10`
      )
        .then((json) => {
          console.log("Received data from server:", json.data.size);
          const newGridData = {
            rows: json.data.dto.map((row) => ({
              id: row.id.toString(),
              ...row,
            })),
            rowCount: json.data.size,
          };
          resolve(newGridData);
        }, 1000)
        .catch((error) => {
          console.error("Error fetching data:", error);

          resolve({ rows: [], rowCount: 0 });
        });
    });
  }

  const render = () => {
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((res) => {
        setValue(res.data);
      })
      .catch((e) => {});
  };
  const everydayAttandance = (attandanceData, batch) => {
    axios
      .post(Urlconstant.url + "api/addAttendennce", attandanceData)
      .then((res) => {
        refresh(batch);
      })
      .catch((e) => {});
  };

  const handleButtonClickYes = (rowData) => {
    const attandanceData = {
      id: rowData.id,
      markAs: 1,
      basicInfo: {
        traineeName: rowData.basicInfo.traineeName,
        email: rowData.basicInfo.email,
        contactNumber: rowData.basicInfo.contactNumber,
      },
      courseInfo: {
        course: rowData.courseInfo.course,
        branch: rowData.courseInfo.branch,
        batchTiming: rowData.courseInfo.batchTiming,
      },
    };
    if (!clickedButtonIds.has(rowData.id)) {
      const updatedClickedButtonIds = new Set(clickedButtonIds);
      updatedClickedButtonIds.add(rowData.id);
      setClickedButtonIds(updatedClickedButtonIds);
    }

    everydayAttandance(attandanceData, rowData.courseInfo.course);
  };

  const handleButtonClickNo = (rowData) => {
    const attandanceData = {
      id: rowData.id,
      markAs: 0,
      basicInfo: {
        traineeName: rowData.basicInfo.traineeName,
        email: rowData.basicInfo.email,
        contactNumber: rowData.basicInfo.contactNumber,
      },
      courseInfo: {
        course: rowData.courseInfo.course,
        branch: rowData.courseInfo.branch,
        batchTiming: rowData.courseInfo.batchTiming,
      },
    };
    if (!clickedButtonIds.has(rowData.id)) {
      const updatedClickedButtonIds = new Set(clickedButtonIds);
      updatedClickedButtonIds.add(rowData.id);
      setClickedButtonIds(updatedClickedButtonIds);
    }
    everydayAttandance(attandanceData, rowData.courseInfo.course);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      headerName: "Name",
      width: 120,
      valueGetter: (params) => params.row.basicInfo.traineeName,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      valueGetter: (params) => params.row.basicInfo.email,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      width: 120,
      valueGetter: (params) => params.row.basicInfo.contactNumber,
    },
    {
      field: "course",
      headerName: "Course",
      width: 120,
      valueGetter: (params) => params.row.courseInfo.course,
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 120,
      valueGetter: (params) => params.row.courseInfo.branch,
    },
    {
      field: "batchTiming",
      headerName: "Batch",
      width: 120,
      valueGetter: (params) => params.row.courseInfo.batchTiming,
    },
    {
      field: "present",
      headerName: "Present",
      width: 120,
      valueGetter: (params) => params.row.present,
    },
    {
      field: "absent",
      headerName: "Absent",
      width: 120,
      valueGetter: (params) => params.row.absent,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => handleButtonClickYes(params.row)}
            disabled={
              params.row.isButton || clickedButtonIds.has(params.row.id)
            }
            style={{ color: params.row.ycolor }}
            variant="outlined"
          >
            Yes
          </Button>
          <Button
            onClick={() => handleButtonClickNo(params.row)}
            disabled={
              params.row.isButton || clickedButtonIds.has(params.row.id)
            }
            style={{ color: params.row.ncolor }}
            variant="outlined"
          >
            No
          </Button>
        </div>
      ),
    },
  ];

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    refresh(e.target.value);
  };

  return (
    <div className="attandance">
      <Header />
      <div
        className="search"
        style={{ marginTop: "50px", display: "flex", alignItems: "center" }}
      >
        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Batch</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select Batch"
            onChange={handleInputChange}
            value={searchValue}
            defaultValue={"Please Select Batch"}
            fullWidth
            required
            variant="outlined"
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "12px",
            }}
          >
            {value.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Select Date"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary">
          Search
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={gridData.rows}
        pagination
        autoHeight
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 15, 20]}
        rowCount={gridData.rowCount}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        loading={loading}
        keepNonExistentRowsSelected
      />
    </div>
  );
};

export default Attandance;
