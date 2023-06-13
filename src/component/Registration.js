import React, { useEffect } from 'react'
import { useState } from 'react';
import { Course } from './Course';
import { Education } from './Education';
import { Trainee} from './Trainee';
import { Referral } from './Referral';
import { Step, StepLabel, Stepper } from '@mui/material';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Header from './Header';

export default function Registration() {
  const [currentSection, setCurrentSection] = useState(1);
  const [messages, setMessages] =useState('');
  const [formData, setFormData] = useState({
    basicInfo: [],
    educationInfo : [],
    courseInfo : [],
    referralInfo : []
  });
  const [dropdown,setDropDown]=useState({
    course: [],
    qualification: [],
    batch: [],
    stream: [],
    college: [],
  })

  useEffect(() => {
    getDropDown();
  }, []);

  const getDropDown=()=>{
    axios.get('http://localhost:8080/utils/dropdown',{
      headers:{
        'spreadsheetId':'1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
      }
    }).then(response=>{
      setDropDown(response.data)
    }).catch(error=>{
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
    axios.post('http://localhost:8080/api/register',formData,{
      headers:{
        'spreadsheetId':'1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
      }
    }).then(response=>{
      setMessages("Registration done successfully!!!")
      console.log(formData);
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
      <Header/>
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
