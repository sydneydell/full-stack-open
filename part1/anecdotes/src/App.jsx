/* eslint-disable react/prop-types */
import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

  const getMostVotes = (votes) => {
    var max = votes[0];
    var maxIndex = 0;
    for (var i=1; i < votes.length; i++) {
      if (votes[i] > max) {
        max = votes[i];
        maxIndex = i;
      }
    }

    return maxIndex;
  }
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleGetClick = () => {
    setSelected(getRandomInt(anecdotes.length))
  }

  const handleVoteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]} </p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={handleVoteClick} text="vote" />
      <Button handleClick={handleGetClick} text="next anecdote" />

      <h1>Anecdote with the most votes</h1>
      <p>{anecdotes[getMostVotes(votes)]}</p>
      <p>has {votes[getMostVotes(votes)]} votes</p>
    </div>
  )
}

export default App