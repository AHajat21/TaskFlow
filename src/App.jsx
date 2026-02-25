import { useState, useEffect, createContext } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import { UserProvider } from './context/UserContext.jsx';

import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx';
import Canvas from './pages/CanvasPage.jsx';
import Header from './components/Header.jsx';

const App = () => {

	return (
		<UserProvider>
			<BrowserRouter>
				<Header />

				
				<Routes>
					<Route path="/about" 
						element={
							<About />
						}
					/>

					<Route path="/login"
						element={
							<Login />
						}
					/>

					<Route path="/:username"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route path="/:username/:projectId"
						element={
							<ProtectedRoute>
								<Canvas />
							</ProtectedRoute>
						}
					/>
				</Routes>

			</BrowserRouter>
		</UserProvider>
	);
}

export default App
