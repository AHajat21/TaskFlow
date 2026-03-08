// Z-Axis for nodes
// Store Images in Supabase and add reference to content row of components table
// Implement more react-draggable features e.g. bounds, axis lock
// Make drag handle using this in corner: ⠿
// Add debouncing for <input /> and <textarea />
// Dragging when zoomed out: node doesn't follow under mouse

// OPTIONAL
// 	> Use onDrag with debouncing instead of onStop for multi-user experience
// 	> Use react resizable npm package

import {useEffect, useRef, useState} from 'react'
import Draggable from 'react-draggable';
import { useTransformContext } from 'react-zoom-pan-pinch';

import styles from '../styles/node.module.css'

const Node = ({nodeData , updateNode, onDelete, nodeClicked, isSelected }) => {
	const { id, type, name, pos_x, pos_y, pos_z, customisation, content} = nodeData

	const nodeRef = useRef(null);

	// Customisation default is this: {
	//   "width": 200,
	//   "height": 250,
	//   "fontSize": 16,
	//   "isLocked": false,
	//   "rotation": 0,
	//   "textAlign": "left",
	//   "textColor": "#000000ff",
	//   "borderColor": "#838383ff",
	//   "connectedTo": [],
	//   "borderRadius": 0,
	//   "backgroundColor": "rgb(255, 255, 255)",
	//   "borderThickness": 4
	// }

	const nodeStyle = {
		position: "absolute",
		border: `${customisation.borderThickness}px solid ${customisation.borderColor}`,
		borderRadius: customisation.borderRadius + "px",
		overflow: "visible",
		zIndex: pos_z,
		width: customisation.width + "px",
		height: customisation.height + "px",
		rotate: customisation.rotate + "deg",
		fontSize: customisation.fontSize + "px",

		boxShadow: isSelected 
    		? `0 0 0 3px #27579fb9, 0 4px 12px rgba(0,0,0,0.2)` 
    		: `0 2px 8px rgba(0,0,0,0.12)`,
  		transition: 'box-shadow 200ms ease',
	}




  	return (
		<Draggable
			nodeRef={nodeRef}
			handle = ".handle"
			position={{x: pos_x, y: pos_y}}
			grid={[10, 10]}
			onStart={(e, data) => console.log('Start:', data.x, data.y)}
			onStop={(e, data) => {
				console.log('Stop:', data.x, data.y);
				updateNode(id, {pos_x: data.x, pos_y: data.y})
			}}
			disabled={customisation.isLocked}
		> 

				<div ref={nodeRef} className={"node"} style={nodeStyle} onClick={() => nodeClicked(nodeData)}>
					<div className="handle">
						<div className={styles.nodeHandle} style={{backgroundColor: customisation.borderColor}}>
							⠿⠿⠿
						</div>
					</div>

					<button className={styles.nodeDeleteButton} onClick={() => {onDelete(id)}}>
						X
					</button>

					<input
						className={styles.nodeTitle}
						style={{backgroundColor: customisation.borderColor, color: customisation.textColor}}
						defaultValue={name}
						placeholder="Node Title"
						onBlur={(e) => {updateNode(id, {name: e.target.value})}}
						onKeyDown={(e) => {if (e.key === "Enter") {e.target.blur()}}}
					/>
					
					{/* TEXT OR IMAGE */}
					{(type == "text") ?
						<textarea
							className={styles.nodeContent}
							style={{backgroundColor: customisation.backgroundColor, color: customisation.textColor, textAlign: customisation.textAlign}}
							defaultValue={content}
							placeholder="Node content..."
							onBlur={(e) => {updateNode(id, {content: e.target.value})}}
						/>
					:
						<img />
					}
					
				</div>

		</Draggable>
		
  	)
}

export default Node