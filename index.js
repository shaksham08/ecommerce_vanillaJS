const express = require("express");
const bodyParser = require("body-parser");
const userRepo = require("./repository/users");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["helloworld"], //this is used to encrypt
  })
);

app.use(authRouter);

app.listen(3000, () => {
  console.log("Listening");
});
