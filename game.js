//DEFINO VALORES
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); /* creo el espacio para dibujar */
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
//Definir pala
var paddleHeight = 10; //Altura
var paddleWidth = 75; //Ancho
var paddleX = (canvas.width - paddleWidth) / 2; //posición en el eje X
//Dos variables para guardar la información sobre si se ha pulsado el botón izquierdo o el derecho.
var rightPressed = false;
var leftPressed = false;
//Declara las variables de los ladrillos
var brickRowCount = 3; //fila
var brickColumnCount = 5; //columna
var brickWidth = 75; //ancho
var brickHeight = 20;//alto
var brickPadding = 10;// el hueco entre los ladrillos para que no se toque
var brickOffsetTop = 30;// el hueco entre los ladrillos para que no se toque
var brickOffsetLeft = 30;//izquierdo
var score = 0;//guardar contador
var lives = 3;//vidas al jugador

//Recorrico de Matriz (tamaño declarado en brickRowCount y rickColumnCount) que dibujara los bloques, sg. 

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };//propiedad status a cada ladrillo
    }
}


//Dos funciones (event listenings) que responden a los eventos keydowny keyup(pulsar tecla, liberar tecla). se ejecute algún código para manejar la paleta cuando se pulsan los botones.
document.addEventListener("keydown", keyDownHandler, false); //Cuando keydownal ocurra, la función keyDownHandler()se ejecutará
document.addEventListener("keyup", keyUpHandler, false);//Cuando se liberará la tecla pulsada, se ejecutará la función keyUpHandler()
//Detectar el movimiento del ratón
document.addEventListener("mousemove", mouseMoveHandler, false);

//Asociar el movimiento de la pala con el movimiento del ratón
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft; // relativeX, que es la posición horizontal del ratón en el "viewport" ( e.clientX), menos la distancia entre el borde izquierdo del terreno de juego y el borde izquierdo del "viewport" ( canvas.offsetLeft).
    if (relativeX > 0 && relativeX < canvas.width) { //Si el valor resultante es mayor que cero y menor que el ancho del terreno de juego, es que el ratón está dentro de los límites, 
        paddleX = relativeX - paddleWidth / 2;
    }
}


function keyDownHandler(e) {//e.keyCode nos va a decir qué tecla se ha pulsado
    if (e.keyCode == 39) {//Si vale 39 es porque se ha pulsado la "flecha derecha"
        rightPressed = true;
    } else if (e.keyCode == 37) {//Si vale 37 es porque se ha pulsado la "flecha izquierda"
        leftPressed = true; //Cuando se pulsará la "flecha izquierda" pondremos leftPressed a true.
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false; //Cuando se liberará la "flecha izquierda" pondremos leftPressed a false.
    }
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

ctx.beginPath();
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#f38ba8";//color
    ctx.fill();
    ctx.closePath();
}

//CONTROL DE LA PALA Y EL TECLADO
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#fab387"; //color
    ctx.fill();
    ctx.closePath();
}
//CONSTRUYE EL MURO DEL LADRILLO


function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#fab387";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//DETECCION DE COLISIONES

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {//si el ladrillo está activo (status 1) comprobaremos si hay colisión.
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;//Si hay colisión, pondremos el "status" de ese ladrillo a 0 para no volver a pintarlo
                    score++; //sumar un punto cada vez que se rompe un ladrillo
                    //Mostrar un mensaje de victoria cuando se hayan destruido todos los ladrillos
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload(); //vuelve a cargar la página y el juego empieza de nuevo, 
                    }
                }
            }
        }
    }
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#cdd6f4";
    ctx.fillText("Vidas: " + lives, canvas.width - 65, 20);
}


//Mostrar por pantalla el número de vidas
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#cdd6f4";
    ctx.fillText("Puntaje: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();//Sacar por pantalla el contador de vidas

    collisionDetection();

    //REBOTA EN LAS PAREDES
    var ballRadius = 10;//Detección de colisión simple
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {//Rebotando en la izquierda y derecha
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    //FIN DEL JUEGO
    else if (y + dy > canvas.height - ballRadius) {//cuando se toque el piso, el juego termina
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw); //requestAnimationFrame ayuda al navegador a refrescar la imagen 
}
draw();//Ahora draw() se ejecuta en bucle, pero al finalizar se pide un reinicio por parte del usuario, para evitar superposucion de alerts