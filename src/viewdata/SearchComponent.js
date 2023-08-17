// import React from 'react';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';

// function SearchComponent(
//     { 
//         autocompleteOptions,
//         searchValue,
//         setSearchValue,
//         handleSearchClick

//      }) {
//   return (
//     <div className="search" style={{ display: 'flex', alignItems: 'center', marginTop: '100px' }}>
//       <Autocomplete
//         options={autocompleteOptions}
//         freeSolo
//         id="free-solo-2-demo"
//         disableClearable
//         getOptionLabel={(option) => option}
//         style={{ width: '20vw', padding: '10px 20px' }}
//         onChange={(event, newValue) => setSearchValue(newValue)}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             type="text"
//             onChange={(e) => setSearchValue(e.target.value)}
//             placeholder="Search..."
//           />
//         )}
//       />
//       <Button variant="contained" color="primary" onClick={handleSearchClick}>
//         Search
//       </Button>
//     </div>
//   );
// }

// export default SearchComponent;