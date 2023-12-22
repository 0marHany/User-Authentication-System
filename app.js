const express = require('express')
const app = express()
require("dotenv").config();
app.use(express.json())

const port = process.env.Port;

const DbConnection = require("./configuration/Db_Config");
DbConnection();

const UserRouter = require("./src/Users/routes/routes")
app.use(UserRouter);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))