import React, { useState } from 'react';

import styles from '../styles/About.module.css'

const AboutPage = () => {

	return (
		<div className={styles.aboutContainer}>
			<section className={styles.aboutHeader}>
				<h1>About Me</h1>
				<p>I'm Ahmad, the developer behind this project.</p>
			</section>

			<section>
				<h2>My Story</h2>
				<p>I started this project to improve my programming skills in React and my understanding of project development.</p>
				<p>What started as a learning experience became a passion project for me, so I continued to work on it by adding new features - eventually transforming it into this.</p>
			</section>

			<section>
				<h2>Skills & Tools</h2>
				<div className={styles.skillsGrid}>
					<div>HTML</div>
					<div>CSS</div>
					<div>JavaScript</div>
					<div>React</div>
				</div>
			</section>

			<section>
				<h2>About This Project</h2>
				<p>TaskFlow is designed to simplify large projects into manageable bite-sized tasks.</p>
			</section>

			<section className={styles.contactSection}>
				<h2>Get In Touch</h2>
				<p>Have a question, feedback, or just want to say hi? Feel free to reach out!</p>
				<div className={styles.socialLinks}>
					<a href="https://github.com/Ahajat21" target="_blank">GitHub</a>
					<a href="https://linkedin.com/in/ahmad-hajat-1a8466292" target="_blank">LinkedIn</a>
					<a href="mailto:ahajat60@gmail.com">Email</a>
				</div>
			</section>
		</div>
	);
};

export default AboutPage;