import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import "./Attandance.css";
import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";
import { json } from "react-router-dom";

const Attandance = () => {
  const [row, setRow] = useState([]);
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

  const initialPageSize = 20;
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
    searchServerRows(paginationModel.page, paginationModel.pageSize).then(
      (newGridData) => {
        setGridData(newGridData);
        setLoading(false);
      }
    );
  }, [paginationModel.page, paginationModel.pageSize]);

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
      console.log("HIiiiiiiiiiiiiiiiiii");
      axios(
        Urlconstant.url +
          `api/byBatch?batch=${select}&startIndex=${startingIndex}&maxRows=20`
      )
        .then((json) => {
          console.log("Received data from server:", json.data.size);
          const newGridData = {
            rows: json.data.dto.map((item) => ({
              id: item.id,
              traineeName: item.basicInfo.traineeName,
              email: item.basicInfo.email,
              contactNumber: item.basicInfo.contactNumber,
              course: item.courseInfo.course,
              branch: item.courseInfo.branch,
              present: item.present,
              absent: item.absent,
              batchTiming: item.courseInfo.batchTiming,
              isButtonDisabled: item.isButton,
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
        console.log(
          "JIiii" +
            paginationModel.page +
            "         " +
            paginationModel.pageSize
        );
        console.log(batch);
        refresh(batch);
      })
      .catch((e) => {});
  };

  const handleButtonClickYes = (rowData) => {
    const attandanceData = {
      id: rowData.id,
      markAs: 1,
      basicInfo: {
        traineeName: rowData.traineeName,
        email: rowData.email,
        contactNumber: rowData.contactNumber,
      },
      courseInfo: {
        course: rowData.course,
        branch: rowData.branch,
        batchTiming: rowData.batchTiming,
      },
    };

    everydayAttandance(attandanceData, rowData.course);
  };

  const handleButtonClickNo = (rowData) => {
    const attandanceData = {
      id: rowData.id,
      markAs: 0,
      basicInfo: {
        traineeName: rowData.traineeName,
        email: rowData.email,
        contactNumber: rowData.contactNumber,
      },
      courseInfo: {
        course: rowData.course,
        branch: rowData.branch,
        batchTiming: rowData.batchTiming,
      },
    };
    everydayAttandance(attandanceData, rowData.course);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "traineeName", headerName: "Name", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "contactNumber", headerName: "Contact Number", width: 120 },
    { field: "course", headerName: "Course", width: 120 },
    { field: "branch", headerName: "Branch", width: 120 },
    { field: "batchTiming", headerName: "Batch", width: 120 },
    { field: "present", headerName: "Present", width: 120 },
    { field: "absent", headerName: "Absent", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => handleButtonClickYes(params.row)}
            disabled={params.row.isButtonDisabled}
          >
            Yes
          </Button>
          <Button
            onClick={() => handleButtonClickNo(params.row)}
            disabled={params.row.isButtonDisabled}
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
      <div
        className="search"
        style={{ marginTop: "50px", display: "flex", alignItems: "center" }}
      >
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
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
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15, 20]}
          rowCount={gridData.rowCount}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          keepNonExistentRowsSelected
        />
      </div>
    </div>
  );
};

export default Attandance;
