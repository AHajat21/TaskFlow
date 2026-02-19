import React from 'react'
import { Navigate } from "react-router-dom"
import { useUser } from '../context/UserContext.jsx'

const ProtectedRoute = ({ children }) => {
	const { user } = useUser();
	
	if (user === undefined) {
		return <div>Loading...</div>;
	}

	if (user === null) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

export default ProtectedRoute
