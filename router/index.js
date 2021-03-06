const express = require("express");
const router = express.Router();
const { UserGame, UserProfile } = require("../models");

router.get("/", (req, res) => {
  res.render("pages/intro/login.ejs");
});

router.get("/home", (req, res) => {
  res.render("pages/home/index.ejs");
});

/** START USERGAMES ROUTE */

router.get("/userGames", (req, res) => {
  UserGame.findAll().then((userGames) => {
    res.render("pages/userGames/index", {
      pageTitle: "User Game",
      userGames,
    });
  });
});

router.get("/userGames/create", (req, res) => {
  res.render("pages/userGames/create", { pageTitle: "Create User" });
});

router.post("/userGames", (req, res) => {
  // Database tidak dapat menerima string kosong dalam memasukkan date
  // Jadi harus dilakukan pengecekan untuk konversi string kosong jadi null
  let joinDate;
  if (!req.body.joinDate) {
    joinDate = null;
  } else {
    joinDate = req.body.joinDate;
  }

  UserGame.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    joinDate,
  }).then(() => {
    res.redirect("/userGames");
  });
});

router.get("/userGames/:id", (req, res) => {
  UserGame.findOne({
    where: { id: req.params.id },
  }).then((userGame) => {
    res.render("pages/userGames/show", {
      pageTitle: `UserGame: ${userGame.name}`,
      userGame,
    });
  });
});

router.get("/userGames/:id/edit", (req, res) => {
  UserGame.findOne({
    where: { id: req.params.id },
  }).then((userGame) => {
    res.render("pages/userGames/edit", {
      pageTitle: "Edit User",
      userGame,
    });
  });
});

router.put("/userGames/:id", (req, res) => {
  let joinDate;
  if (!req.body.joinDate) {
    joinDate = null;
  } else {
    joinDate = req.body.joinDate;
  }

  UserGame.update(
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      joinDate,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    res.redirect("/userGames");
  });
});

router.delete("/userGames/:id", (req, res) => {
  UserGame.destroy({
    where: {
      id: req.params.id,
    },
  }).then(() => {
    res.redirect("back");
  });
});

/** END USERGAMES ROUTE */

/** START SUPPLIERS ROUTE */

router.get("/userProfiles", (req, res) => {
  UserProfile.findAll({
    order: [["fullName", "ASC"]],
    include: ["userGame"],
  }).then((userProfiles) => {
    res.render("pages/userProfiles/index", {
      pageTitle: "User Profile",
      userProfiles,
    });
  });
});

router.get("/userProfiles/create", (req, res) => {
  UserGame.findAll({
    order: [["username", "ASC"]],
  }).then((userGames) => {
    res.render("pages/userProfiles/create", {
      pageTitle: "Create Profile",
      userGames,
    });
  });
});

router.post("/userProfiles", (req, res) => {
  const { fullName, address, phoneNumber, userGameId } = req.body;

  UserProfile.create({
    fullName,
    address,
    phoneNumber,
    userGameId,
  }).then(() => {
    res.redirect("/userProfiles");
  });
});

router.get("/userProfiles/:id", (req, res) => {
  UserProfile.findOne({
    where: { id: req.params.id },
    include: ["userGame"],
  }).then((userProfile) => {
    res.render("pages/userProfiles/show", {
      pageTitle: `User: ${userProfile.fullName}`,
      userProfile,
    });
  });
});

router.get("/userProfiles/:id/edit", async (req, res) => {
  const userProfile = await UserProfile.findOne({
    where: { id: req.params.id },
  });

  const userGames = await UserGame.findAll({
    order: [["username", "ASC"]],
  });

  res.render("pages/userProfiles/edit", {
    pageTitle: "Edit Profile",
    userProfile,
    userGames,
  });
});

router.delete("/userProfiles/:id", (req, res) => {
  UserProfile.destroy({
    where: {
      id: req.params.id,
    },
  }).then(() => {
    res.redirect("back");
  });
});
/** END SUPPLIERS ROUTE */

// router.get("/api/userProfiles", (req, res) => {
//   UserProfile.findAll({
//     order: [["fullName", "ASC"]],
//     include: ["userGame"],
//   }).then((userProfiles) => {
//     res.json(userProfiles);
//   });
// });

module.exports = router;
