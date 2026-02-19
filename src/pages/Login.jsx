// Alert for when email verification is sent

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../helper/supabaseClient.js'
import { useUser } from '../context/UserContext.jsx'

import styles from "../styles/Login.module.css"

const Login = () => {
	const { user, setUser } = useUser();
	const username = user ? user.email.split("@")[0] : "Guest"

	const {error, setError} = useUser()
	const {loading, setLoading} = useUser()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const pInp = useRef(null);

	const navigate = useNavigate();



	const handleSignup = async () => {
		setError("")
		setLoading(true)
		const {data, error} = await supabase.auth.signUp({email, password})
		setLoading(false)

		if (error) return setError(error.message)
	}

	const handleLogin = async () => {
		pInp.current.value = ""
		setError("")
		setLoading(true)
		const {data, error} = await supabase.auth.signInWithPassword({email, password})
		setLoading(false)

		if (error) {return setError(error.message)}
		navigate(`/${username}`, { replace: true })
	}

  	return (
		<div className={styles.loginContainer}>
		<div className={styles.loginForm}>

			<h2 className={styles.heading}>Login</h2>
			<input
				className={styles.emailInput}
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/> <br/>

			<input
				className={styles.pwdInput}
				ref={pInp}
				type="password"
				placeholder="Password..."
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/> <br/>

			{error && <p className={styles.error}>{error}</p>}
			{loading && <p>Loading...</p>}

			<div className={styles.buttonWrapper}>
				<button className={styles.loginButton}
					onClick={handleLogin}
					disabled={loading || !email || !password || user != null}
				>
					Login
				</button>

				<button
					className={styles.signupButton}
					onClick={handleSignup}
					disabled={loading || !email || !password || user != null}
					>
						Sign Up
				</button>
			</div>
		</div>
	</div>
  )
}

export default Login