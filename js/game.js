window.onload = start;

var final = new Array("1","2","3","4","5","6","7","8","X");
var moves = 0;
var timing = 0;
var tim = null;
var grids = new Array(1,2,3,4,5,6,7,8,9);
var num = new Array("1","X","3","4","2","6","7","5","8");
var res;
var fringe = [];
var hintTaken = 0;


function timer() {
     document.getElementById("timer").innerHTML = ++timing +"s";
}
function start() {
    document.getElementById("startGame").onclick = init;
      document.getElementById("newGame").onclick = start;
    document.getElementById("hint").style.display = "none";
   res= new Array("1","X","3","4","2","6","7","5","8");
    
   var pichla = localStorage.getItem("score");
    if(pichla == null) {
        pichla = 0;
    }
    
    document.getElementById("high").innerHTML = "Highest : "+ pichla;
    for(var i = 0; i < 9; i++) {
        
        document.getElementById("s"+grids[i]).innerHTML = "";
        document.getElementById("s"+grids[i]).style.background = "white";
       
    }
     if(tim !=  null) {
       clearInterval(tim);
        document.getElementById("timer").innerHTML = "0";
        document.getElementById("moves").innerHTML = "0";
   }
}
function init() {
    // new game
  document.getElementById("hint").onclick = BFS;
    document.getElementById("hint").style.display = "table";
    moves = 0;
    timing = 0;
    hintTaken = 0;
    tim = setInterval(timer,1000);
    document.getElementById("moves").innerHTML = moves;
    document.getElementById("timer").innerHTML = timing;
    
    //set the timer
  
    
    
   
    
    
    
    for(var i = 0; i < 9; i++) {
        
        document.getElementById("s"+grids[i]).innerHTML = num[i];
        if(num[i] === "X") {
            document.getElementById("s"+grids[i]).style.background = "grey";
        }
        else {
            document.getElementById("s"+grids[i]).style.background = "#F44336";
        }
    }
 //   setTimeout(5000);
    
    // on click listener
    for(var i = 0; i < 9; i++) {
        document.getElementById("s"+grids[i]).onclick = function() {
            var t1 = this.innerHTML;
            var t2 = -1;
            //alert(t1);
            var myId = this.id;
            myId = myId.charAt(1);
           // alert(getRight(myId));
            
            if(valid(getUp(myId))) {
               
                if(checkBlank(getUp(myId))) {
                    // swap with this one
                    t2 = getUp(myId);
                     
                }
            }
             if(valid(getDown(myId))) {
                if(checkBlank(getDown(myId))) {
                    // swap with this one
                    t2 = getDown(myId);
                }
            }
            if(valid(getLeft(myId)) && (Number(myId) != 4 && Number(myId) != 7)) {
                if(checkBlank(getLeft(myId))) {
                    // swap with this one
                    t2 = getLeft(myId);
                }
            }
            //alert(getRight(myId));
            if(valid(getRight(myId))  && (Number(myId) != 3 && Number(myId) != 6)) {
                
                if(checkBlank(getRight(myId))) {
                    // swap with this one
                    t2 = getRight(myId);
                    //alert("yes");
                }
            }
            
            // now swap them
            if(t2 != -1) {
                var temp = this.innerHTML;
                this.innerHTML = "X";
                document.getElementById("s"+t2).innerHTML = temp;
                var c1 = this.style.background;
                var c2 = document.getElementById("s"+t2).style.background;
                temp = c1;
                this.style.background = c2;
                document.getElementById("s"+t2).style.background  = c1;
                moves++;
                document.getElementById("moves").innerHTML = moves;
                
                if(checkPuzzle()) {
                    var score  = Math.floor(19880/(moves*(timing+0.01))) - hintTaken*30;
                    alert("Your score =  "+score);
                    if(score > localStorage.getItem("score")) {
                        localStorage.setItem("score",score);
                        document.getElementById("high").innerHTML = "Highest : "+ localStorage.getItem("score");
                    }
                    
                    start();
                }
            }
            else{
              //  alert("wrong move!");
            }
        };
    }
    
    
}



function checkPuzzle() {
    
    for(var i = 0; i < 9; i++) {
        res[i] = document.getElementById("s"+(i+1)).innerHTML;
    }
    var flag = 0;
    for(var i = 0; i < 9; i++) {
        if(res[i] != final[i]) {
            flag = 1;
        }
    }
    if(flag == 0) {
        return true;
    }
    else {
        return false;
    }
    

}

