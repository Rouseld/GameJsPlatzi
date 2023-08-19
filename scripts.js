const canva = document.querySelector('.rowmain__canva--canvas')
const game = canva.getContext('2d');
const BtnUp = document.querySelector('.controlsrow--up');
const BtnDown = document.querySelector('.controlsrow--down')
const BtnRight = document.querySelector('.controlsrow--right')
const BtnLeft = document.querySelector('.controlsrow--left')
const LifeCounter = document.querySelector('.inforow--life')
const TimeCounter = document.querySelector('.inforow--time')
const RecordCounter = document.querySelector('.inforow--record')



window.addEventListener('load' ,CanvaResize )
window.addEventListener('resize' ,CanvaResize )

let GameRecordRaw;
let GameRecordNew;
let GameRecordOld;
let CanvasSize ;
let ObstaclesSize;
let TimeStartGame;
let TimeInterval;
let GameTimeFinal;

const PlayerPosition = {
    x:undefined,
    y:undefined
}

const GiftPosition = {
    x: undefined,
    y:undefined,
}

let BombsPosition =[]

const Bomba = {
    x:undefined,
    y: undefined,
}

let level = 0 ;

let life = 3 ;
showlife();


function CanvaResize (){


    if( window.innerHeight > window.innerWidth){
        CanvasSize = window.innerWidth * 0.8
    } else {
        CanvasSize = window.innerHeight * 0.8
    }  
    

    canva.setAttribute('width' , CanvasSize)
    canva.setAttribute('height' , CanvasSize)
    ObstaclesSize = CanvasSize / 10;
    StartGame();
}

function StartGame (){
    TransformRecord()
    ShowRecord();
    console.log(CanvasSize , ObstaclesSize)
   // game.fillRect(100,20,100,100)
    if(!TimeStartGame){
        TimeStartGame = Date.now();
        TimeInterval = setInterval(TimeGame , 100)
    }

    

    // Rellenar el canva con textos
    game.font = '10px Audiowide'; // Sintaxis Para Cambiar el size del elemento y la tipografia
    game.fillStyle = 'white'; // Sinxtasis para cambiar el color del elemento
    game.textAlign = "end"
   // game.fillText('Mamahuevo',150,75) // Sinxtasis para crear el elemento del texto  , Estructura = (Texto)(Posicion X)(Posicion Y)(Max-width)

    game.font = ObstaclesSize + 'px Audiowide';

    const map = maps[level]
    console.log(map)
    const MapRow = map.trim().split('\n');
    console.log(MapRow)
    const MapColumn = MapRow.map(row => row.trim().split(''))
    console.log(MapColumn)

  
    game.clearRect(0,0,CanvasSize, CanvasSize);
    MapColumn.forEach((Row , RowI) => {
        Row.forEach((Col, ColI) => {
            const emoji = emojis[Col]
            const RowP = ObstaclesSize * (ColI + 1.20);
            const ColumnP = ObstaclesSize * (RowI + 0.90);

            if (Col == 'O') {
                if(!PlayerPosition.x && !PlayerPosition.y){
                    PlayerPosition.x = RowP;
                    PlayerPosition.y = ColumnP;
                }

            } else if ( Col == 'I'){
                GiftPosition.x = RowP;
                GiftPosition.y = ColumnP;
            } else if (Col == 'X'){

                Bomba.x = RowP;
                Bomba.y = ColumnP;
                BombsPosition.push({x:RowP ,y: ColumnP})

            }

            game.fillText(emoji , RowP , ColumnP)



        });
    });
    MovePlayer();
    

}


function WinGame(){
    
    if ( level + 1 <= 3){
        game.clearRect(0,0,CanvasSize, CanvasSize);
        PlayerPosition.x = undefined;
        PlayerPosition.y = undefined;
        BombsPosition = []
        level++;
        life++;
        showlife();
        StartGame();
    
    } else {
        game.clearRect(0, 0, CanvasSize, CanvasSize);
        PlayerPosition.x = undefined;
        PlayerPosition.y = undefined;
        BombsPosition = [];
        level = 0;
        GameTimeFinal = ((Date.now() - TimeStartGame) / 1000);
    
        // Almacena en localStorage inmediatamente después de calcular GameTimeFinal
        if(!GameRecordNew){
            localStorage.setItem('Record', GameTimeFinal);
            console.log('Funciona el !GameRecordNew')

        } else if (GameTimeFinal < GameRecordNew ){
            localStorage.setItem('Record', GameTimeFinal);
        }
    
        StartGame();
        clearInterval(TimeInterval);
        setTimeout(ShowRecord, 0);

        TimeStartGame = Date.now();
        TimeInterval = setInterval(TimeGame , 100)

        
    }
    
}

function LoseGame(){
    game.clearRect(0,0,CanvasSize, CanvasSize);
    PlayerPosition.x = undefined;
    PlayerPosition.y = undefined;
    BombsPosition = []
    showlife();
    StartGame();
    
}

