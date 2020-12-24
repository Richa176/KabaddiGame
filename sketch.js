var p1,p2,db;
var pos1,pos2, p1ani,p2ani;
var gmSt;
var p1Sc,p2Sc;
var db;
function preload(){
p1ani=loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
p2ani=loadAnimation("assests/player2a.png","assests/player2b.png","assests/player2a.png");
}

function setup(){
    db=firebase.database();
    createCanvas(600,600);
    p1=createSprite(300,250,10,10);
    p1.addAnimation("walking",p1ani);
    //p1.shapeColor="red";
    p1ani.frameDelay=200;
    p1.scale=0.5;
    p1.setCollider("circle",0,0,60);
    p1.debug=true;

    var p1pos=db.ref('Player1/position');
    p1pos.on("value",readPosition,showError);

    p2=createSprite(300,250,10,10);
    p2.addAnimation("walking2",p2ani);
    //p1.shapeColor="yellow";
    p2ani.frameDelay=200;
    p2.scale=-0.5;
    p2.setCollider("circle",0,0,60);
    p2.debug=true;

    var p2pos=db.ref('Player2/position');
    p2pos.on("value",readPosition2,showError);

    gmSt=db.ref('gameState/');
    gmSt.on("value",readGM,showError);

    p1Sc=db.ref('player1Score');
    p1Sc.on("value",readScore1,showError);

    p2Sc=db.ref('player2Score');
    p2Sc.on("value",readScore2,showError);
}

function draw(){

    background(255);
    
    if(gmSt===0){
        fill("black");
        text("Press space to start the toss",100,200);

        if(keyDown('space')){
            r=Math.round(random(1,2));
            if(r===1){
                db.ref('/').update({
                    'gameState': 1
                })
                alert("Red Ride");
            }
            if(r===2){
                db.ref('/').update({
                    'gameState': 2
                })
                alert("Yellow Ride");
            }

            db.ref("Player1/position").update({
                'x':150,
                'y':300
            })
            db.ref("Player2/position").update({
                'x':450,
                'y':300
            })
        }
  }

  if(gmSt===1){

    if(keyDown(LEFT_ARROW)){
        writePosition(-5,0);
    }
    else if(keyDown(RIGHT_ARROW)){
        writePosition(5,0);
    }
    else if(keyDown(UP_ARROW)){
        writePosition(0,-5);
    }
    else if(keyDown(DOWN_ARROW)){
        writePosition(0,5);
    }
    else if(keyDown("w")){
        writePosition2(0,-5);
    }
    else if(keyDown("z")){
        writePosition2(0,+5);
    }

    if(p1.x>500){
        db.ref('/').update({
            'player1Score':p1Sc-5,
            'player2Score':p2Sc+5,
            'gameState':0
        })
        alert("RED WON");
    }
    if(p1.isTouching(p2)){
        db.ref('/').update({
            'player1Score':p1Sc+5,
            'player2Score':p2Sc-5,
            'gameState':0
        })
        alert("RED LOST");
    }
  }

  if(gmSt===2){

    if(keyDown("a")){
        writePosition2(-5,0);
    }
    else if(keyDown("s")){
        writePosition2(5,0);
    }
    else if(keyDown("w")){
        writePosition2(0,-5);
    }
    else if(keyDown("z")){
        writePosition2(0,+5);
    }
    else if(keyDown(UP_ARROW)){
        writePosition(0,-5);
    }
    else if(keyDown(DOWN_ARROW)){
        writePosition(0,+5);
    }

  

  if(p2.x<150){
    db.ref('/').update({
        'player1Score':p1Sc+5,
        'player2Score':p2Sc-5,
        'gameState':0
    })
    alert("YELLOW WON");
}
if(p1.isTouching(p2)){
    db.ref('/').update({
        'player1Score':p1Sc-5,
        'player2Score':p2Sc+5,
        'gameState':0
    })
    alert("YELLOW LOST");
}
  }
textSize(15);
text("RED: "+p1Sc,350,15);
text("YELLOW:"+p2Sc,150,15);

drawline();
drawline1();
drawline2();

console.log(gmSt);

drawSprites();
}

function writePosition(x,y){
    db.ref("Player1/position").set({
        'x':position.x+x,
        'y':position.y+y
    })
}

function writePosition2(x,y){
    db.ref("Player2/position").set({
        'x':position2.x+x,
        'y':position2.y+y
    })
}

function readPosition(data){
    position=data.val();
    p1.x= position.x;
    p1.y= position.y;
}

function readPosition2(data){
    position2=data.val();
    p2.x= position2.x;
    p2.y= position2.y;
}

function readGM(data){
    gmSt=data.val();
}

function readScore1(data1){
    p1Sc=data1.val();
}

function readScore2(data2){
    p2Sc=data2.val();
}

function showError(){
    console.log("Error in writing to the database");
}

function drawline(){
    for(var i=0;i<600;i=i+20){
        line(300,i,300,i+10);
    }
}

function drawline1(){
    for(var i=0;i<600;i=i+20){
        stroke("yellow");
        strokeWeight(4);
        line(100,i,100,i+10);
    }
}

function drawline2(){
    for(var i=0;i<600;i=i+20){
        stroke("red");
        strokeWeight(4);
        line(500,i,500,i+10);
    }
}


