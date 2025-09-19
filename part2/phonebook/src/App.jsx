import { useState, useEffect } from 'react'
import axios from 'axios'
import PersonDisplay from './components/PersonDisplay'
import PersonForm from './components/PersonForm'
import SearchInput from './components/SearchInput'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifClass, setNotifClass] = useState('none')

   const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

   const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    let exists = persons.some(person => person.name === newName)
    if (!exists) {
      personService
        .create({name: newName, number: newNumber})
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setNotifClass('success')
          setNotifMessage(`Added ${newName}`)
          setTimeout(() => {
            setNotifMessage(null)
            setNotifClass(null)
          }, 5000)
        })
    } else {
      if (window.confirm(`${newName} is already in the phonebook. Replace the existing number with the new one?`)) {
        let existingName = persons.find(p => p.name === newName)
        let updatedName = {...existingName, number: newNumber}
        personService
          .update(updatedName)
          .then(response => {
            setPersons(persons.map(p => p.id !== updatedName.id ? p : response.data))
            setNewName('')
            setNewNumber('')
            setNotifClass('success')
            setNotifMessage(`Updated ${newName}`)
            setTimeout(() => {
              setNotifMessage(null)
              setNotifClass(null)
            }, 5000)
          })
      }
    }
  }

  const deleteName = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .del(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          setNotifClass('error')
          setNotifMessage(`${newName} has already been removed from the server`)
          setTimeout(() => {
            setNotifMessage(null)
            setNotifClass(null)
          }, 5000)
        })
    }
  }

  const setValues = (newName, newNumber) => {
    setNewName(newName);
    setNewNumber(newNumber);
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const hook = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(hook, [])

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notifMessage} class={notifClass}/>
      <SearchInput handleSearch={handleSearch}/>
      <h2>Add new number</h2>
      <PersonForm setValues={setValues}
      newName={newName}
      newNumber={newNumber}
      handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}
      addName={addName} />
      <h2>Numbers</h2>
      <PersonDisplay persons={persons} searchTerm={searchTerm} deleteName={deleteName}/>
    </div>
  )
}

export default App