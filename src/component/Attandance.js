import { PersonOutline } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import EditModal from "./EditModal";
import Header from "./Header";
import AttendanceModal from "./AttendanceModal";
import { useDispatch, useSelector } from "react-redux";
import { saveAttendanceCourseName } from "../store/attendence/Attendence";

async function loadServerRows(page, pageSize, courseName) {
	const startingIndex = page * pageSize;
	const maxRows = pageSize;
	const apiUrl =
		Urlconstant.url +
		`api/attendance/readData?startingIndex=${startingIndex}&maxRows=${maxRows}&courseName=${courseName}`;

	return new Promise(resolve => {
		fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				resolve({
					rows: data.attendanceData.map(row => ({
						...row,
						id: row.id.toString()
					})),
					rowCount: data.size
				});
			})
			.catch(error => {
				console.error("Error fetching attendance data:", error);
				resolve({ rows: [], rowCount: 0 });
			});
	});
}

function searchServerRows(searchValue, courseName) {
	const apiUrl =
		Urlconstant.url +
		`api/attendance/filterData/${courseName}?searchValue=${searchValue}`;
	return new Promise(resolve => {
		fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				resolve({
					rows: data.map(row => ({ id: row.id.toString(), ...row })),
					rowCount: data.size
				});
			})
			.catch(error => {
				console.error("Error fetching data:", error);
				resolve({ rows: [], rowCount: 0 });
			});
	});
}

