import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext.jsx'

import styles from "../styles/Login.module.css"

const Login = () => {
	const { user, handleSignup, handleLogin } = useUser();
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const navigate = useNavigate();


	const isDisabled = loading || !email || !password;


	useEffect(() => {
		if (user && !loading) {
    		navigate(`/${user.email.split("@")[0]}`, { replace: true })
  		}
	}, [user, loading, navigate])

	const handleAuthSubmit = async (authMethod) => {
		let errorMessage = null

		if (password.length < 6) errorMessage = "Password must be at least 6 characters";
		if (!email.includes("@") || !email.includes(".")) errorMessage = "Unable to validate email address: invalid format";
		
		if (errorMessage != null) {
			setError(errorMessage)
			return
		}

		setLoading(true)
		try {
			errorMessage = await authMethod(email, password)
			setPassword("")
		} finally {
			setLoading(false)
		}
		setError(errorMessage)
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
					disabled={loading}
				/>

				<input
					className={styles.pwdInput}
					type="password"
					placeholder="Password..."
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={loading}
				/>
				

				<div className={styles.buttonWrapper}>
					{/* LOADER OR ERROR MESSAGE */}
					{loading ? 
						<span className={styles.loader}></span>
					:
						error ?
							<span className={styles.error}>{error}</span>
						:
							<span className={styles.error} style={{visibility: 'hidden'}}> </span>
					}

					<button className={styles.loginButton}
						onClick={() => handleAuthSubmit(handleLogin)}
						disabled={isDisabled}
					>
						Login
					</button>

					<button
						className={styles.signupButton}
						onClick={() => handleAuthSubmit(handleSignup)}
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