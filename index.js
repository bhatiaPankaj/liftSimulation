function createSection(form) {
  var el = document.getElementById('floors-section')
  el.innerHTML = ``

  var floors = form.inputFloor.value;
  this.floors = floors
  var lifts = form.inputLift.value;


  if (floors > 1 && lifts > 0) {
    if (floors > 1) {
      for (var i = floors; i > 1; i--) {
        createFloors(i)
      }
      createGroundFloor()
      addLifts(lifts)
      document.getElementsByClassName('top-button')[0].remove()    // removing the top button from top floor
    }
  }

  else if (floors <= 1) {
    alert('Please Enter valid floor input (must be >1) ')
  }
  else if (lifts < 1) {
    alert('Please Enter valid lift input (must be >0)')
  }
}

let liftCallsQueue = []
function liftButtonClicked(elem) {
  var callFromFloor = elem.parentNode.parentNode.id;
  var destFloor = callFromFloor.substring(6);
  if(this.lifts.filter(x => x.destinationFloor==destFloor).length<1){
    startSimulation(destFloor);
  }
  else if (this.lifts.filter(x => x.currentFloor==destFloor )){
    doorTransition(lifts.filter(x => x.currentFloor == destFloor)[0].liftNumber)
  }
}

function startSimulation(destFloor) {

    var bestLift = getBestLift(destFloor)
    if (bestLift !== undefined) {
      moveBestLiftToFloor(destFloor, bestLift.liftNumber)
    }
    else {
      if(liftCallsQueue.indexOf(destFloor !=-1)){
        liftCallsQueue.push(destFloor)
      }
    }


}

function getBestLift(callFromFloor) {
  var actualDiff = Number.MAX_VALUE
  var bestLift
  for (i = 0; i < this.lifts.length; i++) {
    var diff = Number.MAX_VALUE
    if (lifts[i].state === LiftState.STATIONARY) {
      diff = Math.abs(callFromFloor - lifts[i].currentFloor)
    }
    if (diff < actualDiff) {
      bestLift = lifts[i]
      actualDiff = diff
    }
  }
  return bestLift
}

function moveBestLiftToFloor(destFloor, lift) {
  var boundingRect = document.getElementById("floor#" + destFloor).getBoundingClientRect()
  var height = boundingRect.height;
  var distance = Math.abs(destFloor - this.lifts[lift - 1].currentFloor)
  document.getElementById(`lift#${lift}`).style.transform = `translateY(-${height * (destFloor - 1)}px)`;
  this.lifts[lift - 1].state = LiftState.MOVING
  this.lifts[lift - 1].destinationFloor = destFloor
  document.getElementById(`lift#${lift}`).style.transition = `all ${distance * 2}s ease-in`;
  var timeTaken = distance * 2 * 1000
  setTimeout(() => {
    this.lifts[lift - 1].currentFloor = destFloor
    doorTransition(lift)
  }, timeTaken)
}


function doorTransition(lift) {
  var el = document.getElementById(`lift#${lift}`)
  var leftDoor = el.children[0]
  var rightDoor = el.children[1]

  leftDoor.style.width = 0 + "px";
  rightDoor.style.width = 0 + "px";

  setTimeout(function () {
    leftDoor.style.width = 50 + '%';
    rightDoor.style.width = 50 + '%';

    setTimeout(() => {
      this.lifts[lift - 1].state = LiftState.STATIONARY
      checkQueue()
    }, 2500);

  }, 2500);
}

function checkQueue() {
  if (liftCallsQueue.length != 0) {
    var callFromFloor = liftCallsQueue[0]
    liftCallsQueue.shift();
    startSimulation(callFromFloor)
  }
}

function createFloors(floorNumber) {
  var el = document.getElementById('floors-section')
  //var floorContent = document.createElement('div')
  var floorContainer = document.createElement('div');
  floorContainer.id = "floor#" + floorNumber
  floorContainer.classList.add('floor-container');

  floorContainer.innerHTML = `
        <div class="buttons">
            <button class = "top-button" onclick="liftButtonClicked(this)" style="display: block;">⬆️</button>
            <button onclick="liftButtonClicked(this)" style="display: block;">⬇️</button>
        </div>
        <div class="cabin-section">
        </div>
        <div class="floor">
            Floor ${floorNumber}
        </div>
    `
  el.appendChild(floorContainer)
}

function createGroundFloor() {
  var el = document.getElementById('floors-section')
  var floorContainer = document.createElement('div');
  var floorNumber = 1;
  floorContainer.classList.add('floor-container');
  floorContainer.id = "floor#" + floorNumber

  floorContainer.innerHTML = `
    <div class="buttons">
      <button onclick="liftButtonClicked(this)" style="display: block;">⬆️</button>
    </div>
    <div class="cabin-section-ground">


    </div>
    <div class="floor">
      Floor 1
    </div>
    `
  el.appendChild(floorContainer)
}

function addLifts(numberOfLifts) {
  for (i = 0; i < numberOfLifts; i++) {
    var cabin = document.getElementsByClassName('cabin-section-ground')[0]
    var liftDiv = document.createElement('div')
    liftDiv.classList.add('lift')
    liftDiv.id = `lift#${i + 1}`
    liftDiv.innerHTML = `<div class="lift-door"></div>
      <div style="float: right;"class="lift-door"></div>`
    cabin.appendChild(liftDiv)
  }

  this.lifts = Array.from({ length: numberOfLifts }, (v, i) => new Lift(i + 1));

}



const LiftState = {
  MOVING: 1,
  STATIONARY: 0
};
class Lift {
  currentFloor = 1;
  state = LiftState.STATIONARY;
  destinationFloor = 1;

  constructor(liftNumber) {
    this.liftNumber = liftNumber;
  }
}



