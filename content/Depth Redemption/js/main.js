"use strict";

	//  properties
    var WIDTH = 360; //648 
    var HEIGHT = 216; //480
    var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '', {preload: preload, create: init, update: update}, false, false);

    var inputKeys = {
        KEY_LEFT : undefined, 
        KEY_UP : undefined, 
        KEY_RIGHT : undefined, 
        KEY_DOWN : undefined,
        KEY_SPACE : undefined,
        KEY_ENTER : undefined,
        KEY_ESC : undefined,
        W : undefined,
        A : undefined,
        S : undefined,
        D : undefined,
        E : undefined,
        F : undefined,
        I : undefined,
        Q : undefined,
        M : undefined
    };
    
    var state;//the current state of the game
    var STATE = {//the different states the game can be in
        MAIN_MENU : 0,
        UPDATE : 1,
        PLAYER_TURN : 2,
        MAP : 3,
        INVENTORY : 4,
        CLOSE : 5,
        GAME_OVER : 6,
        AIMING : 7,
        MAGIC : 8,
        CONSOLE : 9,
        WIN : 10
    };
    
    var mainMenu;
    var maps = [];//array of all the levels in the game
    var map;//current level the player is on
    var mapCounter = 0;
    var player;

    var windowViewX;
    var windowViewY;

    var menuText;//text displayed on main menu
    var charText; //text displaying player level, health, xp
    var invText; //text displayed when the inventory is open
    var consoleText; //text displayed about actions
    var consoleHistory;//list of past actions

    var textSet = "!\"#\$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

    var backMusic;
    var clickSound;
    //var player_anim;
    //var anim;
    
    function preload(){//assets that need to be loaded before hand
        game.load.image('font', 'Resources/smallfont.png');//font loading
        
        game.load.audio('background_music', "Resources/Background.mp3");
        game.load.audio('click_music', "Resources/Click.mp3");
        
        game.load.spritesheet('tileSet', 'Resources/tileset_strip12.png', 24, 24, 12);
        game.load.image('player', 'Resources/player.png', 24, 24);
        game.load.spritesheet('enemies', 'Resources/enemies_strip15.png', 24, 24, 15);
        game.load.spritesheet('weapons', 'Resources/weapons_strip23.png', 24, 24, 23);
        game.load.spritesheet('weapons_hold', 'Resources/weapons_holding_strip23.png', 24, 24, 23);
        game.load.spritesheet('armors','Resources/armor_strip8.png', 24, 24, 8);
        game.load.spritesheet('armors_wearing','Resources/armor_wearing_strip8.png', 24, 24, 8);
        game.load.spritesheet('scrolls','Resources/scrolls_strip11.png', 24, 24, 11);
        game.load.spritesheet('items','Resources/item_misc_strip8.png', 24, 24, 8);
        game.load.image('inventory', 'Resources/inventory.png', 96, 120);
        game.load.spritesheet('crosshairs', 'Resources/crosshair_strip5.png', 24, 24, 5);
        game.load.spritesheet('minimap_tiles', 'Resources/map_strip11.png', 5,5,11);
        
        //custom level
        game.load.image('level_5', 'Resources/level_5.bmp');
        game.load.image('level_10', 'Resources/level_10.bmp');
        game.load.image('level_15', 'Resources/level_15.bmp');
        
        Phaser.Canvas.setImageRenderingCrisp(game.canvas); //makes the game have no anti-alias
        game.scale.setUserScale(3,3,0,0); //scales game by 3
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;//uses custom scale for render window
        
        console.log('preload successul');
    }


    function init(){//things that need to be loaded once
        mainMenu = new Main_Menu();
        //map = new Floor();
        player = new Player();
        
        menuText = game.add.retroFont('font', 10, 12, textSet);//creating font
        charText = game.add.retroFont('font', 10, 12, textSet);//creating font
        invText = game.add.retroFont('font', 10, 12, textSet);//creating font
        consoleText = game.add.retroFont('font', 10, 12, textSet);//creating font
        
        mainMenu.setupMainMenu();
        
        mapCounter = 0;
        maps = [];
        
        for(var i = 0; i < 16; i++){
            maps[i] = new Floor();
            if(i == 4) { maps[i].generateFromImage('level_5'); }
            else if(i == 9) { maps[i].generateFromImage('level_10'); }
            else if(i == 14) { maps[i].generateFromImage('level_15'); }
            else { maps[i].generate(); }
            //[i].generate();
        } 
        
        map = maps[0];
        //map.generate();//generates map
        map.playerToStairs(true);
        
        consoleHistory = ["","","",""];//list of past actions
        
        keyActionsSetup();
        
        changeState(STATE.MAIN_MENU);
        
        windowViewX = player.x - 7;
        windowViewY = player.y - 4;
        
        //backMusic = game.add.audio('background_music');
        clickSound = game.add.audio('click_music');
        
        //backMusic.onStop.add(playBackground, this);
        
        //game.sound.setDecodedCallback([ backMusic, clickSound ], start, this);
        
        //backMusic.play();
        
        console.log('init successul');
    }
    
    function update(){//every frame update
        switch(state){
            case STATE.MAIN_MENU:
                break;
            case STATE.UPDATE:
                map.calculateVisible();
                map.setDistanceToPlayer(20);
                for (var i = 0; i < map.enemies.length; i++) {
                    for(var j = 0; j<map.enemies[i].length;j++){
                        if(map.enemies[i][j] != undefined){map.enemies[i][j].turn();}
                    }
                }
                map.updateEnemyStatus();
                changeState(STATE.PLAYER_TURN);
                break;
            case STATE.PLAYER_TURN:
                break;
            case STATE.MAP:
                break;
            case STATE.INVENTORY:
                break;
            case STATE.CLOSE:
                break;
            case STATE.GAME_OVER:
                var g = game.add.graphics(0,0);
                //backMusic.stop();
                g.beginFill('000000');
                g.drawRect(0,0,game.width, game.height);
                g.endFill();
                init();
                break;
            case STATE.AIMING:
                break;
            case STATE.MAGIC:
                break;
            case STATE.CONSOLE:
                break;
            case STATE.WIN:
                break;
            default:
                break;
        }
    }

    function changeState(newState){//happens before update
        state = newState;
        
        if(player.hp <= 0){//player is dead
            console.log("player is dead.");
            state = STATE.GAME_OVER;
        }
        
        game.input.keyboard.reset(true);//reset Controls
        
        switch(newState){
            case STATE.MAIN_MENU:
                inputKeys.W.onDown.add(function(){mainMenu.scrollUp();}, this);
                inputKeys.S.onDown.add(function(){mainMenu.scrollDown();}, this);
                inputKeys.E.onDown.add(function(){mainMenu.select()}, this);
                inputKeys.KEY_ENTER.onDown.add(function(){mainMenu.select()}, this);
                inputKeys.KEY_ESC.onDown.add(function(){mainMenu.changeMenu(MENU.MAIN);changeText(TEXT.MENU);}, this);
                break;
            case STATE.UPDATE:
                windowViewX = player.x - 7;
                windowViewY = player.y - 4;
                break;
            case STATE.PLAYER_TURN:
                drawMap();
                drawItems();
                drawEnemies();
                drawPlayer();
                changeText(TEXT.CHAR);
                changeText(TEXT.CONSOLE);
                
                inputKeys.A.onDown.add(function(){player.move(-1,0);}, this);
                inputKeys.D.onDown.add(function(){player.move(1,0);}, this);
                inputKeys.W.onDown.add(function(){player.move(0,-1);}, this);
                inputKeys.S.onDown.add(function(){player.move(0,1);}, this);
                inputKeys.E.onDown.add(function(){player.pickUpItem();}, this);
                inputKeys.F.onDown.add(function(){
                    changeState(STATE.AIMING);
                    drawTargetCrosshair();
                    consolePrint("You prepare");
                    changeText(TEXT.CONSOLE);}, this);
                inputKeys.I.onDown.add(function(){changeState(STATE.INVENTORY);}, this);
                inputKeys.Q.onDown.add(function(){
                    changeState(STATE.MAGIC);
                    drawScrollCrosshair();
                    consolePrint("You prepare the chip");
                    changeText(TEXT.CONSOLE);}, this);
                inputKeys.M.onDown.add(function(){changeState(STATE.MAP);}, this);
                break;
            case STATE.MAP:
                inputKeys.M.onDown.add(function(){changeState(STATE.PLAYER_TURN);}, this);
                drawMiniMap();
                break;
            case STATE.INVENTORY:
                inputKeys.A.onDown.add(function(){player.moveInv(-1,0);}, this);
                inputKeys.D.onDown.add(function(){player.moveInv(1,0);}, this);
                inputKeys.W.onDown.add(function(){player.moveInv(0,-1);}, this);
                inputKeys.S.onDown.add(function(){player.moveInv(0,1);}, this);
                inputKeys.E.onDown.add(function(){player.swapItem();}, this);
                inputKeys.I.onDown.add(function(){undrawInventory(); changeState(STATE.PLAYER_TURN);}, this);
                drawInventory();
                changeText(TEXT.INV);
                break;
            case STATE.CLOSE:
                break;
            case STATE.GAME_OVER:
                changeState(STATE.MAIN_MENU);
                break;
            case STATE.AIMING:
                player.resetTarget();
                inputKeys.A.onDown.add(function(){player.moveTarget(-1,0, false);}, this);
                inputKeys.D.onDown.add(function(){player.moveTarget(1,0, false);}, this);
                inputKeys.W.onDown.add(function(){player.moveTarget(0,-1, false);}, this);
                inputKeys.S.onDown.add(function(){player.moveTarget(0,1, false);}, this);
                inputKeys.E.onDown.add(function(){player.attackTarget();}, this);
                inputKeys.F.onDown.add(function(){
                    changeState(STATE.PLAYER_TURN);
                    consolePrint("You relax");
                    changeText(TEXT.CONSOLE);}, this);
                break;
            case STATE.MAGIC:
                player.resetTarget();
                inputKeys.Q.onDown.add(function(){
                    changeState(STATE.PLAYER_TURN);
                    consolePrint("You lower your chip");
                    changeText(TEXT.CONSOLE);}, this);
                inputKeys.A.onDown.add(function(){player.moveTarget(-1,0, true);}, this);
                inputKeys.D.onDown.add(function(){player.moveTarget(1,0, true);}, this);
                inputKeys.W.onDown.add(function(){player.moveTarget(0,-1, true);}, this);
                inputKeys.S.onDown.add(function(){player.moveTarget(0,1, true);}, this);
                inputKeys.E.onDown.add(function(){player.useScroll();}, this);
                break;
            case STATE.CONSOLE:
                break;
            case STATE.WIN:
                break;
            default:
                break;
        }
    }
    
    ///Input functions///
    function keyActionsSetup(){//setup keys to receive key inputs
        inputKeys.KEY_LEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        inputKeys.KEY_UP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        inputKeys.KEY_RIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        inputKeys.KEY_DOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        inputKeys.KEY_SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
        inputKeys.KEY_ENTER = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        inputKeys.KEY_ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        inputKeys.W = game.input.keyboard.addKey(Phaser.Keyboard.W);
        inputKeys.A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        inputKeys.S = game.input.keyboard.addKey(Phaser.Keyboard.S);
        inputKeys.D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        inputKeys.E = game.input.keyboard.addKey(Phaser.Keyboard.E);
        inputKeys.F = game.input.keyboard.addKey(Phaser.Keyboard.F);
        inputKeys.I = game.input.keyboard.addKey(Phaser.Keyboard.I);
        inputKeys.Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        inputKeys.M = game.input.keyboard.addKey(Phaser.Keyboard.M);
    }
    
    ///Drawing functions///
    function drawMap(){//takes every tile in the map and displays it
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 9; j++) {
                if(i + windowViewX > 0 && i + windowViewX < map.tiles.length && j + windowViewY > 0 && j + windowViewY <  map.tiles[0].length){//within view area
                    if(map.mapped[i + windowViewX][j + windowViewY] == true){
                        game.add.sprite(i*24,j*24,'tileSet', map.tiles[i + windowViewX][j + windowViewY]);
                        if(map.visible[i + windowViewX][j + windowViewY] == false){//with in 
                            game.add.sprite(i*24,j*24,'tileSet', map.TILE.FADEOUT);
                        }
                    }
                    else{//not seen yet
                     game.add.sprite(i*24,j*24,'tileSet', map.TILE.BLACK);
                    }
                }
                else{//outside map
                     game.add.sprite(i*24,j*24,'tileSet', map.TILE.BLACK);
                }
            }
        }
    }

    function drawTile(xPos, yPos){//draws tile at location
        game.add.sprite(xPos * 24, yPos * 24,'tileSet', map.tiles[xPos][yPos]);
    }
    
    function drawAllonTile(xPos, yPos){
        var offX = (xPos - windowViewX);
        var offY = (yPos - windowViewY);
        game.add.sprite(offX * 24, offY * 24,'tileSet', map.tiles[xPos][yPos]);
        if(map.items[xPos][yPos] != undefined)//items
            {
                drawItem(offX, offY, map.items[xPos][yPos].itemType, map.items[xPos][yPos].ID);
            }
        if(xPos == player.x && yPos == player.y){drawPlayer();}
        else if(map.enemies[xPos][yPos] != undefined)//enemies
            {
                game.add.sprite(offX*24,offY*24,'enemies',map.enemies[xPos][yPos].ID);
            }
        
    }
    
    function drawPlayer(){//draws player at locations
        //player_anim = game.add.sprite((player.x - windowViewX) * 24, (player.y - windowViewY) * 24,'player');
        game.add.sprite((player.x - windowViewX) * 24, (player.y - windowViewY) * 24,'player');
        //anim = player_anim.animations.add('walk');
        //anim.play(10, true);
        if(player.inventory[1][0] != undefined){//holding a weapon
            game.add.sprite((player.x - windowViewX) * 24, (player.y - windowViewY) * 24,'armors_wearing',player.inventory[1][0].ID);
        }
        if(player.inventory[0][0] != undefined){//holding a weapon
            game.add.sprite((player.x - windowViewX) * 24, (player.y - windowViewY) * 24,'weapons_hold',player.inventory[0][0].ID);
        }
    }

    function drawEnemies(){
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 9; j++) {
                if(i + windowViewX > 0 && i + windowViewX < map.tiles.length && j + windowViewY > 0 && j + windowViewY <  map.tiles[0].length){//within view area
                    if(map.enemies[i + windowViewX][j + windowViewY] != undefined)//enemies
                    {
                        if(map.visible[i + windowViewX][j + windowViewY] == true){//with in visibility
                            game.add.sprite(i*24,j*24,'enemies',map.enemies[i + windowViewX][j + windowViewY].ID);
                        }
                    }
                }
            }
        }
    }
    
    function drawItems(){
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 9; j++) {
                if(i + windowViewX > 0 && i + windowViewX < map.tiles.length && j + windowViewY > 0 && j + windowViewY <  map.tiles[0].length){//within view area
                    if(map.items[i + windowViewX][j + windowViewY] != undefined)//items
                    {
                        if(map.visible[i + windowViewX][j + windowViewY] == true){//with in visibility
                            drawItem(i, j, map.items[i + windowViewX][j + windowViewY].itemType, map.items[i + windowViewX][j + windowViewY].ID);
                        }
                    }
                }
            }
        }
    }

    function drawItem(xPos, yPos, type, iID){
            game.add.sprite(xPos*24,yPos*24,getItemDrawType(type), iID);
    }

    function drawInventory(){
        game.add.sprite(24, 24, 'inventory');//inventory background
        for(var i = 0; i < 4;i++){
            for(var j = 0; j < 5; j++){
                if(player.inventory[i][j] != undefined){//each item gets drawn
                    game.add.sprite((1 + i)*24,(1+j)*24,getItemDrawType(player.inventory[i][j].itemType), player.inventory[i][j].ID);
                }
            }
        }
        if(player.holding != undefined){//has item over that is being held
            game.add.sprite((1 + player.invX) * 24, (1 + player.invY) * 24, getItemDrawType(player.holding.itemType), player.holding.ID);
        }
        game.add.sprite((1 + player.invX) * 24, (1 + player.invY) * 24, 'crosshairs', 2);//crosshairs
        //changeText(TEXT.INV);
    }

    function undrawInventory(){
        for (var i = 1; i < 8; i++) {
            for (var j = 1; j < 6; j++) {
                if(i + windowViewX > 0 && i + windowViewX < map.tiles.length && j + windowViewY > 0 && j + windowViewY <  map.tiles[0].length){//within view area
                    game.add.sprite(i*24,j*24,'tileSet', map.tiles[i + windowViewX][j + windowViewY]);
                    if(map.enemies[i + windowViewX][j + windowViewY] != undefined)//enemies under
                    {
                        game.add.sprite(i*24,j*24,'enemies',map.enemies[i + windowViewX][j + windowViewY].ID);
                    }
                    if(map.items[i + windowViewX][j + windowViewY] != undefined)//iteme under
                    {
                        game.add.sprite(i*24,j*24,getItemDrawType(map.items[i + windowViewX][j + windowViewY].itemType),map.items[i + windowViewX][j + windowViewY].ID);
                    }
                }
                else{//outside map
                     game.add.sprite(i*24,j*24,'tileSet', map.TILE.WALL1);
                }
                drawPlayer();
                
            }
        }
        
    }

    function drawHolding(){
        game.add.sprite((1 + player.invX) * 24, (1 + player.invY) * 24, getItemDrawType(player.holding.itemType), player.holding.ID);
    }

    function getItemDrawType(type){//helper function
        switch(type){
            case ITEM.WEAPONS:
                return 'weapons';
            case ITEM.ARMORS:
                return 'armors';
            case ITEM.SCROLLS:
                return 'scrolls';
            case ITEM.BOOKS:
                return 'items';
            default:
                break;
        }
    }

    function drawTargetCrosshair(){
        game.add.sprite((player.targetX - windowViewX) * 24, (player.targetY - windowViewY) * 24, 'crosshairs', 0);//crosshairs
    }

    function drawScrollCrosshair(){
        game.add.sprite((player.targetX - windowViewX) * 24, (player.targetY - windowViewY) * 24, 'crosshairs', 3);//crosshairs
    }

    function drawMiniMap(){
        for(let i = 0; i < map.tiles.length; i++){
            for(let j = 0; j < map.tiles[0].length; j++){
                if(map.mapped[i][j]){ game.add.sprite(i * 5, j * 5, 'minimap_tiles', map.tiles[i][j]); }
                //game.add.sprite(i * 5, j * 5, 'minimap_tiles', map.tiles[i][j]);
                else { game.add.sprite(i * 5, j * 5, 'minimap_tiles', 6); }
            }   
        }
        game.add.sprite(player.x * 5, player.y * 5, 'minimap_tiles', 10);
    }

    ///text functions///

    function consolePrint(text){
        consoleHistory[3] = consoleHistory[2];
        consoleHistory[2] = consoleHistory[1];
        consoleHistory[1] = consoleHistory[0];
        consoleHistory[0] = text;
        //changeText(TEXT.CONSOLE);
    }

    function changeText(textBox){//draw the text the canvas
        var text = "";
        switch(textBox){
            case TEXT.MENU:
                for(var i = 0; i < mainMenu.display.length; i++){//puts input strings together
                    if(i == mainMenu.selected){text+= "> " + mainMenu.display[i] + "\n";}
                    else{text+= "  " + mainMenu.display[i] + "\n";}
                }
                menuText.setText(text, true, 0, 8, Phaser.RetroFont.ALIGN_LEFT);
                game.add.image(24,24, menuText);
                break;
            case TEXT.CHAR:
                charText.setText("F" + (mapCounter + 1) + " LV" + player.level + " HP:" + player.hp + "/" + player.hpMax + " XP:" + player.xp + "/" + player.xpMax, true, 0, 0, Phaser.RetroFont.ALIGN_LEFT);
                game.add.image(2,0, charText);
                break;
            case TEXT.INV:
                text += "Str: " + player.strength + "\n";
                text += "Per: " + player.perception + "\n";
                text += "End: " + player.endurance + "\n";
                text += "Cha: " + player.charisma + "\n";
                text += "Int: " + player.intelligence + "\n";
                text += "Agi: " + player.agility + "\n";
                text += "Lck: " + player.luck + "\n";
                invText.setText(text, true, 0, 1, Phaser.RetroFont.ALIGN_LEFT);
                game.add.image(126,24, invText);
                break;
            case TEXT.CONSOLE:
                for(var i = 3; i >= 0; i--){//puts input strings together
                    text += consoleHistory[i] + "\n";
                }
                consoleText.setText(text, true, 0, 0, Phaser.RetroFont.ALIGN_LEFT);
                game.add.image(2,168, consoleText);
                break;
        }
        
    }

    //music
    function playBackground(){
        backMusic.play();
    }
        
//TODO//
//X Main Menu
//X Rendering
//   X view window
//   X follow player
//   X scale up
//X 0 Turn structure
//X 1 Enemy
//   X 1.1 class
//   X 1.2 generation
//   X 1.3 Drop items
//X 2 player
//   X 2.1 stats
//   X 2.2 pick lock
//   X 2.3 scroll shot
//   X 2.4 close Doors
//   X 2.5 locked and unlocked doors
//
//X 4 Item
//   X 4.1 weapons
//   X 4.3 armor
//   X 4.5 scrolls
//   X 4.2 health packs
//   X 4.4 books
//X 3 inventory
//   X 3.1 drawing
//   X 3.2 picking and moving items
//   X 3.3 swopping items
//   X 3.4 garbage items
//   X 3.6 items effect spots
//   X 3.5 item pickups
//X 8 mini-map
//X 5 text output
//X 7 custom map reading
//6 map difficulty
//