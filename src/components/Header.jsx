import React from 'react'
import { useUser } from '../context/UserContext.jsx'
import { Link } from 'react-router-dom';

import styles from '../styles/header.module.css'

const Header = () => {
	const { user, handleLogout } = useUser();
	const username = user ? user.email.split("@")[0] : "Guest"
	const { loading } = useUser();

  	return (
		<header className={styles.header}>
			<div className={styles.siteWrapper}>
				<Link className={styles.title} to={`/${username}`}>
					<h1>TaskFlow</h1>
				</Link>
				<Link className={styles.aboutLink} to="/about">About</Link>
			</div>

						
 			{user ?
				<div className={styles.userWrapper}>
					<p>{username}</p>
					<button className={styles.logoutButton} onClick={handleLogout} disabled={loading}>Logout</button>
				</div>
				:
				<Link className={styles.loginLink} to="/login">Login</Link>
			}
		</header>
  	)
}

export default Header