function getUp(num) {
return Number(num)-3;
}
function getDown(num) {
    return Number(num)+3;
}
function getLeft(num) {
    return Number(num)-1;
}
function getRight(num) {
    return Number(num)+1;
}
function valid(num) {
    if(Number(num) >= 1 && Number(num) <= 9) {
        return true;
    }
    else {
        return false;
    }
}

function checkBlank(num) {
    var d = document.getElementById("s"+num);
    if(d.innerHTML === "X") {
        return true;
    }
    else {
        return false;
    }
}



// BFS

function addNode(state, xPos, parent, orientation) {
    this.puzzle = state;
    this.negPos = xPos;
    this.baap = parent;
    this.side = orientation;
}
function getNegPos(res) {
    for(var i = 0; i < 9; i++) {
        if(res[i] === "X") {
            return (i);
        }
    }
    return -1;
}

// moves
function movLeft(temp, neg) {
    var v = new Array(9);
    for(var i = 0; i < 9; i++) {
        v[i] = temp.puzzle[i];
    }
    //console.log(("left me "));
    
    var t = v[neg];
    v[neg] = v[neg-1];
    v[neg-1] = t;
  //  console.log(v);
    var newN = new addNode(v, neg-1, temp, "left");
    //console.log(newN.puzzle);
    fringe.push(newN);
}
function movRight(temp, neg) {
    var v = new Array(9);
    for(var i = 0; i < 9; i++) {
        v[i] = temp.puzzle[i];
    }
    var t = v[neg];
    v[neg] = v[neg+1];
    v[neg+1] = t;
    var newN = new addNode(v, neg+1, temp, "right");
    fringe.push(newN);
}
function movUp(temp, neg) {
    var v = new Array(9);
    for(var i = 0; i < 9; i++) {
        v[i] = temp.puzzle[i];
    }
    var t = v[neg];
    v[neg] = v[neg-3];
    v[neg-3] = t;
    var newN = new addNode(v, neg-3, temp, "up");
    fringe.push(newN);
}
function movDown(temp, neg) {
    var v = new Array(9);
    for(var i = 0; i < 9; i++) {
        v[i] = temp.puzzle[i];
    }
    var t = v[neg];
    v[neg] = v[neg+3];
    v[neg+3] = t;
    var newN = new addNode(v, neg+3, temp, "down");
    fringe.push(newN);
}

//getting children
function grow(temp) {
    var Xpos = temp.negPos;
    
    if(Xpos % 3 != 0) {
        movLeft(temp, Xpos);
    }
    if(!(Xpos % 3 == 2)) {
        movRight(temp, Xpos);
    }
   if(Xpos >= 3){
        movUp(temp, Xpos);
    }
    if(Xpos < 6){
        movDown(temp, Xpos);
    }
}


function BFS() {
    //create root object
    hintTaken++;
    var ara = res;
    var root = new addNode(ara, getNegPos(ara), null, "none");
    
    fringe = [];
    fringe.push(root);
 //   console.log("hello = "+ root.puzzle);
    var temp;
    var flag = 0;
    
  //  var cp = 1;
    while(fringe.length != 0) {
        temp = fringe.shift();
      //  console.log(temp.puzzle);
      //  console.log(temp.side);
        if(equ(temp.puzzle, final) == 1) {
            //found end
            flag = 1;
            break;
        }
        if(fringe.length > 120) break;
        grow(temp);
        
        //cp++;
    }
    if(flag == 1) {
        // get all the correct puzzle config
        var output = [];
        var tes = temp;
        while(tes != null) {
            output.push(tes.puzzle);
            tes = tes.baap;
        }
        
       if(fringe.length != 0) {
            output.pop();
           var displayP = output.pop();
           if(displayP != null) {
               //display it
                for(var i = 0; i < 9; i++) {

                    document.getElementById("s"+grids[i]).innerHTML = displayP[i];
                    if(displayP[i] === "X") {
                        document.getElementById("s"+grids[i]).style.background = "grey";
                    }
                    else {
                        document.getElementById("s"+grids[i]).style.background = "#F44336";
                    }
                }
               // check the puzzle here also
                if(checkPuzzle()) {
                    alert("Used only Hints to solve it!");
                    start();
                }
           }
           else {
               alert("no hints!");
           }
       }
        else {
            alert("no hints");
        }
        
    }
    else {
        alert("no possible result");
    }
}

function equ(one, two) {
    var flag = 0;
    for(var i = 0; i < 9; i++) {
        if(one[i] != two[i]) {
            return 0;
        }
    }
    return 1;
}


