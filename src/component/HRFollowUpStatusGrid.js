import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

const HRFollowUpStatusGrid = ({ rows }) => {
  const columns = [
    { field: "attemptOn", headerName: "Attempted On", width: 150 },
    { field: "attemptBy", headerName: "Attempted By", width: 150 },
    { field: "attemptStatus", headerName: "Attempt Status", width: 150 },
    { field: "callDuration", headerName: "Call Duration", width: 100 },
    { field: "callBackDate", headerName: "Call Back Date", width: 150 },
    { field: "callBackTime", headerName: "Call Back Time", width: 150 },
    { field: "comments", headerName: "Comments", width: 200 },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 100px)",
        margin: "50px",
      }}
    >
      <div style={{ height: 400, width: "75%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={40} />
      </div>
    </div>
  );
};

export default HRFollowUpStatusGrid;
