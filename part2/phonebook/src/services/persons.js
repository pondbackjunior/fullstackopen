import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const del = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = updatedObject => {
  return axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject)
}

export default { getAll, create, del, update }