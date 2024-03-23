import {
	Button,
	Container,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";

import axios from "axios";
import { Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";

export const Course = ({
	dropdown,
	formData,
	setFormData,
	onNext,
	onPrevious,
	batchDetiles
}) => {
	const [selectedValue, setSelectedValue] = useState(" ");

	const location = useLocation();

	const email = location.state && location.state.email;

	useEffect(
		() => {
			if (selectedValue) {
				fetchData();
			}
		},
		[selectedValue]
	);
	const fetchData = async () => {
		try {
			const response = await axios.get(
				Urlconstant.url + `api/getCourseDetails?courseName=${selectedValue}`,
				{ headers: { spreadsheetId: Urlconstant.spreadsheetId } }
			);
			const data = await response.data;
			// Update the formData state with fetched data
			setFormData({
				branch: data.branchName,
				trainerName: data.trainerName,
				batchType: data.batchType,
				course: data.courseName,
				batchTiming: data.startTime,
				startDate: data.startDate
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setSelectedValue(e.target.value);
	};

	const setSelect = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const isDisabled = !formData.course || !formData.offeredAs;

	return (
		<Container maxWidth="sm">
			<h2>Course Details</h2>
			<Typography component="div" style={{ height: "50vh" }}>
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
						{batchDetiles.map((item, index) =>
							<MenuItem value={item} key={index}>
								{item}
							</MenuItem>
						)}
					</Select>

					<InputLabel id="demo-simple-select-label">Branch </InputLabel>
					<TextField
						name="branch"
						value={formData.branch}
						required
						aria-readonly
						fullWidth
						onBlur={setSelect}
						margin="normal"
						id="outlined-basic"
						variant="outlined"
					/>
					<InputLabel id="demo-simple-select-label">Trainer Name</InputLabel>
					<TextField
						name="trainerName"
						value={formData.trainerName}
						required
						onBlur={setSelect}
						aria-readonly
						fullWidth
						margin="normal"
						id="outlined-basic"
						variant="outlined"
					/>
					<InputLabel id="demo-simple-select-label">Batch Type </InputLabel>

					<TextField
						name="batchType"
						onBlur={setSelect}
						value={formData.batchType}
						required
						aria-readonly
						fullWidth
						margin="normal"
						id="outlined-basic"
						variant="outlined"
					/>
					<InputLabel id="demo-simple-select-label">Batch Timing </InputLabel>

					<TextField
						name="startTime"
						onBlur={setSelect}
						value={formData.batchTiming}
						required
						aria-readonly
						fullWidth
						margin="normal"
						id="outlined-basic"
						variant="outlined"
					/>
					<InputLabel id="demo-simple-select-label">Start date</InputLabel>

					<TextField
						name="startTime"
						aria-readonly
						onBlur={setSelect}
						value={formData.startDate}
						required
						fullWidth
						margin="normal"
						id="outlined-basic"
						variant="outlined"
					/>
					<InputLabel id="demo-simple-select-label">Offered As</InputLabel>
					<Select
						name="offeredAs"
						value={formData.offeredAs || ""}
						onChange={setSelect}
						required
						fullWidth
						margin="normal"
						id="outlined-basic"
						variant="outlined"
					>
						{dropdown.offered.map((item, index) =>
							<MenuItem value={item} key={index}>
								{item}
							</MenuItem>
						)}
					</Select>
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
};

export default Course;
