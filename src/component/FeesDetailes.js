import { PersonOutline } from "@mui/icons-material";
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
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import { Urlconstant } from "../constant/Urlconstant";
import "./FeesDetailes";
import {
  saveCallbackDate,
  saveFeesBatchName,
  saveFeesStatus,
  savePaymentMode
} from "../store/feesDetials/FeesDetiles";
export const FeesDetailes = () => {
  const feesDetilesStore = useSelector(state => state.feesDetiles);
  const dispatch = useDispatch();
  const [batch, setBatch] = useState(feesDetilesStore.batchName);
  const [date, setDate] = useState(feesDetilesStore.callBackDate);
  const [paymentMode, setPaymentMode] = useState(feesDetilesStore.paymentMode);
  const initialPageSize = 25;
  const selectPaymentMode = ["Online", "Upi", "Cash", "NA"];
  const [batchDetiles, setBatchDetiles] = useState([]);
  const [openSyncLoader, setOpenSyncLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const feesDropdownStatus = ["Fees_due", "Pending", "Free", "Completed"];
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
        feesDetilesStore.feesStatus
      );
    },
    [batch, paymentMode, date, paginationModel, feesDetilesStore.feesStatus]
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
    callBackDate,
    batch,
    paymentMode,
    status
  ) => {
    const startingIndex = minIndex * maxIndex;
    const maxRows = maxIndex;
    const response = axios.get(
      Urlconstant.url +
        `api/getFeesDetilesBySelectedOption/${startingIndex}/${maxRows}/${callBackDate}/${batch}/${paymentMode}/${status}`
    );
    response.then(res => {
      setGridData({
        rows: res.data.listOfFeesDto
          ? res.data.listOfFeesDto.map((row, id) => ({
              ...row,
              id: id
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
      dispatch(savePaymentMode(value));
    }
    if (name === "date") {
      setDate(value);
      dispatch(saveCallbackDate(value));
    }
    if (name === "batch") {
      setBatch(value);
      dispatch(saveFeesBatchName(value));
    }
    if (name === "status") {
      dispatch(saveFeesStatus(value));
    }
  };
  const handleClear = () => {
    dispatch(savePaymentMode(null));
    dispatch(saveCallbackDate("null"));
    dispatch(saveFeesBatchName(null));
    dispatch(saveFeesStatus("null"));
    setBatch("null");
    setPaymentMode("null");
    setDate("null");
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
            value={
              feesDetilesStore.feesStatus ? feesDetilesStore.feesStatus : " "
            }
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
            value={
              feesDetilesStore.batchName ? feesDetilesStore.batchName : " "
            }
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
            value={
              feesDetilesStore.paymentMode ? feesDetilesStore.paymentMode : " "
            }
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
          label="Call Back Date"
          id="outlined-size-small"
          size="small"
          value={feesDetilesStore.callBackDate || "null"}
          color="primary"
          sx={{
            marginRight: "10px",
            width: "200px",
            fontSize: "12px"
          }}
          InputLabelProps={{
            shrink: true
          }}
          onChange={handleSetData}
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
