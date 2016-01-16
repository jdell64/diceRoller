/**
 * RollController
 *
 * @description :: Server-side logic for managing rolls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function add(a, b) {
    return a + b;
}


var crit_miss_texts = ['WOMP womp... Critical Miss!', 'Yay! Rolled a 1... oh wait, that\'s bad...',
                  'wow... you are terrible. Critical Miss.', 'Merry CritMiss!']
var crit_miss_emoji = [':stuck_out_tongue_winking_eye:', ':confounded:', ':rage:', ':hankey:', ':scream:']
var crit_miss_urls = ['http://www.reactiongifs.com/r/dTa.gif',
                      'http://www.reactiongifs.com/r/rrr.gif',
                       'http://www.reactiongifs.com/r/trmp.gif',
                       'http://www.reactiongifs.com/r/tumblr_mazjy9e9Dg1rvbizho2_250.gif',
                       'http://www.reactiongifs.com/r/fmc.gif']

var crit_hit_texts = ['OUCH, Critical Hit!', 'Take that baddie, Critical Hit.',
                      'You literally couldn\'t have rolled better... Critical Hit!', 'DAAAAwwwww YEEEEEEaaaaaw! Crit']
var crit_hit_emoji = [':heart_eyes:', ':clap:', ':smile:' ]
var crit_hit_urls = ['https://i.ytimg.com/vi/fGl4LOAgW50/maxresdefault.jpg',
                      'http://memecrunch.com/meme/7HU74/aww-yeah/image.gif',
                       'http://www.reactiongifs.com/r/msli.gif',
                       'http://www.reactiongifs.com/r/rdcl.gif',
                       'http://www.reactiongifs.com/r/pnda.gif']


var droll = require('droll');

module.exports = {

  getCharacterAttributes: function(req, res){
    rolls = []

    for (var i = 0; i < 6; i++) {
      roll = droll.roll('4d6')
      roll.rolls.sort().shift()
      var sum = roll.rolls.reduce(add, 0);
      rolls.push(sum);
    }
    rolls = rolls.sort(function(a, b){return b-a})
    rolls = rolls.join(', ')
    res.send({'response_type': 'in_channel',
                          'text' : "Your rolls: *" + rolls + "*"
                          // 'attachments' : [ {"text" : attachments_text, 'image_url' : image_url}]
                          })


  },

  mm: function(req, res){
    lvl = parseInt(req.param('text'))
    if (lvl){
      darts = 2 + lvl
      rolls = []
      total = 0
      for(var i=0; i < darts; i++){
        roll = droll.roll('1d4+1')
        rolls.push(roll['total'])
        total += roll['total']
      }
      attachments_text = 'You cast Magic Missile at level '+ lvl + ' which gives you ' + darts + ' darts.' +
                          'Your rolls (1d4+1): ' + rolls
     return res.send({'response_type': 'in_channel',
                      'text' : "*"+ total +"* damage!",
                      'attachments' : [{"text" : attachments_text}]})


    }else{
      return res.send({'response_type': 'ephemeral',
                       'text':'You typed something wrong... make sure you type in the format /mm [level]'})
    }

  },

  dice: function(req, res){
    // expected input: 3d6+5 w
    nums = req.param('text').split(' ')
    //nums[0] == 3d6+5, [1] == 'w'

    whisper = false


    image_url = ''

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
            attachments_text =  crit_hit_emoji[Math.floor(Math.random()*crit_hit_emoji.length)] + ' ' +
                                crit_hit_texts[Math.floor(Math.random()*crit_hit_texts.length)];
            total = 20
            image_url = crit_hit_urls[Math.floor(Math.random()*crit_hit_urls.length)]
          } else if (rolls[0] == 1){
            attachments_text =  crit_miss_emoji[Math.floor(Math.random()*crit_miss_emoji.length)] + ' ' +
            crit_miss_texts[Math.floor(Math.random()*crit_miss_texts.length)];
            image_url = crit_miss_urls[Math.floor(Math.random()*crit_miss_urls.length)]
            total = 1
          }
        }
      } else {
        attachments_text = 'Your rolls: ' + rolls + '. I added ' + mod + ' to the final result.'
      }

    } else {
      return res.send({'response_type': 'ephemeral',
                       'text':"You typed something wrong... make sure you type in the format xdy+z (*ex: 3d6+2*)"})
    }
    if (whisper){
      response_type = 'ephemeral'
    } else {
      response_type = 'in_channel'
    }

    return res.send({'response_type': response_type,
                      'text' : "*"+ total +"*",
                      'attachments' : [ {"text" : attachments_text, 'image_url' : image_url}]

                      })

  },


  dice2: function (req, res){
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
