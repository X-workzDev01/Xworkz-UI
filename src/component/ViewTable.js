import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Urlconstant } from '../constant/Urlconstant';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';


function loadServerRows(page, pageSize) {
  const startingIndex = page * pageSize;
  const maxRows = pageSize;
  const spreadsheetId = Urlconstant.spreadsheetId; // Replace this with the actual spreadsheet ID

  const apiUrl = Urlconstant.url + `api/readData?startingIndex=${startingIndex}&maxRows=${maxRows}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      spreadsheetId: spreadsheetId,
    },
  };
  return new Promise((resolve) => {
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve({
          rows: data.sheetsData.map((row) => ({ id: row.id.toString(), ...row })), // Merge and set id
          rowCount: data.size, // Set rowCount to the total number of rows (size) in the dataset
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        resolve({ rows: [], rowCount: 0 }); // Return an empty dataset in case of an error
      });
  });
}



function loadClientRows(page, pageSize, allData) {
  const startingIndex = page * pageSize;
  const endingIndex = Math.min(startingIndex + pageSize, allData.length);

  return new Promise((resolve) => {
    // Return the paginated portion of the data
    resolve({
      rows: allData,
      rowCount: allData.length,
    });
  });
}

function searchServerRows(searchValue) {
  const apiUrl = Urlconstant.url + `api/filterData?searchValue=${searchValue}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      spreadsheetId: Urlconstant.spreadsheetId,
    },
  };

  return new Promise((resolve) => {
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve({
          rows: data.map((row) => ({ id: row.id.toString(), ...row })),
          rowCount: data.size,
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        resolve({ rows: [], rowCount: 0 });
      });
  });
}
async function fetchFilteredData(searchValue) {
  try {
    const apiUrl = Urlconstant.url + `api/register/suggestion?value=${searchValue}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        spreadsheetId: Urlconstant.spreadsheetId, // Replace with your actual token
      },
    };
    const response = await axios.get(apiUrl, requestOptions);
    return response.data; // The API response already contains the list of suggestions without an id
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

function debounce(func, delay) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}


export default function ControlledSelectionServerPaginationGrid() {

  
  const initialPageSize = 10; // Set the initial page size for server-side pagination

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = React.useState({
    rows: [],
    rowCount: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
  const searchFieldRef = React.useRef(null);

  // const handleSearchChange = async (event, newValue) => {
  //   setSearchValue(newValue);

  //   if (newValue) {
  //     const filteredData = await fetchFilteredData(newValue);
  //     setAutocompleteOptions(filteredData);
  //   } else {
  //     setAutocompleteOptions([]);
  //   }
  // };

  const handleSearchClick = () => {
   
      // Call the search API with the final search value when the search button is clicked
      searchServerRows(searchValue).then((newGridData) => {
        console.log(newGridData);
        setGridData(newGridData);
  
        // Reset the pagination model to initial state
        setPaginationModel({ page: 0, pageSize: initialPageSize });
  
        // Reset the search field after handling the search click
        
        setSearchInputValue('');
        console.log("set to null");
        console.log(searchInputValue);
        
      });
    
  };
 
  
  
  
  
  
  
  const handleAutocompleteChange = (event, newValue) => {
    setSearchValue(newValue || '');
  };

  

  
  const debouncedFetchSuggestions = React.useMemo(
    () => debounce((searchValue) => fetchFilteredData(searchValue)
      .then((suggestions) => {
        console.log(suggestions);
        setAutocompleteOptions(suggestions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
        setAutocompleteOptions([]);
        setLoading(false);
      }), 500), // Adjust the delay time (in milliseconds) as per your requirement
    []
  );

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    if (searchValue === '') {
      console.log("server rows");

      // Load data using server-side pagination for the initial load or when search value is empty
      loadServerRows(paginationModel.page, paginationModel.pageSize)
        .then((newGridData) => {
          if (active) {
            setGridData(newGridData);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          if (active) {
            setGridData({ rows: [], rowCount: 0 });
            setLoading(false);
          }
        });
    } else {
      console.log("client search");
      

      setLoading(false);
      debouncedFetchSuggestions(searchValue);
    }

    return () => {
      active = false;
    };
  }, [paginationModel.page, paginationModel.pageSize, searchValue]);
  

  return (
    <div>
      <div className="search" style={{ display: 'flex', alignItems: 'center', marginTop: '100px' }}>
        <Autocomplete
          options={autocompleteOptions}
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          getOptionLabel={(option) => option}
          style={{ width: '20vw' , padding : '10px 20px' }}
          // value={searchInputValue}
          onChange={handleAutocompleteChange}
          // onChange={handleSearchChange}
          // onChange={(e) => setSearchValue(e.target.value)}
          renderInput={(params) => (
            <TextField
            {...params}
            type="text"
            value={searchInputValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
          />
          )}
        />
        <Button variant="contained" color="primary" onClick={handleSearchClick}>
          Search
        </Button>
      </div>
      <div style={{ height: '650px', width: '100%'}}>
        <DataGrid
          columns={[
            { headerName: 'ID' , field: 'id', flex: 1 },
            { field: 'traineeName', headerName: 'Trainee Name', flex: 1, valueGetter: (params) => params.row.basicInfo.traineeName },
            { field: 'email', headerName: 'Email', flex: 1, valueGetter: (params) => params.row.basicInfo.email },
            { field: 'contactNumber', headerName: 'Contact Number', flex: 1, valueGetter: (params) => params.row.basicInfo.contactNumber },
            { field: 'qualification', headerName: 'Qualification', flex: 1, valueGetter: (params) => params.row.educationInfo.qualification },
            { field: 'stream', headerName: 'Stream', flex: 1, valueGetter: (params) => params.row.educationInfo.stream },
            { field: 'yearOfPassout', headerName: 'Year of Passout', flex: 1, valueGetter: (params) => params.row.educationInfo.yearOfPassout },
            { field: 'collegeName', headerName: 'College Name', flex: 1, valueGetter: (params) => params.row.educationInfo.collegeName },
            { field: 'course', headerName: 'Course', flex: 1, valueGetter: (params) => params.row.courseInfo.course },
            { field: 'branch', headerName: 'Branch', flex: 1, valueGetter: (params) => params.row.courseInfo.branch },
            { field: 'batch', headerName: 'Batch', flex: 1, valueGetter: (params) => params.row.courseInfo.batch },
            { field: 'referalName', headerName: 'Referral Name', flex: 1, valueGetter: (params) => params.row.referralInfo.referalName },
            { field: 'referalContactNumber', headerName: 'Referral Contact Number', flex: 1, valueGetter: (params) => params.row.referralInfo.referalContactNumber },
            { field: 'comments', headerName: 'Comments', flex: 1, valueGetter: (params) => params.row.referralInfo.comments },
          ]}
          rows={gridData.rows}
          pagination
          
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={gridData.rowCount}
          paginationMode={searchValue === '' ? 'server' : 'client'}
          onPaginationModelChange={setPaginationModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          loading={loading}
          keepNonExistentRowsSelected
        />
      </div>
    </div>
  );
}
