const express = require("express");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {
  Schema
} = mongoose;

// binds Express module to app
const app = express();

// tell our app to use EJS as its view engine (template engine)
app.set('view engine', 'ejs');

// create new database called 'tournamentDB' if it does not already exist.
mongoose.connect('mongodb://localhost:27017/tournamentDB', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema for our tournament data
const tournamentSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: [true, "round is not added!"],
    unique: true // every round is assumed to be unique to prevent data duplication
  },
  stage: {
    type: Number,
    required: [true, "stage is not added!"]
  },
  playerInfo: [
    {
      name: {
        type: String,
        required: [true, "player name is not added!"]
      },
      score: {
        type: Number,
        required: [true, "player score is not added!"],
        min: 0,
        max: 50
      },
      profileImg: {
        type: String,
        required: [true, "player profile image is not added!"]
      }
    }
  ]
});

// apply uniqueValidator plugin on tournamentSchema
tournamentSchema.plugin(uniqueValidator);

// create a model and specify the collection name
const Tournament = mongoose.model("Tournament", tournamentSchema);

// hardcoded, dummy data (for testing purpose only)
const tournament1 = new Tournament({
  round: 1,
  stage: 1,
  playerInfo: [
    {
      name: "player 1",
      score: 1,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/19/Icon-D.Va.png/revision/latest/scale-to-width-down/100?cb=20181018235442"
    },
    {
      name: "player 2",
      score: 3,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/11/Icon-Orisa.png/revision/latest/scale-to-width-down/100?cb=20171019023943"
    }
  ]
});

const tournament2 = new Tournament({
  round: 2,
  stage: 1,
  playerInfo: [
    {
      name: "player 3",
      score: 2,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/83/Icon-Reinhardt.png/revision/latest/scale-to-width-down/100?cb=20161019024227"
    },
    {
      name: "player 4",
      score: 3,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/16/Icon-Roadhog.png/revision/latest/scale-to-width-down/100?cb=20151019024332"
    }
  ]
});

const tournament3 = new Tournament({
  round: 3,
  stage: 1,
  playerInfo: [
    {
      name: "player 5",
      score: 0,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/b/be/Icon-Ashe.png/revision/latest/scale-to-width-down/100?cb=20141117054510"
    },
    {
      name: "player 6",
      score: 3,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sigma.png/revision/latest/scale-to-width-down/100?cb=20200820032913"
    }
  ]
});

const tournament4 = new Tournament({
  round: 4,
  stage: 1,
  playerInfo: [
    {
      name: "player 7",
      score: 1,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/f8/Icon-Winston.png/revision/latest/scale-to-width-down/100?cb=20121019025023"
    },
    {
      name: "player 8",
      score: 3,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/75/Icon-Zarya.png/revision/latest/scale-to-width-down/100?cb=20181019025153"
    }
  ]
});

const tournament5 = new Tournament({
  round: 5,
  stage: 2,
  playerInfo: [
    {
      name: "player 2",
      score: 1,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/11/Icon-Orisa.png/revision/latest/scale-to-width-down/100?cb=20171019023943"
    },
    {
      name: "player 4",
      score: 3,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/16/Icon-Roadhog.png/revision/latest/scale-to-width-down/100?cb=20151019024332"
    }
  ]
});

const tournament6 = new Tournament({
  round: 6,
  stage: 2,
  playerInfo: [
    {
      name: "player 6",
      score: 1,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sigma.png/revision/latest/scale-to-width-down/100?cb=20200820032913"
    },
    {
      name: "player 8",
      score: 3,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/75/Icon-Zarya.png/revision/latest/scale-to-width-down/100?cb=20181019025153"
    }
  ]
});

const tournament7 = new Tournament({
  round: 7,
  stage: 3,
  playerInfo: [
    {
      name: "player 4",
      score: 1,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/16/Icon-Roadhog.png/revision/latest/scale-to-width-down/100?cb=20151019024332"
    },
    {
      name: "player 8",
      score: 3,
      profileImg: "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/75/Icon-Zarya.png/revision/latest/scale-to-width-down/100?cb=20181019025153"
    }
  ]
});

const tournamentData = [tournament1, tournament2, tournament3, tournament4, tournament5, tournament6, tournament7];

Tournament.insertMany(tournamentData, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("successfully save all data into tournamentDB.");
  }
});

// fetches all data
app.get('/tournaments', function(req, res) {

   Tournament.find(function(err, foundTournaments) {
     if (err) {
       console.log(err);
     } else {
       res.send(foundTournaments);
     }
   });

});

// fetches all data for a specific _id
app.get('/tournaments/id/:roundId', function(req, res) {

  // _id is unique, there should only be 1 returned tournament data.
  Tournament.findById(req.params.roundId, function(err, foundTournament) {
    if (err) {
      res.send(err);
    } else {
      res.send(foundTournament);
    }
  });

});

// fetches all data by a specific round
app.get('/tournaments/round/:roundNo', function(req, res) {

  Tournament.findOne({round: req.params.roundNo}, function(err, foundTournament) {
    if (err) {
      res.send(err);
    } else {
      res.send(foundTournament);
    }
  });

});

// fetches all data by a specific stage
app.get('/tournaments/stage/:stageNo', function(req, res) {

  Tournament.find({stage: req.params.stageNo}, function(err, foundTournaments) {
    if (err) {
      res.send(err);
    } else {
      res.send(foundTournaments);
    }
  });

});

// send user a pdf containing formatted tournament bracket image based on the dummy data
app.get('/tournaments/download', function(req, res) {

  Tournament.find(function(err, foundTournaments) {
    if (err) {
      console.log(err);
    } else {
      ejs.renderFile(path.join(__dirname, './views', 'tournament-template.ejs'), {foundTournaments: foundTournaments}, function (err, data) {
        if (err) {
          res.send(err);
        } else {
          let options = {
            // "height": "6.75in",
            // "width": "10.5in",
            "height": "600px",
            "width" : "1050px",
          };
          pdf.create(data, options).toFile("tournament.pdf", function(err, data) {
            if (err) {
              res.send(err);
            } else {
              res.download(path.join(__dirname, 'tournament.pdf'));
            }
          })
        }
      })
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
