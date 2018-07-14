"use strict"

function Main_Menu(){
    
    var menuState;
    var selected;
    var statPoints;
    var display = [];
    
    var temptMedicine = 2;
    var temptDodge = 2;
    var temptCoordination = 2;
    var temptMelee = 2;
    var temptRange = 2;
    var temptTek = 2;
    var temptProgramming = 2;
    var temptLearning = 2;
    var temptLuck = 2;
    
    this.setupMainMenu = function(){
        this.selected=0;
        this.menuState=MENU.MAIN;
        this.statPoints=6;
        this.display = menuTitles;
        changeText(TEXT.MENU);
    }
    
    this.scrollUp = function(){
        this.selected+=this.display.length-1;
        this.selected%=this.display.length;
        changeText(TEXT.MENU);
        clickSound.play();
    }
    
    this.scrollDown = function(){
        this.selected++;
        this.selected%=this.display.length;
        changeText(TEXT.MENU);
        clickSound.play();
    }
    
    this.select = function(){//depending on the menuStating what you select does different things
        switch(this.menuState){
            case MENU.MAIN:
                this.changeMenu(this.selected);
                break;
            case MENU.CHARACTER :
                if (this.selected == 10) {
                    this.statPoints = 6;
                    this.temptMedicine = 2;
                    this.temptDodge = 2;
                    this.temptCoordination = 2;
                    this.temptMelee = 2;
                    this.temptRange = 2;
                    this.temptTek = 2;
                    this.temptProgramming = 2;
                    this.temptLearning = 2;
                    this.temptLuck = 2;
                }
                else if (this.statPoints <= 0) {
                    player.setupPlayerAdv(player.x, player.y, this.temptMedicine, this.temptDodge, this.temptCoordination, this.temptMelee, this.temptRange, this.temptTek, this.temptProgramming, this.temptLearning, this.temptLuck);
                    player.setStartingGear();
                    changeState(STATE.PLAYER_TURN);
                    drawMap();
                    drawItems();
                    drawEnemies();
                    drawPlayer();
                    changeText(TEXT.CHAR);
                    return;
                    }
                else {
                    this.statPoints--;
                    if(this.selected==0)this.statPoints++;
                    else if(this.selected==1)this.temptMedicine++;
                    else if(this.selected==2)this.temptDodge++;
                    else if(this.selected==3)this.temptCoordination++;
                    else if(this.selected==4)this.temptMelee++;
                    else if(this.selected==5)this.temptRange++;
                    else if(this.selected==6)this.temptTek++;
                    else if(this.selected==7)this.temptProgramming++;
                    else if(this.selected==8)this.temptLearning++;
                    else if(this.selected==9)this.temptLuck++;
                }
                this.display=["Stat Points Remaining: " + this.statPoints,
                    "Medicine: " + this.temptMedicine,
                    "Dodge: " + this.temptDodge,
                    "Coordination: " + this.temptCoordination,
                    "Melee: " + this.temptMelee,
                    "Range: " + this.temptRange,
                    "Tek: " + this.temptTek,
                    "Programming: " + this.temptProgramming,
                    "Learning: " + this.temptLearning,
                    "Luck: " + this.temptLuck,
                    "Reset"];
                break;
            case MENU.HELP :
                //break;
            case MENU.ABOUT :
                //break;
            case MENU.VERSION :
                //break;
            default :
                this.changeMenu(MENU.MAIN);
                break;
        }
        changeText(TEXT.MENU);
    }
    
    this.changeMenu = function(newState){
        this.menuState = newState;
        this.selected = 0;
        switch(this.menuState){
            case MENU.MAIN:
                this.display = menuTitles;
                break;
            case MENU.CHARACTER :
                this.statPoints = 6;
                this.temptMedicine = 2;
                this.temptDodge = 2;
                this.temptCoordination = 2;
                this.temptMelee = 2;
                this.temptRange = 2;
                this.temptTek = 2;
                this.temptProgramming = 2;
                this.temptLearning = 2;
                this.temptLuck = 2;
                this.display=["Stat Points Remaining: "+ this.statPoints,
                    "Medicine: " + this.temptMedicine,
                    "Dodge: " + this.temptDodge,
                    "Coordination: " + this.temptCoordination,
                    "Melee: " + this.temptMelee,
                    "Range: " + this.temptRange,
                    "Tek: " + this.temptTek,
                    "Programming: " + this.temptProgramming,
                    "Learning: " + this.temptLearning,
                    "Luck: " + this.temptLuck,
                    "Reset"];
                break;
            case MENU.HELP :
                this.display=["WASD to move",
                "Move into an enemy to attack",
                "[i] open your inventory",
                //"[m] to open your map",
                "[f] ranged attack/close doors",
                "[e] pick up items",
                //"[c] to close doors",
                //"[<] and [>] to climb stairs",
                "[q] use chip",
                //"[p] to view past actions",
                //"[Enter] to select/use/manage/etc.",
                "[e] while in a menu to return"];
                break;
            case MENU.ABOUT :
                this.display = ["Created by Noah Parker", "For Rich Media, Project 2","", "Special thanks to Peter Cowal"];
                break;
            case MENU.VERSION :
                this.display = ["2.0 - Remaking the game", "2.1 - Rendering with Z", "2.2 - No Longer SPECIAL"]
                break;
            default :
                
                break;
        }
    }
}