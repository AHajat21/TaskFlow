import { useState } from 'react'
import { createPortal } from 'react-dom'

import styles from '../styles/popup.module.css'

const DeleteProjectModal = ({open, setOpen, deleteProject}) => {

	if (open == null) return
	return createPortal(
		<>
		<div className={styles.hideBackground} />
		<div className={styles.content}>
			<h5 className={styles.prompt}>Are you sure you want to delete this project?</h5>


			<button className={styles.cancelBtn} onClick={(e) => setOpen(null)}> <b>✗</b> </button>
			<button className={styles.confirmBtn} onClick={(e) => deleteProject()} > <b>✔</b> </button>

		</div>
		</>,

		document.getElementById('popup')
	)
	
}

export default DeleteProjectModal