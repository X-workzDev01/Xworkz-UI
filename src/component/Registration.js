import React, { useEffect } from "react";
import { useState } from "react";
import { Course } from "./Course";
import { Education } from "./Education";
import { Trainee } from "./Trainee";
import { Referral } from "./Referral";
import { Step, StepLabel, Stepper } from "@mui/material";
import { Container } from "react-bootstrap";
import axios from "axios";
import Header from "./Header";
import { Urlconstant } from "../constant/Urlconstant";
import {Navigate, Route, Router } from "react-router-dom";

export default function Registration() {
  const email = sessionStorage.getItem("userId");
  const [currentSection, setCurrentSection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [batchDetiles, setBatchDetiles] = useState("");
  const [messages, setMessages] = useState("");
  const [formData, setFormData] = useState({
    basicInfo: [],
    educationInfo: [],
    courseInfo: [],
    othersDto: [],
    adminDto: { createdBy: email },
  });
  const [dropdown, setDropDown] = useState({
    course: [],
    qualification: [],
    batch: [],
    stream: [],
    college: [],
  });

  useEffect(() => {
    getDropDown();
  }, []);

  const getDropDown = () => {
    axios
      .get(Urlconstant.url + "utils/dropdown", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        setDropDown(response.data);
      })
      .catch((error) => {});

    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })

      .then((res) => {
        setBatchDetiles(res.data);
      })
      .catch((e) => {});
  };
  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const handleFormSubmit = (e) => {
    setIsLoading(true);
    axios
      .post(Urlconstant.url + "api/register", formData, {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        setMessages("Registration done successfully!!!");
        setIsLoading(false);
        setFormData({
          basicInfo: [],
          educationInfo: [],
          courseInfo: [],
          othersDto: [],
          adminDto: { createdBy: email },
        });
        setCurrentSection(1);
        Navigate(Urlconstant.navigate + "register");
      })
      .catch((error) => {});
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Trainee
            formData={formData.basicInfo}
            setFormData={(data) => {
              setMessages("");
              setFormData({ ...formData, basicInfo: data });
            }}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Education
            formData={formData.educationInfo}
            setFormData={(data) =>
              setFormData({ ...formData, educationInfo: data })
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
            dropdown={dropdown}
          />
        );
      case 3:
        return (
          <Course
            formData={formData.courseInfo}
            setFormData={(data) =>
              setFormData({ ...formData, courseInfo: data })
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
            dropdown={dropdown}
            batchDetiles={batchDetiles}
          />
        );
      case 4:
        return (
          <Referral
            formData={formData.othersDto}
            setFormData={(data) => {
              setFormData({ ...formData, othersDto: data });
            }}
            onNext={handleFormSubmit}
            onPrevious={handlePrevious}
            loading={isLoading}
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

      <div key={messages} style={{ color: "Green" }}>
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
  );
}
