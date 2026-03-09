const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2/promise");

app.use(express.json());
app.use(cors());

const dbConfig = {
  host: "localhost",
  user: "user",
  password: "password",
  database: "roster"
}

async function executeQuery(query, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  const [results] = await connection.execute(query, params);
  await connection.end();
  return results;
}


app.get("/students", async (req, res) => {
  try {
    const query = 'select * from Roster';
    const students = await executeQuery(query);
    res.json(students)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post("/student", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Yo, give us name and email' });
  }

  try {
    const query = `insert into Roster (name, email) values (?,?)`;
    const students = await executeQuery(query, [name, email]);
    res.status(200).send("Yay, new student created");
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})


// app.get("/students", (req, res) => {
//   res.json(students)
// })

// app.get("/students/:id", (req, res) => {
//   const studentId = Number(req.params.id);
//   res.json(students.filter(s => s.id === studentId))
// })

app.listen(3089, () => {
  console.log(`Example app listening on port 3089`)
})