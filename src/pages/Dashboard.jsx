// Add a last updated

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { fetchProjectsSupa, createProjectSupa, deleteProjectSupa, renameProjectSupa } from '../utils/supabaseQueries'

import styles from "../styles/Dashboard.module.css"
import ProjectCard from '../components/ProjectCard'

const Dashboard = () => {
	const { user } = useUser()
	const username = user ? user.email.split("@")[0].toUpperCase() : "Guest"

	const [projectsArray, setProjectsArray] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		const loadProjects = async () => {
			const projects = await fetchProjectsSupa(user.id)
			setProjectsArray(projects)
		}
		
		if (user?.id) {
			loadProjects()
		}
	}, [user]);


	const createProject = async () => {
		let projectName = prompt("Enter project name:", "Untitled project")
		if (projectName == null) return;
		const newProject = await createProjectSupa(projectName)
		setProjectsArray((prev) => [...prev, newProject[0]])
	}
	const deleteProject = async (project) => {
		let text = "Are you sure you want to delete " + project.name + "?"
		if (!confirm(text)) return;
		await deleteProjectSupa(project.id)
		setProjectsArray(prev => prev.filter(p => p.id !== project.id))
	}
	const renameProject = async (id, name) => {
		renameProjectSupa(id, name)
	}
	const goToProject = (projectId) => {
		navigate(`${projectId}`)
	}

  	return (
		<div className={styles.page}>
			<aside className={styles.sidebar}>...</aside>
			<div className={styles.header}>
				<h1>{username}'s Dashboard</h1>
				<button onClick={createProject}>+</button>
			</div>
			
			{/* PROJECT LIST */}
			
			{/* is list empty? */}
			{projectsArray.length === 0 ?
				<p className={styles.emptyState}>
					No projects yet. Create your first one 🚀
				</p>

			:

				<div className={styles.projectsList}>
				
					{projectsArray.map((project) => (
						<ProjectCard
							key={project.id}
							project={project}
							onDelete={deleteProject}
							onRename={renameProject}
							onClicked={goToProject}
						/>
					))}
				</div>
			}

			
	 	</div>

  	)
}

export default Dashboard