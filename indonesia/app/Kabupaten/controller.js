const Kabupaten = require("./model");
const Provinsi = require("../Provinsi/model");
const fs = require("fs");
const path = require("path");

module.exports = {
  // ADD ===============================
  viewAddKab: async (req, res) => {
    try {
      let newProvs = [];
      const provs = await Provinsi.findAll();
      provs.map((prov) => {
        newProvs.push({
          id: prov.id,
          nama: prov.nama,
        });
      });

      res.render("kabupaten/addkabu", {
        title: "Kabupaten",
        newProvs,
      });
    } catch (err) {
      console.log(err);
    }
  },

  actionAddKab: async (req, res) => {
    try {
      const { nama, diresmikan, Provinsi_Id } = req.body;
      await Kabupaten.create({
        nama,
        diresmikan,
        Provinsi_Id,
      });

      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  },

  //   EDIT =================================='
  viewEditKab: async (req, res) => {
    try {
      const { id } = req.params;
      let newProvs = [];
      const provs = await Provinsi.findAll();
      provs.map((prov) => {
        newProvs.push({
          idProv: prov.id,
          namaProv: prov.nama,
        });
      });

      let newKab = {};
      const kabs = await Kabupaten.findAll({ where: { id } });
      kabs.map((prov) => {
        newKab = {
          id: prov.id,
          nama: prov.nama,
          diresmikan: prov.diresmikan,
          photo: prov.photo,
        };
      });

      res.render("kabupaten/editkab", {
        title: "Kabupaten",
        newProvs,
        newKab,
      });
    } catch (err) {
      console.log(err);
    }
  },

  actionEditKab: async (req, res) => {
    try {
      const idParams = req.params.id;
      const { nama, diresmikan, Provinsi_Id } = req.body;
      console.log(req.file);
      if (req.file) {
        // lokasi ambil foto
        let tmp_path = req.file.path;
        // ambil extensi
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        // sambungkan extensi dengan name baru
        let filename = req.file.filename + "." + originaExt;
        // simpan ke folder
        let target_path = path.resolve(`public/upload/${filename}`);
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            await Kabupaten.update(
              {
                nama,
                diresmikan,
                Provinsi_Id,
                photo: filename,
              },
              {
                where: {
                  id: idParams,
                },
              }
            );
            res.redirect("/");
          } catch (err) {
            console.log(err.message);
          }
        });
      } else {
        await Kabupaten.update(
          { nama, diresmikan, Provinsi_Id },
          { where: { id: idParams } }
        );
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  },
};