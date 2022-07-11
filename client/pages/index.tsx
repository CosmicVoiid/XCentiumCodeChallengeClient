import type { NextPage, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Router from "next/router";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

// checks if user is logged in via jwt token in http only cookie
// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
// 	try {
// 		const response = await axios.get(
// 			process.env.NEXT_PUBLIC_SERVER_URL! + "/account/user",
// 			{
// 				withCredentials: true,
// 				headers: {
// 					"Content-Type": "application/json",
// 					Cookie: `${req.headers.cookie}`,
// 				},
// 			}
// 		);

// 		// return user's name if jwt auth is successful
// 		return {
// 			props: {
// 				fullName: response.data.user,
// 			},
// 		};
// 	} catch {
// 		// redirect to log in page if jwt auth is unsuccessful
// 		return {
// 			redirect: {
// 				permanent: false,
// 				destination: "/login",
// 			},
// 		};
// 	}
// };

type Props = {
	fullName: string;
};

const Home: NextPage<Props> = (props: Props) => {
	// handle log out and redirect

	const [isUser, setIsUser] = useState<boolean>(false);
	const [name, setName] = useState<string>("");

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get(
					process.env.NEXT_PUBLIC_SERVER_URL! + "/account/user",
					{
						withCredentials: true,
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				// return user's name if jwt auth is successful
				setIsUser(true);
				setName(response.data.user);
			} catch {
				// redirect to log in page if jwt auth is unsuccessful
				Router.push("/login");
			}
		};

		checkAuth();
	});

	const handleLogout = async () => {
		const response = await fetch(
			process.env.NEXT_PUBLIC_SERVER_URL! + "/account/logout",
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (response.status === 200) {
			Router.push("/login");
		}
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Home</title>
				<meta name="home page" content="home" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{isUser && (
				<main className={styles.main}>
					<Image
						src="/logo.svg"
						alt="XCentium Logo"
						width={200}
						height={100}
					></Image>
					<div className={styles.mainContainer}>
						<div className={styles.btnContainer}>
							<button className={styles.btn} onClick={handleLogout}>
								Log Out
							</button>
						</div>
						<h1>Welcome {name}!</h1>
						<Image
							className={styles.hero}
							src="/dog.jpg"
							width={300}
							height={450}
							alt="party dog"
						/>
					</div>
				</main>
			)}
			{!isUser && <div></div>}
		</div>
	);
};

export default Home;
