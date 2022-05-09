const express = require("express");
const app = express();
app.use(express.json());

const {
  getUserData,
  userLogin,
  userSignUp,
  userUpdate,
  userDelete,
} = require("./services/eventHandlers");

app.get("/api/v1/users", getUserData);

app.post("/api/v1/user/login", userLogin);

app.post("/api/v1/user/signUp", userSignUp);

// app.patch("/api/v1/users/:email", userUpdate);

// app.delete("/api/v1/users/:email", userDelete);

app.route("/api/v1/users/:email").patch(userUpdate).delete(userDelete);

const port = 3000;
app.listen(port, () => {
  console.log("Listening....");
});
