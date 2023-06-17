import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import { TextField } from '@mui/material';
import axios from 'axios';

export default function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = (event) => {
        //alert("search data")
        setSearchValue(event.target.value);
    };

    const fetchSuggestions = async () => {
        const response = await axios.get('http://localhost:8080/trainee/byname/'+searchValue,{
          headers: {
            'spreadsheetId':'1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
          }
        });
        setSuggestions(response.data);
        console.log(response.data)
      };

    useEffect(() => {
        if (searchValue.length === 3) {
          console.log(searchValue)
          fetchSuggestions();
        }
      }, [searchValue]);
    


    return (
        <div>Search
        
            <h3>Search</h3>
            <TextField
                label="Search"
                variant="outlined"
                value={searchValue}
                onChange={handleSearchChange}
            />
        </div>
    )
}
