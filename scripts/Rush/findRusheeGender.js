var rushData = require('./data/RushFall17.json');
var genderize = require('genderize');
var fs = require('fs');
var result = [];

rushData.forEach((rushee) => {
  let name = rushee.Name.replace(/ .*/,'');
  genderize(name, function(err, res) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(name, res.gender);

      if (res.gender == null) {
        rushee.Gender = 'null';
      }
      else {
        rushee.Gender = res.gender;
      }
    }

    result.push(rushee);

    if (result.length  === rushData.length) {
      fs.writeFile("./data/RushFall17.json", JSON.stringify(result), function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});
