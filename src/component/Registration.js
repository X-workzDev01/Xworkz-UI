import React from 'react'
import { useState } from 'react';
import { Course } from './Course';
import { Education } from './Education';
import { Trainee} from './Trainee';
import { Referral } from './Referral';
import { Step, StepLabel, Stepper } from '@mui/material';
import { Container } from 'react-bootstrap';
import axios from 'axios';

export default function Registration() {
  const [currentSection, setCurrentSection] = useState(1);
  const [messages, setMessages] =useState('');
  const [formData, setFormData] = useState({
    basicInfo: [],
    educationInfo : [],
    courseInfo : [],
    referralInfo : []
  });

  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const handleFormSubmit = () => {
    axios.post('https://ombn.in/Dream/api/register',formData,{
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
          />
        );
        case 3:
          return (
            <Course
              formData={formData.courseInfo}
              setFormData={data => setFormData({ ...formData, courseInfo: data })}
              onNext={handleNext}
              onPrevious={handlePrevious}
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
