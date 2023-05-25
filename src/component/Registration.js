import React from 'react'
import { useState } from 'react';
import { Course } from './Course';
import { EducationDetails } from './EducationDetails';
import { TraineeInfo } from './TraineeInfo';
import { ReferralInfo } from './ReferralInfo';


export default function Registration() {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({

    TraineeInfo : [],
    EducationDetails : [],
    Course : [],
    ReferralInfo : []
  });
  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const handleFormSubmit = () => {
    // Handle form submission here
    console.log(formData);
  };
  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <TraineeInfo
            formData={formData.TraineeInfo}
            setFormData={data => setFormData({ ...formData, TraineeInfo: data })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <EducationDetails
            formData={formData.EducationDetails}
            setFormData={data => setFormData({ ...formData, EducationDetails: data })}
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
              <ReferralInfo
                formData={formData.ReferralInfo}
                setFormData={data => setFormData({ ...formData, ReferralInfo: data })}
                onNext={handleFormSubmit}
                onPrevious={handlePrevious}
              />
            );
        default:
          return null;
      }
    };
  return (
    <div>
      <h1>Registration</h1>
    {renderSection()}
    </div>
  )
}
