import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    console.log(searchText)
  };

  const handleSearch = () => {
    const response = axios.get('http://localhost:8080/trainee/byname/' + searchText, {
      headers: {
        'spreadsheetId': '1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
      }
    });
    setSuggestions(response.data);
    console.log(response.data)
  };

  return (
    <div>Search
      <Header />
      <h3>Search</h3>
      <Box display="flex" alignItems="center">
        <TextField
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
    </div>
  )
}
