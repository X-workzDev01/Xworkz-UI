import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Popper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import {Textarea} from '@mui/joy';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import {TfiClose} from 'react-icons/tfi';
import {Urlconstant} from '../constant/Urlconstant';
import './PayFee.css';
import {useSelector} from 'react-redux';

export const PayFee = ({
  open,
  handleClose,
  traineeEmail,
  feesData,
  feesDetils,
}) => {
  const email = useSelector (state => state.loginDetiles.email);
  const [finalUpdateBalence, setFinalUpdateBalence] = useState ('');
  const [updateFeesData, setUpdateFeesData] = useState ({});
  const [amountError, setAmountError] = useState ('');
  const paidTo = ['Mamatha', 'Akshara', 'Amulya', 'Omkar'];
  const [loading, setLoading] = useState (false);
  const paymentMode = ['Online', 'Upi', 'Cash'];
  var selectlateFee = ['Yes', 'No'];

  const [lateFeesValue, setLateFeesValue] = useState ('');
  const [transactionErr, setTransactionErr] = useState ('');

  const [isConfirm, setIsConfirm] = useState (false);
  const [paidAmountError, setPaidAmountError] = useState ('');
  const [lateFeesError, setLateFeesError] = useState ('');
  const [balance, setBalance] = useState (0);
  const [response, setResponse] = useState ('');
  const [snackbar, setSnackbar] = useState (false);
  const [totalBalance, setTotalBalance] = useState (0);
  const [updatedTotalAmount, setupdatedTotalAmount] = useState ('');
  const [updatedBalance, setUpdatedBalance] = useState ('');
  const [confirmIsDisabled, setConfirmIsDisabled] = useState (false);
  const getCurrentDate = () => {
    const today = new Date ();
    const year = today.getFullYear ();
    const month = String (today.getMonth () + 1).padStart (2, '0');
    const day = String (today.getDate ()).padStart (2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect (
    () => {
      if (feesData.lateFees > 0) {
        setLateFeesValue ('Yes');
      } else {
        setLateFeesValue ('');
      }
      setUpdateFeesData ('');
      setPaidAmountError ('');
      setAmountError ('');
      setLateFeesError ('');
      setTotalBalance (feesData.totalAmount);
      setupdatedTotalAmount (totalBalance);
      setUpdatedBalance (balance);
      setBalance (feesData.balance);
    },
    [open, traineeEmail, handleClose, feesData]
  );

  const handlePay = () => {
    setIsConfirm (true);
  };
  const handleSubmit = () => {
    setConfirmIsDisabled (true);
    const feesDto = {
      admin: {
        updatedBy: email,
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
      comments: updateFeesData.comments,
    };
    updateFees (feesDto);
  };
  const handleSetData = e => {
    const {name, value} = e.target;
    setUpdateFeesData ({...updateFeesData, [name]: value});

    if (name === 'selectlateFees' && value === 'No') {
      setLateFeesError ('');
    }
    if (name === 'selectlateFees' && value === 'Yes') {
      setLateFeesError ('');
    }
    if (name === 'paidAmount' && value > 0) {
      setUpdateFeesData ({...updateFeesData, [name]: value});
      setPaidAmountError ('');
    } else if (name === 'paidAmount' && value <= 0) {
      setPaidAmountError ('Entered amount should be Greater Than 0 *');
    }
    if (name === 'paidAmount' && value <= feesData.balance) {
      setAmountError ('');
    } else if (name === 'paidAmount' && value >= feesData.balance) {
      setAmountError ('Enter Valid Amount');
    }
    if (name === 'lateFees') {
      setLateFeesError ('');
      setupdatedTotalAmount (totalBalance + Number (value));
      setUpdatedBalance (finalUpdateBalence + Number (value));
      setUpdateFeesData ({...updateFeesData, [name]: value});
    }
    if (name === 'lateFees' && value <= 0) {
      setLateFeesError ('Entered amount should be Greater Than 0 *');
      setupdatedTotalAmount (totalBalance);
    }

    if (name === 'paidAmount') {
      setUpdatedBalance (Number (balance) - Number (value));
      setFinalUpdateBalence (Number (balance) - Number (value));
    }
    if (
      (name === 'transectionId' && value !== '' && value.length < 5) ||
      (name === 'transectionId' && value !== '' && value.length > 14)
    ) {
      setTransactionErr ('Please Enter Valid Transaction ID');
    } else if (
      (name === 'transectionId' && value !== '' && value.length > 5) ||
      (name === 'transectionId' && value !== '' && value.length < 14)
    ) {
      setTransactionErr ('');
    }
  };

  const updateFees = feesDto => {
    setLoading (true);
    axios
      .put (Urlconstant.url + 'api/updateFeesDeties', feesDto)
      .then (response => {
        setResponse (response.data);
        if (response.status === 200) {
          setIsConfirm (false);
          feesDetils ();
          handleClose ();
          setLoading (false);
          setSnackbar (true);
          setBalance (0);
          setConfirmIsDisabled (false);
        }
      });
  };

  let isDisabled;
  if (updateFeesData.selectlateFees === 'Yes') {
    isDisabled =
      !updateFeesData.lateFees ||
      !updateFeesData.transectionId ||
      !updateFeesData.lastFeesPaidDate ||
      !updateFeesData.paidAmount ||
      !updateFeesData.followupCallbackDate ||
      !updateFeesData.paymentMode ||
      !updateFeesData.paidTo ||
      amountError ||
      transactionErr;
  } else {
    isDisabled =
      !updateFeesData.transectionId ||
      !updateFeesData.lastFeesPaidDate ||
      !updateFeesData.paidAmount ||
      !updateFeesData.followupCallbackDate ||
      !updateFeesData.paymentMode ||
      !updateFeesData.paidTo ||
      amountError ||
      transactionErr;
  }

  return (
    <Container maxWidth="sm">
      <Modal open={open} onClose={handleClose}>
        <div>
          <div className="containe">
            <div
              style={{
                display: 'flex',
                justifyItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  marginLeft: '18rem',
                  marginTop: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <span className="text">Pay fees</span>
              </div>
              <div
                style={{
                  marginLeft: '21rem',
                  marginTop: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                {' '}<TfiClose
                  color="inherit"
                  onClick={() => {
                    handleClose ();
                  }}
                />
              </div>
            </div>
            <div className="error">
              <span>
                {paidAmountError}
              </span>
              <span>
                {amountError}
              </span>
            </div>
            <div className="late-error error">
              <span>
                {lateFeesError}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                fontSize: '0.7rem',
                paddingBottom: '8px',
                marginRight: '4rem',
              }}
            >
              <span style={{color: 'red', padding: '2px'}}>
                {transactionErr}
              </span>
            </div>

            <Box>
              <Typography
                sx={{
                  paddingLeft: '2rem',
                  paddingRight: '2rem',
                  height: 'auto',
                  width: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  justifySelf: 'center',
                  marginBottom: '2rem',
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
                  sx={{width: '28.5%'}}
                  inputProps={{
                    max: getCurrentDate (),
                  }}
                />
                <TextField
                  sx={{backgroundColor: 'lightcyan'}}
                  InputProps={{
                    readOnly: true,
                  }}
                  name="totalAmount"
                  label="Total Amount *"
                  value={updatedTotalAmount}
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
                    sx={{backgroundColor: 'lightcyan'}}
                    label="balance "
                    placeholder="Enter Amount"
                    value={updatedBalance}
                    id="outlined-size-small"
                    size="small"
                    color="primary"
                    focused
                  />
                }
                <FormControl sx={{m: 1, minWidth: 120}}>
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
                      marginRight: '10px',
                      width: '200px',
                      fontSize: '12px',
                    }}
                  >
                    {paidTo.map ((item, index) => (
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
                      marginRight: '10px',
                      width: '200px',
                      fontSize: '12px',
                    }}
                  >
                    {paymentMode.map ((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '2.1rem',
                  marginBottom: '2rem',
                }}
              >
                <TextField
                  required
                  type="date"
                  name="followupCallbackDate"
                  onChange={handleSetData}
                  label="Fees Call Back Date"
                  id="outlined-size-small"
                  size="small"
                  color="primary"
                  focused
                  sx={{width: '27.5%', marginRight: '6.5%'}}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: getCurrentDate (),
                  }}
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
                    defaultValue={lateFeesValue}
                    name="selectlateFees"
                    onChange={handleSetData}
                    variant="outlined"
                    sx={{
                      marginRight: '3.9rem',
                      width: '200px',
                      fontSize: '12px',
                    }}
                  >
                    {selectlateFee.map ((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {updateFeesData || feesData.lateFees > 0
                  ? updateFeesData.selectlateFees === 'Yes' ||
                      feesData.lateFees > 0
                      ? <TextField
                          required
                          name="lateFees"
                          defaultValue={
                            feesData.lateFees ? feesData.lateFees : ''
                          }
                          sx={{backgroundColor: 'lightcyan'}}
                          label="Select Late Fees"
                          placeholder="Enter Late Fees Amount"
                          onChange={handleSetData}
                          id="outlined-size-small"
                          size="small"
                          color="primary"
                          focused
                        />
                      : ''
                  : ''}
              </div>

              <div className="field">
                <Textarea
                  sx={{
                    outlineOffset: '2rem',
                    width: '25rem',
                    marginBottom: '-2.8rem',
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
                {loading
                  ? <CircularProgress size={20} />
                  : <Button
                      disabled={isDisabled}
                      type="submit"
                      size="large"
                      onClick={handlePay}
                    >
                      Pay
                    </Button>}
              </div>
            </Box>
          </div>
        </div>
      </Modal>
      <Modal open={isConfirm} onClose={() => setIsConfirm (false)}>
        <Box className="popup">
          <div className="closed">
            <TfiClose color="inherit" onClick={() => setIsConfirm (false)} />
          </div>
          <div>
            <div
              style={{
                marginTop: '-10px',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '20px',
                marginbottom: '-20px',
              }}
            >
              <p style={{color: 'green', fontWeight: 'bold'}}>ACCEPTED HERE </p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <div
                style={{
                  fontSize: '9px',
                }}
              >
                <span
                  style={{
                    marginTop: '5px',
                    writingMode: 'vertical-lr',
                  }}
                >
                  hareeshahareeshahr746-2@okaxis
                </span>
              </div>
              <img
                src={`https://chart.googleapis.com/chart?chs=500x500&choe=UTF-8&chld=M|0&cht=qr&chl=upi%3A%2F%2Fpay%3Fpa%3Dhareeshahareeshahr746-2%40okaxis%26am%3D${updateFeesData.paidAmount}.00%26cu%3DINR`}
                height="150px"
                width="150px"
                alt="QR Code"
              />

            </div>

            <div
              style={{
                marginTop: '-10px',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '15px',
              }}
            >
              <p>Scan and Pay using QR Code </p>

              <TextField
                required
                label="Transaction id "
                placeholder="Enter Transaction Id"
                name="transectionId"
                onChange={handleSetData}
                id="outlined-size-small"
                size="small"
                color="primary"
                focused
              />
            </div>

            <div
              style={{
                display: 'flex',
                marginBottom: '0.5rem',
                paddingRight: '3.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '5rem',
              }}
            >

              <span style={{fontSize: '15px', fontWeight: 'bolder'}}>
                Amount Paid <span style={{marginLeft: '0.5rem'}}>:</span>
              </span>
              <span
                style={{
                  fontSize: '15px',
                  color: 'green',
                  fontWeight: 'bolder',
                  paddingLeft: '1rem',
                }}
              >
                {updateFeesData.paidAmount}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8rem',
              }}
            >
              <span style={{fontSize: '15px', fontWeight: 'bolder'}}>
                Remaining fee<span style={{marginLeft: '0.5rem'}}>:</span>
                <span
                  style={{
                    fontSize: '15px',
                    color: 'red',
                    marginLeft: '0.2rem',
                  }}
                >
                  {updatedBalance}
                </span>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '-0.2rem',
                justifyContent: 'center',
              }}
            >
              <h6
                style={{
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{color: 'red'}}>
                  Please check and confirm the above details
                </span>
              </h6>
            </div>
          </div>
          <div className="confirm">
            <Button
              disabled={confirmIsDisabled}
              className="confirm"
              size="large"
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
        sx={{margin: '1rem'}}
        open={snackbar}
        severity="success"
        autoHideDuration={2000} // Adjust as needed
        onClose={() => setSnackbar (false)}
        message={response}
      />
    </Container>
  );
};
