import { useSelector, useDispatch } from 'react-redux'
import { handleVoteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const sortedAnecdotes = [...anecdotes]
    .filter(a => filter === "" || a.content.includes(filter))
    .sort((a, b) => b.votes - a.votes)
  
  const vote = (content, id) => {
    dispatch(handleVoteAnecdote(id))
    dispatch(showNotification(`You voted '${content}'`, 5))
  }

  return (
    <>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.content, anecdote.id)}>vote</button>
        </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList