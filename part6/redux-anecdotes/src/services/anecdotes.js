const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  const data = await response.json()
  return data
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  }
  
  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }
  
  return await response.json()
}

const update = async (id) => {
  const getRes = await fetch(`${baseUrl}/${id}`)
  if (!getRes.ok) {
    throw new Error('Failed to fetch anecdote to update')
  }
  const anecdote = await getRes.json()

  const updated = { ...anecdote, votes: (anecdote.votes || 0) + 1 }

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  }

  const response = await fetch(`${baseUrl}/${id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }
  
  return await response.json()
}

export default { getAll, createNew, update }