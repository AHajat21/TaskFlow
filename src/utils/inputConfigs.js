export const INPUT_CONFIGS = {
	positionX: { label: 'x', min: -2000, max: 2000, step: 10, field: 'pos_x' },
	positionY: { label: 'y', min: -2000, max: 2000, step: 10, field: 'pos_y' },
	positionZ: { label: 'z', min: -9999, max: 9999, step: 1, field: 'pos_z' },
	dimensionWidth: { label: 'w', min: 150, max: 500, step: 10, field: 'width' },
	dimensionHeight: { label: 'h', min: 250, max: 500, step: 10, field: 'height' },
	dimensionRotation: { label: '↻', min: 0, max: 360, step: 1, field: 'rotate' },
	borderThickness: { label: 'thickness', min: 0, max: 20, step: 1, field: 'borderThickness' },
	borderRadius: { label: 'radius', min: 0, max: 100, step: 1, field: 'borderRadius' },
}