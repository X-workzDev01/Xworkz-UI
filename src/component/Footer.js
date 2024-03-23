import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

function Footer() {
	return (
		<footer className="footer-section">
			<div className="container">
				<div className="footer-content pt-5 pb-5" />
			</div>
			<div className="footer-icon">
				<a href="https://www.facebook.com/xworkzdevelopmentcenter/">
					<FaFacebook />
				</a>
				<a href="https://twitter.com/workz_x">
					<FaSquareXTwitter />
				</a>
				<a href="https://instagram">
					<FaInstagram />
				</a>
			</div>
			<div className="copyright-area">
				<div className="container">
					<div className="row">
						<div className="col-xl-6 col-lg-6 text-center text-lg-left">
							<div className="copyright-text">
								<p>Copyright &copy; 2022, All Right Reserved </p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
