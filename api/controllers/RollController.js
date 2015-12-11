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
    if (req.param('text')){
      nums = req.param('text').split(' ')
      sides = parseInt(nums[0])
      add = 0
      if (nums.length > 1){
        add = parseInt(nums[1])
      }

      calculation = '(random number between 1 and ' + sides.toString() + ') + ' + add.toString();

      original_roll = getRandomInt(1, sides)
      roll = original_roll
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



      return res.send({'original_roll':original_roll,'roll': roll.toString(), 'status': status, 'msg': msg,
          'calculation': calculation})
    } else {
      return res.send("must pass in a sides param.")
    }

  }
};

