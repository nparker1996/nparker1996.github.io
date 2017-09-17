"use strict"

function Main_Menu(){
    
    var menuState;
    var selected;
    var statPoints;
    var display = [];
    
    var temptStrength = 2;
    var temptPerception = 2;
    var temptEndurance = 2;
    var temptCharisma = 2;
    var temptIntelligence = 2;
    var temptAgility = 2;
    var temptLuck = 2;
    
    this.setupMainMenu = function(){
        this.selected=0;
        this.menuState=MENU.MAIN;
        this.statPoints=5;
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
                if (this.selected == 8) {
                    this.statPoints = 5;
                    this.temptStrength = 2;
                    this.temptPerception = 2;
                    this.temptEndurance = 2;
                    this.temptCharisma = 2;
                    this.temptIntelligence = 2;
                    this.temptAgility = 2;
                    this.temptLuck = 2;
                }
                else if (this.statPoints <= 0) {
                    player.setupPlayerAdv(player.x, player.y, this.temptStrength, this.temptPerception, this.temptEndurance, this.temptCharisma, this.temptIntelligence, this.temptAgility,this.temptLuck);
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
                    else if(this.selected==1)this.temptStrength++;
                    else if(this.selected==2)this.temptPerception++;
                    else if(this.selected==3)this.temptEndurance++;
                    else if(this.selected==4)this.temptCharisma++;
                    else if(this.selected==5)this.temptIntelligence++;
                    else if(this.selected==6)this.temptAgility++;
                    else if(this.selected==7)this.temptLuck++;
                }
                this.display=["Stat Points Remaining: "+this.statPoints,
                    "Strength: " + this.temptStrength,
                    "Perception: " + this.temptPerception,
                    "Endurance: " +this.temptEndurance,
                    "Charisma: " +this.temptCharisma,
                    "Intellect: " + this.temptIntelligence,
                    "Agility: " +this.temptAgility,
                    "Luck: " +this.temptLuck,
                    "reset"];
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
                this.statPoints = 5;
                this.temptStrength = 2;
                this.temptPerception = 2;
                this.temptEndurance = 2;
                this.temptCharisma = 2;
                this.temptIntelligence = 2;
                this.temptAgility = 2;
                this.temptLuck = 2;
                this.display=["Stat Points Remaining: "+ this.statPoints,
                    "Strength: " + this.temptStrength,
                    "Perception: " + this.temptPerception,
                    "Endurance: " +this.temptEndurance,
                    "Charisma: " +this.temptCharisma,
                    "Intellect: " + this.temptIntelligence,
                    "Agility: " +this.temptAgility,
                    "Luck: " +this.temptLuck,
                    "reset"];
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
                break;
            default :
                
                break;
        }
    }
}