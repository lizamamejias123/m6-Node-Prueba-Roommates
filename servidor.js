const http = require('http')
const fs = require('fs')
const url = require('url')
const {
    nuevoUser,
    actualizarUser,
    guardarUser
} = require('./roommates.js')
const {
    POST_Gasto,
    PUT_GastoUser,
    DETELE_Gasto,
    PUT_Gasto,
    GET_Gasto,
    editGasto,
} = require('./gastos')


http
  .createServer(async (req, res) => {
    // Creación de servidor
    if (req.url == "/" && req.method == "GET") {
      // Página raíz
      res.setHeader("content-type", "text/html");
      console.log(`${res.statusCode} GET /`);
      res.end(fs.readFileSync("index.html", "utf8"));
    }

    if (req.url.startsWith("/roommate") && req.method == "POST") {
      console.log(`${res.statusCode} POST ROOMMATES`);
      await nuevoUser(res);
      await PUT_GastoUser();
    }

    if (req.url.startsWith("/roommates") && req.method == "GET") {
      console.log(`${res.statusCode} GET ROOMMATES`);
      res.setHeader("Content-Type", "application/json");
      res.end(fs.readFileSync("roommates.json", "utf8"));
    }

    if (req.url.startsWith("/gastos") && req.method == "GET") {
      console.log(`${res.statusCode} GET GASTO`);
      res.setHeader("Content-Type", "application/json");
      res.end(fs.readFileSync("gastos.json", "utf8"));
    }

    if (req.url.startsWith("/gasto") && req.method == "POST") {
      console.log(`${res.statusCode} POST GASTO`);
      await POST_Gasto(req, res).then((gasto) => {
        res.end(JSON.stringify(gasto));
      });
    }

    if (req.url.startsWith("/gasto") && req.method == "PUT") {
      console.log(`${res.statusCode} PUT GASTO`);
      await editGasto(req, res);
    }

    if (req.url.startsWith("/gasto") && req.method == "DELETE") {
      console.log(`${res.statusCode} DELETE GASTO`);
      const params = url.parse(req.url, true).query;
      const id_costo = params.id;
      await DETELE_Gasto(id_costo, res);
    }
  })
  .listen(3000, () => console.log("3000 ON"));
