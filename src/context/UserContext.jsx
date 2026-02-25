import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../helper/supabaseClient.js'

const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(undefined);
	const [email, setEmail] = useState("")
	const [err, setErr] = useState("")
	const [loading, setLoading] = useState(false)

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

	// LOGOUT
	const handleLogout = async () => {
		setErr("")
		setLoading(true)
		const {data, error} = await supabase.auth.signOut()
		setLoading(false)

		if (error) {
			console.log("Logout error:", error.message)
			return setError(error.message)
		}
	}

  	return (
		<UserContext.Provider value={
			{ user, setUser, loading, setLoading, err, setErr, handleLogout }
		}>
			{children}
		</UserContext.Provider>
  	)
}

export const useUser = () => {
	return useContext(UserContext);
}