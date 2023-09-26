import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import "./Attandance.css";
import { FormControl } from "react-bootstrap";
import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";

const Attandance = () => {
  const [row, setRow] = useState([]);
  const [value, setValue] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [byEmail, setByEmail] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");

  useEffect(() => {
    render();
  }, []);

  const getBatchWise = (searchdata) => {
    axios
      .get(Urlconstant.url + `byBatch?batch=${searchdata}`, {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((res) => {
        const mappedData = res.data.map((item) => ({
          id: item.id,
          traineeName: item.basicInfo.traineeName,
          email: item.basicInfo.email,
          contactNumber: item.basicInfo.contactNumber,
          course: item.courseInfo.course,
          branch: item.courseInfo.branch,
          present: item.present,
          absent: item.absent,
          batchTiming: item.courseInfo.batchTiming,
        }));
        setRow(mappedData);
      })
      .catch((e) => {});
  };

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

  const handleButtonClickYes = (rowData) => {
    const formattedDate = `${year}-${month}-${day}`;
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
    axios
      .post(Urlconstant.url + "addAttendennce", attandanceData)
      .then((res) => {
        getBatchWise(searchValue);
      })
      .catch((e) => {});

    axios
      .get(Urlconstant.url + `byEmail?email=${rowData.email}`)
      .then((res) => {
        setByEmail(res.data);
      })
      .catch((e) => {});
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
    axios
      .post(Urlconstant.url + "addAttendennce", attandanceData)
      .then((res) => {
        getBatchWise(searchValue);
      })
      .catch((e) => {});
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
            disabled={params.row.isDisabled}
          >
            Yes
          </Button>
          <Button
            onClick={() => handleButtonClickNo(params.row)}
            disabled={isDisabled}
          >
            No
          </Button>
        </div>
      ),
    },
  ];
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    getBatchWise(e.target.value);
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
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={row} columns={columns} pageSize={5} />
      </div>
    </div>
  );
};

export default Attandance;
