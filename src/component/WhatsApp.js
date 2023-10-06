import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Container,
  Typography,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { Form } from 'react-bootstrap';
import {Send } from '@mui/icons-material';
import { Urlconstant } from '../constant/Urlconstant';

const WhatsAppLinkSender = ({ formData: initialFormData }) => {
  const [batchDetails, setBatchDetails] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const[error,setError]=useState('');
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState(initialFormData || { course: '', whatsAppLink: '' });

  const setFormDataWithDefault = (data) => {
    setFormData({
      course: data.courseName || '',
      whatsAppLink: data.whatsAppLink || '',
    });
  };

  const fetchData = useCallback(async (courseName) => {
    try {
        console.log(courseName);
      const response = await axios.get(
        Urlconstant.url + `api/getCourseDetails?courseName=${courseName}`,
        { headers: { spreadsheetId: Urlconstant.spreadsheetId } }
      );
      const data = response.data;
      setFormDataWithDefault(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    getDropDown();
  }, []);

  const getDropDown = () => {
    axios
      .get(Urlconstant.url + 'api/getCourseName?status=Active', {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((res) => {
        setBatchDetails(res.data);
      })
      .catch((error) => {
        console.error('Error fetching dropdown data:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setSelectedValue(value);
    fetchData(value);
  };

  const submit = async () => {
    setIsSending(true);
    try {
      const response = await axios.get(
        Urlconstant.url + `api/sendWhatsAppLink?courseName=${formData.course}`,
        {
          headers: {
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        }
      );
        if(response.data === 'true'){
            console.log('Data from submit URL:', response.data);
            setSuccessMessage('WhatsApp link sent successfully');
        }else{
            setError('WhatsApp Link already send');
        }
      
    } catch (error) {
       
      console.error('Error submitting data:', error);
    }finally {
        setIsSending(false);
    }
  };

//   const isDisabled = !formData.course;

  return (
    <Container maxWidth="sm">
    <h2>WhatsAppLinkSender</h2>
    <div key={successMessage} style={{ color: "Green" }}>
        <h4> {successMessage}</h4>
      </div>
      <div key={error} style={{ color: "Red" }}>
        <h4> {error}</h4>
      </div>
      <Typography component="div" style={{ height: '50vh' }}>

        <InputLabel id="demo-simple-select-label">Course</InputLabel>
        <Form>
          <Select
            name="course"
            value={formData.course}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
            onChange={handleInputChange}
          >
            {batchDetails.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>

          <InputLabel id="demo-simple-select-label">WhatsApp Link</InputLabel>
          <TextField
            name="whatsappLink"
            value={formData.whatsAppLink}
            required
            fullWidth
            readOnly
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          ></TextField>
        </Form>
        <Button variant="contained"  onClick={submit}
        disabled={isSending} startIcon={<Send />}>     
        {isSending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Send'
        )}
        </Button>
      </Typography>
    </Container>

  );
};

export default WhatsAppLinkSender;
