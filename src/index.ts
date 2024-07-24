import express from 'express'

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.get('/', (req, res) => {
  res.send({message: 'Hello World!'}) 
})

const db = {
  courses: [
    {id:1, title: 'front-end'},
    {id:2, title: 'back-end'},
    {id:3, title: 'devops'},
  ]
}

app.get('/courses', (req, res) => {
  console.log('req.query.title',req.query.title);
  
  let foundCourses = db.courses
  if(req.query.title){
    foundCourses = foundCourses.filter(c => c.title.includes(req.query.title as string))
  }

  if(!foundCourses){
    res.sendStatus(404)

    return
  }
  
  res.json(foundCourses)
})


app.get('/courses/:id', (req, res) => {
  const currentData = db.courses.find(c => c.id === +req.params.id)

  if(!currentData){
    res.sendStatus(404)

    return
  }

  res.json(currentData)
})

app.post('/courses', (req, res) => {
  console.log('req.body',req);

  if(!req.body.title?.trim()){
    res.sendStatus(400)
    return
  }

  const newCourse = {
    id: +(new Date()),
    title: req.body.title
  }
  db.courses.push(newCourse)
  res.status(201).json(newCourse)
})

app.delete('/courses/:id', (req, res) => {
  const currentData = db.courses.find(c => c.id === +req.params.id)

  if(!req.params.id || !currentData){
    res.sendStatus(404)

    return
  }

  db.courses = db.courses.filter(c => c.id !== +req.params.id)

  res.json(currentData)
})

app.put('/courses/:id', (req, res) => {
  const currentCourse = db.courses.find(c => c.id === +req.params.id)

  if(!req.params.id || !currentCourse || !req.body.title){
    res.sendStatus(404)

    return
  }

  currentCourse.title = req.body.title

  db.courses = db.courses.map((course) => {
    if(course.id === +req.params.id){
      return currentCourse
    }
    else return course
  })

  res.json(currentCourse)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

  