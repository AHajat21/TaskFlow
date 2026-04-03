import { useState, useEffect, useRef } from "react";

import styles from "../../styles/canvasUI.module.css"

const ConfiguredInput = ({
	value,
	config, // {label, min, max, step, field}
	onChange,
	onBlur,
}) => {
	const [localValue, setLocalValue] = useState(value)
	const timerRef = useRef(null)

	useEffect(() => {
		setLocalValue(value)
	}, [value])

	const clampValue = (val) => {
		const num = parseFloat(val)
		if (isNaN(num)) return localValue
		return Math.max(config.min, Math.min(config.max, num))
	}

	const handleChange = (e) => {
		setLocalValue(e.target.value)
	}

	const handleBlur = (e) => {
		const clamped = clampValue(e.target.value)
		setLocalValue(clamped)

		onChange(clamped)
		onBlur?.(clamped)
	}


	return (
		<label className={styles.subProperty}>
			<span className={styles.subTitle}>{config.label}: </span>
			<input
				type="number"
				inputMode="numeric"
				value={localValue}
				onChange={handleChange}
				onBlur={handleBlur}
				onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
				min={config.min}
				max={config.max}
				step={config.step}
			/>
		</label>
	)
}

export default ConfiguredInput