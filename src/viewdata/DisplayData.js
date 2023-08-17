import axios from 'axios';
import React, { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Header from '../component/Header';
import { Urlconstant } from '../constant/Urlconstant';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function DisplayData() {
 //const [gridApi, setGridApi] = useState(null);
  //const [gridColumnApi, setGridColumnApi] = useState(null);
  //const [error, setError] = useState();
  const navigate = useNavigate();

  const editButtonRenderer = (props) => (
    <Button
      onClick={() => props.onEditClick(props.data)}
    >
      Edit
    </Button>
  );
  const handleEditClick = (rowData) => {
    // Navigate to the register page and pass the rowData as a URL parameter
    navigate(`/register?edit=true`, { state: { rowData } });
  };

  const columnDefs = [
    {
      headerName: 'ID', field: 'id',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter', enablePivot: true
    },
    {
      headerName: 'Trainee Name', field: 'basicInfo.traineeName',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter', enablePivot: true
    },
    {
      headerName: 'Contact Number', field: 'basicInfo.contactNumber',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Email', field: 'basicInfo.email',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Qualification', field: 'educationInfo.qualification',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Stream', field: 'educationInfo.stream',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Year of Passout', field: 'educationInfo.yearOfPassout',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    {
      headerName: 'College Name', field: 'educationInfo.collegeName',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Course', field: 'courseInfo.course',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    { headerName: 'Branch', field: 'courseInfo.branch', cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter' },
    {
      headerName: 'Batch', field: 'courseInfo.batch',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Referral Name', field: 'referralInfo.referalName',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter', hide: true
    },
    {
      headerName: 'Referral Contact Number', field: 'referralInfo.referalContactNumber',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter', hide: true
    },
    {
      headerName: 'Comments', field: 'referralInfo.comments',
      cellStyle: { textAlign: 'center' }, filter: 'agTextColumnFilter', hide: true
    },
    {
      headerName: 'Actions',
      cellRenderer: 'editButtonRenderer', // Custom cell renderer for the "Edit" button
      cellRendererParams: {
        onEditClick: handleEditClick, // Event handler for the "Edit" button click
      },
    },
  ];
  const defaultColDef = {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    floatingFilter: true
  };

  const serverSideDatasource = {
    getRows: (params) => {
      let { startRow} = params.request;
      axios.get(Urlconstant.url + "api/" + `readData?startingIndex=${startRow}&maxRows=15`, {
        headers: {
          'spreadsheetId': Urlconstant.spreadsheetId
        }
      }).then((response) => {
        params.successCallback(response.data.sheetsData, response.data.size);
      }).catch((error) => {
        console.error('Error fetching data:', error);
        params.failCallback();
      });
    },
  };

  const sideBar = useMemo(() => {
    return {
      toolPanels: ['columns'],
      //pivot: false
    };
  }, []);
  return (
    <div className="ag-theme-alpine" style={{ height: '100vh', width: '100%' }}>
      <Header />
      <h1>GridView</h1>
      <div className="ag-search-wrapper">       
      </div>
      <h1>Trainee Details</h1>
      <AgGridReact
        columnDefs={columnDefs}
        rowModelType="serverSide"
        serverSideDatasource={serverSideDatasource}
        pagination={true}
        defaultColDef={defaultColDef}
        paginationPageSize={15}
        animateRows={true}
        maxConcurrentDatasourceRequests={1}
        sideBar={sideBar}
        cacheBlockSize={15}
        frameworkComponents={{
          editButtonRenderer: editButtonRenderer,
        }}
      />
    </div>
  );
}
