const controller = require("../controllers/BookController");

module.exports = function(app) {
  app.post("/api/v1/pinjam-buku", controller.pinjamBuku)
  app.put("/api/v1/pengembalian-buku", controller.pengembalianBuku)
  app.get("/api/v1/books", controller.getAllBook)
  app.get("/api/v1/ready-books", controller.getReadyBook)

  app.get("/api/v1/members", controller.countBookMember)
};