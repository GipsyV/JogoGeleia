window.onload = function () {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    //Direções
    let up = document.getElementById("up");
    let down = document.getElementById("down");
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    
    //Valores iniciais
    var x = 225;
    var y = 225;
    let dir = 0;
    drawMCstop(x, y);

    //Variáveis do jogo
    let speed = 5;
    let score = 0;
    var playerSize = 50;
    var multiplier = 5;
    var game = 1;
    var vida = 100;
    var sprite = 0;
    var mortes = 0;
    var cloudNum = 0;
    var totalClouds = 10;
    var totalEnemies = 5;
    var totalLevels = 10;
    var levelNumber = 1;
    var holder = 5;

    //Testa se o personagem principal está perto do inimigo
    function onRange(x1, y1, playerSize, playerSize, x2, y2, w2, h2){

        areaSize = playerSize*multiplier;
        context.fillStyle = "red";
        //context.strokeRect(x1- (25*(multiplier - 1)), y1 - (25*(multiplier - 1)), areaSize , areaSize);

        posX = x1 - (25*(multiplier - 1));
        posY = y1 - (25*(multiplier - 1));

        if (posX < x2 + w2  && posX + areaSize > x2 && posY < y2 + h2 && areaSize + posY > y2){
            return 1;
        }
        else{
            return 0;
        }
    }


    //Transforma o input X em qualquer número entre 0 e X
    function randy(x){
        result = Math.floor(x*Math.random());
        return result;
    }

    //Pequena função para simular 50% de probabilidade
    function coinFlip(){
        if(randy(100) < 50){
            return true;
        }else{
            return false;
        }
    }
        


    //Coisas de nuvem

    const cloudX = [];
    const cloudY = [];
    const size = [];
    const nuvSpeed = [];

    for( i = 0; i < totalClouds; i++){
        randomizeCloud(i);
    }

    function randomizeCloud(id){
        cloudX[id] = -200 + Math.random()*50;
        cloudY[id] = Math.random()*500;
        size[id] = 30 + 10*Math.random();
        nuvSpeed[id] = 2 + 5*Math.random();

    }

    function cloudManager(){
        for( i = 0; i < totalClouds; i++){
            handleCloud(i);   
        }
    }

    function handleCloud(id){
        if(cloudX[id]>500){
            randomizeCloud(id);
        }
        drawCloud(cloudX[id], cloudY[id], size[id]);
        cloudX[id] += nuvSpeed[id];
    }

    function drawCloud(x,y, size){
        dist = x+size;
        context.beginPath();
        context.fillStyle="#ffffff";
        context.arc(dist, y+5, size, 0, 2 * Math.PI);
        context.fill();
        context.arc(dist+50, y, size*1.2, 0, 2 * Math.PI);
        context.fill();
        context.arc(dist+100, y+5, size, 0, 2 * Math.PI);
        context.fill();

    }
    /*************************************/

    //Coisas de inimigo

    var enemX = [];
    var enemY = [];
    var enemSize = [];
    var enemSpeed = [];
    var enemVida = [];
    var enemAlive = [];

    function moooooooore(){
        for( i = 0; i < totalEnemies; i++){
            randomizeEnemy(i);
        }
    }

    moooooooore();

    function randomizeEnemy(id){
        if(coinFlip()){
            enemX[id] =  500 + randy(200);
        }else{
            enemX[id] =  0 - randy(200);
        }
        if(coinFlip()){
            enemY[id] =  500 + randy(200);
        }else{
            enemY[id] =  0 - randy(200);
        }
        

        enemSize[id] = 8 + 4*Math.random();
        enemSpeed[id] = 1;
        enemVida[id] = 100;
        enemAlive[id] = true;
    }

    function enemManager(){
        for( i = 0; i < holder; i++){
            handleEnemy(i);   
        }
    }

    function handleEnemy(id){

        if(enemAlive[i] == true){
            drawEnemy(enemX[id], enemY[id], enemSize[id]);

            if(enemX[id] < x+25){
                enemX[id] += enemSpeed[id];
            }
            if(enemX[id] > x+25){
                enemX[id] -= enemSpeed[id];
            }
            if(enemY[id] < y+25){
                enemY[id] += enemSpeed[id];
            }
            if(enemY[id] > y+25){
                enemY[id] -= enemSpeed[id];
            }

            if (onRange(x, y, playerSize, playerSize, enemX[id], enemY[id], enemSize[id], enemSize[id]) == 1){
                enemVida[id]--;
                context.beginPath();
                context.moveTo(x + 13, y + 20);
                context.lineTo(enemX[id], enemY[id]);
                context.moveTo(x + 38, y + 20);
                context.lineTo(enemX[id], enemY[id]);
                context.lineWidth = 5;
                context.strokeStyle = 'red';
                context.stroke();

            

                if(testacolisao(x, y, 50, 50, enemX[id], enemY[id], 10, 10) == 1){
                    score--;
                    if(vida > 0){
                        vida --;
                    } 
                }
            }

            if (enemVida[id] == 0){
                enemAlive[id] = false;
                score += 500;
                mortes += 1;
                totalEnemies--;
                enemSpeed[id] = 0;
            }
        }
        else{
            enemVida[id] = 100;
            enemX[id] = 10;
            enemY[id] = 10;
        }
        
    }

    function drawEnemy(x, y, size) {
        context.beginPath();
        context.fillStyle="#ff0000";
        context.arc(x, y, size, 0, 2 * Math.PI);
        context.fill();
        
        
        if((sprite/2)%2 == 1){
            context.fillRect(x+3, y-8, 15, 3);
            context.fillRect(x+3, y -2, 15, 3);
            context.fillRect(x+3, y + 4, 15, 3);
            context.fillRect(x-18, y - 4, 15, 3);
            context.fillRect(x-18, y + 2, 15, 3);
            context.fillRect(x-18, y + 8, 15, 3);
        }else{
            context.fillRect(x+3, y - 4, 15, 3);
            context.fillRect(x+3, y + 2, 15, 3);
            context.fillRect(x+3, y + 8, 15, 3);
            context.fillRect(x-18, y-8, 15, 3);
            context.fillRect(x-18, y -2, 15, 3);
            context.fillRect(x-18, y + 4, 15, 3);
        }

        context.fillStyle="#000000";
        context.fill(); 
        
    }


    /************************************/
    


    //Mostra uma variável no menu
    function menu(valname, pos, val){
        context.font = '25px Arial';
        context.fillStyle = 'black';
        context.fillText(valname +": " + val, 20, 30 + pos*30);
    }

    function drawLevel(levelNumber){
        var gradientRect = context.createLinearGradient(0, 0, canvas.width, 0);
            rot = (levelNumber)/totalLevels;
        
        gradientRect.addColorStop( rot, "black");
        gradientRect.addColorStop(0.5, "white");
        gradientRect.addColorStop(1 - rot, "black");
        
        
        var gradientLetter = context.createLinearGradient(160, 0, 320, 0);
        gradientLetter.addColorStop(0, "green");
        gradientLetter.addColorStop(0.5, "green");
        gradientLetter.addColorStop(1, "green");

        context.font = '50px Verdana';
        if(levelNumber == 1){
            context.fillStyle = "white";
        }else{
            context.fillStyle = gradientRect;
        }

        
        context.fillRect(110, 140, 270, 80);

        

        context.fillStyle = gradientLetter;
        context.fillText("LEVEL " + levelNumber, 140, 200);
    }


    //Gerencia níveis
    function levelManager(){
        if(totalEnemies == holder){
            drawLevel(levelNumber);
        }
        if(totalEnemies == 0){
            holder+=5;
            totalEnemies = holder;
            levelNumber++;
            moooooooore();
        }

    }

    //Testa se algo (1) colidiu com outra coisa (2)
    function testacolisao(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 < x2 + w2  && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2){
             return 1;
        }
    }



    //Mostra a tela final do jogo
    function telaFinal(){

        context.clearRect(0, 0, 500, 500);
        context.fillStyle = "black";
        context.fillRect(0, 0, 500, 500);
        context.fillStyle = 'white';
        context.font = '50px serif';
        if(totalLevels == levelNumber){
            context.fillText("Você venceu!",120, 150);
        }else{
            context.fillText("Você perdeu!",120, 150);
        }
        
        context.font = '25px Arial';
        context.fillText("Pontos: " + score, 170, 250);
        context.fillText("Inimigos mortos: " + mortes, 170, 280);
    }
    
    //Mostra a vida total do personagem
    function drawVida(vida) {
        context.fillStyle = "red";
        context.fillRect(260, 10, 200, 25);
        context.fillStyle = "green";
        context.fillRect(260, 10, vida*2, 25);
    }
    

    //Funções para desenhar o personagem

    //Desenha o personagem parado
    function drawMCstop(x, y) {
        context.fillStyle = "green";
        context.fillRect(x, y, playerSize, playerSize);
        context.fillStyle = "Black";
        context.fillRect(x + 5, y + 10, 15, 15);
        context.fillRect(x + 30, y + 10, 15, 15);
    }
    //Desenha o personagem olhando para cima
    function drawMCup(x, y) {
        context.fillStyle = "green";
        context.fillRect(x, y, playerSize, playerSize);
        context.fillStyle = "Black";
        context.fillRect(x + 5, y + 5, 15, 15);
        context.fillRect(x + 30, y + 5, 15, 15);
    }
     //Desenha o personagem olhando para baixo
    function drawMCdown(x, y) {
        context.fillStyle = "green";
        context.fillRect(x, y, playerSize, playerSize);
        context.fillStyle = "Black";
        context.fillRect(x + 5, y + 15, 15, 15);
        context.fillRect(x + 30, y + 15, 15, 15);
    }
     //Desenha o personagem olhando para esquerda
    function drawMCleft(x, y) {
        context.fillStyle = "green";
        context.fillRect(x, y, playerSize, playerSize);
        context.fillStyle = "Black";
        context.fillRect(x, y + 10, 15, 15);
        context.fillRect(x + 25, y + 10, 15, 15);
    }
     //Desenha o personagem olhando para direita
    function drawMCright(x, y) {
        context.fillStyle = "green";
        context.fillRect(x, y, playerSize, playerSize);
        context.fillStyle = "Black";
        context.fillRect(x + 10, y + 10, 15, 15);
        context.fillRect(x + 35, y + 10, 15, 15);
    }

    //Movimenta o personagem usando teclas W,A,S,D ou setas
    window.addEventListener('keydown', function (e) {
        if(e.key == "w" || e.key == "ArrowUp"){
            dir = "up";
        }
        if(e.key == "s" || e.key == "ArrowDown"){
            dir = "down";
        }
        if(e.key == "a" || e.key == "ArrowLeft"){
            dir = "left";
        }
        if(e.key == "d" || e.key == "ArrowRight"){
            dir = "right";
        }  
    });

    //Ao parar de apertar a tecla, para o personagem
    window.addEventListener('keyup', function (e) {
        if(e.key == "w" || e.key == "ArrowUp"){
            if(dir == "up"){
                dir = 0;
            }
        }
        if(e.key == "s" || e.key == "ArrowDown"){
            if(dir == "down"){
                dir = 0;
            }
        }
        if(e.key == "a" || e.key == "ArrowLeft"){
            if(dir == "left"){
                dir = 0;
            }
        }
        if(e.key == "d" || e.key == "ArrowRight"){
            if(dir == "right"){
                dir = 0;
            }
        }
        
        
      });

    //Movimenta usando os botões da tela (Mouse)
    up.onmousedown = function () {
        dir = "up";
    }
    down.onmousedown = function () {
        dir = "down";
    }
    left.onmousedown = function () {
        dir = "left";
    }
    right.onmousedown = function () {
        dir = "right";
    }
    up.onmouseup = function () { 
        dir = 0; 
    }
    down.onmouseup = function () {
        dir = 0; 
    }
    left.onmouseup = function () {
        dir = 0; 
    }
    right.onmouseup = function () {
        dir = 0; 
    }

    //Movimenta o personagem (Touchscreen)
    up.ontouchstart = function () { 
        dir = "up";
        console.log("a");
    }
    down.ontouchstart = function () { 
        dir = "down"; 
    }
    left.ontouchstart = function () { 
        dir = "left"; 
    }
    right.ontouchstart = function () { 
        dir = "right"; 
    }
    up.ontouchend = function () {
        dir = 0;
    }
    down.ontouchend = function () {
        dir = 0;
    }
    left.ontouchend = function () {
        dir = 0;
    }
    right.ontouchend = function () {
        dir = 0;
    }

    //Loop do jogo
    function draw() {
        context.clearRect(0, 0, 500, 500);
        
        
        cloudManager();
        enemManager();
        levelManager();

        drawVida(vida);

        menu("Vida", 0, vida);
        menu("Pontos", 1, score);
        menu("Nível", 2, levelNumber);

        //menu("OnRange", 3, onRange(x, y, playerSize, playerSize, enemX, enemY, 10, 10));
        //menu("enemX", 4, enemX);
        //menu("enemY", 5, enemY);
        //menu("totalEnemies", 6, totalEnemies);
        //menu("enemVida", 8,  enemVida);
       
        


        

        

        if (dir == "up") {
            if (y > 0) {
                y -= speed;
            }
            drawMCup(x, y);

        }
        else if (dir == "down") {
            if (y < 450) {
                y += speed;
            }
            drawMCdown(x, y);
        }
        else if (dir == "left") {
            if (x > 0) {
                x -= speed;
            }
            drawMCleft(x, y);
        }
        else if (dir == "right") {
            if (x < 450) {
                x += speed;
            }
            drawMCright(x, y);
        }
        else {
            drawMCstop(x, y);
        }
        

        
        if(vida == 0 || levelNumber == totalLevels){
            clearInterval(jogo);
            telaFinal();
        }

        sprite++;


    }  
        jogo = setInterval(draw, 40);

        

}



