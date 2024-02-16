import React, { useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import "./FeesDetailes";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";
import { render } from "@testing-library/react";
import { Link } from "react-router-dom";
export const FeesDetailes = () => {
  const [batch, setBatch] = useState(null);
  const [date, setDate] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const initialPageSize = 25;
  const selectPaymentMode = ["Online", "Upi", "Cash", "NA"];
  const [batchDetiles, setBatchDetiles] = useState([]);
  const [openSyncLoader, setOpenSyncLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0,
  });

  useEffect(() => {
    setOpenSyncLoader(true);
    setIsOpen(true);
    fetchingGridData(
      paginationModel.page,
      paginationModel.pageSize,
      date,
      batch,
      paymentMode
    );
    getBatch();
  }, [batch, paymentMode, date,paginationModel]);

  const getBatch = () => {
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })

      .then((response) => {
        setBatchDetiles(response.data);
      })
      .catch((error) => {});
  };

  const fetchingGridData = (minIndex, maxIndex, date, batch, paymentMode) => {
    const response = axios.get(
      Urlconstant.url +
        `api/getFeesDetilesBySelectedOption/${minIndex}/${maxIndex}/${date}/${batch}/${paymentMode}`
    );
    response.then((res) => {
      console.log(res.data.listOfFeesDto);
      setGridData({
        id: res.data.listOfFeesDto.id,
        rows: res.data.listOfFeesDto.map((row) => ({
          ...row,
        })),
        rowCount: res.data.size,
      });
      setOpenSyncLoader(false);
      setIsOpen(false);
    });
  };
  const columns = [
    {
      field: "name",
      headerName: "Trainee Name",
      valueGetter: (params) => params.row.name,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params.row.feesHistoryDto.email,
    },
    {
      field: "Batch",
      headerName: "Batch",
      flex: 1,
      valueGetter: (params) => params.row.courseName,
    },
    {
      field: "transectionId",
      flex: 1,
      headerName: "Transection Id",
      valueGetter: (params) => params.row.feesHistoryDto.transectionId,
    },
    {
      field: "paymentMode",
      flex: 1,
      headerName: "Payment Mode",
      valueGetter: (params) => params.row.feesHistoryDto.paymentMode,
    },
    {
      field: "paymentpaidDate",
      flex: 1,
      headerName: "Payment paid date",
      valueGetter: (params) => params.row.feesHistoryDto.lastFeesPaidDate,
    },
    {
      field: "Fees Followup date",
      flex: 1,
      headerName: "Fees Followup date",
      valueGetter: (params) => params.row.feesHistoryDto.feesfollowupDate,
    },
    {
      headerName: "Paid To",
      field: "paidTo",
      flex: 1,
      valueGetter: (params) => params.row.feesHistoryDto.paidTo,
    },
    {
      field: "totalAmount",
      flex: 1,
      headerName: "Total Amount",
      valueGetter: (params) => params.row.totalAmount,
    },
    {
      field: "balance",
      flex: 1,
      headerName: "Balance",
      valueGetter: (params) => params.row.balance,
    },
    {
      field: "lateFees",
      flex: 1,
      headerName: "Late Fees",
      valueGetter: (params) => params.row.lateFees,
    },
    {
      flex: 1,
      headerName: "FeesStatus",
      valueGetter: (params) => params.row.feesStatus,
      renderCell: (params) => (
        <div>
          {params.row.balance === 0 ? (
            <div
              style={{
                // border: "1px solid black",
                padding: "0.4rem",
                borderRadius: "0.5rem",
                color: "black",
                textTransform: "uppercase",
              }}
            >
              Completed
            </div>
          ) : (
            <div
              style={{
                padding: "0.4rem",
                borderRadius: "0.5rem",
                color: "blue",
              }}
            >
              {params.row.feesStatus === "FEES_DUE" ? (
                <div
                  style={{
                    color: "red",
                    // border: "1px solid red",
                    paddingRight: "0.9rem",
                    paddingLeft: "0.9rem",
                    borderRadius: "0.5rem",
                    textTransform: "uppercase",
                    padding: "0.4rem",
                  }}
                >
                  {params.row.feesStatus}
                </div>
              ) : (
                <div>
                  {params.row.feesStatus === "FREE" ? (
                    <span
                      style={{
                        color: "green",
                        // border: "1px solid green",
                        paddingRight: "2rem",
                        paddingLeft: "2rem",
                        padding: "0.4rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {params.row.feesStatus}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "blue",
                        // border: "1px solid blue",
                        paddingRight: "1.1rem",
                        paddingLeft: "1.1rem",
                        borderRadius: "0.5rem",
                        textTransform: "uppercase",
                        padding: "0.4rem",
                      }}
                    >
                      {params.row.feesStatus}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      flex: 1,
      headerName: "Action",
      field: "Action",
      renderCell: (params) => (
        <div>
          <Button
            color="secondary"
            LinkComponent={Link}
            to={
              Urlconstant.navigate +
              `profile/${params.row.feesHistoryDto.email}`
            }
          >
            {" "}
            View
          </Button>
        </div>
      ),
    },
  ];
  const handleSetData = (event) => {
    const { name, value } = event.target;
    if (name === "paymentMode") {
      setPaymentMode(value);
    }
    if (name === "date") {
      setDate(value);
    }
    if (name === "batch") {
      setBatch(value);
    }
  };
  const handleClear = () => {
    setBatch(null);
    setDate(null);
    setPaymentMode("null");
  };
  return (
    <div style={{ marginTop: "7%", marginBottom: "2%", marginLeft: "0.7%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "1%",
        }}
      >
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
              fontSize: "12px",
            }}
            size="medium"
          >
            {batchDetiles.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
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
              fontSize: "12px",
            }}
          >
            {selectPaymentMode.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          name="date"
          onChange={handleSetData}
          label="Fees Followup date"
          id="outlined-size-small"
          size="small"
          value={date ? date : " "}
          color="primary"
          sx={{
            marginRight: "10px",
            width: "200px",
            fontSize: "12px",
          }}
          focused
        />
        <Button variant="contained" color="primary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {openSyncLoader ? (
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: "50%",
          }}
        >
          <SyncLoader
            color="#4000ff"
            margin={8}
            size={12}
            speedMultiplier={1}
          />
        </Modal>
      ) : (
        ""
      )}

      <DataGrid
        style={{ height: "42rem", width: "100%" }}
        columns={columns}
        rows={gridData.rows}
        pagination
        autoHeight
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 15, 20]}
        rowCount={gridData.rowCount}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        keepNonExistentRowsSelected
      />
    </div>
  );
};
