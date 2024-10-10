const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <p>{props.part} {props.exercise}</p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.exercise1 + props.exercise2 + props.exercise3}</p>
    </div>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const courses = [
    { part: 'Fundamentals of React', exercise: 10 },
    { part: 'Using props to pass data', exercise: 7} ,
    { part: 'State of component', exercise: 14 }
  ]

  return (
    <div>
      <Header course={course} />
      <Content part={courses[0].part} exercise={courses[0].exercise} />
      <Content part={courses[1].part} exercise={courses[1].exercise} />
      <Content part={courses[2].part} exercise={courses[2].exercise} />
      <Total exercise1={courses[0].exercise} exercise2={courses[1].exercise} exercise3={courses[2].exercise} />
    </div>
  )
}

export default App