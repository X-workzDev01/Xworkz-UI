import React, { useEffect } from 'react'
import { useState } from 'react';
import { Course } from './Course';
import { Education } from './Education';
import { Trainee } from './Trainee';
import { Referral } from './Referral';
import { Step, StepLabel, Stepper } from '@mui/material';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Urlconstant } from '../constant/Urlconstant';


export default function Registration() {
  let navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(1);
  const [messages, setMessages] = useState('');
  const [formData, setFormData] = useState({
    basicInfo: [],
    educationInfo: [],
    courseInfo: [],
    referralInfo: []
  });
  const [dropdown, setDropDown] = useState({
    course: [],
    qualification: [],
    batch: [],
    stream: [],
    college: [],
  })

  useEffect(() => {
    getDropDown();
  }, []);

  const getDropDown = () => {
    axios.get(Urlconstant.url+'/utils/dropdown', {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setDropDown(response.data)
    }).catch(error => {
      console.log(error);
    })
  }
  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  //registration api call
  const handleFormSubmit = () => {
    axios.post(Urlconstant.url+'api/register', formData, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setMessages("Registration done successfully!!!")
      navigate("/x-workz/view")
    }).catch(error => {
      console.error(error);
    });
  };

  //dropdown api call

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Trainee
            formData={formData.basicInfo}
            setFormData={data => setFormData({ ...formData, basicInfo: data })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Education
            formData={formData.educationInfo}
            setFormData={data => setFormData({ ...formData, educationInfo: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
            dropdown={dropdown}
          />
        );
      case 3:
        return (
          <Course
            formData={formData.courseInfo}
            setFormData={data => setFormData({ ...formData, courseInfo: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
            dropdown={dropdown}
          />
        );
      case 4:
        return (
          <Referral
            formData={formData.referralInfo}
            setFormData={data => setFormData({ ...formData, referralInfo: data })}
            onNext={handleFormSubmit}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Container>
      <Header />
      <h2>Registration Form</h2>

      <div key={messages} style={{ color: 'Green' }} >
        <h4> {messages}</h4>
      </div>
      <Stepper activeStep={currentSection}>

        <Step>
          <StepLabel>Trainee</StepLabel>
        </Step>
        <Step>
          <StepLabel>Education</StepLabel>
        </Step>
        <Step>
          <StepLabel>Course</StepLabel>
        </Step>
        <Step>
          <StepLabel>Referral</StepLabel>
        </Step>
      </Stepper>
      {renderSection()}
    </Container>
  )
}