export default function ControlledSelectionServerPaginationGrid() {
	const initialPageSize = 25;
	const [paginationModel, setPaginationModel] = React.useState({
		page: 0,
		pageSize: initialPageSize
	});
	const [gridData, setGridData] = React.useState({
		rows: [],
		rowCount: 0
	});
	const attendaceDropdown = useSelector(state => state.attendaceDropdown);
	const dispatch = useDispatch();

	const [handleOpen, setHandleOpen] = useState(false);
	const [loading, setLoading] = React.useState(false);
	const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState("");
	const [searchInputValue, setSearchInputValue] = React.useState("");
	const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [editedRowData, setEditedRowData] = React.useState(null);
	const [courseName, setCourseName] = React.useState(
		attendaceDropdown.attendanceCourseName
	);
	const [courseDropdown, setCourseDropdown] = React.useState("");
	const [totalClass, setTotalClass] = useState(0);
	const [course, setCourse] = useState("");
	const [id, setId] = useState("");
	const [selectedOption, setSelectedOption] = useState(null);
	const [isClearClicked, setIsClearClicked] = useState(false);

	useEffect(() => {
		refreshPageEveryTime();
		getActiveCourse();
	}, []);

	useEffect(
		() => {
			if (courseName) {
				getTotalClass();
			}
		},
		[courseName]
	);

	const handleCourseChange = event => {
		const courseName = event.target.value;
		dispatch(saveAttendanceCourseName(courseName));
		setCourseName(courseName);
	};

	function getTotalClass() {
		axios
			.get(
				Urlconstant.url +
					`api/attendance/getBatchAttendanceCount?courseName=${courseName}`
			)
			.then(response => {
				const batchAttendanceData = response.data;
				const key = Object.keys(batchAttendanceData)[0];
				setTotalClass(key);
			})
			.catch(error => {
				console.error("Error fetching total class data:", error);
			});
	}
	async function fetchFilteredData(searchValue, courseName) {
		try {
			const apiUrl =
				Urlconstant.url +
				`api/attendance/suggestion/${courseName}?value=${searchValue}`;

			const response = await axios.get(apiUrl);
			const suggestions = response.data.map(option => ({
				traineeName: option.name,
				email: option.email,
				label: `${option.name}-${option.email}`
			}));
			setAutocompleteOptions(suggestions);
			return suggestions;
		} catch (error) {
			console.error("Error fetching data:", error);
			setAutocompleteOptions([]);
			return [];
		}
	}
	const refreshPageEveryTime = () => {
		let active = true;
		setLoading(true);
		const fetchDataAndUpdateState = async () => {
			try {
				if (
					searchValue === "" ||
					(searchValue.length >= 1 && searchValue.length <= 3)
				) {
					const newGridData = await loadServerRows(
						paginationModel.page,
						paginationModel.pageSize,
						courseName
					);

					if (active) {
						setGridData(newGridData);
						setAutocompleteOptions([]);
						setLoading(false);
					}
				} else {
					const suggestions = await fetchFilteredData(
						searchValue,
						courseName,
						paginationModel.page,
						paginationModel.pageSize,
						setPaginationModel
					);

					if (active) {
						setAutocompleteOptions(suggestions);
						setLoading(false);
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				if (active) {
					setGridData({ rows: [], rowCount: 0 });
					setAutocompleteOptions([]);
					setLoading(false);
				}
			}
		};
		fetchDataAndUpdateState();
		return () => {
			active = false;
		};
	};

	const getActiveCourse = () => {
		axios
			.get(Urlconstant.url + "api/getCourseName?status=Active", {
				headers: {
					spreadsheetId: Urlconstant.spreadsheetId
				}
			})
			.then(response => {
				setCourseDropdown(response.data);
			})
			.catch(error => {});
	};
	const handleSearchClick = () => {
		searchServerRows(searchValue, courseName).then(newGridData => {
			setGridData(newGridData);
			setPaginationModel({ page: 0, pageSize: initialPageSize });
			setSearchInputValue("");
		});
	};
	const handleModelOpen = (batch, id) => {
		setHandleOpen(true);
		setCourse(batch);
		setId(id);
	};
	const handleClear = () => {
		dispatch(saveAttendanceCourseName(null));
		sessionStorage.setItem("searchName", "null");
		setCourseName("null");
		setTotalClass(0);
		setSearchValue("");
		setSelectedOption({ traineeName: "" });
	};
	const handleAutocompleteChange = (event, newValue) => {
		setSelectedOption(isClearClicked ? null : newValue);
		sessionStorage.setItem("searchName", newValue);
		setIsClearClicked(false);
	};
	React.useEffect(
		() => {
			refreshPageEveryTime();
		},
		[paginationModel.page, paginationModel.pageSize, searchValue, courseName]
	);

	const columns = [
		{
			field: "traineeName",
			headerName: "Trainee Name",
			width: 350,
			valueGetter: params => params.row.name
		},
		{
			field: "email",
			headerName: "Email",
			width: 350,
			valueGetter: params => params.row.email
		},
		{
			field: "course",
			headerNam1e: "Course",
			width: 450,
			valueGetter: params => params.row.courseName
		},

		{
			field: "totalAbsent",
			headerName: "Total Absent",
			width: 300,
			valueGetter: params => params.row.totalAbsent
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 120,
			renderCell: params =>
				<div>
					<Button
						variant="outlined"
						color="secondary"
						startIcon={<PersonOutline />}
						component={Link}
						to={Urlconstant.navigate + `profile/${params.row.email}`}
					>
						View
					</Button>
				</div>
		}
	];

	return (
		<div>
			<Header />

			<div
				className="search"
				style={{
					display: "flex",
					alignItems: "center",
					marginTop: "100px"
				}}
			>
				<Autocomplete
					options={autocompleteOptions}
					freeSolo
					id="free-solo-2-demo"
					disableClearable
					getOptionLabel={option => option.label}
					style={{ width: "22rem", padding: "10px 20px" }}
					value={selectedOption}
					onChange={handleAutocompleteChange}
					renderInput={params =>
						<TextField
							{...params}
							type="text"
							onChange={e => {
								const value = e.target.value;
								if (value.length >= 3) {
									setSearchValue(value);
									setPaginationModel({
										page: 0,
										pageSize: initialPageSize
									});
								}
								if (value.length >= 1 && value.length <= 3) {
									setPaginationModel({ page: 0, pageSize: initialPageSize });
								}
							}}
							placeholder="Search..."
						/>}
					renderOption={(props, option) =>
						<li {...props}>
							{option.label}
						</li>}
				/>
				<FormControl>
					<InputLabel id="demo-simple-select-label">Select Course</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						label="Course Name"
						name="courseName"
						value={courseName}
						required
						variant="outlined"
						sx={{
							marginRight: "10px",
							width: "200px",
							fontSize: "12px"
						}}
						onChange={handleCourseChange}
					>
						{Array.isArray(courseDropdown)
							? courseDropdown.map((item, k) =>
									<MenuItem value={item} key={k}>
										{item}
									</MenuItem>
								)
							: null}
					</Select>
				</FormControl>
				<div>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSearchClick}
					>
						Search
					</Button>
				</div>
				<div style={{ paddingLeft: "10px" }}>
					<Button variant="contained" color="primary" onClick={handleClear}>
						Clear
					</Button>
				</div>
				<div>
					<span style={{ paddingLeft: "15px", marginRight: "8px" }}>
						Total Class <span style={{ marginRight: "5px" }}>:</span>
						<span
							style={{
								backgroundColor: "darkgray",
								borderRadius: "15px",
								paddingTop: "5px",
								paddingLeft: "12px",
								paddingRight: "12px",
								padding: "4px"
							}}
						>
							{totalClass}
						</span>
					</span>
				</div>
			</div>
			<div style={{ height: "650px", width: "100%" }}>
				<DataGrid
					style={{ width: "100%" }}
					columns={columns}
					rows={gridData.rows}
					pagination
					paginationModel={paginationModel}
					pageSizeOptions={[5, 10, 15]}
					rowCount={gridData.rowCount}
					paginationMode={searchValue === "" ? "server" : "client"}
					onPaginationModelChange={setPaginationModel}
					onRowSelectionModelChange={newRowSelectionModel => {
						setRowSelectionModel(newRowSelectionModel);
					}}
					rowSelectionModel={rowSelectionModel}
					loading={loading}
					keepNonExistentRowsSelected
				/>
			</div>
			<EditModal
				open={isModalOpen}
				handleClose={() => setModalOpen(false)}
				rowData={editedRowData}
				setRowData={setEditedRowData}
				handleSaveClick={() => {
					setModalOpen(false);
				}}
			/>
			{id && course
				? <AttendanceModal
						open={handleOpen}
						handleClose={() => setHandleOpen(false)}
						id={id}
						batch={course}
					/>
				: ""}
		</div>
	);
}
