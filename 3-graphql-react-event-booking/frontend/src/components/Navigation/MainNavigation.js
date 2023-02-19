import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import "./MainNavigation.css";

const mainNavigation = (props) => (
	<AuthContext.Consumer>
		{(context) => {
			return (
				<header>
					<div className="main-navigation__logo">
						<NavLink to="/">E-event</NavLink>
					</div>
					<nav className="main-navigation__items">
						<ul>
							<li>
								<NavLink to="/events">Events</NavLink>
							</li>
							{context.token && (
								<React.Fragment>
									<li>
										<NavLink to="/bookings">Bookings</NavLink>
									</li>
									<li>
										<button type="button" onClick={context.logout}>
											Logout
										</button>
									</li>
								</React.Fragment>
							)}
							{!context.token && (
								<li>
									<NavLink to="/auth">Login</NavLink>
								</li>
							)}
						</ul>
					</nav>
				</header>
			);
		}}
	</AuthContext.Consumer>
);

export default mainNavigation;
