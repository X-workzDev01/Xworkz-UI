import React from 'react'
import { useState } from 'react';
import { Course } from './Course';
import { Education } from './Education';
import { Trainee} from './Trainee';
import { Referral } from './Referral';
import { Step, StepLabel, Stepper } from '@mui/material';
import { Container } from 'react-bootstrap';

export default function Registration() {
  const [currentSection, setCurrentSection] = useState(1);
  const [messages, setMessages] =useState('');
  const [formData, setFormData] = useState({
    Trainee : [],
    Education : [],
    Course : [],
    Referral : []
  });
  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const handleFormSubmit = () => {
    // Handle form submission here
    setMessages("Registration done successfully!!!")
    console.log(formData);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Trainee
            formData={formData.Trainee}
            setFormData={data => setFormData({ ...formData, Trainee: data })}
            onNext={handleNext}
            
          />
        );
      case 2:
        return (
          <Education
            formData={formData.Education}
            setFormData={data => setFormData({ ...formData, Education: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
        case 3:
          return (
            <Course
              formData={formData.Course}
              setFormData={data => setFormData({ ...formData, Course: data })}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          );
          case 4:
            return (
              <Referral
                formData={formData.Referral}
                setFormData={data => setFormData({ ...formData, Referral: data })}
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
