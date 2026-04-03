import React from 'react'

import { validateProjectName } from '../utils/validation'

import styles from "../styles/projectCard.module.css"

const ProjectCard = ({ project, onDelete, onRename, onClicked }) => {

  	return (
		<div className={styles.projectCard} key={project.id} onClick={() => onClicked(project.id)}>

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
				onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
				onBlur={(e) => onRename(project.id, e.target.value)}
			/>

			<div>
				<p className={styles.projectDesc}>{project.description}</p>

				<p className={styles.projectTimestamps}>
					<span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
					<span>Last updated: {new Date(project.updated_at).toLocaleString()}</span>
				</p>
			</div>
		</div>
	)
}

export default ProjectCard