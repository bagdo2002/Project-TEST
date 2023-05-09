

const express = require("express");
const fs = require("fs");
const app = express();


app.use(express.json());

const readFile = () => {
  const rawData = fs.readFileSync("./data.json");
  return JSON.parse(rawData);
};

const writeFileJson = (data) => {
  const jsonData = JSON.stringify(data);
  fs.writeFileSync("./data.json", jsonData);
};

// Get all users
app.get("/api", (req, res) => {
  const data = readFile();
  res.json(data);
});

// Get user by ID
app.get("/api/:id", (req, res) => {
  const data = readFile();
  const user = data.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
});

// Add new user
app.post("/api", (req, res) => {
  const data = readFile();
  const newUser = {
    id:Math.floor(Math.random() * 1000),
    ...req.body,
  };
  data.push(newUser);
  writeFileJson(data);
  res.json(newUser);
});

// Update user
app.put("/api/:id", (req, res) => {
  const data = readFile();
  const userIndex = data.findIndex(
    (user) => user.id === parseInt(req.params.id)
  );
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }
  const updatedUser = {
    ...data[userIndex],
    ...req.body,
    id: parseInt(req.params.id),
  };
  data[userIndex] = updatedUser;
  writeFileJson(data);
  res.json(updatedUser);
});

// Delete user
app.delete("/api/:id", (req, res) => {
  const data = readFile();
  const filteredData = data.filter(
    (user) => user.id !== parseInt(req.params.id)
  );
  if (filteredData.length === data.length) {
    return res.status(404).send("User not found");
  }
  writeFileJson(filteredData);
  res.sendStatus(204);
});


app.listen(5000,()=>{ console.log("server started on port 5000")})
