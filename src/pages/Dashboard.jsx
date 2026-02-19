// Add a last updated

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { fetchProjectsSupa, createProjectSupa, deleteProjectSupa, renameProjectSupa } from '../utils/supabaseQueries'

import styles from "../styles/Dashboard.module.css"

const Dashboard = () => {
	const { user } = useUser()
	const username = user ? user.email.split("@")[0].toUpperCase() : "Guest"

	const [projectsArray, setprojectsArray] = useState([])
	const [updateList, setUpdateList] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const loadProjects = async () => {
			const projects = await fetchProjectsSupa(user.id)
			setprojectsArray(projects)
		}
		
		if (user?.id) {
			loadProjects()
		}
	}, [updateList]);


	const createProject = async () => {
		let projectName = prompt("Enter project name:", "Untitled project")
		if (projectName == null) return;
		await createProjectSupa(projectName)
		setUpdateList(!updateList)
	}
	const deleteProject = async (project) => {
		let text = "Are you sure you want to delete " + project.name + "?"
		confirm(text) ? await deleteProjectSupa(project.id) : console.log("Project not deleted")
		setUpdateList(!updateList)
	}
	const goToProject = async (projectId) => {
		navigate(`${projectId}`)
	}

  	return (
		<div>
			<br />
			<h1 style={{textAlign: "center"}}>{username}'s Dashboard</h1> <br /> <br />
			
			
			{/* PROJECT LIST */}
			<button className={styles.createProjectButton} onClick={createProject}>+</button> <br /> <br /> <br />

			<div className={styles.projectsList}>
			
				{projectsArray.map((project) => (
					<div className={styles.projectCard} key={project.id}>

						{/* DELETE BUTTON */}
						<button
							onClick={() => {deleteProject(project)}}
							className={styles.deleteProjectBtn}
						><b>X</b></button>
							
						{/* RENAME INPUT */}
						<input
							className={styles.renameInput}
							type="text"
							defaultValue={project.name}
							onBlur={(e) => {renameProjectSupa(project.id, e.target.value)}}
							onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
						/>
						<div style={{height: "100%"}} onClick={() => {goToProject(project.id)}}>
							<p>{project.description}</p>

							<p className={styles.projectTimestamps}>
								Created on: {new Date(project.created_at).toLocaleDateString()} <br />
								{/*Last updated: {new Date(project.updated_at).toLocaleString()}*/}
							</p>
						</div>
						

						
					</div>
				))}
			</div>
	 	</div>

  	)
}

export default Dashboard