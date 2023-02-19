import { useState } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";

import "./App.css";
import AuthPage from "./pages/AuthPage";
import EventsPage from "./pages/EventsPage";
import BookingsPage from "./pages/BookingsPage";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

function App() {
	const [state, setState] = useState({
		userId: null,
		token: null,
	});

	const login = (userId, token, tokenExpiration) => {
		setState({ userId: userId, token: token });
	};

	const logout = () => {
		setState({ userId: null, token: null });
	};

	return (
		<BrowserRouter>
			<AuthContext.Provider
				value={{
					userId: state.userId,
					token: state.token,
					login: login,
					logout: logout,
				}}
			>
				<MainNavigation />
				<main className="main-content">
					<Routes>
						{state.token ? (
							<Route path="/" element={<Navigate to="/events" />} />
						) : (
							<Route path="/" element={<Navigate to="/auth" />} />
						)}
						{state.token ? (
							<Route path="/auth" element={<Navigate to="/events" />} />
						) : (
							<Route path="/auth" element={<AuthPage />} />
						)}
						<Route path="/events" element={<EventsPage />} />
						{state.token ? (
							<Route path="/bookings" element={<BookingsPage />} />
						) : (
							<Route path="/bookings" element={<Navigate to="/auth" />} />
						)}
					</Routes>
				</main>
			</AuthContext.Provider>
		</BrowserRouter>
	);
}

export default App;
