// Alex Laris
// Elevator Technical Challenge for With Cherry
// 10-04-2022

//Start at the bottom floor
document.body.scrollTop=document.body.scrollHeight;

// *Start of Class* //
class Elevator{
    constructor(){
        this.currentFloor = 1;
        this.transitionTime = 0;
        this.increment =  43;
        this.elevatorY = 0;
        this.queue = [];
        this.building = document.getElementById("building");
        this.floorIndicator = document.getElementById("floor-indicator");
        this.passingBy = 1;
        this.standByTime = 1000;
        this.doors = document.getElementById("doors");
        this.doorLeft = document.getElementById("door-left");
        this.doorRight = document.getElementById("door-right");
    }

    //GETTERS
    ypos(){return this.elevatorY;}
    getQueue(){return this.queue}
    getQueueLength(){return this.queue.length}
    getCurrentFloor(){return this.currentFloor}

    //FUNCTIONS
    addToQueue(floor){this.queue.push(floor);
    console.log('add floor' + this.queue)}

    calculateTransitionTime(head){
        //using current and head of queue, calculate total time in ms
        return  ((Math.abs(head-this.currentFloor)) * 3000);
    }
    calculateYMovement(head){
        //using current and head of queue, calculate total Y movement
        return ((head - this.currentFloor)* this.increment);
    }
    startTransition(distance, time, head){
        //update where you want the elevator to end up
        this.elevatorY += distance;
        //set css for buidling to move
        this.building.style.transform = "translateY(" + this.elevatorY + "em)";
        this.building.style.transitionDuration = time + "ms";
        
        
        //add or subtract to floor indicator
        let floorVariable = (distance > 0) ? 1 : -1;
        let floorsMoved = Math.abs(head-this.currentFloor);

        //set this to "that" to hold reference inside interval
        let that = this;
        let count = 0;
        let interval = setInterval(function(){
            count += 1;

            if (count === floorsMoved){
                clearInterval(interval);
            }

            that.passingBy = that.passingBy + floorVariable;
            that.floorIndicator.textContent = that.passingBy;

        }, 1900)   
    }
    arrive(){
            //get head of queue and set to current on arrival
            this.currentFloor = this.queue.shift();
            console.log("New current floor is: " + this.currentFloor)
            //undo highlight for arrival floor
            document.getElementById("button"+this.currentFloor).style.backgroundColor =  "";
            this.openDoors();
    }
    moveElevator(){
        if (this.queue.length !== 0){
            let head = this.queue[0];

            console.log('moving from ' + this.currentFloor + " to : " + head);

            let calculatedMovement = this.calculateYMovement(head);
            let calculatedTime = this.calculateTransitionTime(head);

            console.log(calculatedMovement + ' em ' + calculatedTime + 'ms to ' + head)

            setTimeout(() => {
                this.startDirectionSignaling(calculatedMovement, calculatedTime);
                this.closeDoors();
                this.startTransition(calculatedMovement, calculatedTime, head);
            }, this.standByTime)
            setTimeout(() => {
                //after transition time, set arrival
                this.arrive();
                if (this.queue.length !== 0){
                    this.moveElevator();
                }

              }, calculatedTime + this.standByTime )

        }
    }
    startDirectionSignaling(movement, time){
        //if positive = green : if negative = red
        let indicatorId = (movement > 0) ? "green" : "red";
        let indicator = document.getElementById(indicatorId)
        indicator.style.opacity = 1;

        setTimeout(() => {
            //after transition time, set indicator off
            indicator.style.opacity = 0.3;
            
          }, time)
    }
    openDoors(){
        this.floorIndicator.style.color = "yellow";
        this.doorLeft.style.transform = "translateX(-50%)";
        this.doorLeft.style.transitionDuration = 200 + "ms";
        this.doorRight.style.transform = "translateX(50%)";
        this.doorRight.style.transitionDuration = 200 + "ms";
        this.doors.style.opacity = 1;

    }
    closeDoors(){
        this.floorIndicator.style.color = "white";
        this.doorLeft.style.transform = "translateX(0)";
        this.doorLeft.style.transitionDuration = 200 + "ms";
        this.doorRight.style.transform = "translateX(0)";
        this.doorRight.style.transitionDuration = 200 + "ms";
        setTimeout(() => {
            this.doors.style.opacity = 0.3;
          }, 200)
        
       
    }

}
// *End of Class* //




// START PROGRAM //

//declare our elevator
const elevator = new Elevator();

//function to add to queue - triggered by panel buttons
function toQueue(floor){
    //check that the floor selected is not the current floor, or the one it departed from
    if (floor == elevator.getCurrentFloor()){
        console.log('This is the floor selected.');
        return
    }
    //check that the floor selected is not already in queue
    else if (elevator.getQueue().indexOf(floor) != -1){
        console.log('Floor pressed was already selected');
        return
    }
    //highlight button and decide whether to add to queue and move, or simply add to queue
    else{
        document.getElementById("button"+floor).style.backgroundColor =  "#F4BB44";
        if (elevator.getQueueLength() === 0){
            elevator.addToQueue(floor);
            elevator.moveElevator();
        }
        else{
            elevator.addToQueue(floor);
        }
    }
}


