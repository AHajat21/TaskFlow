import React from 'react'

import styles from "../styles/projectCard.module.css"

const ProjectCard = ({ project, onDelete, onRename, onClicked }) => {


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
				onBlur={async (e) => {
					const updated = await onRename(project.id, e.target.value)
				}}
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