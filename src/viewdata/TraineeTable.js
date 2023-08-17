
// import React, { useState} from 'react';
// import SearchComponent from './SearchComponent';
// import ReusableDataGrid from './ReusableDataGrid';
// import { Urlconstant } from '../constant/Urlconstant';
// import axios from 'axios';
// import Button from '@mui/material/Button';

// function loadServerRows(page, pageSize) {
//     const startingIndex = page * pageSize;
//     const maxRows = pageSize;
//     const spreadsheetId = Urlconstant.spreadsheetId; // Replace this with the actual spreadsheet ID
  
//     const apiUrl = Urlconstant.url + `api/readData?startingIndex=${startingIndex}&maxRows=${maxRows}`;
//     const requestOptions = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         spreadsheetId: spreadsheetId,
//       },
//     };
//     return new Promise((resolve) => {
//       fetch(apiUrl, requestOptions)
//         .then((response) => response.json())
//         .then((data) => {
//           resolve({
//             rows: data.sheetsData.map((row) => ({ id: row.id.toString(), ...row })), // Merge and set id
//             rowCount: data.size, // Set rowCount to the total number of rows (size) in the dataset
//           });
//         })
//         .catch((error) => {
//           console.error('Error fetching data:', error);
//           resolve({ rows: [], rowCount: 0 }); // Return an empty dataset in case of an error
//         });
//     });
//   }
  
//   const handleEditClick = (row) => {
//     // setEditedRowData(row);
//     // setModalOpen(true);
//   };
  
//   function loadClientRows(page, pageSize, allData) {
//     const startingIndex = page * pageSize;
//     const endingIndex = Math.min(startingIndex + pageSize, allData.length);
  
//     return new Promise((resolve) => {
//       // Return the paginated portion of the data
//       resolve({
//         rows: allData,
//         rowCount: allData.length,
//       });
//     });
//   }
  
//   function searchServerRows(searchValue) {
//     const apiUrl = Urlconstant.url + `api/filterData?searchValue=${searchValue}`;
//     const requestOptions = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         spreadsheetId: Urlconstant.spreadsheetId,
//       },
//     };
  
//     return new Promise((resolve) => {
//       fetch(apiUrl, requestOptions)
//         .then((response) => response.json())
//         .then((data) => {
//           resolve({
//             rows: data.map((row) => ({ id: row.id.toString(), ...row })),
//             rowCount: data.size,
//           });
//         })
//         .catch((error) => {
//           console.error('Error fetching data:', error);
//           resolve({ rows: [], rowCount: 0 });
//         });
//     });
//   }
//   async function fetchFilteredData(searchValue) {
//     try {
//       const apiUrl = Urlconstant.url + `api/register/suggestion?value=${searchValue}`;
//       const requestOptions = {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           spreadsheetId: Urlconstant.spreadsheetId, // Replace with your actual token
//         },
//       };
//       const response = await axios.get(apiUrl, requestOptions);
//       console.log(response);
//       return response.data; // The API response already contains the list of suggestions without an id
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       return [];
//     }
//   }
  
//   function debounce(func, delay) {
//     let timeout;
//     return function executedFunction(...args) {
//       const later = () => {
//         timeout = null;
//         func(...args);
//       };
//       clearTimeout(timeout);
//       timeout = setTimeout(later, delay);
//     };
//   }
  

