
//flow paramaters
var Npractice = 1;
var Ntrials = 42;
var show_RT = 500; //milisec

//pardigm parameters
var sigma = 20;
var sampleSize = 8;
var max_n = 100
var min_n = 0
var c = 30 //constant that bounds the scale for the samples' mean

//holders
let practice = []; //holds practice trials
let maintrials = []; // holds each trail's parameters
let trials; // current trials sequence
let t_i = 0; // index of the current trial
let m_color; // current machine color
let outcome; // current outcome
let sampleArr; // current sample
let param; //current trial's parameters
let Estimate; // participant's estimation
let Evaluation; //participant's evaluation
let evaluationRT;
let notify; // current notification for the user
let message = '' //optional
let blockName;
let ran = new lab.util.Random()
let name;
let company;
let state = 'USA'
let clean = false;
var tagText;
//var predictionText = "Next bonus"
var averageText = "Average"
var Qtext;
//var predictionQ = 'What will be the bonus this Requester give in a month?'
var averagingQ = 'What is the average of this series?'
var currentChange ;
var predictionTrial;
var numColor;
var colorText = ["black", "blue"]


//check for repeated same number
function isRepeated(arr){
  for (var i=0; i < arr.length-2; i++){
    if (arr[i]==arr[i+1]) {return (true)}
  }
  return (false)
}

function getStandardDeviation (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

//create trial function
var labRand = new lab.util.Random()
function t() {
  this.mu = ran.range(2 * sigma - 15, max_n - 2 * sigma + 1 + 15)
  var gen = stochasm({
    mean: this.mu,
    stdev: sigma,
    min: min_n + 1,
    max: max_n - 1
  });
  gen.roll = gen.next;
  this.sample = gen.roll(sampleSize+10).map(function (e) {
    return Math.round(e)
  });
  this.sample = labRand.sample(this.sample, sampleSize);
  while (isRepeated(this.sample)){
    this.sample = gen.roll(sampleSize+10).map(function (e) {
      return Math.round(e)
    });
    this.sample = labRand.sample(this.sample, sampleSize);
  }
  this.std= getStandardDeviation(this.sample)
  //this.sample = Array(sampleSize).fill(NaN).map(function(e){return Math.round(gen.next())});
  this.realMu = this.sample.reduce((a, b) => a + b, 0) / sampleSize;
  this.color = `rgb(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)})`
}


//names = labRand.shuffle(names)
//cities = labRand.shuffle(cities)
//practiceName = ["Requester X", "Requester X", "Requester X"]
//creat trials array
for (i = 0; i <= Npractice - 1; i++) {
  practice[i] = new t()
//  practice[i].name1 = practiceName[i]
//  practice[i].name2 = practiceName[i]
//  practice[i].city = "Y"
//  practice[i].company1 = "Z"
//  practice[i].company2 = "Z"
//  practice[i].reportedChange = 10
}
//reported change vector
//var incrase = stochasm({kind: "integer", min: 8, max: 12})
//var decrease = stochasm({kind: "integer", min: -12, max: -8})
//incrase.roll=incrase.next
//decrease.roll=decrease.next

//var ChageVector= incrase.roll(Ntrials/3).concat(decrease.roll(Ntrials/3)).concat(Array(Ntrials/3).fill(0))
//ChageVector = labRand.shuffle(ChageVector)


for (i = 0; i <= Ntrials - 1; i++) {
  maintrials[i] = new t()
//  maintrials[i].name1 = names.pop()
//  maintrials[i].name2 = names.pop()
//  maintrials[i].company1 = labRand.choice(firms)
//  maintrials[i].company2 = labRand.choice(firms)
//  maintrials[i].reportedChange = ChageVector[i]
}

maintrials_shuffel = labRand.shuffle(maintrials)
colorText = labRand.shuffle(colorText)
/**************************************canvas functions***********************************************/
// draw the machne samplling
function plus(ts, canvas, ctx, obj) {
  let c = canvas
  ctx.fillStyle = "gray"
  ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height)
  ctx.fillStyle = "black"
  ctx.textAlign = "center"
  //ctx.font="15px sans-serif"
  //ctx.fillText('Get ready',-7.5, -screenImg.height/4)
  ctx.font = "14px sans-serif"
  ctx.fillText('Get ready', -15, screenImg.height / 8)
}

