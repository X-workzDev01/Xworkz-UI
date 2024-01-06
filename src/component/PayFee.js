import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { TfiClose } from "react-icons/tfi";
import { Urlconstant } from "../constant/Urlconstant";
import "./PayFee.css";
import { Textarea } from "@mui/joy";

export const PayFee = ({ open, handleClose, traineeEmail, feesData }) => {
  const [updateFeesData, setUpdateFeesData] = useState({});
  const paidTo = ["Mamatha", "Akshara", "Amulya", "Omkar"];
  const [loading, setLoading] = useState(false);
  const paymentMode = ["Online", "Upi", "Cash"];
  var selectlateFee = ["Yes", "No"];
  const [isConfirm, setIsConfirm] = useState(false);
  const [paidAmountError, setPaidAmountError] = useState("");
  const [lateFeesError, setLateFeesError] = useState("");
  const [balance, setBalance] = useState(0);
  const [response, setResponse] = useState("");
  const [snackbar, setSnackbar] = useState(false);

  useEffect(() => {
    setUpdateFeesData("");
    setPaidAmountError("");
    setLateFeesError("");
    setBalance(feesData.balance);
  }, [open, traineeEmail, handleClose, feesData]);

  const handlePay = () => {
    setIsConfirm(true);
  };
  const handleSubmit = () => {
    const feesDto = {
      admin: {
        updatedBy: sessionStorage.getItem("userId"),
      },
      feesHistoryDto: {
        email: traineeEmail,
        transectionId: updateFeesData.transectionId,
        lastFeesPaidDate: updateFeesData.lastFeesPaidDate,
        paidAmount: updateFeesData.paidAmount,
        followupCallbackDate: updateFeesData.followupCallbackDate,
        paymentMode: updateFeesData.paymentMode,
        paidTo: updateFeesData.paidTo,
      },
      lateFees: updateFeesData.lateFees,
      name: feesData.name,
      comments:updateFeesData.comments,
    };
    updateFees(feesDto);
  };
  const handleSetData = (e) => {
    const { name, value } = e.target;
    setUpdateFeesData({ ...updateFeesData, [name]: value });

    if (name === "paidAmount" && value > 0) {
      setUpdateFeesData({ ...updateFeesData, [name]: value });
      setPaidAmountError("");
    } else if (name === "paidAmount" && value <= 0) {
      setPaidAmountError("Entered amount should be Greater Than 0 *");
      setUpdateFeesData({ ...updateFeesData, [name]: "" });
    }
    if (name === "lateFees" && value > 0) {
      setUpdateFeesData({ ...updateFeesData, [name]: value });
      setLateFeesError("");
    } else if (name === "lateFees" && value <= 0) {
      setLateFeesError("Entered amount should be Greater Than 0 *");
      setUpdateFeesData({ ...updateFeesData, [name]: "" });
    }
    if (name === "paidAmount") {
      setBalance(feesData.balance - value);
    }
  };
  const updateFees = (feesDto) => {
    setLoading(true);
    axios
      .put(Urlconstant.url + "api/updateFeesDeties", feesDto)
      .then((response) => {
        setResponse(response.data);
        if (response.status === 200) {
          setIsConfirm(false);
          handleClose(false);
          setLoading(false);
          setSnackbar(true);
          setBalance(0);
        }
      });
  };

  let isDisabled;
  if (updateFeesData.selectlateFees === "Yes") {
    console.log("Running Is diesable");
    isDisabled =
      !updateFeesData.lateFees ||
      !updateFeesData.transectionId ||
      !updateFeesData.lastFeesPaidDate ||
      !updateFeesData.paidAmount ||
      !updateFeesData.followupCallbackDate ||
      !updateFeesData.paymentMode ||
      !updateFeesData.paidTo;
  } else {
    isDisabled =
      !updateFeesData.transectionId ||
      !updateFeesData.lastFeesPaidDate ||
      !updateFeesData.paidAmount ||
      !updateFeesData.followupCallbackDate ||
      !updateFeesData.paymentMode ||
      !updateFeesData.paidTo ||
      !updateFeesData.selectlateFees;
  }

  return (
    <Container>
      <Modal open={open} onClose={handleClose}>
        <div>
          {" "}
          <div className="containe">
            <div className="close">
              <span className="text">PayFees</span>

              <TfiClose
                color="inherit"
                onClick={() => {
                  handleClose();
                }}
              />
            </div>
            <div className="error">
              <span>{paidAmountError}</span>
            </div>
            <div className="late-error error">
              <span>{lateFeesError}</span>
            </div>

            <Box>
              <Typography
                sx={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  height: "auto",
                  width: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  justifySelf: "center",
                  marginBottom: "2rem",
                }}
              >
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  label="trainee Name"
                  name="traineeName"
                  id="outlined-size-small"
                  value={feesData.name}
                  size="small"
                  color="primary"
                  focused
                />

                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  label="Email"
                  id="outlined-size-small"
                  defaultValue={traineeEmail}
                  name="email"
                  size="small"
                  color="primary"
                  focused
                />
                <TextField
                  required
                  label="Transection id "
                  placeholder="Enter Transection Id"
                  name="transectionId"
                  onChange={handleSetData}
                  id="outlined-size-small"
                  size="small"
                  color="primary"
                  focused
                />
              </Typography>

              <div className="field">
                <TextField
                  required
                  type="date"
                  name="lastFeesPaidDate"
                  onChange={handleSetData}
                  label="Fees Paid Date"
                  id="outlined-size-small"
                  size="small"
                  color="primary"
                  focused
                />
                <TextField
                  sx={{ backgroundColor: "lightcyan" }}
                  InputProps={{
                    readOnly: true,
                  }}
                  name="totalAmount"
                  label="Total Amount *"
                  value={feesData.totalAmount}
                  id="outlined-size-small"
                  size="small"
                  color="primary"
                  focused
                />
                <div>
                  <TextField
                    required
                    name="paidAmount"
                    label="Payable Amount"
                    placeholder="Enter Amount"
                    onChange={handleSetData}
                    id="outlined-size-small"
                    size="small"
                    color="primary"
                    focused
                  />
                </div>
              </div>
              <div className="field">
                {
                  <TextField
                    sx={{ backgroundColor: "lightcyan" }}
                    label="balance "
                    placeholder="Enter Amount"
                    value={balance}
                    id="outlined-size-small"
                    size="small"
                    color="primary"
                    focused
                  />
                }
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel htmlFor="grouped-native-select">
                    Spoke To
                  </InputLabel>
                  <Select
                    focused
                    required
                    id="outlined-size-small"
                    label="Grouping"
                    name="paidTo"
                    onChange={handleSetData}
                    sx={{
                      marginRight: "10px",
                      width: "200px",
                      fontSize: "12px",
                    }}
                  >
                    {paidTo.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    <span>Payment mode</span>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Payment mode "
                    required
                    name="paymentMode"
                    onChange={handleSetData}
                    sx={{
                      marginRight: "10px",
                      width: "200px",
                      fontSize: "12px",
                    }}
                  >
                    {paymentMode.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "2.1rem",
                  marginBottom: "2rem",
                }}
              >
                <TextField
                  style={{ marginRight: "4.5rem" }}
                  required
                  type="date"
                  name="followupCallbackDate"
                  onChange={handleSetData}
                  label=" Fees Call Back Date"
                  id="outlined-size-small"
                  size="small"
                  color="primary"
                  focused
                />
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    <span>Select Late Fees</span>
                  </InputLabel>
                  <Select
                    color="primary"
                    focused
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select Late Fees"
                    required
                    style={{ marginRight: "4.5rem" }}
                    name="selectlateFees"
                    onChange={handleSetData}
                    variant="outlined"
                    sx={{
                      marginRight: "12px",
                      width: "200px",
                      fontSize: "12px",
                    }}
                  >
                    {selectlateFee.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {updateFeesData ? (
                  updateFeesData.selectlateFees === "Yes" ? (
                    <TextField
                      required
                      name="lateFees"
                      sx={{ backgroundColor: "lightcyan" }}
                      label="Select Late Fees"
                      placeholder="Enter Late Fees Amount"
                      onChange={handleSetData}
                      id="outlined-size-small"
                      size="small"
                      color="primary"
                      focused
                    />
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>

              <div className="field">
                <Textarea
                  sx={{
                    outlineOffset: "2rem",
                    width: "25rem",
                    marginBottom: "-2.8rem",
                  }}
                  placeholder="Type in here…"
                  minRows={2}
                  onChange={handleSetData}
                  name="comments"
                  label="Select Late Fees"
                  maxRows={4}
                  focused
                  color="primary"
                />
              </div>

              <div className="success">
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Button
                    disabled={isDisabled}
                    type="submit"
                    size="large"
                    onClick={handlePay}
                  >
                    Pay
                  </Button>
                )}
              </div>
            </Box>
          </div>
        </div>
      </Modal>
      <Modal open={isConfirm} onClose={() => setIsConfirm(false)}>
        <Box className="popup">
          <div className="closed">
            <TfiClose color="inherit" onClick={() => setIsConfirm(false)} />
          </div>
          <div>
            <div
              style={{
                display: "flex",
                marginBottom: "0.5rem",
                paddingRight: "3.5rem",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "5rem",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: "bolder" }}>
                Amount Paid <span style={{ marginLeft: "0.5rem" }}>:</span>
              </span>
              <span
                style={{
                  fontSize: "15px",
                  color: "green",
                  fontWeight: "bolder",
                  paddingLeft: "1rem",
                }}
              >
                {updateFeesData.paidAmount}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8rem",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: "bolder" }}>
                Remaining fee<span style={{ marginLeft: "0.5rem" }}>:</span>
                <span
                  style={{
                    fontSize: "15px",
                    color: "red",
                    marginLeft: "0.2rem",
                  }}
                >
                  {balance}
                </span>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "-0.2rem",
                justifyContent: "center",
              }}
            >
              <h6
                style={{
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "red" }}>
                  Please check and confirm the above details
                </span>
              </h6>
            </div>
          </div>
          <div className="confirm">
            <Button className="confirm" size="large" onClick={handleSubmit}>
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
      sx={{margin:'1rem'}}
        open={snackbar}
        severity="success"
        autoHideDuration={2000} // Adjust as needed
        onClose={() => setSnackbar(false)}
        message={response}
      ></Snackbar>
    </Container>
  );
};
