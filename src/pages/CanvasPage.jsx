// Redirect incorrect url. Look at loadProjectData function's catch block
// Add project name and account to header
// Undo/Redo

// OPTIONAL
// 	> Update local state immediately onStop, to avoid snap issue.
// 	> Add a grid background ( background-image: radial-gradient(#d1d1d1 1px, transparent 1px); background-size: 10px 10px;)
import {useEffect, useState, useRef} from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

import { useUser } from '../context/UserContext.jsx'
import CanvasUI from "../components/CanvasUI.jsx"
import Node from '../components/Node.jsx'

import { supabase } from '../helper/supabaseClient.js'
import { fetchProjectByIdSupa, fetchComponentsSupa, createComponentSupa, updateComponentSupa, deleteComponentSupa } from '../utils/supabaseQueries.js'

import styles from "../styles/CanvasPage.module.css"

const CanvasPage = () => {
	const { user } = useUser()
	const navigate = useNavigate()
	const username = user ? user.email.split("@")[0] : "Guest"
	const { projectId } = useParams()
	const [error, setError] = useState(null)

	const [componentsArray, setComponentsArray] = useState([])

	const [highestZIndex, setHighestZIndex] = useState(1);
	const [selectedNodeData, setSelectedNodeData] = useState({})


	// LOAD PROJECT INITIALY
	useEffect(() => {
		if (!projectId) return

		// ACCESS PROJECT DATA
		const loadProjectData = async () => {
			try {
				const projectData = await fetchProjectByIdSupa(projectId)
				if (!projectData) {
					setError("Project not found, redirecting to dashboard")
					setTimeout(() => navigate(`/${username}`), 4000)
      			return
				}
				setError(null)
			} catch (err) {		
				setError("Project not found, redirecting to dashboard")
				setTimeout(() => navigate(`/${username}`), 4000)
			}	
		}
		loadProjectData()

		// FETCH COMPONENTS
		const fetchComponents = async () => {
			const components = await fetchComponentsSupa(projectId)
			setComponentsArray(components)
		}
		fetchComponents()

		// REALTIME SUBSCRIPTION
		const channel = supabase.channel('room-' + projectId + '-project')
		channel.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'Components',
				filter: `project_id=eq.${projectId}`
			},
			(payload) => {
				// console.log("Something has changed...", payload)
				
				setComponentsArray((prev) => {
					switch (payload.eventType) {
						// Another user added a node 
						case 'INSERT':
							return [...prev, payload.new]
						
						// Another user edited node
						case 'UPDATE':
							return prev.map((comp) =>
								comp.id === payload.new.id ? payload.new : comp
							)

						// Another user deleted a node
						case 'DELETE':
							return prev.filter((comp) => comp.id !== payload.old.id)

						default:
							return prev
					}
				})
			}
		)
		.subscribe()

		return () => {
			channel.unsubscribe()
		}
	}, [projectId])

	useEffect(() => {
		// MORE EFFICIENT APPARENTLY
		// const updatedSelected = componentsArray.find(
  		// 	comp => comp.id === selectedNodeData.id
		// );

		// if (updatedSelected) setSelectedNodeData(updatedSelected)
		componentsArray.forEach((comp) => {
			if (comp.id === selectedNodeData.id) {setSelectedNodeData(comp)}
		})

		setHighestZIndex(
			Math.max(...componentsArray.map((comp) => (
				comp.pos_z
			)))
		)
	}, [componentsArray])

	// COMPONENT ACTIONS
	const addNode = async () =>  {
		const newComp = await createComponentSupa(projectId, highestZIndex+1)
	}
	const updateNode = async (compId, updates) => {
		setComponentsArray(prev => prev.map(comp => 
			(comp.id === compId) ? { ...comp, ...updates} : comp
		));
		
		const u = await updateComponentSupa(compId, updates)
	}
	const deleteNode = async (compId) => {
		const d = await deleteComponentSupa(compId)
	}
	const bringNodeToFront = async (compData) => {
		setSelectedNodeData(compData)
		// Prevents z-index increase for every click
		if (compData.pos_z == highestZIndex) return
		
		updateComponentSupa(compData.id, {pos_z: highestZIndex+1})
	}

  	return (
		<>
			{error && (
				<div className={styles.errorBanner}>
					<span>{error}</span>
				</div>
			)}

			{/* CANVAS */}
			<div className={styles.canvasStage}>
				<TransformWrapper
					limitToBounds={false}
					initialScale={1}
					initialPositionX={0}
					initialPositionY={0}
					minScale={.4}
					maxScale={2}
					panning={{excluded: ["node"]}}
					wheel={{smoothStep: .02}}
				>
					{/* UI OVERLAP */}
					<CanvasUI nodeData={selectedNodeData} addNode={addNode} updateNode={updateNode} />

					{/* COMPONENT MAPPING */}
					<TransformComponent wrapperStyle={{"width": "100vw", "height": "100vh"}}>


							{componentsArray.map((component) => (
								<Node key={component.id} nodeData={component} updateNode={updateNode} onDelete={deleteNode} nodeClicked={bringNodeToFront} isSelected={(selectedNodeData.id == component.id)} />
							))}
					</TransformComponent>

				</TransformWrapper>
			</div>

			
			
		</>
  	)
}