function RequesterInfo (ts, canvas, ctx, obj) {
  let c = canvas
  ctx.fillStyle = "gray"
  ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height)
  ctx.fillStyle = "black"
  ctx.textAlign = "center"
  //ctx.font="15px sans-serif"
  //ctx.fillText('Get ready',-7.5, -screenImg.height/4)
  

  let txt= name + ", has completed the following minutes of aerobic exercise a day"
  ctx.font = "14px sans-serif"
  ctx.fillText(txt, -15, screenImg.height / 8)
}

function repoertChange (ts, canvas, ctx, obj) {
  let c = canvas
  ctx.fillStyle = "gray"
  ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height)
  ctx.fillStyle = "black"
  ctx.textAlign = "center"
  //ctx.font="15px sans-serif"
  //ctx.fillText('Get ready',-7.5, -screenImg.height/4)
  let txt;
//  if (currentChange == 0){
//    txt = name + " is not expected to change the bonus sum."
//  } else if (currentChange > 0) {
//    txt = name + " is expected to raise the bonuses by " + String(currentChange) + "%."
//  } else if (currentChange < 0){
//    txt = name + " is expected to decrease the bonuses by " + String(-1*currentChange) + "%."
//  }

  ctx.font = "14px sans-serif"
  ctx.fillText(txt, -15, screenImg.height / 8)
}

function drawsample(ts, canvas, ctx, obj) {
  let c = canvas
  let txt;

  ctx.fillStyle = "gray"
  ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height)
  // draw machine's screen and number
 
  ctx.fillStyle = numColor
  ctx.textAlign = "center"
  ctx.font = "20px sans-serif"
 
  //ctx.font = "30px sans-serif"
  
    if (!isNaN(outcome)){
      ctx.font = "20px sans-serif"
      if (clean){
        ctx.fillText(outcome, -15, screenImg.height / 8)
      }
      else{
      ctx.fillText(outcome + "¢", -15, screenImg.height / 8)
    }}
    else {
        ctx.fillText(outcome, -15, screenImg.height / 8)

      }
  
  //ctx.font="15px sans-serif"
  //ctx.fillText(notify,-7.5, -screenImg.height/2)

}


function drawStage(ts, canvas, ctx, obj) {
  let c = canvas
 
  ctx.fillStyle = "gray"
  ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height)
  // draw machine's screen and number
  
  ctx.fillStyle = "black"
  ctx.textAlign = "center"
  ctx.font = "20px sans-serif"

    if (!isNaN(outcome)){
      ctx.font = "20px sans-serif"
      if (clean){
        ctx.fillText(outcome, -15, screenImg.height / 8)
      }
      else{
      ctx.fillText(outcome + "¢", -15, screenImg.height / 8)
    }}
    else {
        ctx.fillText(outcome, -15, screenImg.height / 8)

      }
  
  //ctx.font="15px sans-serif"
  //ctx.fillText(notify,-7.5, -screenImg.height/2)

}

 
/************************************labjs structures********************************************/
var drawingSampleFunction;

var samplingScreen = new lab.canvas.Screen({
  renderFunction: drawsample,
  tardy: true,
  timeout: show_RT,
  viewportScale: 1,
  datacommit: false,
  messageHandlers: {
    'before:prepare': () => {
      outcome = sampleArr.pop()
    }
  }
})


var trialTemp_averagingOnly = new lab.flow.Sequence({
  tardy: true,
  datacommit: false,
  content: [
    new lab.canvas.Screen({
      renderFunction: plus,
      timeout: 750,
      datacommit: false
    }),

    new lab.canvas.Screen({
      renderFunction: RequesterInfo,
      timeout: 3000,
      datacommit: false,
      trady: true,
    }),

    new lab.flow.Loop({
      tardy: true,
      template: samplingScreen,
      templateParameters: Array.from(Array(8)).map((e, i) => i + 1),
      datacommit: false,
    }),

    new lab.canvas.Screen({
      viewportScale: 1,
      trady: true,
      title: 'scale',
      renderFunction: estimate,
      //responses:{'keypress(Enter)': Estimate},
      events: {
        'keypress(Space)': function () {
          if (Estimate > 0) {
            this.data.RT = this.timer
            this.data.trial = t_i + 1
            this.data.mean = param.realMu
            this.data.estimation = Estimate
            this.data.SampleAsSeen = param.sample.slice().reverse()
            this.data.block = blockName
            this.numColor = numColor
            this.end()
          }
        }
      },
      data: {
        'trial': '',
        'block': '',
        'estimation': '',
        'mean': '',
        'RT': '',
        'SampleAsSeen': '',
        'numColor': ''
      },
      messageHandlers: {
        'after:run': () => {

        },
      }
    })
  ],
  messageHandlers: {
    'before:prepare': () => {
      param = trials[t_i]
      sampleArr = param.sample.slice()
      name = param.name1
      company = param.company1

    },
    'after:end': () => {
      t_i++;
      Estimate = 0;
    }
  },
}
)

