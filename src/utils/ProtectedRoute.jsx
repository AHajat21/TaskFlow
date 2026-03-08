import { useNavigate } from "react-router-dom"
import { useUser } from '../context/UserContext.jsx'
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
	const { user } = useUser();
	const navigate = useNavigate()
	
	useEffect(() => {
		if (user === null) {
			navigate("/login", { replace: true })
		}
	}, [user, navigate])

	if (user === undefined) return <div>Loading...</div>

	return children
}

export default ProtectedRoute
