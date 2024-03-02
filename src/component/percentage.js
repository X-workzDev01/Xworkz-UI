import {
    Button,
    Container,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

export const Percentage = ({
    formData,
    setFormData,
    onNext,
    onPrevious,
}) => {

    useEffect(() => {
        setSslcValue((formData.sslcPercentage / 10 + 0.7).toFixed(2));
        setPucValue((formData.pucPercentage / 10 + 0.7).toFixed(2));
        setDegreeValue((formData.degreePercentage / 10 + 0.7).toFixed(2));

    }, []);
    const [sslcValue, setSslcValue] = useState("");
    const [pucValue, setPucValue] = useState("");
    const [degreeValue, setDegreeValue] = useState("");

    const [sslcError, setSslcError] = useState("");
    const [pucError, setPucError] = useState("");
    const [degreeError, setDegreeError] = useState("");

    const [sslcToPerc, setSslcToPerc] = useState("");
    const [pucToPerc, setPucToPerc] = useState("");
    const [degreeToPerc, setDegreeToPerc] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "sslcPercentage") {
            setSslcValue(value);
            if (!value) {
                setSslcError("SSLC (10th) Percentage is required");
                setSslcToPerc("");
            }
            else if (value < 1 || value > 99.99) {
                setSslcError("Enter proper percentage");
            } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                setSslcError("Only two decimals are allowed");
            } else {
                setSslcToPerc("");
                setSslcError("");
            }
            if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
                setSslcToPerc(((value - .7) * 10).toFixed(2) + "%");
            }
        }

        if (name === "pucPercentage") {
            setPucValue(value);
            if (!value) {
                setPucError("PUC Percentage is required");
                setPucToPerc("");
            } else if (value < 1 || value > 99.99) {
                setPucError("Enter proper percentage");
            } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                setPucError("Only two decimals are allowed");
            } else {
                setPucToPerc("");
                setPucError("");
            }

            if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
                setPucToPerc(((value - .7) * 10).toFixed(2) + "%");
            }
        }

        if (name === "degreePercentage") {
            setDegreeValue(value);
            if (!value) {
                setDegreeError("Degree Percentage  is required");
                setDegreeToPerc("");
            } else if (value < 1 || value > 99.99) {
                setDegreeError("Enter proper percentage");
            } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                setDegreeError("Only two decimals are allowed");
            } else {
                setDegreeToPerc("");
                setDegreeError("");
            }
            if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
                setDegreeToPerc(((value - .7) * 10).toFixed(2) + "%");
            }
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === "sslcPercentage") {
            if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
                setFormData({ ...formData, [name]: ((value - .7) * 10).toFixed(2) });
            }
        }

        if (name === "pucPercentage") {
            if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
                setFormData({ ...formData, [name]: ((value - .7) * 10).toFixed(2) });
            }
        }

        if (name === "degreePercentage") {
            if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
                setFormData({ ...formData, [name]: ((value - .7) * 10).toFixed(2) });
            }
        }
    };

    const isDisabled =
        !formData.sslcPercentage ||
        !formData.pucPercentage ||
        !formData.degreePercentage ||
        sslcError || pucError || degreeError;
    return (
        <Container maxWidth="sm">
            <h2>Percentage Details </h2>
            <Typography component="div" style={{ height: "50vh" }}>
                <Form>
                    <TextField
                        type="number"
                        label="SSLC or 10th Percentage"
                        name="sslcPercentage"
                        value={sslcValue?sslcValue:null}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
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
                    {sslcToPerc ? (
                        <Alert severity="info">{sslcToPerc}</Alert>
                    ) : (
                        " "
                    )}
                    <TextField
                        type="number"
                        label="PUC or Diploma Percentage"
                        name="pucPercentage"
                        value={pucValue?pucValue:null}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
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
                    {pucToPerc ? (
                        <Alert severity="info" style={{ textAlign: "center" }}>{pucToPerc}</Alert>
                    ) : (
                        " "
                    )}
                    <TextField
                        type="number"
                        label="Degree Percentage or CGPA"
                        name="degreePercentage"
                        value={degreeValue?degreeValue:null}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
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
                    {degreeToPerc ? (
                        <Alert severity="info">{degreeToPerc}</Alert>
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