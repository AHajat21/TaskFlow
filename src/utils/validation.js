// Validation for AUTH

// Validation for PROJECT NAME
export const validateProjectName = (name) => {
	if (!name || name.trim().length === 0) {
   	return "Project name cannot be empty"
	}
	if (name.trim().length > 50) {
   	return "Project name must be 50 characters or less"
	}
	if (name.trim().length < 3) {
   	return "Project name must be at least 3 characters"
  	}
	return null
}
