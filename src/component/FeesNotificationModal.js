import React, { useEffect, useState } from "react";
import { RxCountdownTimer } from "react-icons/rx";

import { Avatar, Popover, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";

function stringToColor(string) {
	let hash = 0;
	let i;
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	return color;
}

function stringAvatar(name) {
	let avatarText = "";
	if (name.includes(" ")) {
		const [firstName, lastName] = name.split(" ");
		avatarText = `${firstName[0]}${lastName[0]}`;
	} else {
		avatarText = name[0];
	}

	return {
		sx: {
			bgcolor: stringToColor(name)
		},
		children: avatarText
	};
}
export const FeesNotificationModal = ({ plsOpen, feesData, handleClose }) => {
	// const [anchorEl, setAnchorEl] = useState(null);

	return (
		<div className="container-fluid">
			<Popover
				style={{ marginTop: "2.3rem" }}
				open={plsOpen}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
			>
				<Typography sx={{ p: 2 }}>
					<div
						style={{
							width: "23rem",
							maxHeight: "470px",
							// minWidth:"550px",
							overflowY: "auto",
							overflowX: "auto",
							marginRight: "-1rem"
						}}
					>
						{feesData.todayCandidates && feesData.todayCandidates.length > 0
							? <div>
									<div>
										<p
											style={{
												backgroundColor: "white",
												marginTop: "-1rem",
												textAlign: "center",
												marginLeft: "-20px",
												marginRight: "-2rem",
												color: "green",
												paddingBottom: "-6px",
												fontStyle: "bold"
											}}
										/>
										<div style={{ display: "flex", alignItems: "center" }}>
											<div
												style={{
													display: "flex",
													marginTop: "3px",
													justifyContent: "flex-start"
												}}
											>
												<RxCountdownTimer />
											</div>

											<span
												style={{
													display: "flex",
													marginLeft: "5rem",
													paddingTop: "2px"
												}}
											>
												Today
											</span>
											<span
												style={{
													display: "flex",
													marginLeft: "0.5rem",
													paddingTop: "2px"
												}}
											>
												{`${new Date().getDate()}/${new Date().getMonth() +
													1}/${new Date().getFullYear()}`}
											</span>
										</div>
										<div>
											<div>
												<hr style={{ paddingBottom: "-1rem" }} />
											</div>
											<div>
												{feesData.todayCandidates.map((v, k) =>
													<div style={{ paddingBottom: "0.7rem" }} key={k}>
														{v
															? <div
																	style={{
																		display: "flex",
																		justifyContent: "flex-start"
																	}}
																>
																	<Link
																		to={
																			Urlconstant.navigate +
																			`profile/${v.feesHistoryDto.email}`
																		}
																		style={{ color: "blue", fontSize: "14px" }}
																	>
																		<div
																			style={{
																				display: "flex",
																				justifyContent: "flex-start",
																				textTransform: "capitalize"
																			}}
																		>
																			<Avatar
																				style={{
																					width: "2rem",
																					height: "2rem"
																				}}
																				{...stringAvatar(v.name)}
																			/>

																			<span
																				style={{
																					display: "flex",
																					alignItems: "flex-start",
																					marginLeft: "20px",
																					paddingTop: "5px",
																					textTransform: "capitalize"
																				}}
																			>
																				{v.name} &nbsp;
																			</span>
																		</div>
																	</Link>
																	<span
																		style={{
																			display: "flex",
																			alignItems: "flex-start",
																			marginLeft: "5px",
																			paddingTop: "5.3px"
																		}}
																	>
																		{" "}{v.feesHistoryDto.email}
																	</span>
																	<span
																		style={{
																			display: "flex",
																			alignItems: "flex-start",
																			marginLeft: "5px",
																			paddingTop: "5.3px",
																			color: "green",
																			marginRight: "-20rem"
																		}}
																	>
																		{" "}{v.feesStatus}
																	</span>
																</div>
															: null}
													</div>
												)}
											</div>
										</div>
									</div>
									<div>
										<hr style={{ paddingBottom: "-1rem" }} />
									</div>
								</div>
							: ""}
						<div>
							{feesData.yesterdayCandidates &&
							feesData.yesterdayCandidates.length > 0
								? <div>
										<div />
										<div>
											<p
												style={{
													backgroundColor: "white",
													marginTop: "-1rem",
													textAlign: "center",
													marginLeft: "-20px",
													marginRight: "-2rem",
													paddingBottom: "-6px",
													fontStyle: "bold"
												}}
											/>
											<div style={{ display: "flex", alignItems: "center" }}>
												<div
													style={{
														display: "flex",
														marginTop: "3px",
														justifyContent: "flex-start"
													}}
												>
													<RxCountdownTimer />
												</div>

												<span
													style={{
														display: "flex",
														marginLeft: "5rem",
														paddingTop: "2px"
													}}
												>
													Yesterday
												</span>
												<span
													style={{
														display: "flex",
														marginLeft: "0.5rem",
														paddingTop: "2px"
													}}
												>
													{`${new Date().getDate() -
														1}/${new Date().getMonth() +
														1}/${new Date().getFullYear()}`}
												</span>
											</div>
											<div>
												<div>
													<hr style={{ paddingBottom: "-1rem" }} />
												</div>
												<div>
													{feesData.yesterdayCandidates.map((v, k) =>
														<div style={{ paddingBottom: "0.7rem" }} key={k}>
															<div
																style={{
																	display: "flex",
																	justifyContent: "flex-start"
																}}
															>
																{v
																	? <Link
																			to={
																				Urlconstant.navigate +
																				`profile/${v.feesHistoryDto.email}`
																			}
																			style={{
																				color: "blue",
																				fontSize: "14px"
																			}}
																		>
																			<div
																				style={{
																					display: "flex",
																					justifyContent: "flex-start",
																					textTransform: "capitalize"
																				}}
																			>
																				<Avatar
																					style={{
																						width: "2rem",
																						height: "2rem"
																					}}
																					{...stringAvatar(v.name)}
																				/>
																				<span
																					style={{
																						display: "flex",
																						alignItems: "flex-start",
																						marginLeft: "18px",
																						paddingTop: "7px",
																						textTransform: "capitalize"
																					}}
																				>
																					{v.name} &nbsp;
																				</span>
																			</div>
																		</Link>
																	: null}
																<span
																	style={{
																		display: "flex",
																		alignItems: "flex-start",
																		marginLeft: "5px",
																		paddingTop: "5.3px"
																	}}
																>
																	{v.feesHistoryDto.email}
																</span>
																<span
																	style={{
																		display: "flex",
																		alignItems: "flex-start",
																		marginLeft: "5px",
																		paddingTop: "5.3px",
																		color: "green",
																		marginRight: "-20rem"
																	}}
																>
																	{" "}{v.feesStatus}
																</span>
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
										<div>
											<hr style={{ paddingBottom: "-1rem" }} />
										</div>
									</div>
								: ""}
						</div>
						<div>
							{feesData.afterFourDayCandidates &&
							feesData.afterFourDayCandidates.length > 0
								? <div>
										<div
											style={{
												backgroundColor: "white",
												marginTop: "-1rem",
												textAlign: "center",
												marginLeft: "-20px",
												marginRight: "-2rem",
												color: "green",
												paddingBottom: "-6px",
												fontStyle: "bold"
											}}
										/>
										<div
											style={{
												display: "flex",
												paddingTop: "0.7rem",
												alignItems: "center"
											}}
										>
											<div
												style={{
													display: "flex",
													marginTop: "4px",
													justifyContent: "flex-start"
												}}
											>
												<RxCountdownTimer />
											</div>

											<span
												style={{
													display: "flex",
													marginLeft: "5rem",
													paddingTop: "2px"
												}}
											>
												After 4 day
											</span>
											<span
												style={{
													display: "flex",
													marginLeft: "0.5rem",
													paddingTop: "2px"
												}}
											>
												{`${new Date().getDate() + 4}/${new Date().getMonth() +
													1}/${new Date().getFullYear()}`}
											</span>
										</div>
										<div>
											<div>
												<hr style={{ paddingBottom: "-1rem" }} />
											</div>
											<div>
												{feesData.afterFourDayCandidates.map((v, k) =>
													<div style={{ paddingBottom: "0.7rem" }} key={k}>
														<div
															style={{
																display: "flex",
																justifyContent: "flex-start"
															}}
														>
															{v
																? <Link
																		to={
																			Urlconstant.navigate +
																			`profile/${v.feesHistoryDto.email}`
																		}
																		style={{ color: "blue", fontSize: "14px" }}
																	>
																		<div
																			style={{
																				display: "flex",
																				justifyContent: "flex-start",
																				textTransform: "capitalize"
																			}}
																		>
																			<Avatar
																				style={{
																					width: "2rem",
																					height: "2rem"
																				}}
																				{...stringAvatar(v.name)}
																			/>
																			<span
																				style={{
																					display: "flex",
																					alignItems: "flex-start",
																					marginLeft: "18px",
																					paddingTop: "7px",
																					textTransform: "capitalize"
																				}}
																			>
																				{v.name} &nbsp;
																			</span>
																		</div>{" "}
																	</Link>
																: null}
															<span
																style={{
																	display: "flex",
																	alignItems: "flex-start",
																	paddingTop: "5.3px"
																}}
															>
																{" "}{v.feesHistoryDto.email}
															</span>{" "}
														</div>
													</div>
												)}
											</div>
										</div>
										<div>
											<hr style={{ paddingBottom: "-1rem" }} />
										</div>
									</div>
								: ""}
						</div>
					</div>
					<p
						style={{
							backgroundColor: "white",
							marginTop: "-1rem",
							textAlign: "center",
							marginLeft: "-20px",
							marginRight: "-2rem",
							color: "green",
							paddingBottom: "-6px",
							fontStyle: "bold"
						}}
					/>
				</Typography>
			</Popover>
		</div>
	);
};
