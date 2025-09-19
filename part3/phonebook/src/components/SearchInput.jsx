const SearchInput = (props) => {
  return (
    <div>
      Search: <input onChange={props.handleSearch}/>
    </div>
  )
}

export default SearchInput