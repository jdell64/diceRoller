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
      attachments_text = ''
      // crits only apply for 20s
      if (sides == 20){
        if (roll == 1){
          msg = "critical miss"
          status = -1
          attachments_text = 'Oh no! You rolled a 1!'
        } else if (roll == 20){
          msg = "critical hit"
          status = 1
          attachments_text = 'WOOOOHOOO! CRITICAL HIT!!!'
        } else {
          msg = "normal roll"
          status = 0
          roll += add
          attachments_text = 'You originally rolled a ' + original_roll.toString() + '. I added ' + add.toString() +
                             ' to give you ' + roll + '.'
        }
      } else {
        roll += add
        attachments_text = 'You originally rolled a ' + original_roll.toString() + '. I added ' + add.toString() +
                                     ' to give you ' + roll + '.'
      }



      return res.send({'response_type': 'in_channel',
                        'text' : "*"+ roll +"*",
                        'attachments' : [ {"text" : attachments_text}]
                        })
//      'original_roll':original_roll,'roll': roll.toString(), 'status': status, 'msg': msg,
//          'calculation': calculation})
    } else {
      return res.send("must pass in a sides param.")
    }

  }
};

