const fs = require("fs");
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

module.exports={
    getData,
    createNewUser
}