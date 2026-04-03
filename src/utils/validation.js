// Validation for AUTH
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  if (password.length < 8) return "Password must be 8+ characters"
  if (!/[A-Z]/.test(password)) return "Must contain uppercase letter"
  if (!/[0-9]/.test(password)) return "Must contain a number"
  return null
}

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

// Validation for INPUT FIELDS
export const validateNumberInput = (val, uB, lB) => {
	if (!Number.isInteger(+val) || val.includes(".")) {
		return "NaN"
	}
	else if (val > lB) {
		return "Too large"
	} else if (val < uB) {
		return "Too small"
	}
	else {return ""}
}