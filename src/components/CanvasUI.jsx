// Undo/Redo

import { useEffect, useState, useRef } from "react"

import { useControls, useTransformContext, useTransformEffect } from "react-zoom-pan-pinch"
import { MuiColorInput } from 'mui-color-input'
import toast from "react-hot-toast"

import { validateNumberInput } from "../utils/validation"
import ConfiguredInput from "./Canvas/ConfiguredInput"
import { INPUT_CONFIGS } from "../utils/inputConfigs"

import styles from "../styles/canvasUI.module.css"


const CanvasUI = ( {compArray, selectedNodeData, setSelectedNodeData, nodeFunctions} ) => {
	const { id, type, name, pos_x, pos_y, pos_z, customisation} = selectedNodeData
	const {addNode, updateNode, deleteNode} = nodeFunctions
	

	const colorTimerRef = useRef(null)
	const inputZoomRef = useRef(null);


	const [error, setError] = useState(null)

	const [pos, setPos] = useState({
		x: pos_x ?? 0,
		y: pos_y ?? 0,
		z: pos_z ?? 0
	})
	const [dimensions, setDimensions] = useState({
		w: customisation?.width ?? 0,
		h: customisation?.height ?? 0,
		r: customisation?.rotate ?? 0
	})
	const [border, setBorder] = useState({
		thickness: customisation?.borderThickness ?? 0,
		radius: customisation?.borderRadius ?? 0
	})
	const [colors, setColors] = useState({
		textColor: customisation?.textColor ?? "#ffffffff",
		backgroundColor: customisation?.backgroundColor ?? "#ffffffff",
		borderColor: customisation?.borderColor ?? "#ffffffff"
	})
	

	const [nodePropertiesPanelVisible, setnodePropertiesPanelVisible] = useState(false)
	const [nodeListPanelVisible, setnodeListPanelVisible] = useState(false)

	const { zoomIn, zoomOut, resetTransform, setTransform } = useControls()
	const context = useTransformContext()


	useEffect(() => {
		toast.error(error)
	}, [error])

	useEffect(() => {
		setPos({
   		x: pos_x ?? 0,
   		y: pos_y ?? 0,
   		z: pos_z ?? 0
		})
	}, [pos_x, pos_y, pos_z])
	useEffect(() => {
		setDimensions({
			w: customisation?.width ?? 0,
   		h: customisation?.height ?? 0,
   		r: customisation?.rotate ?? 0
		})
		setBorder({
			thickness: customisation?.borderThickness ?? 0,
			radius: customisation?.borderRadius ?? 0
		})
		setColors({
			textColor: customisation?.textColor ?? "#ffffffff",
			backgroundColor: customisation?.backgroundColor ?? "#ffffffff",
			borderColor: customisation?.borderColor ?? "#ffffffff"
		})
	}, [customisation])

	// DEBOUNCING
	const handleColorChange = (newColor, field) => {
		setColors(prev => ({ ...prev, [field]: newColor}))

		if (colorTimerRef.current) clearTimeout(colorTimerRef.current)
		colorTimerRef.current = setTimeout(() => {
			updateNode(id, {customisation: {...customisation, [field]: newColor}})
		}, 200)
	}

	return (
		<div className={styles.uiOverlap}>

		{/* ZOOM TOOLS */}
		<div className={styles.zoomTools}>
			<button onClick={() => zoomOut(0.4)} title="Zoom out">-</button>
			<button onClick={() => zoomIn(0.4)} title="Zoom in">+</button>
			<button onClick={() => resetTransform()} title="Reset zoom">R</button>
		</div>



		{/* NODE PANEL */}
		{(id === undefined) ?
		<div className={`${styles.nodePropertiesPanel} ${nodePropertiesPanelVisible ? styles.openedProperties : "" }`}>
			{/* PANEL HANDEL */}
			<button className={styles.nodePropertiesPanelHandle} onClick={() => setnodePropertiesPanelVisible(!nodePropertiesPanelVisible)}>
				{(nodePropertiesPanelVisible) ? ">" : "<"}
			</button>

			<h3 className={styles.nodeName}>Select a node for details</h3>
		</div>
		:
		<div className={`${styles.nodePropertiesPanel} ${nodePropertiesPanelVisible ? styles.openedProperties : "" }`}>
			{/* PANEL HANDEL */}
			<button
				className={styles.nodePropertiesPanelHandle}
				onClick={() => setnodePropertiesPanelVisible(!nodePropertiesPanelVisible)}
				title="Toggle panel"
			>
				{(nodePropertiesPanelVisible) ? ">" : "<"}
			</button>
			
			
			<button
				className={styles.lockNodeBtn}
				onClick={() => updateNode(id, {customisation: {...customisation, isLocked: !customisation.isLocked}})}
				title={customisation.isLocked ? 'Unlock node' : 'Lock node'}
			>
				{customisation.isLocked ? '🔒' : '🔓'}
			</button>

			<h3 className={styles.nodeName}>{name || "Untitled" }</h3>
			<hr />
			
			{/* SECTION 1 */}
			<div className={styles.s1}>
				<input className={styles.fontSize} type="number" inputMode="numeric"
					defaultValue={customisation.fontSize}
					onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
					onBlur={(e) => updateNode(id, {customisation: {...customisation, fontSize: e.target.value}})}
					title="Font size"
				/>

				<div className={styles.textAlignBtns} title="Text align">
					{/* Make buttons selectables maybe use radio */}
					<button onClick={() => updateNode(id, {customisation: {...customisation, textAlign: "left"}})}>LLL</button>
					<button onClick={() => updateNode(id, {customisation: {...customisation, textAlign: "center"}})}>CCC</button>
					<button onClick={() => updateNode(id, {customisation: {...customisation, textAlign: "right"}})}>RRR</button>
				</div>

				<MuiColorInput className={styles.textColor} format="hex8"
					variant="standard"
					slotProps={{input: { disableUnderline: true }}}
					value={colors.textColor}		
					onChange={(color) => handleColorChange(color, "textColor")}
					title="Text color"
				/>
			</div>

			{/* SECTION 2 */}
			<div className={styles.s2}>
				{/* POSITIONS */}
				<div className={styles.property}>
					<span className={styles.title}>Position: </span>
					<ConfiguredInput
						value={pos.x}
						config={INPUT_CONFIGS.positionX}
						onChange={(val) => setPos({...pos, x: val})}
						onBlur={(val) => updateNode(id, {pos_x: val})}
					/>
					<ConfiguredInput
						value={pos.y}
						config={INPUT_CONFIGS.positionY}
						onChange={(val) => setPos({...pos, y: val})}
						onBlur={(val) => updateNode(id, {pos_y: val})}
					/>
					<ConfiguredInput
						value={pos.z}
						config={INPUT_CONFIGS.positionZ}
						onChange={(val) => setPos({...pos, z: val})}
						onBlur={(val) => updateNode(id, {pos_z: val})}
					/>
				</div>

				<hr />

				{/* DIMENIONS */}
				<div className={styles.property}>
					<span className={styles.title}>Dimensions: </span>
					<ConfiguredInput
						value={dimensions.w}
						config={INPUT_CONFIGS.dimensionWidth}
						onChange={(val) => setDimensions({...dimensions, w: val})}
						onBlur={(val) => updateNode(id, {customisation: {...customisation, width: val}})}
					/>

					<ConfiguredInput
						value={dimensions.h}
						config={INPUT_CONFIGS.dimensionHeight}
						onChange={(val) => setDimensions({...dimensions, h: val})}
						onBlur={(val) => updateNode(id, {customisation: {...customisation, height: val}})}
					/>

					<ConfiguredInput
						value={dimensions.r}
						config={INPUT_CONFIGS.dimensionRotation}
						onChange={(val) => setDimensions({...dimensions, r: val})}
						onBlur={(val) => updateNode(id, {customisation: {...customisation, rotate: val}})}
					/>
				</div>
			</div>

			<hr />

			{/* SECTION 3 */}
			<div className={styles.s3}>
				<div className={styles.property}>
					<span className={styles.title}>Background:</span>
					<label className={styles.subProperty}>
						<span className={styles.subTitle}>color: </span>
						<MuiColorInput className={styles.backgroundColor} format="hex8"
							variant="standard"
							slotProps={{input: { disableUnderline: true }}}
							value={colors.backgroundColor}		
							onChange={(color) => handleColorChange(color, "backgroundColor")}
						/>
					</label>
				</div>
				
				<div className={styles.property}>
					<span className={styles.title}>Border: </span>

					<label className={styles.subProperty}>
						<span className={styles.subTitle}>color: </span> 
						<MuiColorInput className={styles.borderColor} format="hex8"
							variant="standard"
							slotProps={{input: { disableUnderline: true }}}
							value={colors.borderColor}		
							onChange={(color) => handleColorChange(color, "borderColor")}
						/>
					</label>

					<ConfiguredInput
						value={border.thickness}
						config={INPUT_CONFIGS.borderThickness}
						onChange={(val) => setBorder({...border, thickness: val})}
						onBlur={(val) => updateNode(id, {customisation: {...customisation, borderThickness: val}})}
					/>
					<ConfiguredInput
						value={border.radius}
						config={INPUT_CONFIGS.borderRadius}
						onChange={(val) => setBorder({...border, radius: val})}
						onBlur={(val) => updateNode(id, {customisation: {...customisation, borderRadius: val}})}
					/>
				</div>
			</div>

			<hr />
		</div>
		}
		


		{/* NODE LIST */}
		<div className={`${styles.nodeListPanel} ${nodeListPanelVisible ? styles.openedList : "" }`}>
			{/* HANDLE */}
			<button className={styles.nodeListPanelHandle} onClick={() => setnodeListPanelVisible(!nodeListPanelVisible)}>
				{(nodeListPanelVisible) ? "<" : ">"}
			</button>

			<h3>Nodes List</h3>

			<hr />

			<div className={styles.nodeList}>
				{compArray.map((comp) => (
					<div key={comp.id} className={`${styles.nodeBar} ${id === comp.id && styles.selectedNodeBar}`}>
						<p>{comp.name || "Untitled"}</p>
						<div className={styles.buttonWrapper}>
							<button onClick={() => {
								setTransform(-comp.pos_x + comp.customisation.width, -comp.pos_y + comp.customisation.height, 1)
								setSelectedNodeData(comp)
							}}>
								🔍</button>
							<button onClick={() => deleteNode(comp.id)}>🗑️</button>
						</div>
					</div>
				))}
			</div>
		
		</div>
		


		{/* CONTROL PANEL */}
		<div className={styles.controlPanel}>
			<div onClick={addNode}>T⁺</div>
		</div>

		</div>

	)
}

export default CanvasUI


// const InputBox = ({subTitle, object, propertyName, setObject, dbName, updateNode, id, customisation}) => {
	
// 	return(
// 		<label className={styles.subProperty}>
// 			<span className={styles.subTitle}>{subTitle}: </span>
// 			<input type="text" value={object[propertyName]}
// 				onChange={(e) => setObject({...object, [propertyName]: e.target.value})}
// 				onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
// 				onBlur={() => updateNode(id, {customisation: {...customisation, [dbName]: object[propertyName]}})}
// 			/>
// 		</label>
// 	)
// }
