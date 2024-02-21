import {
    Button,
    Container,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

export const Percentage = ({
    formData,
    setFormData,
    onNext,
    onPrevious,
}) => {
    const [sslcError, setSslcError] = useState("");
    const [pucError, setPucError] = useState("");
    const [degreeError, setDegreeError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "sslcPercentage") {
            if (!value) {
                setSslcError("SSLC (10th) Percentage is required");
            } else if (value < 1 || value > 99.99) {
                setSslcError("Percentage must be greater than 1 and less than 99.9");
            }else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                setSslcError("Only two decimals are allowed");
            } else {
                setSslcError("");    
            }
        }

        if (name === "pucPercentage") {
            if (!value) {
                setPucError("PUC Percentage is required");
            } else if (value < 1 || value > 99.99) {
                setPucError("Percentage must be greater than 1 and less than 99.9");
            }else if (value.length >5) {
                setPucError("Only two decimals are allowed");
            } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                setPucError("Only two decimals are allowed");
            }else {
                setPucError("");    
            }
        }

        if (name === "degreePercentage") {
            if (!value) {
                setDegreeError("Degree Percentage  is required");
            } else if (value < 1 || value > 99.99) {
                setDegreeError("Percentage must be greater than 1 and less than 99.9");
            }else if (value.length >5) {
                setDegreeError("Only two decimals are allowed");
            } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                setDegreeError("Only two decimals are allowed");
            }else {
                setDegreeError("");    
            }
        }
    };

    const isDisabled =
    !formData.sslcPercentage ||
    !formData.pucPercentage ||
    !formData.degreePercentage ||
    sslcError||pucError||degreeError;
    return (
        <Container maxWidth="sm">
            <h2>Percentage Details </h2>
            <Typography component="div" style={{ height: "50vh" }}>
                <Form>
                    <TextField
                        type="number"
                        label="SSLC or 10th Percentage"
                        name="sslcPercentage"
                        value={formData.sslcPercentage}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        variant="outlined"
                        required
                    />
                    {sslcError ? (
                        <Alert severity="error">{sslcError}</Alert>
                    ) : (
                        " "
                    )}
                    <TextField
                        type="number"
                        label="PUC or Diploma Percentage"
                        name="pucPercentage"
                        value={formData.pucPercentage}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        variant="outlined"
                        required
                    />
                    {pucError ? (
                        <Alert severity="error">{pucError}</Alert>
                    ) : (
                        " "
                    )}
                    <TextField
                        type="number"
                        label="Degree Percentage or CGPA"
                        name="degreePercentage"
                        value={formData.degreePercentage}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        variant="outlined"
                        required
                    />
                    {degreeError ? (
                        <Alert severity="error">{degreeError}</Alert>
                    ) : (
                        " "
                    )}
                </Form>
                <Button
                    style={{ marginTop: "20px" }}
                    variant="contained"
                    onClick={onPrevious}
                >
                    Previous
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                    style={{ marginTop: "20px" }}
                    variant="contained"
                    disabled={isDisabled}
                    onClick={onNext}
                >
                    Next
                </Button>
            </Typography>
        </Container>
    );
}