function loselife (){
    if ( life >= 1){
        (life-- ) - 1
        console.log('funciona el restar vida')
    } else if (life == 0 && level == 0){
        life = 3
        return life
    } else if ( life == 0 && level >=1){
        level--;
        life = 3
    }
}

function showlife(){
    const LifesArray = Array(life)
    const LifesArrayClean =LifesArray.fill(emojis['life']).join(' ');


    console.log(LifesArrayClean)
    LifeCounter.innerText = " Vida:" + LifesArrayClean
}

function TimeGame(){
    TimeCounter.innerText = "S" + ((Date.now() - TimeStartGame)/1000)
    
}

function TransformRecord(){

        GameRecordRaw = localStorage.getItem('Record')
        GameRecordNew = parseInt(GameRecordRaw)

}

function ShowRecord(){

    if(!GameRecordNew){
        RecordCounter.innerText = "Aun No Se Tiene Record"

    } else {
        RecordCounter.innerText = "Record" + GameRecordNew
        console.log('Esta funcionando el record')
    }
}



// Scripst Para mover a los jugadores 

window.addEventListener('keyup', KeysMove )

BtnUp.addEventListener('click' , MovePlayerUp);
BtnDown.addEventListener('click' , MovePlayerDown);
BtnRight.addEventListener('click', MovePlayerRight);
BtnLeft.addEventListener('click', MovePlayerLeft)



function KeysMove(event){
    console.log(event)

    if ( event.key == 'ArrowUp' ||  event.key == 'w'){
        MovePlayerUp();
    } else if ( event.key == 'ArrowDown' || event.key == 's'){
        MovePlayerDown();
    } else if (event.key == 'ArrowRight' || event.key == 'd'){
        MovePlayerRight();
    } else if (event.key == 'ArrowLeft' || event.key == 'a'){
        MovePlayerLeft();
    }
}

// function MapUpdate (){  intento de solucion para el mapa

//     const map = maps[0]
//     console.log(map)
//     const MapRow = map.trim().split('\n');
//     console.log(MapRow)
//     const MapColumn = MapRow.map(row => row.trim().split(''))
//     console.log(MapColumn)

//     MapColumn.forEach((Row , RowI) => {
//         Row.forEach((Col, ColI) => {
//             const emoji = emojis[Col]
//             const RowP = ObstaclesSize * (ColI + 1);
//             const ColumnP = ObstaclesSize * (RowI + 0.90);

//             game.fillText(emoji , RowP , ColumnP)


//         });
//     });
// }

function ValidationPlayer(){

    const isBombNearby = BombsPosition.find(bomb => bomb.x.toFixed(0) === PlayerPosition.x.toFixed(0) && bomb.y.toFixed(0) === PlayerPosition.y.toFixed(0));


    if (PlayerPosition.y.toFixed(0) == GiftPosition.y.toFixed(0) && PlayerPosition.x.toFixed(0) == GiftPosition.x.toFixed(0)){
        console.log('Pasastes al siguiente nivel')
        WinGame();
     } else if (isBombNearby){
         console.warn('perdistes')
         loselife();
         LoseGame();

     }
}

function MovePlayer(){
    game.fillText(emojis['PLAYER'] , PlayerPosition.x , PlayerPosition.y)

}

function MovePlayerUp(){

    if ( PlayerPosition.y <= ObstaclesSize ){

        console.log('no se esta moviendo')
        console.log( PlayerPosition.y)

    } else{
        PlayerPosition.y -= ObstaclesSize
        console.log(PlayerPosition.y)
        StartGame();

        console.log('funciona')
    }

    ValidationPlayer();


}
function MovePlayerDown(){
    if ( (PlayerPosition.y + ObstaclesSize) > CanvasSize ){
        console.log('no se esta moviendo')
        console.log( PlayerPosition.y)

    } else{
 
        PlayerPosition.y += ObstaclesSize
        console.log(PlayerPosition.y)
        StartGame();

        console.log('funciona')
    }

    ValidationPlayer();
    
}
function MovePlayerLeft(){
    if ( (PlayerPosition.x - ObstaclesSize) < ObstaclesSize ){
        console.log('no se esta moviendo')
        console.log( PlayerPosition.x)

    } else{
        console.log('no se esta moviendo')
        console.log( PlayerPosition.x)

        PlayerPosition.x -= ObstaclesSize
        console.log(PlayerPosition.x)
        StartGame();

        console.log('funciona')
    }

    ValidationPlayer();
}
function MovePlayerRight(){
    if ( PlayerPosition.x > CanvasSize ){
        console.log('no se esta moviendo')
        console.log( PlayerPosition.x)

    } else{
        console.log('no se esta moviendo')
        console.log( PlayerPosition.x)
        PlayerPosition.x += ObstaclesSize
        console.log(PlayerPosition.x)
        StartGame();

        console.log('funciona')
    }

    ValidationPlayer();
}
