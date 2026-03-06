import { useState } from 'react'
import { createPortal } from 'react-dom'

import styles from '../styles/popup.module.css'

const CreateProjectModal = ({open, setOpen, createProject}) => {
	const [projectName, setProjectName] = useState("Untitled Project")

	if (!open) return
	return createPortal(
		<>
		<div className={styles.hideBackground} />
		<div className={styles.content}>
			<h4 className={styles.prompt}>Enter project name: </h4>
			<input type="text"
				className={styles.inputBox}
				value={projectName}
				onChange={(e) => setProjectName(e.target.value)}
			/>

			<button className={styles.cancelBtn} onClick={(e) => setOpen(false)}> <b>✗</b> </button>
			<button className={styles.confirmBtn} onClick={(e) => createProject(projectName)} > <b>✔</b>  </button>

		</div>
		</>,

		document.getElementById('popup')
	)
	
}

export default CreateProjectModal