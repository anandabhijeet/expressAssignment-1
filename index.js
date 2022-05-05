const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
const { v4: uuidv4 } = require("uuid");

const getData = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./Data/userData.json", "utf-8", (error, data) => {
      if (error) reject("Could not find the file to read");
      // console.log(data);
      resolve(data);
    });
  });
};

const createNewUser = async (data) => {
  console.log("createNewUser method been called");
  return new Promise((resolve, reject) => {
    fs.writeFile("./Data/userData.json", data, (error) => {
      if (error) reject(error);
      resolve("successfully written");
    });
  });
};

app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await getData();
    res.status(200).json({
      status: "success",
      message: "request received",
      data: {
        users: JSON.parse(users),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "Not found",
    });
  }
});

app.post("/api/v1/user/login", async (req, res) => {
  try {
    let users = await getData().catch((error) => {
      console.log(error);
    });
    let usersArray = JSON.parse(users);

    const verifiedUser = usersArray.find((user) => {
      return user.email == req.body.email && user.password == req.body.password;
    });

    verifiedUser
      ? res.status(200).json({
          status: "user found",
          message: "login successful",
          data: {
            user: verifiedUser,
          },
        })
      : res.status(404).json({
          status: "user not found",
          message: "Invalid credential",
        });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "Not Found",
    });
  }
});

app.post("/api/v1/user/signUp", async (req, res) => {
  try {
    const newId = uuidv4();
    const newUser = Object.assign({ id: newId }, req.body);

    const users = await getData();

    console.log("newUser", newUser);
    const userArray = JSON.parse(users);
    userArray.push(newUser);
    console.log("users", userArray);

    await createNewUser(JSON.stringify(userArray));

    res.status(201).json({
      status: "New User Found",
      data: {
        newUser: newUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Not found",
    });
  }
});

app.patch("/api/v1/users/:email", async (req, res) => {
  try {
    const users = await getData();
    const userArray = JSON.parse(users);

    // console.log(userArray);

    const findUserByEmail = userArray.find(
      (el) => el.email === req.params.email
    );

    if (findUserByEmail) {
      let index = userArray.indexOf(findUserByEmail);
      console.log(index);

      Object.keys(req.body).map((el) => {
        findUserByEmail[el] = req.body[el];
      });

      userArray.splice(index, 1, findUserByEmail);
      await createNewUser(JSON.stringify(userArray));

      res.status(200).json({
        status: "updated",
      });

      
    } else {
      res.status(404).json({
        status: "Not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: error,
    });
  }
});

app.delete("/api/v1/users/:email", async (req, res) => {
  try {
    const users = await getData();
    const userArray = JSON.parse(users);

    const deletedUserArray = userArray.filter(
      (el) => el.email !== req.params.email
    );
    console.log(deletedUserArray);
    await createNewUser(JSON.stringify(deletedUserArray));
    res.status(200).json({
      status: "deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: error,
    });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log("Listening....");
});