var trialTemp_expectedInfo = new lab.flow.Sequence({
  tardy: true,
  datacommit: false,
  content: [
    new lab.canvas.Screen({
      renderFunction: plus,
      timeout: 750,
      datacommit: false
    }),

    new lab.canvas.Screen({
      renderFunction: RequesterInfo,
      timeout: 3000,
      datacommit: false,
      trady: true,
    }),

    new lab.flow.Loop({
      tardy: true,
      template: samplingScreen,
      templateParameters: Array.from(Array(8)).map((e, i) => i + 1),
      datacommit: false,
    }),

    new lab.canvas.Screen({
      viewportScale: 1,
      trady: true,
      title: 'scale',
      renderFunction: estimate,
      //responses:{'keypress(Enter)': Estimate},
      events: {
        'keypress(Space)': function () {
          if (Estimate > 0) {
            this.data.RT = this.timer
            this.data.trial = t_i + 1
            this.data.mean = param.realMu
            this.data.estimation = Estimate
            this.data.SampleAsSeen = param.sample.slice().reverse()
            this.data.block = blockName
            this.end()
          }
        }
      },
      data: {
        'trial': '',
        'block': '',
        'estimation': '',
        'mean': '',
        'RT': '',
        'SampleAsSeen': '',
      },
      messageHandlers: {
        'after:run': () => {
          Estimate = 0;
        },
      }
    }),

    reportChange = new lab.canvas.Screen({
      renderFunction: repoertChange,
      timeout: 3000,
      datacommit: false,
      trady: true,
    }),

    prediction = new lab.canvas.Screen({
      viewportScale: 1,
      trady: true,
      title: 'predictionScale',
      renderFunction: estimate,
      //responses:{'keypress(Enter)': Estimate},
      events: {
        'keypress(Space)': function () {
          if (Estimate > 0) {
            this.data.RT = this.timer
            this.data.trial = t_i + 1
            this.data.mean = param.realMu
            this.data.prediction = Estimate
            this.data.reportedChange = currentChange
            this.data.block = blockName
            this.end()
          }
        }
      },
      data: {
        'trial': '',
        'block': '',
        'prediction': '',
        'mean': '',
        'RT': '',
        'reportedChange': '',
      },
      messageHandlers: {
        'before:run' : () => {predictionTrial =true},
        'after:end': () => { predictionTrial =false
        },
      }
    })
  ],
  messageHandlers: {
    'before:run': () => {
      param = trials[t_i]
      m_color = param.color
      sampleArr = param.sample.slice()
      currentChange = param.reportedChange
      name = param.name2
      company = param.company2
    },

    'after:end': () => {
      t_i++;
      Estimate = 0;
    }
  },
}
)


