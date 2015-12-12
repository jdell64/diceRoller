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

//      if (req.param('token') && sails.config.local.slackApiKey.split(',').indexOf(req.param('token')) > -1 ) {
//TODO: API KEY, env variable?
        nums = req.param('text').split(' ')
        sides = parseInt(nums[0])
        add = 0
        whisper = false

        if (nums[1]){
          if (parseInt(nums[1])){
            add = parseInt(nums[1])
          } else if (nums[1].toUpperCase() == 'W' ) {
            whisper = true
          }
          if (nums[2] && nums[2].toUpperCase() == 'W'){
            whisper = true
          }

        }

        calculation = '(random number between 1 and ' + sides.toString() + ') + ' + add.toString();

        original_roll = getRandomInt(1, sides)
        roll = original_roll
        attachments_text = ''
        // crits only apply for 20s
        extra_text = '.'

        if (sides == 20){
          if (roll == 1){
            msg = "critical miss"
            status = -1
            attachments_text = 'Oh no! Critical miss!'
          } else if (roll == 20){
            msg = "critical hit"
            status = 1
            attachments_text = 'WOOOOHOOO! CRITICAL HIT!!!'
          } else {
            msg = "normal roll"
            status = 0
            roll += add

            if (add > 0){
              extra_text += ' I added ' + add.toString() + ' to give you ' + roll + '.'
            }

            attachments_text = 'You originally rolled a ' + original_roll.toString() + extra_text
          }
        } else {
          roll += add
            if (add > 0){
              extra_text += ' I added ' + add.toString() + ' to give you ' + roll + '.'
            }

          attachments_text = 'You originally rolled a ' + original_roll.toString() + extra_text

          }
//      }
      if (whisper){
        response_type = 'ephemeral'
      } else {
        response_type = 'in_channel'
      }



      return res.send({'response_type': response_type,
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

