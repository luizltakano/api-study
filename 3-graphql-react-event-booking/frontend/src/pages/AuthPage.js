import React, { Component } from "react";
import axios from "axios";

import "./AuthPage.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
	state = {
		isLogin: true,
	};

	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.emailEl = React.createRef();
		this.passwordEl = React.createRef();
	}

	switchModeHandler = () => {
		this.setState((prevState) => {
			return { isLogin: !prevState.isLogin };
		});
	};

	submitHandler = async (event) => {
		event.preventDefault();
		const email = this.emailEl.current.value;
		const password = this.passwordEl.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}

		let requestBody = {
			query: `
                    query Login($email: String!, $password: String!) {
                        login(email: $email, password: $password){
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `,
			variables: {
				email: email,
				password: password,
			},
		};

		if (!this.state.isLogin) {
			requestBody = {
				query: `
                    mutation CreateUser($email: String!, $password: String!) {
                        createUser(userInput: {email: $email, password: $password}){
                            _id
                            email
                        }
                    }
                `,
				variables: {
					email: email,
					password: password,
				},
			};
		}

		try {
			const res = await axios("http://localhost:8000/graphql", {
				method: "POST",
				timeout: 5000,
				headers: {
					"Content-Type": "application/json",
				},
				data: requestBody,
			});

			const data = res.data.data;

			if (res.status !== 200 && res.status !== 201) {
				throw new Error("Failed");
			}

			if (data.login.token) {
				this.context.login(
					data.login.userId,
					data.login.token,
					data.login.tokenExpiration
				);
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return (
			<form className="auth-form" onSubmit={this.submitHandler}>
				<div className="form-control">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						placeholder="john@email.com"
						ref={this.emailEl}
					/>
				</div>
				<div className="form-control">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						placeholder="MySecretPassword"
						ref={this.passwordEl}
					/>
				</div>
				<div className="form-actions">
					<button
						className="btn btn__secondary"
						type="button"
						onClick={this.switchModeHandler}
					>
						{this.state.isLogin ? "Go to Signup" : "Go to Login"}
					</button>
					<button className="btn" type="submit">
						{this.state.isLogin ? "Login" : "Signup"}
					</button>
				</div>
			</form>
		);
	}
}

export default AuthPage;
