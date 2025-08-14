import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => <tr><td>{props.name}</td> <td>{props.value}</td></tr>

const Statistics = (props) => {
  if (props.values[0] + props.values[1] + props.values[2] == 0) {
    return ("No feedback given")
  }
  return (
    <div>
      <StatisticLine name="good" value={props.values[0]}/>
      <StatisticLine name="neutral" value={props.values[1]}/>
      <StatisticLine name="bad" value={props.values[2]}/>
      <StatisticLine name="average" value={props.values[3]}/>
      <StatisticLine name="positive" value={props.values[4] + "%"}/>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const average = (good * 1 + bad * -1) / (good + neutral + bad)
  const positive = good / (good + neutral + bad)

  const setNewGood = newValue => {
    setGood(newValue);
  }

  const setNewNeutral = newValue => {
    setNeutral(newValue);
  }

  const setNewBad = newValue => {
    setBad(newValue);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setNewGood(good + 1)} text="good"></Button>
      <Button onClick={() => setNewNeutral(neutral + 1)} text="neutral"></Button>
      <Button onClick={() => setNewBad(bad + 1)} text="bad"></Button>
      <h1>statistics</h1>
      <Statistics values={[good, neutral, bad, average, positive]}/>
    </div>
  )
}

export default App