const study = new lab.flow.Sequence({
  tardy: true,
  content: [
    instruc = new lab.html.Screen({
      contentUrl: 'pages/1-welcome-and-instruc.html',
      title: 'instructions',
      responses: {
        'keypress(Space)': 'continue'
      },
      parameters: {
        color: 'gray'
      },
      datacommit: true,
    }),

    instrucB1 = new lab.html.Screen({
      contentUrl: 'pages/instruc-predictFirst.html',
      title: 'instructionsPrediction',
      responses: {
        'keypress(Space)': 'continue'
      },
      parameters: {
        color: 'gray'
      },
      datacommit: true,
    }),


 
    instrucB1 = new lab.html.Screen({
      contentUrl: 'pages/instruc-averagingOnlySecond.html',
      title: 'instructionsPrediction',
      responses: {
        'keypress(Space)': 'continue'
      },
      parameters: {
        color: 'gray'
      },
      datacommit: true,
    }),

    practiceBlock = new lab.flow.Loop({
      template: trialTemp_averagingOnly,
      templateParameters: practice,
      trady: true,
      datacommit: false,
      messageHandlers: {
        'before:run': () => {
          trials = practice
          blockName = "practice"
          tagText = predictionText
          Qtext = predictionQ
          t_i = 0;
          numColor = colorText[1]
        },
      }
    }),

    pause = new lab.html.Screen({
      content: "<p><b>Practice is over.</p> <br> <p><b>Try to be accurate as possible.</b></p>",
      datacommit: true,
      timeout:2000,
    }),

    Onlyaveraging = new lab.flow.Loop({
      template: trialTemp_averagingOnly,
      templateParameters: maintrials,
      trady: true,
      datacommit: false,
      messageHandlers: {
        'before:run': () => {
          trials = maintrials
          t_i = 0;
          blockName = "averaging"
        },
      }
    }),


    new lab.html.Screen({
      content: '<p>Well done</p> <p><b>This part of the study is over</b></p></b>',
      timeout: 2500,
      tardy: true,
      responses: {
        'keypress': 'bye'
      },
      datacommit: false,
    }),
  ],
  plugins: [
    new lab.plugins.PostMessage({}),
    new lab.plugins.Metadata(),
    //new lab.plugins.Fullscreen()

  ], 
  /**messageHandlers: {
    'end': () => {study.options.datastore.download()}
  }**/

})

