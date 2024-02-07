import React, { useEffect, useState } from "react";
import "./FeesDetailes";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";
export const FeesDetailes = () => {
  const [batch, setBatch] = useState(null);
  const [date, setDate] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const initialPageSize = 25;
  const selectPaymentMode = ["Online", "Upi", "Cash", "NA"];
  const [batchDetiles, setBatchDetiles] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0,
  });

  useEffect(() => {
    fetchingGridData(
      paginationModel.page,
      paginationModel.pageSize,
      date,
      batch,
      paymentMode
    );
    getBatch();
  }, [batch, paymentMode, date]);

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
    });
  };
  const columns = [
    {
      field: "name",
      headerName: "Trainee Name",
      valueGetter: (params) => params.row.name,
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      valueGetter: (params) => params.row.feesHistoryDto.email,
    },
    {
      field: "transectionId",
      width: 150,

      headerName: "Transection Id",
      valueGetter: (params) => params.row.feesHistoryDto.transectionId,
    },
    {
      field: "paymentMode",
      width: 150,
      headerName: "Payment Mode",
      valueGetter: (params) => params.row.feesHistoryDto.paymentMode,
    },
    {
      field: "paymentpaidDate",
      width: 150,
      headerName: "Payment paid date",
      valueGetter: (params) => params.row.feesHistoryDto.lastFeesPaidDate,
    },
    {
      field: "Fees Followup date",
      width: 150,
      headerName: "Fees Followup date",
      valueGetter: (params) => params.row.feesHistoryDto.feesfollowupDate,
    },
    {
      headerName: "Paid To",
      field: "paidTo",
      width: 150,

      valueGetter: (params) => params.row.feesHistoryDto.paidTo,
    },
    {
      field: "totalAmount",
      width: 140,
      headerName: "Total Amount",
      valueGetter: (params) => params.row.totalAmount,
    },
    {
      field: "balance",
      width: 140,
      headerName: "Balance",
      valueGetter: (params) => params.row.balance,
    },
    {
      field: "lateFees",
      width: 140,
      headerName: "Late Fees",
      valueGetter: (params) => params.row.lateFees,
    },
    {
      width: 140,
      headerName: "FeesStatus",
      valueGetter: (params) => params.row.feesStatus,
      renderCell: (params) => (
        <div>
          {params.row.balance === 0 ? (
            <span
              style={{
                backgroundColor: "green",
                padding: "0.4rem",
                borderRadius: "0.5rem",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              Completed
            </span>
          ) : (
            <div style={{ backgroundSize: "2rem" }}>
              <span
                style={{
                  // backgroundColor: "#ff3333",
                  padding: "0.4rem",
                  borderRadius: "0.5rem",
                  color: "blue",
                }}
              >
                {params.row.feesStatus === "FEES_DUE" ? (
                  <span style={{ color: "red", textTransform: "uppercase" }}>
                    {params.row.feesStatus}
                  </span>
                ) : (
                  <span style={{ textTransform: "uppercase" }}>
                    {params.row.feesStatus === "FREE" ? (
                      <span style={{color:"green"}}>{params.row.feesStatus}</span>
                    ) : (
                      <span>{params.row.feesStatus}</span>
                    )}
                  </span>
                )}
              </span>
            </div>
          )}
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
    <div style={{ color: "red", marginTop: "8rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "2rem",
          marginBottom: "0.4rem",
        }}
      >
        <div>
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
      </div>

      <div
        style={{
          height: "650px",
          width: "95%",
          marginLeft: "2rem",
          paddingRight: "1rem",
        }}
      >
        <DataGrid
          style={{ height: "42rem" }}
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
    </div>
  );
};
