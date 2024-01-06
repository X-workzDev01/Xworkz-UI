import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./PayFee.css";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";
import { DataGrid } from "@mui/x-data-grid";
import { FormControl } from "react-bootstrap";
import Popup from "reactjs-popup";

export const FeesHistory = ({ isOpen, handleClose, row }) => {
  console.log(row);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const initialPageSize = 10;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });

  const columns = [
    {
      headerName: "Email",
      width: 220,
      valueGetter: (parm) => parm.row.email,
    },
    {
      field: "LastFeesPaidDate",
      headerName: "LastFeesPaidDate",
      width: 150,
      valueGetter: (param) => param.row.lastFeesPaidDate,
    },
    {
      field: "Transection Id",
      headerName: "Contact Number",
      width: 120,
      valueGetter: (param) => param.row.transectionId,
    },
    {
      field: "paidAmount",
      headerName: "Course",
      width: 120,
      valueGetter: (param) => param.row.paidAmount,
    },
    {
      field: "Payment Mode",
      headerName: "Payment mode",
      width: 90,
      valueGetter: (param) => param.row.paymentMode,
    },
    {
      field: "Paid To",
      headerName: "PaidTo",
      width: 100,
      valueGetter: (param) => param.row.paidTo,
    },

    {
      field: "Followup Callback Date",
      headerName: "Followup Callback Date",
      width: 120,
      valueGetter: (param) => param.row.followupCallbackDate,
    },
  ];

  return (
    <Container>
      <Modal open={isOpen} onClose={handleClose}>
        <div
          style={{
            height: "auto",
            width: "57.2rem",
            borderRadius: "1.2rem",
            backgroundColor: "white",
            transform: "translate(20rem,9rem)",
          }}
        >
          <div className="closed">
            <TfiClose color="inherit" onClick={() => handleClose()} />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <DataGrid
              columns={columns}
              rows={row}
              pagination
              autoHeight
              paginationModel={paginationModel}
              pageSizeOptions={[5, 10, 15, 20]}
              rowCount={row.length}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              keepNonExistentRowsSelected
            />
          </div>
        </div>
      </Modal>
    </Container>
  );
};