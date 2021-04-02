const express = require("express");
const app = express();
const morgan = require("morgan");

morgan.token("reqBody", (req, res) => JSON.stringify(req.body));
let customLogger = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.reqBody(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
};
app.use(express.json());
app.use(morgan(customLogger));

let notes = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(notes);
});

app.get("/api/persons/:id", (req, res) => {
  // console.log(!notes.some((note) => note.id === req.params.id));
  if (!notes.some((note) => note.id == req.params.id)) {
    return res.status(404).send(`<p>Requested id was not found</p>`);
  } else {
    const matchId = notes.find((note) => note.id == req.params.id);
    return res.status(200).send(`${matchId.name} - ${matchId.number}`);
  }
});

app.get("/info", (req, res) => {
  res
    .status(200)
    .send(
      `<p>Phonebook has info for ${
        notes.length
      } people </p><p>${new Date()}</p>`
    );
});

app.delete("/api/persons/:id", (req, res) => {
  console.log(req.params.id);
  notes = notes.filter((note) => note.id != req.params.id);
  res.status(204).send(`${req.params.id} successfully deleted`);
});

app.post("/api/persons", (req, res) => {
  const id = Math.random() * 9999999;
  console.log(req);
  if (notes.some((note) => note.name == req.body.name)) {
    return res.json({ error: "name must be unique" });
  } else if (!req.body.name) {
    return res.json({ error: "Please enter a name" });
  }

  notes.push({ id: id, name: req.body.name, number: req.body.number });
  res.status(200).send(`${req.body.name} has been added to the contacts list`);
  // res.redirect("/");
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = 3000;
app.listen(PORT, console.log("Starting server"));
