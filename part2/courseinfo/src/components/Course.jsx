const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part part={part.name} exercises={part.exercises}/>
      )}
    </div>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p><b>Total of {total} excercises</b></p>
  )
}

const Course = (props) => (
  <div>
    <Header course={props.course.name} />
    <Content parts={props.course.parts}/>
    <Total parts={props.course.parts} />
  </div>
)

export default Course