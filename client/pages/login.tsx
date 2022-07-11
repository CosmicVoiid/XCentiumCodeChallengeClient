import type { NextPage, GetServerSideProps } from "next";
import Router from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Login.module.css";
import { useFormik } from "formik";

// checks if user is already logged in
// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
// 	try {
// 		await axios.get(process.env.NEXT_PUBLIC_SERVER_URL! + "/account/user", {
// 			withCredentials: true,
// 			headers: {
// 				"Content-Type": "application/json",
// 				Cookie: `${req.headers.cookie}`,
// 			},
// 		});

// 		// if user is logged in, redirect to home page
// 		return {
// 			redirect: {
// 				permanent: false,
// 				destination: "/",
// 			},
// 		};
// 	} catch {
// 		// if user is not logged in, continue loading log in page
// 		return {
// 			props: {},
// 		};
// 	}
// };

type Values = {
	username: string;
	password: string;
};

type Errors = {
	username?: string;
	password?: string;
};

// formik validation
const validate = (values: Values) => {
	const errors: Errors = {};
	if (!values.username) {
		errors.username = "Username Required";
	}
	if (!values.password) {
		errors.password = "Password Required";
	}

	return errors;
};

const Login: NextPage = () => {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isUser, setIsUser] = useState<boolean>(true);

	// formik set up
	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		validate,
		onSubmit: () => {
			handleSubmit();
		},
	});

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch(
					process.env.NEXT_PUBLIC_SERVER_URL! + "/account/user",
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				// return user's name if jwt auth is successful
				if (response.status === 200) {
					Router.push("/");
				} else {
					setIsUser(false);
				}
			} catch {
				// redirect to log in page if jwt auth is unsuccessful
				setIsUser(false);
				return;
			}
		};

		checkAuth();
	});

	// send api a post request to log in
	const handleSubmit = async () => {
		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_SERVER_URL! + "/account/login",
				{
					method: "POST",
					mode: "cors",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: formik.values.username,
						password: formik.values.password,
					}),
				}
			);
			if (response.status !== 200) {
				const userData = await response.json();
				setErrorMessage(userData.info);
			} else {
				Router.push("/");
			}
		} catch (err) {
			console.log(process.env.NEXT_PUBLIC_SERVER_URL!);
			console.log(err);
		}
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Login</title>
				<meta name="login page" content="user log in" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{!isUser && (
				<main className={styles.main}>
					<Image
						src="/logo.svg"
						alt="XCentium Logo"
						width={200}
						height={100}
					></Image>
					<div className={styles.mainContainer}>
						<h1 className={styles.header}>Log In</h1>
						<div className={styles.formContainer}>
							<form className={styles.form} onSubmit={formik.handleSubmit}>
								<label className={styles.label} htmlFor="username">
									Username
								</label>
								<input
									className={styles.textInput}
									type="text"
									id="username"
									name="username"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.username}
								/>
								{formik.touched.username && formik.errors.username ? (
									<div className={styles.errorMessage}>
										{formik.errors.username}
									</div>
								) : null}

								<label className={styles.label} htmlFor="password">
									Password
								</label>
								<input
									className={styles.textInput}
									type="password"
									id="password"
									name="password"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.password}
								/>
								{formik.touched.password && formik.errors.password ? (
									<div className={styles.errorMessage}>
										{formik.errors.password}
									</div>
								) : null}

								{errorMessage.length !== 0 && (
									<div className={styles.errorMessage}>{errorMessage}</div>
								)}

								<button
									className={styles.btn}
									type="submit"
									disabled={
										formik.values.username.length === 0 ||
										formik.values.password.length === 0
									}
								>
									Log In
								</button>
							</form>
						</div>
					</div>
				</main>
			)}
			{isUser && <div></div>}
		</div>
	);
};

export default Login;
