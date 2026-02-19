// Set bounds for UI controls position e.g. when resizing window
// Truncate scale value in input field
// If no node is selected, display: "Please select a node"
// Make input fields blur on onKeyDown(enter) with e.target.blur()
// min dimensions (or optimise)
// Add debouncing for color changing

// OPTIONAL
// 	> Add alt tags for when hovering over buttons
// 	> Make zoom/scale more efficient. shouldn't re-render on every useTransformEffect(debouncing)
import { useEffect, useState, useRef } from "react"

import { useControls, useTransformContext, useTransformEffect } from "react-zoom-pan-pinch"
import { MuiColorInput } from 'mui-color-input'

import styles from "../styles/canvasUI.module.css"

const CanvasUI = ( {nodeData, addNode, updateNode} ) => {
	const { id, type, name, pos_x, pos_y, pos_z, customisation, content} = nodeData
	const inputZoomRef = useRef(null);
	const [pos, setPos] = useState({x: 0, y: 0, z: 0})
	const [dimensions, setDimensions] = useState({w: 0, h: 0, r: 0})
	const [border, setBorder] = useState({thickness: 0, radius: 0})


	const { zoomIn, zoomOut, setTransform, resetTransform } = useControls()
	const context = useTransformContext()

	const [nodePanelVisible, setNodePanelVisible] = useState(false)
	const [nodeListVisible, setNodeListVisible] = useState(false)


	useTransformEffect(({ state }) => {
		inputZoomRef.current.value = state.scale
	})
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
	}, [customisation])



	return (
		<div className={styles.uiOverlap}>

		{/* ZOOM TOOLS */}
		{/* Make into a continuous shape/grid */}
		<div className={styles.zoomTools}>
			<button onClick={() => {zoomIn()}}>+</button>
			<input
				ref={inputZoomRef}

				defaultValue={1}
				onBlur={(e) => setTransform(context.transformState.positionX, context.transformState.positionY, e.target.value)}
				onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
			/>
			<button onClick={() => {zoomOut()}}>-</button>
			<button onClick={() => {resetTransform()}}>R</button>
		</div>



		{/* NODE PANEL */}
		{(id === undefined) ?
		<div className={`${styles.nodePanel} ${nodePanelVisible ? styles.openedPanel : "" }`}>
			{/* PANEL HANDEL */}
			<button className={styles.nodePanelHandle} onClick={() => setNodePanelVisible(!nodePanelVisible)}>
				{(nodePanelVisible) ? ">" : "<"}
			</button>

			<h3 className={styles.nodeName}>Select a node for details</h3>
		</div>
		:
		<div className={`${styles.nodePanel} ${nodePanelVisible ? styles.openedPanel : "" }`}>
			{/* PANEL HANDEL */}
			<button className={styles.nodePanelHandle} onClick={() => setNodePanelVisible(!nodePanelVisible)}>
				{(nodePanelVisible) ? ">" : "<"}
			</button>
			


			<button className={styles.lockNodeBtn}>🔒/🔓</button> {/* Top left corner */} <br />
			<h3 className={styles.nodeName}>{(name == null) ? "Untitled" : name }</h3>
			<hr />
			
			{/* SECTION 1 */}
			<div className={styles.s1}>
				<input className={styles.fontSize} type="number" defaultValue={16}/>

				<div className={styles.textAlignBtns}>
					{/* Make buttons selectables maybe use radio */}
					<button onClick={() => updateNode(id, {customisation: {...customisation, textAlign: "left"}})}>LLL</button>
					<button onClick={() => updateNode(id, {customisation: {...customisation, textAlign: "center"}})}>CCC</button>
					<button onClick={() => updateNode(id, {customisation: {...customisation, textAlign: "right"}})}>RRR</button>
				</div>

				<MuiColorInput className={styles.textColor} format="hex8"
					variant="standard"
					slotProps={{input: { disableUnderline: true }}}
					value={customisation.textColor}		
					onChange={(color) => updateNode(id, {customisation: {...customisation, textColor: color}})}		
				/>
			</div>
			<br /> <br />

			{/* SECTION 2 */}
			<div className={styles.s2}>
				<div className={styles.Inp}>
					<span>position: </span>

						<label>x:
							<input type="number" value={pos.x}
								onChange={(e) => setPos({...pos, x: e.target.value})}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => {updateNode(id, {pos_x: pos.x})}}
							/>
						</label>
						<label>y:
							<input type="number" value={pos.y}
								onChange={(e) => setPos({...pos, y: e.target.value})}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => updateNode(id, {pos_y: pos.y})}
							/>
						</label>
						<label>z:
							<input type="number" value={pos.z}
								onChange={(e) => setPos({...pos, z: e.target.value})}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => updateNode(id, {pos_z: pos.z})}
							/>
						</label>
				</div>

				<div className={styles.Inp} style={{borderLeft: "2px solid black"}}>
					<span>dimensions: </span>
					{/* if shape is rect then: */}
						<label>w:
							<input type="number" value={dimensions.w}
								onChange={(e) => setDimensions({...dimensions, w: e.target.value})}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => {updateNode(id, {customisation: {...customisation, width: dimensions.w}}); console.log(customisation)}}
							/>
						</label>
						<label>h:
							<input type="number" value={dimensions.h}
								onChange={(e) => {setDimensions({...dimensions, h: e.target.value})}}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => updateNode(id, {customisation: {...customisation, height: dimensions.h}})}
							/>
						</label>

					{/* if circle
						<label>r: <input type="number" /></label>
					*/}
						<label>↻:
							<input type="number" value={dimensions.r}
								onChange={(e) => {setDimensions({...dimensions, r: e.target.value})}}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => updateNode(id, {customisation: {...customisation, rotate: dimensions.r}})}
							/>
						</label>
				</div>
			</div>
			<hr />

			{/* SECTION 3 */}
			<div className={styles.s3}>
				<span>background:
					<MuiColorInput className={styles.backgroundColor} format="hex8"
						variant="standard"
						slotProps={{input: { disableUnderline: true }}}
						value={customisation.backgroundColor}		
						onChange={(color) => updateNode(id, {customisation: {...customisation, backgroundColor: color}})}
					/>
				</span>
				
				<div className={styles.Inp}>
					<span>border: </span>
						<label> <span>Color: </span> 
							<MuiColorInput className={styles.borderColor} format="hex8"
								variant="standard"
								slotProps={{input: { disableUnderline: true }}}
								value={customisation.borderColor}		
								onChange={(color) => updateNode(id, {customisation: {...customisation, borderColor: color}})}
							/>
						</label>
						<label> <span>Thickness: </span>
							<input type="number" value={border.thickness}
								onChange={(e) => setBorder({...border, thickness: e.target.value})}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => updateNode(id, {customisation: {...customisation, borderThickness: border.thickness}})}
							/>
						</label>
					{/* ONLY IF rect */}
						<label> <span>Radius: </span>
							<input type="number" value={border.radius}
								onChange={(e) => setBorder({...border, radius: e.target.value})}
								onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
								onBlur={() => updateNode(id, {customisation: {...customisation, borderRadius: border.radius}})}
							/>
						</label>
				</div>

			</div>
			<hr />
		
			{/* SECTION 4 */}
			<div className={styles.s4}>
				<h4>Node Name</h4>
				<div className={styles.connectionContainer}>
					{/* Map component names into a grid with delete button */}
				</div>
			</div>

		</div>
		}
		



		{/* NODE LIST */}
		<div className={`${styles.nodeList} ${nodeListVisible ? styles.openedList : "" }`}>
			{/* LIST HANDLE */}
			<button className={styles.nodeListHandle} onClick={() => setNodeListVisible(!nodeListVisible)}>
				{(nodeListVisible) ? "<" : ">"}
			</button>

			{/* Map component list here with delete button */}
		</div>
		


		{/* CONTROL PANEL */}
		<div className={styles.controlPanel}>
			<div onClick={addNode}>T⁺</div>
			<div>→⁺</div>
			<div>↔⁺</div>
			<div>✎⁺</div>

		</div>


		</div>

	)
}

export default CanvasUI