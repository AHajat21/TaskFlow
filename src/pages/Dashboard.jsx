// Add a last updated
// no null project names

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { fetchProjectsSupa, createProjectSupa, deleteProjectSupa, renameProjectSupa } from '../utils/supabaseQueries'

import styles from "../styles/Dashboard.module.css"
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import DeleteProjectModal from '../components/DeleteProjectModal'

const Dashboard = () => {
	const { user } = useUser()

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
		setIsCreatePopupOpen(false)
		const newProject = await createProjectSupa(projectName)
		setProjectsArray((prev) => [...prev, newProject[0]])
	}
	const deleteProject = async () => {
		await deleteProjectSupa(deletePopupId)
		setProjectsArray(prev => prev.filter(p => p.id !== deletePopupId))
		setDeletePopupId(null)
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
						/>
					))}
				</div>
			}

			
	 	</div>

  	)
}

export default Dashboard