export default CanvasPage





/* useTransformContext Object {

animate: false
​
animation: null
​
applyTransformation: function applyTransformation()
​
bounds: Object { minPositionX: 383, maxPositionX: 383, minPositionY: 311, … }
​
cleanupWindowEvents: function cleanupWindowEvents()
​
clearPanning: function clearPanning(event)
​
contentComponent: <div class="react-transform-componen…-module_content__FBWxo " style="transform: translate(0px) scale(1);">
​
distance: null
​
doubleClickStopEventTimer: null
​
getContext: function getContext()
​
handleInitialize: function handleInitialize(wrapper, contentComponent)
​
handleInitializeWrapperEvents: function handleInitializeWrapperEvents(wrapper)
​
handleTransformStyles: function handleTransformStyles(x, y, scale)
​
init: function init(wrapperComponent, contentComponent)
​
initializeWindowEvents: function initializeWindowEvents()
​
isInitialized: true
​
isPanning: false
​
isPressingKeys: function isPressingKeys(keys)
​
isWheelPanning: false
​
lastDistance: null
​
lastMousePosition: null
​
lastTouch: null
​
maxBounds: null
​
mount: function mount()
​
mounted: true
​
observer: ResizeObserver {  }
​
onChange: function onChange(callback)
​
onChangeCallbacks: Set []
​
onDoubleClick: function onDoubleClick(event)
​
onInit: function onInit(callback)
​
onInitCallbacks: Set []
​
onPanning: function onPanning(event)
​
onPanningStart: function onPanningStart(event)
​
onPanningStop: function onPanningStop(event)
​
onPinch: function onPinch(event)
​
onPinchStart: function onPinchStart(event)
​
onPinchStop: function onPinchStop(event)
​
onTouchPanning: function onTouchPanning(event)
​
onTouchPanningStart: function onTouchPanningStart(event)
​
onTouchPanningStop: function onTouchPanningStop(event)
​
onWheelPanning: function onWheelPanning(event)
​
onWheelZoom: function onWheelZoom(event)
​
pinchLastCenterX: null
​
pinchLastCenterY: null
​
pinchMidpoint: null
​
pinchStartDistance: null
​
pinchStartScale: null
​
pressedKeys: Object { g: false, Enter: false }
​
previousWheelEvent: null
​
props: Object { limitToBounds: false, initialScale: 1, initialPositionX: 0, … }
​
setCenter: function setCenter()
​
setKeyPressed: function setKeyPressed(e)
​
setKeyUnPressed: function setKeyUnPressed(e)
​
setTransformState: function setTransformState(scale, positionX, positionY)
​
setup: Object { disabled: false, minPositionX: -1000, maxPositionX: 1000, … }
​
startCoords: Object { x: 304, y: 530 }
​
transformState: Object { previousScale: 1, scale: 1, positionX: 0, … }
​
unmount: function unmount()
​
update: function update(newProps)
​
velocity: null
​
velocityTime: null
​
wheelAnimationTimer: null
​
wheelStopEventTimer: null
​
wrapperComponent: <div class="react-transform-wrapper …-module_wrapper__SPB86 " style="width: 100vw; height: 100vh;">
​
<prototype>: Object { … }
Node.jsx:88:68
 */