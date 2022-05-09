const {
  emailValidator,
  passwordValidator,
  nameValidator,
} = require("../validation");
const { v4: uuidv4 } = require("uuid");

const {getData, createNewUser} = require("../Data/userData")

const getUserData = async (req, res) => {
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
};

const userLogin = async (req, res) => {
  try {
    const emailValidity = emailValidator(req.body.email);
    const passwordValidity = passwordValidator(req.body.password);

    if (emailValidity && passwordValidity) {
      let users = await getData().catch((error) => {
        console.log(error);
      });
      let usersArray = JSON.parse(users);

      const verifiedUser = usersArray.find((user) => {
        return (
          user.email == req.body.email && user.password == req.body.password
        );
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
    } else if (!emailValidity) {
      res.status(404).json({
        status: "Incorrect Email address",
      });
    } else if (!passwordValidity) {
      res.status(404).json({
        status: "incorrect password",
        message:
          "correct order : (?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,16}",
      });
    }

    console.log("validation:", emailValidity, passwordValidity);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "Not Found",
    });
  }
};

const userSignUp = async (req, res) => {
  try {
    const users = await getData();
    const userArray = JSON.parse(users);
    const emailValidity = emailValidator(req.body.email);
    const passwordValidity = passwordValidator(req.body.password);
    const nameValidity = nameValidator(req.body.name);
    // const phoneValidity = phoneValidator(req.body.phone)

    const emailIsUsed = userArray.filter((el) => el.email === req.body.email);
    console.log(emailIsUsed.length);

    if (emailIsUsed.length) {
      res.status(406).send("email is already Used");
    } else {
      if (emailValidity && passwordValidity && nameValidity) {
        const newId = uuidv4();
        const newUser = Object.assign({ id: newId }, req.body);

        console.log("newUser", newUser);

        userArray.push(newUser);
        console.log("users", userArray);

        await createNewUser(JSON.stringify(userArray));

        res.status(201).json({
          status: "New User Added",
          data: {
            newUser: newUser,
          },
        });
      } else if (!emailValidity) {
        res
          .status(409)
          .json({ status: "conflict", message: "Invalid Email format" });
      } else if (!passwordValidity) {
        res
          .status(409)
          .json({ status: "conflict", message: "Incorrect  password format " });
      } else if (!nameValidity) {
        res.status(409).json({ status: "conflict", message: "Incorrect name" });
      }
      // }else if(!phoneValidity){
      //   res.status(409).json({status: "conflict", message: "incorrect phone number"})
      // }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Not found",
    });
  }
};

const userUpdate = async (req, res) => {
  try {
    const users = await getData();
    const userArray = JSON.parse(users);
    const emailValidity = emailValidator(req.body.email);
    const passwordValidity = passwordValidator(req.body.password);
    const nameValidity = nameValidator(req.body.name);

    if (!req.body) {
      res.status(400).send("Add something to update");
    } else if (req.body.email && !emailValidity) {
      console.log("email");
      res.status(400).send("Incorrect email format");
    } else if (req.body.password && !passwordValidity) {
      console.log("password");
      res.status(400).send("Incorrect password format");
    } else if (req.body.name && !nameValidity) {
      console.log("name", nameValidity);
      res.status(400).send("Invalid Name");
    } else {
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
    }

    // console.log(userArray);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: error,
    });
  }
};

const userDelete = async (req, res) => {
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
};

module.exports = {
  getUserData,
  userLogin,
  userSignUp,
  userUpdate,
  userDelete,
};