/********************************************slider function************************************************************/
function estimate(ts, canvas, ctx, obj) {
  if (predictionTrial) {
    outcome = "What bonus will " + name + " offer on next HIT?";
    tagText = "Next bonus"
} 
    else  {
      outcome = "What is the average bonus " + name + " pays?";
      tagText = "Average bonus"}
  
  drawStage(ts, canvas, ctx, obj)
  ctx.font = "16px sans-serif"
  ctx.fillText('Press the spacebar to submit', 0, machineImg.width)

  // Create a pointer to the current component,
  // to be used inside of p5.js
  const component = this;
  let change = true;
  var slider;
  var MP;
  var img;
  var c;
  var firstKnobe = false;
  // p5.js initialization function
  const s = (component) => {

    return (p) => {

      p.setup = function () {
        Estimate = 0; 

        let cnv = p.createCanvas(
          component.options.canvas.width / window.devicePixelRatio,
          component.options.canvas.height / window.devicePixelRatio
        )
        c = cnv.elt.getContext("2d");
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER);

        component.options.canvas.parentElement.style.position = 'relative'
        cnv.style('align', 'center')
        cnv.style('display', 'block')
        cnv.style('position', 'absolute')
        cnv.style('left', '0')
        cnv.style('top', '0')
        cnv.style('z-index', '20')


        slider = new SliderClass(p.width / 2 - machineImg.width * 0.75, p.height / 2 + machineImg.width / 1.4,
          machineImg.width * 1.5, 0, 100, 10, false, false, true);

      }

      p.draw = function () {

        slider.move();
        slider.jump();
        p.textSize(16)


        if (change) {
          p.clear()
          slider.display();
          p.textStyle(p.BOLD)
          p.textSize(19)
          if (predictionTrial){
          p.text("Imagine taking a HIT by " + name , p.width / 2, p.height * 0.4)}
          p.textStyle(p.NORMAL)
          p.textSize(16)
          p.text('Use the mouse to adjust your answer on the scale', p.width / 2, p.height * 0.25)
          //p.text('Press the spacebar to submit', p.width / 2, p.height / 2 + machineImg.width)

        }

      }

      p.mousePressed = function () {
        MP = true;
        change = true;
      }

      p.mouseReleased = function () {
        MP = false;
        change = false;
        Estimate = slider.sliderValue
      }


      function SliderClass(_x, _y, _length, _startValue, _endValue, _varerval, _vars, _sticky, _showValues) {
        this.clicked = false;
        this.clickJump = false;
        this.sticky = false;
        this.knobWidth = 12;
        this.knobHeight = 20;
        this.sliderValue = 0;
        this.sliderValueInt = 0;
        this.fade = 255; // for knob color
        this.xDif = 0.0;
        this.screenInterval = 0;
        this.x = _x;
        this.y = _y;
        this.xEnd = this.x + _length;
        this.xStart = this.x;
        this.startValue = _startValue;
        this.endValue = _endValue;
        this.vars = _vars;
        this.varerval = _varerval;
        this.totalLength = _length;
        this.sticky = _sticky;
        this.showValues = _showValues;

        this.jump = function () {
          if (p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.totalLength) {
            if (MP && this.clicked == false) {
              this.xDif = p.mouseX - this.x;
              this.clicked = true;
              firstKnobe = true;
            }
          }
          if (MP == false && this.clicked == true) { // if the mouse was just released
            this.clicked = false;
            this.fade = 255;
          }
          if (this.clicked) {
            this.x = p.mouseX; // so the slider doens't "jump" to the mouse x. 
            this.x = p.constrain(this.x, this.xStart, this.xEnd); // keep the knob on the slider
          }
          this.sliderValue = p.map(this.x, this.xStart, this.xEnd, this.startValue, this.endValue); // get the slider position relative to the values
          this.sliderValueInt = p.int(this.sliderValue); // make that number an var

        }

        this.move = function () {
          // check to see if it's clicked 
          if (p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.knobWidth) { // use this if you want a round knob on the slider 
            if (MP && this.clicked == false) { // if mouse was pressed
              this.xDif = p.mouseX - this.x;
              this.clicked = true;
            }
            this.fade = 0; // mouseOver but not clicked
          } else {
            this.fade = 0;
          }
          if (this.clicked == true) {
            this.fade = 0;
          }
          if (MP == false && this.clicked == true) { // if the mouse was just released
            this.clicked = false;
            this.fade = 255;
            if (this.sticky) { // if you set it to jump to the closest line 
              var modDif = this.sliderValue % this.varerval; // value to show how close it is to last line 
              var div = p.int(this.sliderValue / this.varerval); // vlaue to show how MANY varervals it's passed 

              if (modDif < this.varerval / 2) { // so it goes to closest line not just lower 
                this.x = this.xStart + (div * this.screenInterval);
              } else {
                this.x = this.xStart + ((div + 1) * this.screenInterval);
              }
            }
          }
          if (this.clicked) {
            this.x = p.mouseX - this.xDif; // so the slider doens't "jump" to the mouse x. 
            this.x = p.constrain(this.x, this.xStart, this.xEnd); // keep the knob on the slider
          }
          this.sliderValue = p.map(this.x, this.xStart, this.xEnd, this.startValue, this.endValue); // get the slider position relative to the values
          this.sliderValueInt = p.int(this.sliderValue); // make that number an var
        }

        this.display = function () {
          //p.stroke(1);
          this.screenInterval = p.map(this.varerval, 0, this.endValue - this.startValue, 0, this.totalLength); // get the createCanvas of the gaps for the screen relative to the varervals 
          var counter = 0;
          for (var i = p.int(this.screenInterval); i < this.totalLength; i += this.screenInterval) { // go from the first gap to the end of slider by the screenInterval
            p.line(i + this.xStart, this.y + 12, i + this.xStart, this.y - 12); // draw lines
            if (this.showValues) {
              counter++;
              p.text(p.nfc(counter * this.varerval, 0, 1), i + this.xStart, this.y + 30);

            }
          }
          p.line(this.xStart, this.y + 12, this.xStart, this.y - 12); // draw first line (optional) 
          p.line(this.xEnd, this.y + 12, this.xEnd, this.y - 12); // draw last line (optional) 
          p.line(this.xStart, this.y, this.xEnd, this.y); // draw center line
          if (firstKnobe) {
            p.fill(255);

            //p.rect(this.x, this.y, this.knobWidth, this.knobHeight); // so it's opaque
            p.triangle(this.x - this.knobWidth / 2, this.y - this.knobHeight, this.x, this.y, this.x + this.knobWidth / 2, this.y - this.knobHeight)
            p.fill(100, 120, 160, this.fade);
            //p.rect(this.x, this.y, this.knobWidth, this.knobHeight); // add color
            p.triangle(this.x - this.knobWidth / 2, this.y - this.knobHeight, this.x, this.y, this.x + this.knobWidth / 2, this.y - this.knobHeight)
            p.fill(1)
            p.textStyle(p.BOLD)
            p.textSize(12)
            p.text(tagText, this.x, this.y - 22);
            p.textSize(16)
            p.textStyle(p.NORMAL)
          }
          p.fill(1);
          if (this.vars) {
            p.textStyle(p.BOLD)
            p.text(p.nfc(this.sliderValue, 2, 1), this.x, this.y - 20);
            p.textStyle(p.NORMAL)
          } else {

            //p.text(this.sliderValueInt, this.x, this.y - 20);
          }
          p.text(p.int(this.startValue), this.xStart, this.y + 30);
          p.text(p.int(this.endValue), this.xEnd, this.y + 30);
        }
      }

    }
  }
  // p5.js instantiation
  // (note that the library script has been added
  // to the HTML page header via the study-wide options)
  let myp5 = new p5(s(this), this.options.el)
}

