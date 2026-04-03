import { supabase } from "../helper/supabaseClient";

// ---------------- Projects ----------------

export const fetchProjectsSupa = async (userId) => {
	const {data, error} = await supabase
		.from("Projects")
		.select()
		.eq("user_id", userId)
		.order('updated_at', {ascending: false})

	if (error) throw error;
	return data;
}

export const fetchProjectDataSupa = async (projectId) => {
	const {data, error} = await supabase
		.from("Projects")
		.select()
		.eq("id", projectId)
		.single()

	if (error) throw error;
	return data;
}

export const createProjectSupa = async (projectName) => {
  	const { data, error } = await supabase
   	.from("Projects")
   	.insert({name: projectName})
		.select()

	if (error) throw error;
	return data;
}

export const updateProjectSupa = async (projectId, update) => {
	const { error } = await supabase 
		.from("Projects")
		.update(update)
		.eq("id", projectId)
	
	if (error) throw error;
}

export const deleteProjectSupa = async (projectId) => {
  	const { error } = await supabase
   	.from("Projects")
   	.delete()
		.eq("id", projectId)

	if (error) throw error;
}



// ---------------- Components -----------------

export async function fetchComponentsSupa(projectId) {
  const { data, error } = await supabase
    .from("Components")
    .select()
    .eq("project_id", projectId);

  if (error) throw error;
  return data;
}

export async function createComponentSupa(projectId, zIndex) {
  const { data, error } = await supabase
    .from("Components")
    .insert({ project_id: projectId, pos_z: zIndex})
	 .select()

  if (error) throw error;
  return data;
}

export async function updateComponentSupa(compId, updates) {
	const { data, error } = await supabase
		.from("Components")
		.update(updates)
		.eq("id", compId)
		.select()

	if (error) throw error;
	return data
}

export async function deleteComponentSupa(compId) {
	const { data, error } = await supabase
		.from("Components")
		.delete()
		.eq("id", compId)
		.select()

	if (error) throw error;
	return data
}