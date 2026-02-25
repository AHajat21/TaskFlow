// make check for '@' and password characters client side

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../helper/supabaseClient.js'
import { useUser } from '../context/UserContext.jsx'

import styles from "../styles/Login.module.css"

const Login = () => {
	const { user, err, setErr, loading, setLoading } = useUser();
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const navigate = useNavigate();


	const isDisabled = loading || !email || password === "" || user != null;



	const validate = () => {
		setErr("")
		if (!email.includes("@")) setErr("Please enter a valid email");
    	if (password.length < 6) console.log("Password must be at least 6 characters");
	}

	const handleSignup = async () => {
		validate()
		if (err != "") return;
		setLoading(true)
		const {data, error} = await supabase.auth.signUp({email, password})
		setLoading(false)
		setPassword("")

		if (error) return setErr(error.message)
		navigate(`/${user.email.split("@")[0]}`, { replace: true })
	}

	const handleLogin = async () => {
		validate()
		if (err != "") return;
		setLoading(true)
		const {data, error} = await supabase.auth.signInWithPassword({email, password})
		setLoading(false)
		setPassword("")

		if (error) return setErr(error.message);
		navigate(`/${email.split("@")[0]}`, { replace: true })
	}

  	return (
		<div className={styles.background}>
			<div className={styles.loginContainer}>

				<h2 className={styles.heading}>Login</h2>
				<input
					className={styles.emailInput}
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					className={styles.pwdInput}
					type="password"
					placeholder="Password..."
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				{err && <p className={styles.error}>{err}</p>}
				{loading && <p>Loading...</p>}

				<div className={styles.buttonWrapper}>
					<button className={styles.loginButton}
						onClick={handleLogin}
						disabled={isDisabled}
					>
						Login
					</button>

					<button
						className={styles.signupButton}
						onClick={handleSignup}
						disabled={isDisabled}
						>
							Sign Up
					</button>
				</div>
			</div>
		</div>
  )
}

export default Login