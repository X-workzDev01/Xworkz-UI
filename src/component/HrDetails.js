import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import React from "react";
import { Urlconstant } from "../constant/Urlconstant";
import { gridStyle, style } from "../constant/FormStyle";
import { DataGrid } from "@mui/x-data-grid";
import { PersonOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { GridToolbar } from "@mui/x-data-grid";

const HRDetails = ({ open, handleClose, id }) => {
  const initialPageSize = 25;
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = React.useState({
    rows: [],
    rowCount: 0,
  });

  React.useEffect(() => {
    searchServerRows(paginationModel.page, paginationModel.pageSize, id).then(
      (newGridData) => {
        setGridData(newGridData);
      }
    );
  }, [open]);

  // ... (existing code)

  function searchServerRows(page, pageSize, id) {
    const startingIndex = page * pageSize;
    var apiUrl =
      Urlconstant.url +
      `api/hrdetails?startingIndex=${startingIndex}&maxRows=${25}&companyId=${id}`;

    return new Promise((resolve) => {
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const newGridData = {
            rows: data.clientHrDetails.map((row) => ({
              id: row.id.toString(),
              ...row,
            })),
            rowCount: data.size,
          };

          resolve(newGridData);
        })
        .catch((error) => {
          console.error("Error in API call", error);
          if (error.message.includes("500")) {
          }

          resolve({ rows: [], rowCount: 0 });
        });
    });
  }

  const columns = [
    {
      field: "hrScopName",
      headerName: "HR Spoc Name",
      flex: 1,
      valueGetter: (params) => params.row.hrScopName,
    },
    {
      field: "hrEmail",
      headerName: "HR E-mail",
      flex: 1,
      valueGetter: (params) => params.row.hrEmail,
    },
    {
      field: "hrContactNumber",
      headerName: " HR ContactNumber",
      flex: 1,
      valueGetter: (params) => params.row.hrContactNumber,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      valueGetter: (params) => params.row.designation,
    },
    {
      field: "status",
      headerName: "Comments",
      flex: 1,
      valueGetter: (params) => params.row.status,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PersonOutline />}
            component={Link}
            to={Urlconstant.navigate + `company/hr/${params.row.id}`}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        HR Details
        <IconButton
          color="inherit"
          onClick={handleClose}
          edge="start"
          aria-label="close"
          style={style}
        >
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={gridStyle}>
          <DataGrid
            rows={gridData.rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            paginationMode="server"
            rowCount={gridData.rowCount}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            keepNonExistentRowsSelected
            slots={{ toolbar: GridToolbar}}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default HRDetails;
