import { PersonOutline } from "@mui/icons-material";
import {
    Button,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import {
    saveBatchName,
    savebirthdayDate,
    savebirthdayMonth
} from "../store/birthday/Birthday";
export const BirthdayInfo = () => {
    const birthdayStore = useSelector(state => state.birthday);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const [batch, setBatch] = useState(birthdayStore.batchName);
    const [date, setDate] = useState(birthdayStore.date);
    const [birthdayMonth, setBirthdayMonth] = useState(birthdayStore.month);
    const initialPageSize = 25;
    const [batchDetiles, setBatchDetiles] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: initialPageSize
    });
    const [gridData, setGridData] = useState({
        rows: [],
        rowCount: 0
    });

    useEffect(
        () => {
            fetchingGridData(
                paginationModel.page,
                paginationModel.pageSize,
                date,
                batch,
                birthdayMonth,
            );
        },
        [batch, birthdayMonth, date, paginationModel]
    );
    useEffect(() => {
        getBatch();
    }, []);

    const getBatch = () => {
        axios
            .get(Urlconstant.url + "api/getCourseName?status=Active", {
                headers: {
                    spreadsheetId: Urlconstant.spreadsheetId
                }
            })
            .then(response => {
                setBatchDetiles(response.data);
            })
            .catch(error => { });
    };

    const fetchingGridData = (
        minIndex,
        maxIndex,
        date,
        batch,
        birthdayMonth,
    ) => {
        setIsOpen(true);
        const startingIndex = minIndex * maxIndex;
        const maxRows = maxIndex;
        const response = axios.get(
            Urlconstant.url +
            `api/birthdays?startingIndex=${startingIndex}&maxRows=${maxRows}&date=${date}&courseName=${batch}&month=${birthdayMonth}`
            , {
                headers: {
                    spreadsheetId: Urlconstant.spreadsheetId
                }
            });
        response.then(res => {
            setGridData({
                rows: res.data.listofBirthdays
                    ? res.data.listofBirthdays.map((row, id) => ({
                        ...row,
                        id: id
                    }))
                    : "",
                rowCount: res.data.size
            });
            setIsOpen(false);
        });
        response.catch(() => { });
    };
    const columns = [
        {
            field: "traineeName",
            headerName: "Trainee Name",
            valueGetter: params => params.row.basicInfoDto.traineeName,
            flex: 1
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            valueGetter: params => params.row.basicInfoDto.email
        },
        {
            field: "dateOfBirth",
            headerName: "Birthday",
            flex: 1,
            valueGetter: params => params.row.basicInfoDto.dateOfBirth
        },
        {
            field: "courseName",
            headerName: "Batch",
            flex: 1,
            valueGetter: params => params.row.courseName
        },
        {
            field: "birthDayMailSent",
            headerName: "Mail Sent",
            flex: 1,
            valueGetter: params => params.row.birthDayMailSent ? params.row.birthDayMailSent : "NA",
        },
        {
            flex: 1,
            headerName: "Action",
            field: "Action",
            renderCell: params =>
                <div>
                    <Button
                        color="secondary"
                        startIcon={<PersonOutline />}
                        variant="outlined"
                        LinkComponent={Link}
                        to={
                            Urlconstant.navigate +
                            `profile/${params.row.basicInfoDto.email}`
                        }
                    >
                        {" "}View
                    </Button>
                </div>
        }
    ];
    const handleSetData = event => {
        const { name, value } = event.target;
        if (name === "month") {
            setPaginationModel({ page: 0, pageSize: initialPageSize });
            setDate("null");
            dispatch(savebirthdayDate("null"));
            setBirthdayMonth(value);
            dispatch(savebirthdayMonth(value));
        }
        if (name === "date") {
            setPaginationModel({ page: 0, pageSize: initialPageSize });
            setBirthdayMonth("null");
            dispatch(savebirthdayMonth("null"));
            setDate(value);
            dispatch(savebirthdayDate(value));
        }
        if (name === "batch") {
            setPaginationModel({ page: 0, pageSize: initialPageSize });
            setBatch(value);
            dispatch(saveBatchName(value));
        }
    };
    const handleClear = () => {
        setPaginationModel({ page: 0, pageSize: initialPageSize });
        dispatch(savebirthdayMonth("null"));
        dispatch(savebirthdayDate("null"));
        dispatch(saveBatchName(null));
        setBatch("null");
        setBirthdayMonth("null");
        setDate("null");
    };
    return (
        <div style={{ marginTop: "7%", marginBottom: "2%", marginLeft: "0.7%" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginBottom: "1%"
                }}
            >
                <FormControl>
                    <InputLabel id="demo-simple-select-label">
                        <span>Select Course</span>
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Course"
                        value={
                            birthdayStore.batchName ? birthdayStore.batchName : "null"
                        }
                        required
                        name="batch"
                        onChange={handleSetData}
                        sx={{
                            marginRight: "10px",
                            width: "200px",
                            fontSize: "12px"
                        }}
                        size="medium"
                    >
                        <MenuItem value={"null"}> Select course </MenuItem>
                        {batchDetiles.map((item, index) =>
                            <MenuItem value={item} key={index}>
                                {item}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
                <TextField
                    type="date"
                    name="date"
                    label="Birthday Date"
                    id="outlined-size-small"
                    size="small"
                    value={birthdayStore.date ? birthdayStore.date : "null"}
                    color="primary"
                    sx={{
                        marginRight: "10px",
                        width: "200px",
                        fontSize: "12px"
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={handleSetData}
                />

                <TextField
                    type="month"
                    name="month"
                    label="Birthday Month"
                    id="outlined-size-small"
                    size="small"
                    value={birthdayStore.month ? birthdayStore.month : "null"}
                    color="primary"
                    sx={{
                        marginRight: "10px",
                        width: "200px",
                        fontSize: "12px"
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={handleSetData}
                />
                <Button variant="contained" color="primary" onClick={handleClear}>
                    Clear
                </Button>
            </div>

            {isOpen ? <LinearProgress size={24} color="primary" ></LinearProgress> : ""}
            <DataGrid
                style={{ height: "42rem", width: "100%" }}
                columns={columns}
                rows={gridData ? gridData.rows : ""}
                pagination
                paginationModel={paginationModel}
                pageSizeOptions={[25, 50, 75, 100]}
                rowCount={gridData ? gridData.rowCount : ""}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                keepNonExistentRowsSelected
            />
        </div>
    );
};
