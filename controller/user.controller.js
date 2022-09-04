const fs = require("fs");

async function getAllUsers(req, res) {
     fs.readFile("user.json", (err, data) => {
          const userData = JSON.parse(data);
          const limit = req.query.limit
          const sliceUser = userData.slice(0, limit)
          res.send(sliceUser)
     })

}
async function getRandomUser(req, res) {
     fs.readFile("user.json", (err, data) => {
          const userData = JSON.parse(data);
          const id = Math.floor(Math.random() * userData.length) + 1;
          const user = userData.find(user => user.id == id)
          res.send(user)
     })

}

// post user
async function postUser(req, res) {
     const data = fs.readFileSync("user.json");
     const myObject = JSON.parse(data);
     const newUser = req.body;

     // validating req.body data
     const { gender, name, contact, address, photoURL } = req.body;

     if (!gender) {
          res.status(403).json({
               success: false,
               message: "gender is not found",
          });
     }
     else if (!name) {
          res.status(403).json({
               success: false,
               message: "name is not found",
          });
     }
     else if (!contact) {
          res.status(403).json({
               success: false,
               message: "contact is not found",
          });
     }
     else if (!address) {
          res.status(403).json({
               success: false,
               message: "address is not found",
          });
     }
     else if (!photoURL) {
          res.status(403).json({
               success: false,
               message: "photoURL is not found",
          });
     }
     else {
          newUser.id = myObject.length + 2;
          myObject.push(newUser);
          const newData2 = JSON.stringify(myObject);
          fs.writeFile("user.json", newData2, (err) => {
               if (err) {
                    console.log(err.message);
                    return;
               }

               res.status(200).json({
                    success: true,
                    message: "Successfully added data to json file!",
               });
               // res.send("Successfully added data to json file!");
          });
     }
}

// update User
async function updateUser(req, res) {
     const data = fs.readFileSync("user.json");
     const myObject = JSON.parse(data);

     // validating req.body data
     const { id, gender, name, contact, address, photoURL } = req.body;
     if (!id) {
          res.status(403).json({
               success: false,
               message: "id is not found",
          });
     }
     else {
          const exisUser = myObject.find(user => user.id == id)
          const restUser = myObject.filter(user => user.id !== id)
          if (exisUser) {
               const newUser = {
                    id: id,
                    gender: gender || exisUser.gender,
                    name: name || exisUser.name,
                    contact: contact || exisUser.contact,
                    address: address || exisUser.address,
                    photoURL: photoURL || exisUser.photoURL,
               }
               restUser.push(newUser);
               const newData2 = JSON.stringify(restUser);
               fs.writeFile("user.json", newData2, (err) => {
                    if (err) {
                         res.status(400).json({
                              success: false,
                              message: err.message,
                         });
                    }
                    res.status(200).json({
                         success: true,
                         message: "Successfully updated data in json file!",

                    });
               });
          }
          else {
               res.status(403).json({
                    success: false,
                    message: "user not found",
               });
          }
     }


}

async function bulkUpdate(req, res) {
     const data = fs.readFileSync("user.json");
     const myObject = JSON.parse(data);
     const users = req.body;
     const emptyId = users.find(user => user.id == "" || user.id == null)
     if (emptyId) {
          res.status(403).json({
               success: false,
               message: `id not found in ${emptyId.name}`,
          });
     }
     else {
          const { Id, gender, name, contact, address, photoUrl } = req.body
          const updatedUser = { Id, gender, name, contact, address, photoUrl }

          if (!Id || !gender || !name || !contact || !address || !photoUrl) {
               return res.status(403).json({ error: "Please provide Id, gender, name, contact, address, photoUrl property." })
          }

          Id.forEach(id => {
               if (isNaN(id) || !id) {
                    return res.status(403).json({ error: "Please provide valid data" })
               }
          })

          myObject.forEach(user => {
               Id.filter(id => user.Id == id ? updateUser(user) : null)
          });

          function updateUser(user) {
               myObject = myObject.map(data => data.Id == user.Id ? { ...updatedUser, Id: user.Id } : data)
          }

          writeFileSync(file, JSON.stringify(myObject))
          res.status(201).json({ message: "Users data updated successfully" })
     }
}

// deleteUser
async function deleteUser(req, res) {
     const data = fs.readFileSync("user.json");
     const myObject = JSON.parse(data);

     // validating req.body data
     const { id } = req.body;
     if (!id) {
          res.status(400).json({
               success: false,
               message: "id is not found",
          });
     }
     else {
          const exisUser = myObject.find(user => user.id == id)
          const restUser = myObject.filter(user => user.id !== id)
          if (exisUser) {
               const newData2 = JSON.stringify(restUser);
               fs.writeFile("user.json", newData2, (err) => {
                    if (err) {
                         res.status(400).json({
                              success: false,
                              message: err.message,
                         });
                    }
                    res.status(200).json({
                         success: true,
                         message: "Successfully deleted data from json file!",

                    });
               });
          }
          else {
               res.status(400).json({
                    success: false,
                    message: "user not found",
               });
          }
     }

}

module.exports = { getAllUsers, getRandomUser, postUser, updateUser, bulkUpdate, deleteUser }