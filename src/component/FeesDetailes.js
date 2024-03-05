import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import { Urlconstant } from "../constant/Urlconstant";
import "./FeesDetailes";
import { PersonOutline } from "@mui/icons-material";
export const FeesDetailes = () => {
  const [batch, setBatch] = useState(sessionStorage.getItem("feesBatch"));
  const [date, setDate] = useState(sessionStorage.getItem("feesDate"));
  const [paymentMode, setPaymentMode] = useState(
    sessionStorage.getItem("feesPaymentMode")
  );
  const initialPageSize = 25;
  const selectPaymentMode = ["Online", "Upi", "Cash", "NA"];
  const [batchDetiles, setBatchDetiles] = useState([]);
  const [openSyncLoader, setOpenSyncLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const feesDropdownStatus = ["Fees_due", "Pending", "Free", "Completed"];
  const [status, setStatus] = useState(sessionStorage.getItem("feesStatus"));
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0
  });

  useEffect(
    () => {
      setOpenSyncLoader(true);
      setIsOpen(true);
      fetchingGridData(
        paginationModel.page,
        paginationModel.pageSize,
        date,
        batch,
        paymentMode,
        status
      );
    },
    [batch, paymentMode, date, paginationModel, status]
  );
  useEffect(() => {
    getBatch();
  }, []);

  const getBatch = () => {
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId
        }
      })
      .then(response => {
        setBatchDetiles(response.data);
      })
      .catch(error => {});
  };

  const fetchingGridData = (
    minIndex,
    maxIndex,
    date,
    batch,
    paymentMode,
    status
  ) => {
    const startingIndex = minIndex * maxIndex;
    const maxRows = maxIndex;
    const response = axios.get(
      Urlconstant.url +
        `api/getFeesDetilesBySelectedOption/${startingIndex}/${maxRows}/${date}/${batch}/${paymentMode}/${status}`
    );
    response.then(res => {
      console.log(res.data.listOfFeesDto);
      setGridData({
        rows: res.data.listOfFeesDto
          ? res.data.listOfFeesDto.map(row => ({
              ...row
            }))
          : "",
        rowCount: res.data.size
      });
      setOpenSyncLoader(false);
      setIsOpen(false);
    });
    response.catch(() => {});
  };
  const columns = [
    {
      field: "name",
      headerName: "Trainee Name",
      valueGetter: params => params.row.name,
      flex: 1
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: params => params.row.feesHistoryDto.email
    },
    {
      field: "Batch",
      headerName: "Batch",
      flex: 1,
      valueGetter: params => params.row.courseName
    },
    {
      field: "TransectionId",
      flex: 1,
      headerName: "Transaction Id",
      valueGetter: params => params.row.feesHistoryDto.transectionId
    },
    {
      field: "paymentMode",
      flex: 1,
      headerName: "Payment Mode",
      valueGetter: params => params.row.feesHistoryDto.paymentMode
    },
    {
      field: "paymentpaidDate",
      flex: 1,
      headerName: "Payment paid date",
      valueGetter: params => params.row.feesHistoryDto.lastFeesPaidDate
    },
    {
      field: "Call Back Date",
      flex: 1,
      headerName: "Call Back Date",
      valueGetter: params => params.row.feesHistoryDto.followupCallbackDate
    },
    {
      headerName: "Paid To",
      field: "paidTo",
      flex: 1,
      valueGetter: params => params.row.feesHistoryDto.paidTo
    },
    {
      field: "totalAmount",
      flex: 1,
      headerName: "Total Amount",
      valueGetter: params => params.row.totalAmount
    },
    {
      field: "balance",
      flex: 1,
      headerName: "Balance",
      valueGetter: params => params.row.balance
    },
    {
      field: "lateFees",
      flex: 1,
      headerName: "Late Fees",
      valueGetter: params => params.row.lateFees
    },
    {
      field: "Fee Concession",
      flex: 1,
      headerName: "Fee Concession",
      valueGetter: params => params.row.feeConcession + " %"
    },
    {
      field: "Paid Amount",
      flex: 1,
      headerName: "Paid Amount",
      valueGetter: params => params.row.feesHistoryDto.paidAmount
    },
    {
      flex: 1,
      headerName: "FeesStatus",
      valueGetter: params => params.row.feesStatus,
      renderCell: params =>
        <div>
          {params.row.balance === 0
            ? <div
                style={{
                  padding: "0.4rem",
                  borderRadius: "0.5rem",
                  color: "black",
                  textTransform: "uppercase"
                }}
              >
                Completed
              </div>
            : <div
                style={{
                  padding: "0.4rem",
                  borderRadius: "0.5rem",
                  color: "blue"
                }}
              >
                {params.row.feesStatus === "FEES_DUE"
                  ? <div
                      style={{
                        color: "red",
                        paddingRight: "0.9rem",
                        paddingLeft: "0.9rem",
                        borderRadius: "0.5rem",
                        textTransform: "uppercase",
                        padding: "0.4rem"
                      }}
                    >
                      {params.row.feesStatus}
                    </div>
                  : <div>
                      {params.row.feesStatus === "FREE"
                        ? <span
                            style={{
                              color: "green",
                              paddingRight: "2rem",
                              paddingLeft: "2rem",
                              padding: "0.4rem",
                              borderRadius: "0.5rem"
                            }}
                          >
                            {params.row.feesStatus}
                          </span>
                        : <span
                            style={{
                              color: "blue",
                              paddingRight: "1.1rem",
                              paddingLeft: "1.1rem",
                              borderRadius: "0.5rem",
                              textTransform: "uppercase",
                              padding: "0.4rem"
                            }}
                          >
                            {params.row.feesStatus}
                          </span>}
                    </div>}
              </div>}
        </div>
    },
    {
      flex: 1,
      headerName: "Action",
      field: "Action",
      renderCell: params =>
        <div>
          <Button
            color="secondary"
            startIcon={<PersonOutline />}
            variant="outlined"
            LinkComponent={Link}
            to={
              Urlconstant.navigate +
              `profile/${params.row.feesHistoryDto.email}`
            }
          >
            {" "}View
          </Button>
        </div>
    }
  ];
  const handleSetData = event => {
    const { name, value } = event.target;
    if (name === "paymentMode") {
      setPaymentMode(value);
      sessionStorage.setItem("feesPaymentMode", value);
    }
    if (name === "date") {
      sessionStorage.setItem("feesDate", value);
      setDate(value);
    }
    if (name === "batch") {
      sessionStorage.setItem("feesBatch", value);
      setBatch(value);
    }
    if (name === "status") {
      sessionStorage.setItem("feesStatus", value);
      setStatus(value);
    }
  };
  const handleClear = () => {
    setStatus("null");
    setBatch("null");
    setDate("null");
    setPaymentMode("null");
    sessionStorage.setItem("feesBatch", "null");
    sessionStorage.setItem("feesDate", "null");
    sessionStorage.setItem("feesPaymentMode", "null");
    sessionStorage.setItem("feesStatus", "null");
  };
  return (
    <div style={{ marginTop: "7%", marginBottom: "2%", marginLeft: "0.7%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "1%"
        }}
      >
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            <span>Select Status</span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select Status"
            value={status ? status : " "}
            required
            name="status"
            onChange={handleSetData}
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "12px"
            }}
            size="medium"
          >
            {" "}<MenuItem value={"null"}> Select status </MenuItem>
            {feesDropdownStatus.map((item, index) =>
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            <span>Select batch</span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select batch"
            value={batch ? batch : " "}
            required
            name="batch"
            onChange={handleSetData}
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "12px"
            }}
            size="medium"
          >
            <MenuItem value={"null"}> Select course </MenuItem>
            {batchDetiles.map((item, index) =>
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            <span>Select Payment Mode</span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={paymentMode ? paymentMode : " "}
            label="Select payment mode "
            required
            name="paymentMode"
            onChange={handleSetData}
            sx={{
              marginRight: "10px",
              width: "200px",
              fontSize: "12px"
            }}
          >
            <MenuItem value={"null"}>Select payment mode </MenuItem>
            {selectPaymentMode.map((item, index) =>
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          type="date"
          name="date"
          onChange={handleSetData}
          label="Call Back Date"
          id="outlined-size-small"
          size="small"
          value={
            date
              ? date
              : "null" &&
                setDate("null") &&
                sessionStorage.setItem("feesDate", "null")
          }
          color="primary"
          sx={{
            marginRight: "10px",
            width: "200px",
            fontSize: "12px"
          }}
          focused
        />
        <Button variant="contained" color="primary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {openSyncLoader
        ? <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: "50%"
            }}
          >
            <SyncLoader
              color="#4000ff"
              margin={8}
              size={12}
              speedMultiplier={1}
            />
          </Modal>
        : ""}

      <DataGrid
        style={{ height: "42rem", width: "100%" }}
        columns={columns}
        rows={gridData ? gridData.rows : ""}
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[25, 50, 75, 100]}
        rowCount={gridData ? gridData.rowCount : ""}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        keepNonExistentRowsSelected
      />
    </div>
  );
};
