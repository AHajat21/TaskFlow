import React from 'react'

import { validateProjectName } from '../utils/validation'

import styles from "../styles/projectCard.module.css"

const ProjectCard = ({ project, onDelete, onRename, onClicked, setError }) => {


	const projectRename = async (projectName) => {
		const err = validateProjectName(projectName)
		if (err) {
			setError(err)
			return
		}
		const updated = await onRename(project.id, projectName)
	}

  	return (
		<div className={styles.projectCard} key={project.id} onClick={() => {onClicked(project.id)}}>

			{/* DELETE BUTTON */}
			<button
				onClick={(e) => {onDelete(project); e.stopPropagation()}}
				className={styles.deleteProjectBtn}
			><b>✘</b></button>
				
			{/* RENAME INPUT */}
			<input
				className={styles.renameInput}
				type="text"
				defaultValue={project.name}
				onClick={(e) => e.stopPropagation()}
				onBlur={(e) => projectRename(e.target.value)}
				onKeyDown={(e) => {if (e.key === "Enter") e.target.blur()}}
			/>

			<div>
				<p>{project.description}</p>

				<p className={styles.projectTimestamps}>
					Created: {new Date(project.created_at).toLocaleDateString()}
					{/*Last updated: {new Date(project.updated_at).toLocaleString()}*/}
				</p>
			</div>
			
		</div>
	)
}

export default ProjectCard