"use strict";

function Floor(){
    
    //properties
    this.tiles = new Array();//map of all the tiles for the floor
    this.enemies = new Array(); //contains where the enemies are
    this.items = new Array();
    this.visible = new Array();//the tiles that the player can/have seen
    this.mapped = new Array();//the play has seen the tile
    this.reachable = new Array(); //map of where the player could reach
    this.distToPlayer = new Array(); //for enemies, how far the space is from the player
    this.TILE = Object.freeze({
        FLOOR1 : 0,
        WALL1 : 1,
        WALL2 : 2,
        CLOSE_LOCKED_DOOR : 3,
        CLOSE_UNLOCKED_DOOR : 4,
        OPEN_DOOR : 5,
        BLACK : 6,
        GREEN : 7,
        DOWN_STAIR : 8,
        UP_STAIR : 9,
        CRYSTAL : 10,
        FADEOUT : 11,
    });
    
    this.level = 0; //the level that this is
    this.floorWidth = 32;
    this.floorLength = 32;
    
    this.enemyProbability = [0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 50];//the chance of spawning specific enemies
    
    this.doorRatio = 0.5; //ratio of locked to unlocked doors

    this.generate = function() {//generates the floor layout
        //fill the level with walls except for a border-ish thing
        this.clearTiles();
        this.generateRooms(10);
        this.generateCorridors(.5);
        this.removeDeadends(7);
        this.addRandomDoors();
        this.generateStairs();
        this.removeBorder();
        this.changeWall(25);
        
        this.enemyProbability = PROBABILITY[this.level];
        this.generateEnemies(400);
        
        this.addRandomItems();
        
    }
    
    ///floor generation functions///
    this.clearTiles = function() {
        for (var i = 0; i < this.floorWidth; i++) {
            this.tiles[i] = new Array();
            this.reachable[i] = new Array();
            this.visible[i] = new Array();
            this.mapped[i] = new Array();
            this.enemies[i] = new Array();
            this.items[i] = new Array();
            for (var j = 0; j < this.floorLength; j++) {
                if (i != 0 && i != this.tiles[0]-1 && j != 0 && j != this.tiles[0]-1) {
                    this.tiles[i][j] = this.TILE.WALL1;//wall
                }
                else{
                    this.tiles[i][j] = this.TILE.FLOOR1;//floor
                }
                this.reachable[i][j] = false;
                this.visible[i][j] = false;
                this.mapped[i][j] = false;
            }
        }
    }
    
    this.generateRooms = function(count) {
        var x=0,y=0,w=0,h=0;
        for(var n=0; n<count; n++){//the number of rooms wanted
            var f=0;
            while(f<200){//tries to make a room at most 200 times
                w=2+Math.floor(Math.random()*4)*2;//random width
                h=2+Math.floor(Math.random()*4)*2;//random height
                x=4+Math.floor(Math.random()*(this.tiles.length-w-8)/2)*2;//random x
                y=4+Math.floor(Math.random()*(this.tiles[0].length-h-8)/2)*2;//random y
                var ok=true;
                for(var i=x; i<=x+w; i++){//checks to see if new room is over another room
                    for(var j=y; j<=y+h; j++){
                        if(this.tiles[i][j]==this.TILE.FLOOR1) {ok=false;}
                    }
                }
                if(ok)f+=200;//room was successfully made
                else{
                    f++;
                    if(f>199){//tried to make a room 200 times, there is no more space for rooms
                        n=count;
                    }
                }
            }
            for(var i=x; i<=x+w; i++){//changes tiles to make room
                for(var j=y; j<=y+h; j++){
                    this.tiles[i][j]=this.TILE.FLOOR1;
                }
            }
            //adds some random doors
            var doorx, doory;
            var door=1;
            while(door>0.4){ //random amount of doors around the room
                if(Math.random()>0.5){ //top or bottom of room
                    doorx=x+Math.floor(Math.random()*w/2)*2;//random x location
                    if(Math.random()>0.5){//top
                        doory=y-1;
                    }
                    else{//boottom
                        doory=y+h+1;
                    }
                }
                else{//left or right of room
                    doory=y+Math.floor(Math.random()*h/2)*2;//random y location
                    if(Math.random()>0.5){//left
                        doorx=x-1;
                    }
                    else{//right
                        doorx=x+w+1;
                    }
                }
                
                if(Math.random() <= this.doorRatio) { this.tiles[doorx][doory]=this.TILE.CLOSE_LOCKED_DOOR; }//sets tile at location to door
                else{ this.tiles[doorx][doory]=this.TILE.CLOSE_UNLOCKED_DOOR; }
                door=Math.random();//sees if another random door appear
            }
        }
    }
    
    this.generateCorridors = function(carveOut) {
        var x=0, y=0, dir=0;
        var dx=0, dy=2;
        //mark off a border for boundary purposes
        for(var i=0; i < this.tiles.length; i++){//x boundaries
            this.tiles[i][0]=0;
            this.tiles[i][this.tiles[0].length-2] = 0;
        }
        for(var i=0; i < this.tiles[0].length; i++){//y boundaries
            this.tiles[0][i] = 0;
            this.tiles[this.tiles.length-2][i] = 0;
        }
        //find a wall
        for(var i=0; i<100; i++){
            x=4+Math.floor(Math.random()*(this.tiles.length-8)/2)*2;//random x for a tile
            y=4+Math.floor(Math.random()*(this.tiles[0].length-8)/2)*2;//random y for tile
            if(this.tiles[x][y]==this.TILE.WALL1||this.tiles[x][y]==this.TILE.WALL2){break;}//checks to see if is a wall
        }
        dir = Math.floor(Math.random()*4);//determines direction that corridor will go
        //carve out corridors
        for(var n=0; n<10000; n++){
            this.tiles[x][y]=this.TILE.FLOOR1;//sets tile as a corridor
            if((this.tiles[x+dx][y+dy] == this.TILE.WALL1 || this.tiles[x+dx][y+dy]==this.TILE.WALL2) && Math.random()>carveOut){//checks to see if tile beyond next tile is a wall
                this.tiles[x+dx/2][y+dy/2]=this.TILE.FLOOR1;
                x+=dx;
                y+=dy;
            }
            else{//path hits an open area, or random number bellow carveOut
                var ok = false;
                for(var t=0; t<10; t++){//changes direction of the corridor
                    dir=Math.floor(Math.random()*4);
                    dx=dy=0;
                    if(dir==0)dx=2;//right
                    else if(dir==1)dy=2;//down
                    else if(dir==2)dx=-2;//left
                    else dy=-2;//up
                    if(this.tiles[x+dx][y+dy]==this.TILE.WALL1 || this.tiles[x+dx][y+dy]==this.TILE.WALL2){//checks to see if new path is valid
                        ok = true;
                        break;
                    }
                }
                //randomizes new x and y location
                if(!ok){
                    for(var i=0; i<1000; i++){
                        x=4+Math.floor(Math.random()*(this.tiles.length-8)/2)*2;
                        y=4+Math.floor(Math.random()*(this.tiles[0].length-8)/2)*2;
                        if(this.tiles[x][y]==this.TILE.FLOOR1){ //checks if good amount of floors
                            i += 100;
                            ok = true;
                        }
                    }
                }
                if(!ok){
                    for(var i=0; i<100; i++){
                        x=4+Math.floor(Math.random()*(this.tiles.length-8)/2)*2;
                        y=4+Math.floor(Math.random()*(this.tiles[0].length-8)/2)*2;
                        if(this.tiles[x][y]==this.TILE.WALL1 || this.tiles[x][y]==this.TILE.WALL2){//checks for walls
                            ok = true;
                            break;
                        }
                    }
                }
                if(!ok) break;//still for some reason not good, no more paths
            }
        }
        //makes sure outer most tiles are walls
        for(var i=0; i < this.tiles.length; i++){
            this.tiles[i][0] = this.TILE.WALL1;
            this.tiles[i][this.tiles[0].length-1] = this.TILE.WALL1;
        }
        for(var i=0; i < this.tiles[0].length; i++){
            this.tiles[0][i] = this.TILE.WALL1;
            this.tiles[this.tiles.length-1][i] = this.TILE.WALL1;
        }
    }
    
    this.removeDeadends = function(amount) {
         for(var n=0; n < amount; n++){//how many times it needs to remove path segments
            for(var i=1; i < this.tiles.length-1; i++){
                for(var j=1; j < this.tiles[0].length-1; j++){
                    if(this.tiles[i][j] == this.TILE.CLOSE_LOCKED_DOOR || this.tiles[i][j] == this.TILE.CLOSE_UNLOCKED_DOOR || this.tiles[i][j] == this.TILE.OPEN_DOOR){//if the tile it is on is a door
                        if(this.getNumOfTileAround(i,j,this.TILE.WALL1) + this.getNumOfTileAround(i,j,this.TILE.WALL2) > 2) {this.tiles[i][j] = this.TILE.WALL2;}//door is at the end of a corridor that doesnt lead anywhere
                    }
                    if(this.tiles[i][j] == this.TILE.FLOOR1){//if the tile is a floor
                        if(this.getNumOfTileAround(i,j,this.TILE.WALL1) + this.getNumOfTileAround(i,j,this.TILE.WALL2) > 2){this.tiles[i][j] = this.TILE.WALL2;}//end of a corridor
                    }
                }
            }
        }
        //add doors to end of paths that conenct to other rooms or corridors
        for(var i=1; i < this.tiles.length-1; i++){
            for(var j=1; j < this.tiles[0].length-1; j++){
                if(this.tiles[i][j] == this.TILE.FLOOR1){//if a tile is a floor
                    if(this.getNumOfTileAround(i,j,this.TILE.FLOOR1) == 1){//only one neighbor floor tile aka current tile is a dead end
                        if(this.tiles[i-1][j] == this.TILE.WALL1 || this.tiles[i-1][j] == this.TILE.WALL2){
                            if(i-1 >= 1){//not a border wall to left
                                var xx = i-1;
                                var yy = j;
                                if(this.getNumOfTileAround(xx,yy,this.TILE.FLOOR1) > 1 && Math.random() >= .3){
                                    if(Math.random() <= this.doorRatio) { this.tiles[xx][yy]=this.TILE.CLOSE_LOCKED_DOOR; }//sets tile at location to door
                                    else{ this.tiles[xx][yy]=this.TILE.CLOSE_UNLOCKED_DOOR; }
                                }
                            }
                        }
                        if(this.tiles[i+1][j] == this.TILE.WALL1 || this.tiles[i+1][j] == this.TILE.WALL2){
                            if(i+1 <= this.tiles.length-1){
                                var xx = i+1;
                                var yy = j;
                                if(this.getNumOfTileAround(xx,yy,this.TILE.FLOOR1) > 1 && Math.random() >= .3){
                                    if(Math.random() <= this.doorRatio) { this.tiles[xx][yy]=this.TILE.CLOSE_LOCKED_DOOR; }//sets tile at location to door
                                    else{ this.tiles[xx][yy]=this.TILE.CLOSE_UNLOCKED_DOOR; }
                                }
                            }
                        }
                        if(this.tiles[i][j-1] == this.TILE.WALL1 || this.tiles[i][j-1] == this.TILE.WALL2){
                            if(j-1>=1){
                                var xx = i;
                                var yy = j-1;
                                if(this.getNumOfTileAround(xx,yy,this.TILE.FLOOR1) > 1 && Math.random() >= .3){
                                    if(Math.random() <= this.doorRatio) { this.tiles[xx][yy]=this.TILE.CLOSE_LOCKED_DOOR; }//sets tile at location to door
                                    else{ this.tiles[xx][yy]=this.TILE.CLOSE_UNLOCKED_DOOR; }
                                }
                            }
                        }
                        if(this.tiles[i][j+1] == this.TILE.WALL1 || this.tiles[i][j+1] == this.TILE.WALL2){
                            if(j+1 <= this.tiles[0].length-1){
                                var xx = i;
                                var yy = j+1;
                                if(this.getNumOfTileAround(xx,yy,this.TILE.FLOOR1) > 1 && Math.random() >= .3){
                                    if(Math.random() <= this.doorRatio) { this.tiles[xx][yy]=this.TILE.CLOSE_LOCKED_DOOR; }//sets tile at location to door
                                    else{ this.tiles[xx][yy]=this.TILE.CLOSE_UNLOCKED_DOOR; }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    this.addRandomDoors = function() {//adds random doors to corridors
        for(var i=0; i<200; i++){
            var x=1+Math.floor(Math.random()*(this.tiles.length-2));
            var y=1+Math.floor(Math.random()*(this.tiles[0].length-2));
            var f = 0;
            if (this.getNumOfTileAround(x,y,this.TILE.CLOSE_LOCKED_DOOR) + this.getNumOfTileAround(x,y,this.TILE.CLOSE_UNLOCKED_DOOR) <= 0) {//check to see if there are already doors
                if (this.tiles[x - 1][y] == this.TILE.FLOOR1 && this.tiles[x + 1][y] == this.TILE.FLOOR1) {//if corridor is going verticle
                    if (this.tiles[x][y - 1] != this.TILE.FLOOR1 && this.tiles[x][y + 1] != this.TILE.FLOOR1) {//tiles to left and right not floors
                        f++;
                    }
                }
                if (this.tiles[x][y - 1] == this.TILE.FLOOR1 && this.tiles[x][y + 1] == this.TILE.FLOOR1) {//if corridor is going horizontal
                    if (this.tiles[x - 1][y] != this.TILE.FLOOR1 && this.tiles[x + 1][y] != this.TILE.FLOOR1) {//tiles top and bottom not floor
                        f++;
                    }
                }
                if (this.tiles[x][y] == this.TILE.FLOOR1 && f == 1) {//if floor
                    if(Math.random() <= this.doorRatio) { this.tiles[x][y]=this.TILE.CLOSE_LOCKED_DOOR; }//sets tile at location to door
                    else{ this.tiles[x][y]=this.TILE.CLOSE_UNLOCKED_DOOR; }
                    i += 15;
                }
            }
        }
    }
    
    this.generateStairs = function() {
        var x = 0, y = 0;
        var ok = false;
        while(!ok){//creates the up stairs
            x = Math.floor(Math.random() * this.tiles.length);
            y = Math.floor(Math.random() * this.tiles[0].length);
            if(this.tiles[x][y] == this.TILE.FLOOR1){
                this.tiles[x][y] = this.TILE.UP_STAIR;
                ok = true;
            }
        }
        //this.reachable = new boolean[tiles.length][tiles[0].length];
        this.reachable[x][y] = true;
        for(var n = 0; n < 20; n++){//figures out what spots the up stair can be put
            for(var i = 1; i < this.tiles.length; i++){ //left to right
                for(var j = 1; j < this.tiles[0].length; j++){//top to bottom
                    if(this.tiles[i][j] != this.TILE.WALL1 && this.tiles[i][j] != this.TILE.WALL2){//not a wall
                        if(this.reachable[i-1][j])this.reachable[i][j] = true;//if left neigbor is reachable
                        if(this.reachable[i][j-1])this.reachable[i][j] = true;//if top neigbor is reachable
                    }
                }
            }
            for(var i = this.tiles.length-2; i >= 0; i--){//right to left
                for(var j = this.tiles[0].length-2; j >= 0; j--){//bottom to top
                    if(this.tiles[i][j] != this.TILE.WALL1 && this.tiles[i][j] != this.TILE.WALL2){//not a wall
                    if(this.reachable[i+1][j])this.reachable[i][j] = true;//if right neigbor is reachable
                    if(this.reachable[i][j+1])this.reachable[i][j] = true;//if bottom neigbor is reachable
                    }
                }
            }
        }
        ok = false;
        while(!ok){//figures out what spot the down stairs can be put
            x=Math.floor(Math.random() * this.tiles.length);
            y=Math.floor(Math.random() * this.tiles[0].length);
            if(this.tiles[x][y] == this.TILE.FLOOR1){//if a floor tile
                if(this.reachable[x][y]){//if reachable
                    this.tiles[x][y]=this.TILE.DOWN_STAIR;
                    ok = true;
                }
            }
        }
    }
    
    this.removeBorder = function() {//makes sure nothing get out
        for (var i = 0; i < this.tiles.length; i++) {
            for (var j = 0; j < this.tiles[0].length; j++) {
                if (i == 0 || i == this.tiles[0]-1 || j == 0 || j == this.tiles[0]-1) {
                    this.tiles[i][j] = this.TILE.WALL1;//wall
                }
            }
        }
    }
    
    this.changeWall = function(amount) {
        for (var i = 1; i < this.tiles.length - 1; i++) {
            for (var j = 1; j < this.tiles[0].length - 1; j++) {
                if (this.tiles[i][j] == this.TILE.WALL1) {//if a normal wall
                    if(this.getNumOfTileAround(i,j,this.TILE.FLOOR1) >= 4){//lone walls get turned into floor
                        this.tiles[i][j] = this.TILE.FLOOR1;
                    }
                    else if(Math.random()*100 <= amount){//above the chance
                        this.tiles[i][j] = this.TILE.WALL2;
                    }
                }
            }
        }
    }
    
    this.getNumOfTileAround = function(centerX, centerY, tileType){//checks the tiles around center tile to see if they are of tile type tileType
        var w = 0;
        if(this.tiles[centerX - 1][centerY] == tileType)w++;//left
        if(this.tiles[centerX + 1][centerY] == tileType)w++;//right
        if(this.tiles[centerX][centerY - 1] == tileType)w++;//up
        if(this.tiles[centerX][centerY + 1] == tileType)w++;//down
        return w;
    }
    
    this.generateEnemy = function(eID, xPos, yPos) { //makes enemy at location
        var newEnemy = new Enemy();
        newEnemy.setupEnemy(xPos, yPos, eID);
        this.enemies[xPos][yPos] = newEnemy;
    }
    
    this.generateSingleEnemy = function(eID){//makes and places a singular enemy
        var testAmount = 200;
        var xPos = 0;
        var yPos = 0;
        do{
            xPos = 2 + Math.floor(Math.random() * (this.tiles.length-4));
            yPos = 2 + Math.floor(Math.random() * (this.tiles[0].length-4));
            if(this.tiles[xPos][yPos] == 0 && !this.isSolid(xPos, yPos)){//a valid location //want to work on
                if(this.enemies[xPos][yPos] == undefined && xPos != player.x && yPos != player.y){
                    this.generateEnemy(eID, xPos, yPos);
                    break;
                }
            }
            testAmount--;
        }while(testAmount > 0);
    }
    
    this.generateEnemies = function(iterations){//generate enemies on the level
        if(iterations <= 0){return;}//no enemies will appear in level
        var tries = 200;
        while(this.getTotalEnemies() < this.level + 1 && tries > 0){//make sure there are at least some enemies
            for(var i = 0; i < iterations; i++){//iterate to create enemies
                if(this.enemyProbability[i % this.enemyProbability.length] > Math.random() * 100){ //check chance of creating enemy
                    this.generateSingleEnemy(i % this.enemyProbability.length);
                }
            }
            tries--;
        }
    }
    
    this.addRandomItems = function(){
        var x;
        var y;
        var n = Math.floor(Math.random()*3);
        //add a book/medikit or two
        for(var i = 0; i<n;){
            x=2+Math.floor(Math.random()*(this.tiles.length-4));
            y=2+Math.floor(Math.random()*(this.tiles[0].length-4));
            if(!this.isSolid(x, y)){
                //var newBook = new Item();
                //newBook.setupBook(x,y,Math.floor(Math.random()*8));
                //this.items[x][y] = newBook;
                this.createWorldItem(x,y,ITEM.BOOKS,Math.floor(Math.random()*8));
                i++;
            }
        }
        //add some random scrolls
        for (var i = 0; i < 1 + Math.floor(Math.random() * 2);) {
            x = 2 + Math.floor (Math.random() * (this.tiles.length-4));
            y = 2 + Math.floor (Math.random() * (this.tiles[0].length-4));
            if (!this.isSolid(x, y)) {
                //var newScroll = new Scroll();
                //newScroll.setupScroll(x, y, Math.floor(Math.random() * scrollName.length));
                //this.items[x][y] = newScroll;
                this.createWorldItem(x,y,ITEM.SCROLLS,Math.floor(Math.random() * scrollName.length));
                i++;
            }
        }
        //add armor(the higher the level, the better the armor, maybe?)
        for (var i = 0; i < 2;) {//add 2 armors to each map
            x = 2 + Math.floor(Math.random() * (this.tiles.length-4));
            y = 2 + Math.floor(Math.random() * (this.tiles[0].length-4));
            if (!this.isSolid(x, y)) {
                var id = Math.floor(Math.random() * (this.level / 3 + 1)) % armorName.length;
                //var newArmor = new Armor();
                //newArmor.setupArmor(x, y, id);
                //this.items[x][y] = newArmor;
                this.createWorldItem(x,y,ITEM.ARMORS,id);
                i++;
            }
        }
        //add some random weapons
        for (var i = 0; i < 4;) {//add 4 weapons to the map
            x = 2 + Math.floor(Math.random() * (this.tiles.length-4));
            y = 2 + Math.floor(Math.random() * (this.tiles[0].length-4));
            while(this.isSolid(x, y)){
                x = 2 + Math.floor(Math.random() * (this.tiles.length-4));
                y = 2 + Math.floor(Math.random() * (this.tiles[0].length-4));
            }
            var id = Math.floor (Math.random() * 100) % weaponName.length;
            while (weaponDamage[id] > this.level / 2 + 2) {//weapons are not too strong
                id = Math.floor (Math.random() * 100) % weaponName.length;
            }
            //var newWeapon = new Weapon();
            //newWeapon.setupWeapon(x, y, id);
            //this.items[x][y] = newWeapon;
            this.createWorldItem(x,y,ITEM.WEAPONS,id);
            i++;
        }
        
        //if the floor is deep enough, add some rare weapons
        if (this.level > 10) {
            for (var i = 0; i < (this.level - 9);) {
                x = 2 + Math.floor (Math.random() * (this.tiles.length-4));
                y = 2 + Math.floor (Math.random() * (this.tiles[0].length-4));
                if (!this.isSolid(x, y)) {
                    var id = Math.floor(15 + Math.random() * 8) % Weapon.weaponName.length;
                    //var newWeapon = new Weapon();
                    //newWeapon.setupWeapon(x, y, id);
                    //this.items[x][y] = newWeapon;
                    this.createWorldItem(x,y,ITEM.WEAPONS,id);
                    i++;
                }
            }
        }
    }
    
    ///Floor Utilities///
    
    this.calculateVisible = function(){//calculates the spaces the player can see
         for (var i = 0; i < this.floorWidth; i++) {//resets visible
             for (var j = 0; j < this.floorLength; j++) {
                 this.visible[i][j] = false;
             }
         }
        var x1 = Math.max(0, player.x - 4);
        var x2 = Math.min(map.tiles[0].length, player.x + 4);
        var y1 = Math.max(0, player.y - 4);
        var y2 = Math.min(map.tiles[0].length, player.y + 4);
        var line = new Phaser.Line();
        var coordsOnLine = new Array();
        console.log(player.x + " : " + player.y);
        for(var i = x1; i<= x2; i++){
            for(var j = y1; j <= y2; j++){
                if(i == x1 || i == x2 || j == y1 || j == y2){//if an edge tile
                    
                    line.start.set(player.x, player.y);
                    line.end.set(i,j);
                    coordsOnLine = new Array();
                    line.coordinatesOnLine(1, coordsOnLine);//gets all the tiles that are getting touched
                    //console.log(coordsOnLine);
                    for(var g = 0; g < coordsOnLine.length; g++){//expanse out from the player
                        if(this.isSolid(coordsOnLine[g][0], coordsOnLine[g][1])){//a solid block
                            this.visible[coordsOnLine[g][0]][coordsOnLine[g][1]] = true;
                            this.mapped[coordsOnLine[g][0]][coordsOnLine[g][1]] = true;
                            break;
                        }
                        else{//anything else
                            this.visible[coordsOnLine[g][0]][coordsOnLine[g][1]] = true;
                            this.mapped[coordsOnLine[g][0]][coordsOnLine[g][1]] = true;
                        }
                    }
                }
            }
        }
        console.log(this.visible);
    }
    
    this.setDistanceToPlayer = function(maxDistance){//calculates how far a tile is from the player
        this.distToPlayer = new Array();
        for (var i = 0; i < this.tiles.length; i++) {
            this.distToPlayer[i] = new Array();
            for (var j = 0; j < this.tiles[0].length; j++) {
                this.distToPlayer[i][j] = 999;
            }
        }
        this.distToPlayer[player.x][player.y] = 1;
        for (var n = 0; n < maxDistance; n++) {
            for (var i = 1; i < map.tiles.length-1; i++) {
                for (var j = 1; j < map.tiles[0].length-1; j++) {
                    var minDist = this.distToPlayer[i][j];
                    if (!this.isSolid(i, j) && this.distToPlayer[i + 1][j] < minDist) {
                        minDist = this.distToPlayer[i + 1][j];
                    }
                    if (!this.isSolid(i, j) && this.distToPlayer[i - 1][j] < minDist) {
                        minDist = this.distToPlayer[i - 1][j];
                    }
                    if (!this.isSolid(i, j) && this.distToPlayer[i][j + 1] < minDist) {
                        minDist = this.distToPlayer[i][j + 1];
                    }
                    if (!this.isSolid(i, j) && this.distToPlayer[i][j - 1] < minDist) {
                        minDist = this.distToPlayer[i][j - 1];
                    }

                    if (minDist < this.distToPlayer[i][j]) {
                        this.distToPlayer[i][j] = minDist + 1;
                    }
                }
            }
        }
    }
    
    this.updateEnemyStatus = function(){//updates the status of enemies
        for (var i = 0; i < this.tiles.length; i++) {
            for (var j = 0; j < this.tiles[0].length; j++) {
                if (this.enemies[i][j] != undefined) {//tile not empty
                    var e1 = this.enemies[i][j];
                    if (e1.hp <= 0) {//enemy is dead
                        consolePrint("You slayed a " + e1.name + ". " +"+"+(unitHP[e1.ID]+player.luck/2)+"xp");
                        this.dropItem(i,j,e1.ID);
                        player.addXP(unitHP[e1.ID]);
                        this.enemies[i][j] = undefined;
                    } else if (e1.x != i || e1.y != j) {//enemy moved
                        if (this.enemies[e1.x][e1.y] == undefined) {
                            this.enemies[e1.x][e1.y] = e1;
                            this.enemies[i][j] = undefined;
                        } else {
                            e1.x = i;
                            e1.y = j;
                        }
                    }
                }
            }
        }
    }
    
    this.getTotalEnemies = function(){
        var total = 0;
        for(var i = 0; i<this.tiles.length;i++){
            for(var j = 0; j<this.tiles[0].length;j++){
                if(!this.isSolid(i,j)){
                    if(this.enemies[i][j]!=undefined){
                        total++;
                    }
                }
            }
        }
        return total;
    }
    
    this.dropItem = function(xPos, yPos, eID){//enemy dies, has chance of dropping item
        if(Math.random()*10 < 9){//enemy drops item
            if(eID == UNIT.GUARD && Math.random() > 0.4){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.RANGED_TAZOR);}
            else if(eID == UNIT.SOLDIER && Math.random() > 0.6){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.COMBAT_KNIFE);}
            else if(eID == UNIT.MARINE && Math.random() > 0.6){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.SHOTGUN);}
            else if(eID == UNIT.ADVANCED_MARINE && Math.random() > 0.65){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.RIFLE);}
            
            else if(eID == UNIT.DRONE && Math.random() > 0.4){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.PLASMA_PISTOL);}
            else if(eID == UNIT.ARMORED_DRONE && Math.random() > 0.6){
                this.createWorldItem(xPos, yPos, ITEM.ARMORS, ARMOR.METAL);}
            else if(eID == UNIT.ATTACK_DRONE && Math.random() > 0.65){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.LASER_RIFLE);}
            else if(eID == UNIT.SCOUT_DRONE && Math.random() > 0.4){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.LIGHT_WAVE_EMITTER);}
            else if(eID == UNIT.TURRET && Math.random() > 0.9){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.SNIPER_RIFLE);}
            
            else if(eID == UNIT.CYBORG && Math.random() > 0.65){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.PLASMA_RIFLE);}
            else if(eID == UNIT.AUGMENT && Math.random() > 0.7){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.PLASMA_BLADE);}
            else if(eID == UNIT.ZOMBIE && Math.random() > 0.98){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.ALIEN_BLASTER);}
            
            else if(eID == UNIT.CAPTAIN){
                this.createWorldItem(xPos, yPos, ITEM.ARMORS, ARMOR.COMBAT);}
            else if(eID == UNIT.GENERAL){
                this.createWorldItem(xPos, yPos, ITEM.WEAPONS, WEAPON.THAT_GUN);}
            else if(eID == UNIT.CRYSTAL_GUARD){
                this.createWorldItem(xPos, yPos, ITEM.ARMORS, ARMOR.OMEGA_CRYSTAL);}
        }
        else{//enemy drops medpack
            this.createWorldItem(xPos, yPos, ITEM.BOOKS, BOOK.MEDIKIT);
        }
    }
    
    this.createWorldItem = function(xPos, yPos, itemType, itemID){//create new item
        var newItem = undefined;
        switch(itemType){
            case ITEM.WEAPONS :
                newItem = new Weapon();
                newItem.setupWeapon(xPos, yPos, itemID);
                break;
            case ITEM.ARMORS :
                newItem = new Armor();
                newItem.setupArmor(xPos, yPos, itemID);
                break;
            case ITEM.SCROLLS :
                newItem = new Scroll();
                newItem.setupScroll(xPos, yPos, itemID);
                break;
            case ITEM.BOOKS :
                newItem = new Item();
                newItem.setupBook(xPos, yPos, itemID);
                break;
        }
        
        this.items[xPos][yPos] = newItem;
    }
    
    ///Player related functions///
    
    this.isSolidType = function(tileType){//checks to see if player can move on tile
        if (tileType === this.TILE.WALL1 || tileType === this.TILE.WALL2 || tileType === this.TILE.CLOSE_LOCKED_DOOR || tileType === this.TILE.CLOSE_UNLOCKED_DOOR) {//solid tile
            return true;
        } else {//player can move through tile
            return false;
        }
    }
    
    this.isSolid = function(xPos, yPos){//checks to see if player can move on tile
        if (xPos >= 0 && xPos < this.tiles.length && yPos >= 0 && yPos < this.tiles[0].length) {//within bounds of map
            return this.isSolidType(this.tiles[xPos][yPos]);
        } else {//outside bounds so is solid
            return true;
        }
    }
    
    this.openDoor = function(xPos, yPos){//called by player to open a door
        if(this.tiles[xPos][yPos] == this.TILE.CLOSE_UNLOCKED_DOOR){
             this.tiles[xPos][yPos] = this.TILE.OPEN_DOOR;
            changeState(STATE.UPDATE);
        }
        else if(this.tiles[xPos][yPos] == this.TILE.CLOSE_LOCKED_DOOR){
            if(Math.random() * 100 < 40 + (player.luck*2) + player.strength){//lockpicking
                this.tiles[xPos][yPos] = this.TILE.OPEN_DOOR;
                if(Math.random() * 100 < 10 + player.luck){
                    player.addXP(2);
                    consolePrint("The door opens. +2 xp")
                }
                else{
                    player.addXP(1);
                    consolePrint("The door opens. +1 xp");
                }
            }
            else{//door doesnt budge
                consolePrint("The door won't budge");
            }
            changeState(STATE.UPDATE);
        }
    }
    
    this.closeDoor = function(xPos, yPos){//close a open door
        if(this.tiles[xPos][yPos] == this.TILE.OPEN_DOOR && this.enemies[xPos][yPos] == undefined){
            this.tiles[xPos][yPos] = this.TILE.CLOSE_UNLOCKED_DOOR;
            if(this.items[xPos][yPos] != undefined){
                this.items[xPos][yPos] = undefined;
                consolePrint("The closing door crushed something"); 
            }
            else {
                consolePrint("You close the door");
            }
            changeState(STATE.UPDATE);
        }
    }
    
    this.playerToStairs = function(toUpStairs){//places player at up or down stairs tile
        for (var i = 0; i < this.tiles.length; i++) {
            for (var j = 0; j < this.tiles[0].length; j++) {
                if (toUpStairs === true && this.tiles[i][j] == this.TILE.UP_STAIR) {//if up stair
                    player.setupPlayer(i, j);
                }
                else if (toUpStairs === false && this.tiles[i][j] == this.TILE.DOWN_STAIR) {//if up stair
                    player.setupPlayer(i, j);
                }
            }
        }
        this.calculateVisible();
    }
    
    this.generateFromImage = function(mapName) //generates a level from a map
    {
        var bitmap = game.make.bitmapData(32,32);
        console.log(bitmap);
        bitmap.draw(mapName); //sets the image to the bitmap
        bitmap.update();
        this.clearTiles();
        for (var i = 0; i < bitmap.width; i++) {
            for(var j = 0; j < bitmap.height; j++){
                //this.tiles[i][j] = getTileFromColor(bitmap.getPixelRGB(i,j));
                let pixelRGB = bitmap.getPixelRGB(i,j);
                let r = pixelRGB.r;
                let g = pixelRGB.g;
                let b = pixelRGB.b;
                if (r == 0 && g == 0 && b == 0)
                { //black wall1
                    this.tiles[i][j] = this.TILE.WALL1;//wall
                    //System.out.println("POW");
                }
                else if (r == 128 && g == 128 && b == 128)
                { //grey wall2
                    this.tiles[i][j] = this.TILE.WALL2;//wall
                }
                else if (r == 0 && g == 128 && b == 0)
                { //dark green closed door
                    this.tiles[i][j] = this.TILE.CLOSE_LOCKED_DOOR;//closed door
                }
                else if (r == 128 && g == 255 && b == 128)
                { //light green open door
                    this.tiles[i][j] = this.TILE.OPEN_DOOR;//open door
                }
                else if (r == 128 && g == 0 && b == 0)
                { //dark red
                    this.tiles[i][j] = this.TILE.GREEN;//green stuff
                }
                else if (r == 255 && g == 0 && b == 255)
                { // light purple exit
                    this.tiles[i][j] = this.TILE.DOWN_STAIR;//down stair
                }
                else if (r == 128 && g == 255 && b == 255)
                { //light blue enterance and start postion
                    this.tiles[i][j] = this.TILE.UP_STAIR;//up stair
                }
                else if (r == 128 && g == 0 && b == 255)
                { //indigo Crystal 
                    this.tiles[i][j] = this.TILE.CRYSTAL;//crystal
                }
                else {
                    this.tiles[i][j] = this.TILE.FLOOR1;//floor
                }

                if (r == 0 && g == 0 && b == 128)
                { // dark blue guard
                    this.generateEnemy(UNIT.GUARD, i, j);
                }
                else if (r == 0 && g == 255 && b == 0)
                { //green soldier
                    this.generateEnemy(UNIT.SOLDIER, i, j);
                }
                else if (r == 0 && g == 0 && b == 255)
                { //blue marine
                    this.generateEnemy(UNIT.MARINE, i, j);
                }
                else if (r == 255 && g == 0 && b == 0)
                { //red advanced marine
                    this.generateEnemy(UNIT.ADVANCED_MARINE, i, j);
                }
                else if (r == 255 && g == 128 && b == 128)
                { //light red drone
                    this.generateEnemy(UNIT.DRONE, i, j);
                }
                else if (r == 255 && g == 255 && b == 0)
                { //yellow def drone
                    this.generateEnemy(UNIT.ARMORED_DRONE, i, j);
                }
                else if (r == 128 && g == 128 && b == 0)
                { //dark yellow attack drone
                    this.generateEnemy(UNIT.ATTACK_DRONE, i, j);
                }
                else if (r == 255 && g == 128 && b == 0)
                { //orange scout drone
                    this.generateEnemy(UNIT.SCOUT_DRONE, i, j);
                }
                else if (r == 255 && g == 0 && b == 128)
                { //dark pink cyborg
                    this.generateEnemy(UNIT.CYBORG, i, j);
                }
                else if (r == 128 && g == 128 && b == 255)
                { //light blue augments
                    this.generateEnemy(UNIT.AUGMENT, i, j);
                }
                else if (r == 128 && g == 0 && b == 128)
                { //purple zombie
                    this.generateEnemy(UNIT.ZOMBIE, i, j);
                }
                else if (r == 0 && g == 128 && b == 128)
                { // sea blue Captain 0merica
                    this.generateEnemy(UNIT.CAPTAIN, i, j);
                }
                else if (r == 0 && g == 255 && b == 128)
                { //light teal General 0liver
                    this.generateEnemy(UNIT.GENERAL, i, j);
                }
                else if (r == 0 && g == 255 && b == 255)
                { //teal Crystal Guard
                    this.generateEnemy(UNIT.CRYSTAL_GUARD, i, j);
                }
                
            }
        }
        console.log(this.tiles);
    }
    
    
    
}