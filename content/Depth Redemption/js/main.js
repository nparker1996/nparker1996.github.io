"use strict";

	//  properties
    var tSize = 24; //size of all tiles
    var WIDTH = tSize * 15; //648 
    var HEIGHT = tSize * 9; //480
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

    var renderOrder= [];
    var RENDER_LAYERS = {
        BACKGROUND: 0,
        TILES: 1,
        ITEMS : 2, 
        ENEMIES: 3,
        PLAYER: 4,
        PLAYER_ARMOR: 5,
        PLAYER_WEAPON: 6,
        FADEOUT: 7, //connect to camera
        CROSSHAIRS: 8, //connect to camera
        INVENTORY: 9, //connect to camera
        INVENTORY_ITEMS: 10,//connect to camera
        INVENTORY_ITEM_TARGETED:11,//connect to camera
        INVENTORY_TARGET: 12,//connect to camera
        TEXT: 13, //connect to camera
        MINI_MAP: 14, //connect to camera
        MINI_MAP_PLAYER: 15//connect to camera
    };

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
        
        game.load.spritesheet('tileSet', 'Resources/tileset_strip12.png', tSize, tSize, 12);
        game.load.image('player', 'Resources/player.png', tSize, tSize);
        game.load.spritesheet('enemies', 'Resources/enemies_strip15.png', tSize, tSize, 15);
        game.load.spritesheet('weapons', 'Resources/weapons_strip23.png', tSize, tSize, 23);
        game.load.spritesheet('weapons_hold', 'Resources/weapons_holding_strip23.png', tSize, tSize, 23);
        game.load.spritesheet('armors','Resources/armor_strip8.png', tSize, tSize, 8);
        game.load.spritesheet('armors_wearing','Resources/armor_wearing_strip8.png', tSize, tSize, 8);
        game.load.spritesheet('scrolls','Resources/scrolls_strip11.png', tSize, tSize, 11);
        game.load.spritesheet('items','Resources/item_misc_strip9.png', tSize, tSize, 9);
        game.load.image('inventory', 'Resources/inventory.png', 96, 120);
        game.load.spritesheet('crosshairs', 'Resources/crosshair_strip5.png', tSize, tSize, 5);
        game.load.spritesheet('minimap_tiles', 'Resources/map_strip11.png', 5,5,11);
        
        //custom level
        game.load.image('level_5', 'Resources/level_5.bmp');
        game.load.image('level_10', 'Resources/level_10.bmp');
        game.load.image('level_15', 'Resources/level_15.bmp');
        
        Phaser.Canvas.setImageRenderingCrisp(game.canvas); //makes the game have no anti-alias
        game.scale.setUserScale(3,3,0,0); //scales game by 3
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;//uses custom scale for render window
        
        game.camera.bounds = null;//camera can move anywhere
        
        for(let i = 0; i < 16; i++){
            renderOrder[i] = game.add.group();
        }
        renderOrder[RENDER_LAYERS.FADEOUT].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.CROSSHAIRS].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.INVENTORY].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.INVENTORY_ITEMS].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.INVENTORY_ITEM_TARGETED].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.INVENTORY_TARGET].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.TEXT].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.MINI_MAP].fixedToCamera = true;//connect to camera
        renderOrder[RENDER_LAYERS.MINI_MAP_PLAYER].fixedToCamera = true;//connect to camera
        
        //console.log(renderOrder);
        
        console.log('preload successul');
    }


    function init(){//things that need to be loaded once
        console.log(game.camera.x + " : " + game.camera.y);
        console.log(game.camera)
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
        
        for(var i = 0; i < 15; i++){
            maps[i] = new Floor();
            if(i == 4) { maps[i].generateFromImage('level_5'); }
            else if(i == 9) { maps[i].generateFromImage('level_10'); }
            else if(i == 14) { maps[i].generateFromImage('level_15'); }
            else { maps[i].generate(i); }
            //[i].generate();
        } 
        
        changeMap(0);
        //map.generate();//generates map
        map.playerToStairs(true);
        
        consoleHistory = ["","","",""];//list of past actions
        
        keyActionsSetup();
        
        setupRenderLayers();
        
        changeState(STATE.MAIN_MENU);
        
        windowViewX = player.x - 7;
        windowViewY = player.y - 4;
        
        //backMusic = game.add.audio('background_music');
        clickSound = game.add.audio('click_music');
        
        //backMusic.onStop.add(playBackground, this);
        
        //game.sound.setDecodedCallback([ backMusic, clickSound ], start, this);
        
        //backMusic.play();
        
        console.log('init successful');
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
                //backMusic.stop();
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
                game.camera.target = null;
                game.camera.setPosition(0,0);
                renderMap(false);
                renderPlayer(false);
                renderInventory(false);
                renderText(true, false, false, false);
                renderMiniMap(false);
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
                renderMap(true);
                renderPlayer(true);
                renderCrosshairs(false);
                renderInventory(false);
                renderText(false, true, false, true);
                renderMiniMap(false);
                drawMap();
                drawItems();
                drawEnemies();
                drawPlayer();
                game.camera.focusOnXY(renderOrder[RENDER_LAYERS.PLAYER].getChildAt(0).x + (tSize/2), renderOrder[RENDER_LAYERS.PLAYER].getChildAt(0).y + (tSize/2));
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
                renderMiniMap(true);
                inputKeys.M.onDown.add(function(){changeState(STATE.PLAYER_TURN);}, this);
                drawMiniMap();
                break;
            case STATE.INVENTORY:
                renderInventory(true);
                renderText(false, true, true, true);
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
                renderCrosshairs(true);
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
                renderCrosshairs(true);
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

    function changeMap(newMap){
        map = maps[newMap];
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

    function setupRenderLayers(){
        //background
        
        //player
        renderOrder[RENDER_LAYERS.PLAYER].removeAll(true);
        let p = game.add.sprite(player.x * tSize, player.y * tSize,'player');
        renderOrder[RENDER_LAYERS.PLAYER].addChild(p);
        
        //inventory
        renderOrder[RENDER_LAYERS.INVENTORY].removeAll(true);
        renderOrder[RENDER_LAYERS.INVENTORY].addChild(game.add.sprite(tSize, tSize, 'inventory'));//inventory background
        
        //text
        renderOrder[RENDER_LAYERS.TEXT].removeAll(true);
        renderOrder[RENDER_LAYERS.TEXT].addChild(game.add.image(24, 24, menuText));
        renderOrder[RENDER_LAYERS.TEXT].addChild(game.add.image(2, 0, charText));
        renderOrder[RENDER_LAYERS.TEXT].addChild(game.add.image(126,tSize, invText));
        renderOrder[RENDER_LAYERS.TEXT].addChild(game.add.image(2,168, consoleText));
        renderText(false,false,false,false);
    }

    function renderMap(render){
        renderOrder[RENDER_LAYERS.TILES].visible = render;
        renderOrder[RENDER_LAYERS.ITEMS].visible = render;
        renderOrder[RENDER_LAYERS.ENEMIES].visible = render;
        renderOrder[RENDER_LAYERS.FADEOUT].visible = render;
    }

    function renderPlayer(render){
        renderOrder[RENDER_LAYERS.PLAYER].getChildAt(0).visible = render;
        renderOrder[RENDER_LAYERS.PLAYER_ARMOR].visible = render;
        renderOrder[RENDER_LAYERS.PLAYER_WEAPON].visible = render;
     }

    function renderCrosshairs(render){
        renderOrder[RENDER_LAYERS.CROSSHAIRS].visible = render;
    }

    function renderInventory(render){
        renderOrder[RENDER_LAYERS.INVENTORY].visible = render;
        renderOrder[RENDER_LAYERS.INVENTORY_ITEMS].visible = render;
        renderOrder[RENDER_LAYERS.INVENTORY_ITEM_TARGETED].visible = render;
        renderOrder[RENDER_LAYERS.INVENTORY_TARGET].visible = render;
    }

    function renderText(menuText, charText, invText, conText){
        renderOrder[RENDER_LAYERS.TEXT].getChildAt(0).visible = menuText; //menu
        renderOrder[RENDER_LAYERS.TEXT].getChildAt(1).visible = charText; //character
        renderOrder[RENDER_LAYERS.TEXT].getChildAt(2).visible = invText; //inventory
        renderOrder[RENDER_LAYERS.TEXT].getChildAt(3).visible = conText; //console
    }

    function renderMiniMap(render){
        renderOrder[RENDER_LAYERS.MINI_MAP].visible = render;
        renderOrder[RENDER_LAYERS.MINI_MAP_PLAYER].visible = render;
    }


    function drawMap(){//takes every tile in the map and displays it
        renderOrder[RENDER_LAYERS.TILES].removeAll(true);
        renderOrder[RENDER_LAYERS.FADEOUT].removeAll(true);
        let iwvx = 0;
        let jwvy = 0;
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 9; j++) {
                iwvx = i + windowViewX;
                jwvy = j + windowViewY;
                if(iwvx > 0 && iwvx < map.tiles.length && jwvy > 0 && jwvy <  map.tiles[0].length){//within view area
                    if(map.mapped[iwvx][jwvy] == true){
                        renderOrder[RENDER_LAYERS.TILES].addChild(game.add.sprite(iwvx*tSize, jwvy*tSize, 'tileSet', map.tiles[iwvx][jwvy]));
                        if(map.visible[iwvx][jwvy] == false){//with in 
                             renderOrder[RENDER_LAYERS.FADEOUT].addChild(game.add.sprite(i*tSize, j*tSize, 'tileSet', map.TILE.FADEOUT));
                        }
                    }
                    else{//not seen yet
                     //game.add.sprite(i*tSize,j*tSize,'tileSet', map.TILE.BLACK);
                    }
                }
                else{//outside map
                     //game.add.sprite(i*tSize,j*tSize,'tileSet', map.TILE.BLACK);
                }
            }
        }
    }
    
    function drawAllonTile(xPos, yPos){
        var offX = (xPos - windowViewX);
        var offY = (yPos - windowViewY);
        //game.add.sprite(offX * tSize, offY * tSize,'tileSet', map.tiles[xPos][yPos]);
        if(map.items[xPos][yPos] != undefined)//items
            {
                drawItem(offX, offY, map.items[xPos][yPos].itemType, map.items[xPos][yPos].ID);
            }
        if(xPos == player.x && yPos == player.y){drawPlayer();}
        else if(map.enemies[xPos][yPos] != undefined)//enemies
            {
                //game.add.sprite(offX*tSize,offY*tSize,'enemies',map.enemies[xPos][yPos].ID);
            }
        
    }
    
    function drawPlayer(){//draws player at locations
        console.log(renderOrder);
        //player_anim = game.add.sprite((player.x - windowViewX) * tSize, (player.y - windowViewY) * tSize,'player');
        //game.add.sprite((player.x - windowViewX) * tSize, (player.y - windowViewY) * tSize,'player');
        renderOrder[RENDER_LAYERS.PLAYER].getChildAt(0).x = player.x * tSize;
        renderOrder[RENDER_LAYERS.PLAYER].getChildAt(0).y = player.y * tSize;
        //anim = player_anim.animations.add('walk');
        //anim.play(10, true);
        renderOrder[RENDER_LAYERS.PLAYER_ARMOR].removeAll(true);
        renderOrder[RENDER_LAYERS.PLAYER_WEAPON].removeAll(true);
        if(player.inventory[1][0] != undefined){//holding a armor
            renderOrder[RENDER_LAYERS.PLAYER_ARMOR].addChild(game.add.sprite(player.x * tSize, player.y * tSize, 'armors_wearing', player.inventory[1][0].ID));
        }
        if(player.inventory[0][0] != undefined){//holding a weapon
            renderOrder[RENDER_LAYERS.PLAYER_WEAPON].addChild(game.add.sprite(player.x * tSize, player.y * tSize, 'weapons_hold', player.inventory[0][0].ID));
        }
    }

    function drawEnemies(){
        renderOrder[RENDER_LAYERS.ENEMIES].removeAll(true);
        let iwvx = 0;
        let jwvy = 0;
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 9; j++) {
                iwvx = i + windowViewX;
                jwvy = j + windowViewY;
                if(iwvx > 0 && iwvx < map.tiles.length && jwvy > 0 && jwvy < map.tiles[0].length){//within view area
                    if(map.enemies[iwvx][jwvy] != undefined)//enemies
                    {
                        
                        if(map.visible[iwvx][jwvy] == true){//with in visibility
                            renderOrder[RENDER_LAYERS.ENEMIES].addChild(game.add.sprite(iwvx * tSize, jwvy * tSize, 'enemies', map.enemies[iwvx][jwvy].ID));
                        }
                    }
                }
            }
        }
    }
    
    function drawItems(){
        renderOrder[RENDER_LAYERS.ITEMS].removeAll(true);
        let iwvx = 0;
        let jwvy = 0;
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 9; j++) {
                iwvx = i + windowViewX;
                jwvy = j + windowViewY;
                if(iwvx > 0 && iwvx < map.tiles.length && jwvy > 0 && jwvy <  map.tiles[0].length){//within view area
                    if(map.items[iwvx][jwvy] != undefined)//items
                    {
                        if(map.visible[iwvx][jwvy] == true){//with in visibility
                            drawItem(iwvx, jwvy, map.items[iwvx][jwvy].itemType, map.items[iwvx][jwvy].ID);
                        }
                    }
                }
            }
        }
    }

    function drawItem(xPos, yPos, type, iID){
        renderOrder[RENDER_LAYERS.ITEMS].addChild(game.add.sprite(xPos*tSize,yPos*tSize, getItemDrawType(type), iID));
    }

    function drawInventory(){
        renderOrder[RENDER_LAYERS.INVENTORY_ITEMS].removeAll(true);
        for(var i = 0; i < 4;i++){
            for(var j = 0; j < 5; j++){
                if(player.inventory[i][j] != undefined){//each item gets drawn
                    renderOrder[RENDER_LAYERS.INVENTORY_ITEMS].addChild(game.add.sprite((1 + i) * tSize,(1+j) * tSize,getItemDrawType(player.inventory[i][j].itemType), player.inventory[i][j].ID));
                }
            }
        }
        renderOrder[RENDER_LAYERS.INVENTORY_ITEM_TARGETED].removeAll(true);
        if(player.holding != undefined){//has item over that is being held
            renderOrder[RENDER_LAYERS.INVENTORY_ITEM_TARGETED].addChild(game.add.sprite((1 + player.invX) * tSize, (1 + player.invY) * tSize, getItemDrawType(player.holding.itemType), player.holding.ID));
        }
        renderOrder[RENDER_LAYERS.INVENTORY_TARGET].removeAll(true);
        renderOrder[RENDER_LAYERS.INVENTORY_TARGET].addChild(game.add.sprite((1 + player.invX) * tSize, (1 + player.invY) * tSize, 'crosshairs', 2));//crosshairs
        //changeText(TEXT.INV);
    }

    function undrawInventory(){
        for (var i = 1; i < 8; i++) {
            for (var j = 1; j < 6; j++) {
                if(i + windowViewX > 0 && i + windowViewX < map.tiles.length && j + windowViewY > 0 && j + windowViewY <  map.tiles[0].length){//within view area
                    //game.add.sprite(i*tSize,j*tSize,'tileSet', map.tiles[i + windowViewX][j + windowViewY]);
                    if(map.enemies[i + windowViewX][j + windowViewY] != undefined)//enemies under
                    {
                        //game.add.sprite(i*tSize,j*tSize,'enemies',map.enemies[i + windowViewX][j + windowViewY].ID);
                    }
                    if(map.items[i + windowViewX][j + windowViewY] != undefined)//iteme under
                    {
                        //game.add.sprite(i*tSize,j*tSize,getItemDrawType(map.items[i + windowViewX][j + windowViewY].itemType),map.items[i + windowViewX][j + windowViewY].ID);
                    }
                }
                else{//outside map
                     //game.add.sprite(i*tSize,j*tSize,'tileSet', map.TILE.WALL1);
                }
                drawPlayer();
                
            }
        }
        
    }

    function drawHolding(){
        //game.add.sprite((1 + player.invX) * tSize, (1 + player.invY) * tSize, getItemDrawType(player.holding.itemType), player.holding.ID);
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
        renderOrder[RENDER_LAYERS.CROSSHAIRS].removeAll(true);
        renderOrder[RENDER_LAYERS.CROSSHAIRS].addChild(game.add.sprite((player.targetX - windowViewX) * tSize, (player.targetY - windowViewY) * tSize, 'crosshairs', 0));//crosshairs
    }

    function drawScrollCrosshair(){
        renderOrder[RENDER_LAYERS.CROSSHAIRS].removeAll(true);
        renderOrder[RENDER_LAYERS.CROSSHAIRS].addChild(game.add.sprite((player.targetX - windowViewX) * tSize, (player.targetY - windowViewY) * tSize, 'crosshairs', 3));//crosshairs
    }

    function drawMiniMap(){
        renderOrder[RENDER_LAYERS.MINI_MAP].removeAll(true);
        renderOrder[RENDER_LAYERS.MINI_MAP_PLAYER].removeAll(true);
        for(let i = 0; i < map.tiles.length; i++){
            for(let j = 0; j < map.tiles[0].length; j++){
                if(map.mapped[i][j]){
                    renderOrder[RENDER_LAYERS.MINI_MAP].addChild(game.add.sprite(i * 5, j * 5, 'minimap_tiles', map.tiles[i][j])); 
                }
                //game.add.sprite(i * 5, j * 5, 'minimap_tiles', map.tiles[i][j]);
                else { //game.add.sprite(i * 5, j * 5, 'minimap_tiles', 6); 
                     }
            }   
        }
        renderOrder[RENDER_LAYERS.MINI_MAP_PLAYER].addChild(game.add.sprite(player.x * 5, player.y * 5, 'minimap_tiles', 10));
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
                //game.add.image(tSize,tSize, menuText);
                break;
            case TEXT.CHAR:
                charText.setText("F" + (mapCounter + 1) + " LV" + player.level + " HP:" + player.hp + "/" + player.hpMax + " XP:" + player.xp + "/" + player.xpMax, true, 0, 0, Phaser.RetroFont.ALIGN_LEFT);
                //game.add.image(2,0, charText);
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
                //game.add.image(126,tSize, invText);
                break;
            case TEXT.CONSOLE:
                for(var i = 3; i >= 0; i--){//puts input strings together
                    text += consoleHistory[i] + "\n";
                }
                consoleText.setText(text, true, 0, 0, Phaser.RetroFont.ALIGN_LEFT);
                //game.add.image(2,168, consoleText);
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