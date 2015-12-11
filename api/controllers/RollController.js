/**
 * RollController
 *
 * @description :: Server-side logic for managing rolls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {

  dice: function (req, res){
    if (req.param('d')){
      sides = parseInt(req.param('d'))
      add = 0
      if (req.param('a')){
         add = parseInt(req.param('a'))
      }
      roll = getRandomInt(1, sides)
      if (roll == 1){
        msg = "critical miss"
        status = -1
      } else if (roll == 20){
        msg = "critical hit"
        status = 1
      } else {
        msg = "normal roll"
        status = 0
        roll += add
      }


      return res.send({'roll': roll.toString(), 'status': status, 'msg': msg})
    } else {
      return res.send("must pass in a d param.")
    }

  }
};