// const columns = [
//     { headerName: 'ID', field: 'id', flex: 1 },
//     { field: 'traineeName', headerName: 'Trainee Name', flex: 1, valueGetter: (params) => params.row.basicInfo.traineeName },
//     { field: 'email', headerName: 'Email', flex: 1, valueGetter: (params) => params.row.basicInfo.email },
//     { field: 'contactNumber', headerName: 'Contact Number', flex: 1, valueGetter: (params) => params.row.basicInfo.contactNumber },
//     { field: 'qualification', headerName: 'Qualification', flex: 1, valueGetter: (params) => params.row.educationInfo.qualification },
//     { field: 'stream', headerName: 'Stream', flex: 1, valueGetter: (params) => params.row.educationInfo.stream },
//     { field: 'yearOfPassout', headerName: 'Year of Passout', flex: 1, valueGetter: (params) => params.row.educationInfo.yearOfPassout },
//     { field: 'collegeName', headerName: 'College Name', flex: 1, valueGetter: (params) => params.row.educationInfo.collegeName },
//     { field: 'course', headerName: 'Course', flex: 1, valueGetter: (params) => params.row.courseInfo.course },
//     { field: 'branch', headerName: 'Branch', flex: 1, valueGetter: (params) => params.row.courseInfo.branch },
//     { field: 'batch', headerName: 'Batch', flex: 1, valueGetter: (params) => params.row.courseInfo.batch },
//     { field: 'referalName', headerName: 'Referral Name', flex: 1, valueGetter: (params) => params.row.referralInfo.referalName },
//     { field: 'referalContactNumber', headerName: 'Referral Contact Number', flex: 1, valueGetter: (params) => params.row.referralInfo.referalContactNumber },
//     { field: 'comments', headerName: 'Comments', flex: 1, valueGetter: (params) => params.row.referralInfo.comments },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 120,
//       renderCell: (params) => (
//         <Button variant="outlined" color="primary" onClick={() => handleEditClick(params.row)}>
//           Edit
//         </Button>
//       ),
//     }
// ];

// export default function TraineeTable() {
//   const initialPageSize = 10;

//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: initialPageSize,
//   });
//   const [gridData, setGridData] = useState({
//     rows: [],
//     rowCount: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [rowSelectionModel, setRowSelectionModel] = useState([]);
//   const [searchValue, setSearchValue] = useState([]);
//   const [autocompleteOptions, setAutocompleteOptions] = useState([]);
//   const [isModalOpen, setModalOpen] = React.useState(false);
//   const [editedRowData, setEditedRowData] = React.useState(null);
//   // ... other state variables and hooks

//   const handleSearchClick = () => {
//     searchServerRows(searchValue).then((newGridData) => {
//       setGridData(newGridData);
//       setPaginationModel({ page: 0, pageSize: initialPageSize });
//       setSearchValue('');
//     });
//   };

//   const handleEditClick = (row) => {
//     // Handle edit click logic
//   };

//   const handleSaveClick = () => {
//     // Handle save click logic
//   };

  






//   const handleAutocompleteChange = (event, newValue) => {
//     setSearchValue(newValue || ''); 

//   };


  

//   const debouncedFetchSuggestions = React.useMemo(
//     () => debounce((searchValue) => fetchFilteredData(searchValue)
//       .then((suggestions) => {
//         console.log(suggestions);
//         setAutocompleteOptions(suggestions);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching suggestions:', error);
//         setAutocompleteOptions([]);
//         setLoading(false);
//       }), 500), // Adjust the delay time (in milliseconds) as per your requirement
//     []
//   );

//   React.useEffect(() => {
//     let active = true;
//     setLoading(true);

//     if (searchValue === '') {
//       console.log("server rows");

//       // Load data using server-side pagination for the initial load or when search value is empty
//       loadServerRows(paginationModel.page, paginationModel.pageSize)
//         .then((newGridData) => {
//           if (active) {
//             setGridData(newGridData);
//             setLoading(false);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching data:', error);
//           if (active) {
//             setGridData({ rows: [], rowCount: 0 });
//             setLoading(false);
//           }
//         });
//     } else {
//       console.log("client search");


//       setLoading(false);
//       debouncedFetchSuggestions(searchValue);
//     }

//     return () => {
//       active = false;
//     };
//   }, [paginationModel.page, paginationModel.pageSize, searchValue]);


  

//   return (
//     <div>
//       <SearchComponent
//         autocompleteOptions={autocompleteOptions}
//         searchValue={searchValue}
//         setSearchValue={setSearchValue}
//         handleSearchClick={handleSearchClick}
//       />
//       <ReusableDataGrid
//         columns={columns}
//         rows={gridData.rows}
//         searchValue={searchValue}
//         paginationModel={paginationModel}
//         setPaginationModel={setPaginationModel}
//         rowSelectionModel={rowSelectionModel}
//         setRowSelectionModel={setRowSelectionModel}
//         loading={loading}
//         handleEditClick={handleEditClick}
//         handleSaveClick={handleSaveClick}
//         isModalOpen={isModalOpen}
//         editedRowData={editedRowData}
//       />
//     </div>
//   );
// }