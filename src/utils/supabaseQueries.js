import { supabase } from "../helper/supabaseClient";

// ---------------- Boards ----------------

export const fetchProjectsSupa = async (userId) => {
	const {data, error} = await supabase
		.from("Projects")
		.select()
		.eq("user_id", userId)

	if (error) throw error;
	return data
}

export const fetchProjectByIdSupa = async (projectId) => {
	const {data, error} = await supabase
		.from("Projects")
		.select()
		.eq("id", projectId)
		.single()

	if (error) throw error;
	return data
}

export const createProjectSupa = async (projectName) => {
  	const { error } = await supabase
   	.from("Projects")
   	.insert({name: projectName})

	if (error) throw error;
}

export const deleteProjectSupa = async (projectId) => {
  	const { error } = await supabase
   	.from("Projects")
   	.delete()
		.eq("id", projectId)

	if (error) throw error;
}

export const renameProjectSupa = async (projectId, newName) => {
	const { error } = await supabase 
		.from("Projects")
		.update({name: newName})
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

/* ---------------- Connections ----------------

// Create a connection between two nodes
export async function createConnection(boardId, fromNode, toNode) {
  const { data, error } = await supabase
    .from("connections")
    .insert([{ board_id: boardId, from_node: fromNode, to_node: toNode }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all connections for a board
export async function getConnections(boardId) {
  const { data, error } = await supabase
    .from("connections")
    .select("*")
    .eq("board_id", boardId);

  if (error) throw error;
  return data;
}

// Delete a connection
export async function deleteConnection(id) {
  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

*/