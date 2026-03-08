import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../helper/supabaseClient.js'

const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(undefined);
	const [email, setEmail] = useState("")

	useEffect(() => {
		// 1, Get current Supabase user
		supabase.auth.getUser().then(
			({ data }) => {
				setUser(data.user ?? null)
				setEmail(data.user?.email || "")
			}
		)

		// 2. Listen for auth changes (login, logout, refresh)
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null)
				setEmail(session?.user?.email || "")
			}
		)
		return () => listener.subscription.unsubscribe()
	}, []);

	// AUTH
	const handleSignup = async (email, password) => {
		try {
			const {error} = await supabase.auth.signUp({email, password})
			return error ? error.message : null
		} catch (err) {
			return "Network error. Please try again."
		}
	}
	const handleLogin = async (email, password) => {
		try {
			const {error} = await supabase.auth.signInWithPassword({email, password})
			return error ? error.message : null
		} catch (err) {
			return "Network error. Please try again."
		}
	}
	const handleLogout = async () => {
		try {
			const {error} = await supabase.auth.signOut()
			return error ? error.message : null
		} catch (err) {
			return "Network error. Please try again."
		}
	}

  	return (
		<UserContext.Provider value={
			{ user, setUser, handleSignup, handleLogin, handleLogout }
		}>
			{children}
		</UserContext.Provider>
  	)
}

export const useUser = () => {
	return useContext(UserContext);
}