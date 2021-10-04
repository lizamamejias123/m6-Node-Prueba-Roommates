// Modulos
const axios = require("axios");
const {
    v4: uuidv4
} = require("uuid");
const fs = require("fs");


const nuevoUser = async (res) => {
    let user = {};
    await axios
        .get("https://randomuser.me/api/")
        .catch((error) => console.log(error))
        .then((datos) => {
            const data = datos.data.results;
            user = {
                id: uuidv4().slice(30),
                correo: data[0].email,
                nombre: `${data[0].name.first} ${data[0].name.last}`,
                debe: 0,
                recibe: 0,
            };
            return user;
        })
        .then(async (user) => {
            await guardarUser(user);
            res.end(JSON.stringify(user));
        })
        .catch((error) => {
            console.log(error);
        });
};

const guardarUser = async (user) => {
    try {
        const userJSON = await JSON.parse(
            fs.readFileSync("roommates.json", "utf8")
        );
        userJSON.roommates.push(user);
        fs.writeFileSync("roommates.json", JSON.stringify(userJSON));
    } catch (error) {
        console.log(error);
    }
};

const actualizarUser = async (gasto) => {

    try {
        const userJSON = await JSON.parse(
            fs.readFileSync("roommates.json", "utf8")
        );
        let data = {};
        let deuda = gasto.monto / userJSON.roommates.length;
        data.roommates = userJSON.roommates.map((user) => {
            if (user.id == gasto.idroommie) user.recibe += deuda;
            else user.debe += deuda;
            return user;
        });
        fs.writeFileSync("roommates.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    nuevoUser,
    actualizarUser,
    guardarUser
};