// Add a last updated
// no empty project names

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { fetchProjectsSupa, createProjectSupa, deleteProjectSupa, renameProjectSupa } from '../utils/supabaseQueries'

import { validateProjectName } from '../utils/validation'
import styles from "../styles/Dashboard.module.css"
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import DeleteProjectModal from '../components/DeleteProjectModal'

const Dashboard = () => {
	const { user } = useUser()
	const [error, setError] = useState(null)

	const [projectsArray, setProjectsArray] = useState([])
	const navigate = useNavigate()

	const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
	const [deletePopupId, setDeletePopupId] = useState(null)

	useEffect(() => {
		const loadProjects = async () => {
			const projects = await fetchProjectsSupa(user?.id)
			setProjectsArray(projects)
		}
		
		if (user?.id) {
			loadProjects()
		}

	}, [user]);


	const createProject = async (projectName) => {
		const err = validateProjectName(projectName)
		if (err) {
			setError(err)
			return
		}

		try {
			setIsCreatePopupOpen(false)
			const newProject = await createProjectSupa(projectName.trim())
			setProjectsArray((prev) => [...prev, newProject[0]])
		} catch (err) {
			setError("Failed to create project")
		}
	}
	const renameProject = async (id, name) => {
		try {
			await renameProjectSupa(id, name)
			setProjectsArray(prev => 
      		prev.map(p => p.id === id ? { ...p, name: name.trim() } : p)
    		)
		} catch (err) {
			setError("Failed to rename project")
		}

		
	}
	const deleteProject = async () => {
		await deleteProjectSupa(deletePopupId)
		setProjectsArray(prev => prev.filter(p => p.id !== deletePopupId))
		setDeletePopupId(null)
	}
	
	const goToProject = (projectId) => {
		navigate(`${projectId}`)
	}

  	return (
		<div className={styles.page}>
			<aside className={styles.sidebar}>...</aside>
			
			{/* MODALS */}
			<CreateProjectModal open={isCreatePopupOpen} setOpen={setIsCreatePopupOpen} createProject={createProject} />
			<DeleteProjectModal open={deletePopupId} setOpen={setDeletePopupId} deleteProject={deleteProject} />

			<div className={styles.heading}>
				<h1>  Dashboard</h1>
				<hr />
				<button onClick={() => setIsCreatePopupOpen(true)}>✚</button>
			</div>
			
			{/* PROJECT LIST */}
			
			{/* is list empty? */}
			{projectsArray.length === 0 ?
				<h4 className={styles.emptyState}>
					No projects yet. Create your first one 🚀
				</h4>

			:

				<div className={styles.projectsList}>
				
					{projectsArray.map((project) => (
						<ProjectCard
							key={project.id}
							project={project}
							onDelete={() => setDeletePopupId(project.id)}
							onRename={renameProject}
							onClicked={goToProject}
							setError={setError}
						/>
					))}
				</div>
			}

			
	 	</div>

  	)
}

export default Dashboard