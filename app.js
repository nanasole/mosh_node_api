cd; // const express = require("express");
// const http = require("http");

// const app = express();

// const server = http.createServer((req, res) => {
//   req.writeHead(200, { "Content-Type": "application/json" });
//   res.end(
//     JSON.stringify({
//       data: "Hello, world",
//     })
//   );
// });

const courses = [
  { id: 1, name: "father", age: "45" },
  { id: 2, name: "mother", age: "39" },
  { id: 3, name: "son", age: "20" },
  { id: 4, name: "brother", age: "13" },
  { id: 5, name: "aunty", age: "37" },
  { id: 6, name: "uncle", age: "33" },
];

// const http = require("http");
const joi = require("joi");
const express = require("express");
const { error } = require("joi/lib/types/lazy");
const array = require("joi/lib/types/array");
const app = express();
app.use(express.json());
const env = require("dotenv").config();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});
//requesting a course from the server
app.get("/api/courses/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (course) {
    res.send(course);
    // res.send(req.params.id);
  } else {
    //response with status code 404 for invalid course
    res.status(404).send("The recommended course is not available");
  }
});

app.get("/api/post/:year/:month", (req, res) => {
  res.send(req.params);
});
app.get("/api/courses/:id?sortBy=Name", (req, res) => {
  res.send(req.query);
});
//posting to the collection of course already in the courses array
app.post("/api/courses", (req, res) => {
  //define a schema with joi module
  const schema = {
    name: joi.string().min(3).required(),
    age: joi.number(),
  };
  const result = joi.validate(req.body, schema);
  console.log(result);
  //input validation error message
  // if (!req.body.name || req.body.name.length < 3) {
  //   //send a 400 bad request error message
  //   res
  //     .status(400)
  //     .send(`$name is required and should be not be less3 characters`);
  //   return;
  // }
  /**
   * Instead of the manual validation done above we can use joy
   */
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  } else {
    const course = {
      id: courses.length + 1,
      name: req.body.name,
      age: req.body.age,
    };
    courses.push(course);
    res.send(course);
  }
});
//=================================================================
app.put("/api/courses/:id", (req, res) => {
  // // TODO: LOOK UP THE COURESE
  // //? THAT
  // //! MOST IMPORTANT
  // //DEFAULT: CODE BLOCK
  // //FIRST WE NEED TO LOOKUP THE COURSES
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The recommended course is not available");
    return;
  }

  //response with status code 404 for invalid course
  //!Do the above instead

  // VALIDE
  // const schema = {
  //   id: joi.number(),
  //   name: joi.string().min(3).required(),
  //   age: joi.number(),
  // };

  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // //!Better validation for course from method
  //? UPDATE THE COURSE AND RETURN THE UPDATE COURSE TO THE CLIENT

  course.name = req.body.name;
  course.age = req.body.age;
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: joi.string().min(3).required(),
    age: joi.number(),
  };
  const joiResult = joi.validate(course, schema);
  return joiResult;
}

app.delete("/api/courses/:id", (req, res) => {
  //lookup the course is courses
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The recommended course is not available");
    return;
  }
  //not exit, we neeed to need to return 404
  // we need to find the index of the course in our courses array
  const index = courses.indexOf(course);
  // else we delete it
  //revove from one object from our courses array
  course = courses.splice(index, 1);
  //and return the course that was deleted
  res.send(course);
});

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