// Collect data in a central data store
study.options.datastore = new lab.data.Store()



/************estimation with likert scale **********************/

function evaluate(ts, canvas, ctx, obj) {
  outcome = "?"
  drawsample(ts, canvas, ctx, obj)
  ctx.font = "400 19px sans-serif"
  ctx.fillText('How much would you recommend another player to play this machine?', 0, -canvas.height*0.2)
  ctx.font = "16px sans-serif"
  ctx.fillText('Press the spacebar to submit', 0, machineImg.width)


  // Create a pointer to the current component,
  // to be used inside of p5.js
  const component = this;
  let change = true;
  var slider;
  var MP;
  var img;
  var c;
  var firstKnobe = false;
  // p5.js initialization function
  const s = (component) => {

    return (p) => {

      p.setup = function () {

        let cnv = p.createCanvas(
          component.options.canvas.width / window.devicePixelRatio,
          component.options.canvas.height / window.devicePixelRatio
        )
        c = cnv.elt.getContext("2d");
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER);

        component.options.canvas.parentElement.style.position = 'relative'
        cnv.style('align', 'center')
        cnv.style('display', 'block')
        cnv.style('position', 'absolute')
        cnv.style('left', '0')
        cnv.style('top', '0')
        cnv.style('z-index', '20')


        likret = new LikretClass(p.width / 2 - machineImg.width * 0.75, p.height / 2 + machineImg.width / 1.4,
          machineImg.width * 1.5, 7, {1:"Not at all", 7:"Very much"}, true, true);
        likret.display()
        

      }


      p.mousePressed= function(){
        p.clear()
        //p.text('How much would you recommend this machine to another player?', p.width / 2, p.height * 0.2)
        likret.display()
        likret.clicked(p.mouseX, p.mouseY)
        Evaluation = likret.Value
     }


      function LikretClass(_x, _y, _length, _choiceN, _labels, _showNum, _showLabels) {
        this.clicked = false;


        this.knobWidth = 16;

        this.Value = null;

        this.color = 255; // for knob color
        this.choiceColor = 0; 

        
        this.x = _x;
        this.y = _y;
        this.xEnd = this.x + _length;
        this.length = _length
        this.xStart = this.x;
        
        //this.startValue = _startValue;
        //this.endValue = _endValue;
        this.screenInterval = null;
        this.choiceN = _choiceN
        this.Interval = (this.choiceN>1)? _length/(this.choiceN-1) :  _length;
        this.labels = _labels;
        this.showNum = _showNum;
        this.showLabels = _showLabels;


        this.clicked = function (mX, mY) {
            for (var i = 0; i <= this.length; i += this.screenInterval) {
              if (p.dist(mX, mY, this.xStart+i, this.y) < this.knobWidth){
                this.Value =  i/this.screenInterval + 1;
              }}
            if (this.Value){
                p.fill(this.choiceColor)
                p.ellipse((this.Value-1)*this.screenInterval + this.xStart, this.y, this.knobWidth*0.7); 
              }
          
        }

        this.display = function () {
          //p.stroke(1);
          this.screenInterval = this.Interval
          var counter = 0;
          p.textAlign(p.CENTER)

          counter = 1;
          for (var i = 0; i <= this.length; i += this.screenInterval) { 
            p.textSize(16)
            p.fill(this.color)
            p.stroke(0)
            p.strokeWeight(1)
            p.ellipse(this.xStart+i, this.y, this.knobWidth); 
            p.fill(0)
            p.noStroke()
            //p.textStyle(p.NORMAL)
            if (this.showNum) {
              p.text(counter,this.xStart+i, this.y - this.knobWidth); 
            } 
            if (this.showLabels) {
              if (counter in this.labels) {
                p.text(this.labels[counter],i + this.xStart, this.y - 2.5*this.knobWidth); 
              }
            }
            counter++;
          }

        }
      }

    }
  }
  // p5.js instantiation
  // (note that the library script has been added
  // to the HTML page header via the study-wide options)
  let myp5 = new p5(s(this), this.options.el)
}

// Start the study (uncomment to run)
study.run()

