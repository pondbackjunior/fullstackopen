const PersonDisplay = (props) => {
  const filteredPersons = props.persons.filter(person =>
    person.name.toLowerCase().includes(props.searchTerm.toLowerCase())
  )
  return (
    <div>
      {filteredPersons.map(person => 
        <div>
          <p key={person.name}>{person.name} {person.number} <button onClick={() => props.deleteName(person)}>delete</button></p>
        </div>
      )}
    </div>
  )
}

export default PersonDisplay