/**
 * RollController
 *
 * @description :: Server-side logic for managing rolls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var crit_miss_texts = ['WOMP womp... Critical Miss!', 'Yay! Rolled a 1... oh wait, that\'s bad...',
                  'wow... you are terrible. Critical Miss.', 'Merry CritMiss!']

var crit_hit_urls = ['https://i.ytimg.com/vi/fGl4LOAgW50/maxresdefault.jpg']

var crit_hit_texts = ['OUCH, Critical Hit!', 'Take that baddie, Critical Hit.',
                      'You literally couldn\'t have rolled better... Critical Hit!', 'DAAAA']


var droll = require('droll');

module.exports = {

  dice2: function(req, res){
    // expected input: 3d6+5 w
    nums = req.param('text').split(' ')
    //nums[0] == 3d6+5, [1] == 'w'

    whisper = false
    operator = '+'
    global_add = '0'

    // if w was passed in, whisper.
    if (nums[1]){
      if (nums[1].toUpperCase() == 'W' ) {
        whisper = true
      }
    }
    sides = nums[0].toUpperCase().split('D')[1].split(/[+-]/)[0]
    var result = droll.roll(nums[0])

    if(result){
      rolls = result['rolls']
      mod = result['modifier']
      total = result['total']
      attachments_text = ''
      if(rolls.length == 1){
        attachments_text = 'You rolled: ' + rolls[0] + '. '
        if(mod > 0  ){
          attachments_text += 'I added '+ mod +' to the final result.'
        } else if (mod < 0) {
          attachments_text += 'I subtracted '+ Math.abs(mod) +' from the final result.'
        }
        if (sides == 20){
          if(rolls[0] == 20){
            attachments_text =  crit_hit_texts[Math.floor(Math.random()*crit_hit_texts.length)] + '\n' +
                                crit_hit_urls[Math.floor(Math.random()*crit_hit_urls.length)];
            total = 20
          } else if (rolls[0] == 1){
            attachments_text =  crit_miss_texts[Math.floor(Math.random()*crit_miss_texts.length)];
            total = 1
          }
        }
      } else {
        attachments_text = 'Your rolls: ' + rolls + '. I added ' + mod + ' to the final result.'
      }

    } else {
      return res.send("You typed something wrong... make sure you type in the format xdy+z (*ex: 3d6+2*)")
    }
    if (whisper){
      response_type = 'ephemeral'
    } else {
      response_type = 'in_channel'
    }

    return res.send({'response_type': response_type,
                      'text' : "*"+ total +"*",
                      'attachments' : [ {"text" : attachments_text}]
                      })

  },


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

