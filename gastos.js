const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { actualizarUser } = require("./roommates.js");
const url = require("url");

const POST_Gasto = async (req, res) => {
  let datos = "";
  req.on("data", (chunk) => {
    datos += chunk.toString();
  });
  req.on("end", () => {
    const gasto = JSON.parse(datos);
    gasto.id = uuidv4().slice(30);
    GET_Gasto(gasto, res);
  });
};

const GET_Gasto = async (gasto, res) => {
  try {
    const gastosJSON = await JSON.parse(
      fs.readFileSync("gastos.json", "utf8")
    );
    gastosJSON.gastos.push(gasto);
    fs.writeFile("gastos.json", JSON.stringify(gastosJSON), (error) => {
      error
        ? console.log("Error de gasto")
        : console.log("Exito guardado");
      res.end("Actualizado");
    });
    actualizarUser(gasto);
  } catch (error) {
    console.log(error);
  }
};

const PUT_Gasto = async (gastos, res) => {
  try {
    fs.writeFile("gastos.json", JSON.stringify(gastos), (error) => {
      if (error) console.log("Error en añadir");
      else {
        console.log("Gasto Actualizado");
        PUT_GastoUser();
        res.end();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const DETELE_Gasto = async (id, res) => {
  try {
    const gastosJSON = await JSON.parse(
      fs.readFileSync("gastos.json", "utf8")
    );

    let data = {};
    data.gastos = gastosJSON.gastos.filter((gasto) => {
      if (gasto.id != id) return gasto;
    });
    PUT_Gasto(data, res);
  } catch (error) {
    console.log(error);
  }
};

const PUT_GastoUser = async () => {
  try {
    const gastosJSON = await JSON.parse(
      fs.readFileSync("gastos.json", "utf8")
    );
    const userJSON = await JSON.parse(
      fs.readFileSync("roommates.json", "utf8")
    );

    let gastos = [];
    let divisor = userJSON.roommates.length;
    gastos = gastosJSON.gastos.map((user) => {
      return {
        id: user.idroommie,
        monto: user.monto / divisor,
      };
    });

    let user = {};
    user.roommates = userJSON.roommates.map((userRoom) => {
      userRoom.recibe = 0;
      userRoom.debe = 0;
      gastos.forEach((gasto) => {
        if (gasto.id === userRoom.id) userRoom.recibe += gasto.monto;
        else userRoom.debe += gasto.monto;
      });
      return userRoom;
    });
    fs.writeFileSync("roommates.json", JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
};

const editGasto = async (req, res) => {
  let datos = "";
  const params = url.parse(req.url, true).query;
  const id_costo = params.id;
  req.on("data", (chunk) => {
    datos += chunk.toString();
  });
  req.on("end", async () => {
    const dataGasto = JSON.parse(datos);
    const idroommie = dataGasto.idroommie;
    const room = dataGasto.roommate;
    const desc = dataGasto.descripcion;
    const monto = dataGasto.monto;
    const gastosJSON = await JSON.parse(
      fs.readFileSync("gastos.json", "utf8")
    );
    let dataUser = {};
    dataUser.gastos = gastosJSON.gastos.map((gasto) => {
      if (gasto.id === id_costo) {
        gasto.idroommie = idroommie;
        gasto.roommate = room;
        gasto.descripcion = desc;
        gasto.monto = monto;
      }
      return gasto;
    });
    PUT_Gasto(dataUser, res); 
  });
};

module.exports = {
  POST_Gasto,
  PUT_GastoUser,
  DETELE_Gasto,
  PUT_Gasto,
  GET_Gasto,
  editGasto,
};
