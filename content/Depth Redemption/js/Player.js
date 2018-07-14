"use strict";

function Player(){
    
    this.x = 0;
    this.y = 0;
    this.name = "player";
    
    this.level = 1;
    this.hp = 20;
    this.hpMax = 20;
    this.xp = 0;
    this.xpMax = 10;
    this.damage = 1;
    this.defence = 2;
    
    
    //skills
    this.skill_medicine = 2; //heal/2,lvlup hpup/2, start health
    this.skill_dodge = 2; //enemyAttack*7
    this.skill_coordination = 2; //hit acc*7, enemySoak
    this.skill_melee = 2; //hit acc*4, damage/2
    this.skill_range = 2; //hit acc*4, damage/2
    this.skill_tek = 2; //hit acc*4, damage/2
    this.skill_programming = 2; //unlock door*3
    this.skill_learning = 2; //lvlup hpup/2,enemyAttack, addXP/2,unlock door, unlock doorxp/4
    this.skill_luck = 2; //hit acc*2, enemySoak, addXP/4
    
    //inventory
    this.inventory = [[],[],[],[]];
    this.holding = undefined;
    this.invX = 0;
    this.invY = 0;
    
    this.targetX = 0;
    this.targetY = 0;

    this.setupPlayer = function(xPos, yPos){//basic charater
        this.x = xPos;
        this.y = yPos;
        
        this.targetX = xPos;
        this.targetY = yPos;
    }
    
    this.setupPlayerAdv = function(xPos, yPos, statMED, statDDG, statCRD, statMLE, statRNG, statTEK, statPRG, statLRN, statLCK){//advanced character creation
        this.setupPlayer(xPos, yPos);
        this.skill_medicine = statMED;
        this.skill_dodge = statDDG;
        this.skill_coordination = statCRD;
        this.skill_melee = statMLE;
        this.skill_range = statRNG;
        this.skill_tek = statTEK;
        this.skill_programming = statPRG;
        this.skill_learning = statLRN;
        this.skill_luck = statLCK;
        
        this.hpMax = 18 + statMED;
        this.hp = this.hpMax;
    }
    
    ///player methods///
    this.move = function(xDir, yDir){
        if(map.enemies[this.x + xDir][this.y + yDir] != undefined)//for running into enemies // attack
        {
            //console.log("attack");
            this.attack(map.enemies[this.x + xDir][this.y + yDir]);
            changeState(STATE.UPDATE);
        }
        else if(map.isSolid(this.x + xDir, this.y + yDir))//hitting solid object
        {
            map.openDoor(this.x + xDir, this.y + yDir);
            //update is in openDoor method
        }
        else{//normal move
            this.x += xDir;
            this.y += yDir;
            changeState(STATE.UPDATE);
        }
        
    }
    
    this.attack = function(baddy){
        var range;
        var type;
        var myWeapon = this.inventory[0][0];
        if (myWeapon != undefined) {
            type = weaponType[myWeapon.ID];
            this.damage = weaponDamage[myWeapon.ID];
            range = weaponRange[myWeapon.ID];
        } else {
            type = MELEE;
            this.damage = 1;
            range = 1;
        }
        if (Math.abs(this.x - baddy.x) <= range && Math.abs(this.y - baddy.y) <= range) { // checks within range
            let hitAcc = 10 + (this.skill_coordination * 7) + (this.skill_luck * 2);
            switch(type){
                case MELEE:
                    hitAcc += this.skill_melee * 4;
                    break;
                case RANGE :
                    hitAcc += this.skill_range * 4;
                    break;
                case TEK :
                    hitAcc += this.skill_tek * 4;
                    break;
                default:
                    break;
            }
            //if(unitDodge[baddy.ID]>0){ //has some dodge
            //    hitAcc = ((5 + (2 * (this.agility * 7 + this.perception*3 + this.luck * 2) + this.endurance * 2 + this.strength)) / unitDodge[baddy.ID]);
            //}
            //else{ //so no dividing by zero
            //    hitAcc = (5 + (2 * (this.agility * 7 + this.perception*3 + this.luck * 2) + this.endurance * 2 + this.strength));
            //}
            if (Math.floor(Math.random() * 90) <= hitAcc - (unitDodge[baddy.ID] * 2)) { //attack and miss
                let damageGive = 0;
                switch(type){
                    case MELEE:
                        damageGive = this.damage + Math.floor(this.skill_melee / 2);
                        break;
                    case RANGE:
                        damageGive = this.damage + Math.floor(this.skill_range / 2);
                        break;
                    case TEK:
                        damageGive = this.damage + Math.floor(this.skill_tek / 2);
                        break;
                    default:
                        damageGive = this.damage;
                        break;
                }
                if (Math.floor(Math.random() * 50) > (this.skill_coordination + this.skill_luck)) {//enemy soaks some damage
                    damageGive = (damageGive - unitDef[baddy.ID]);
                }
                if (damageGive < 0) {
                    damageGive = 0;
                }
                consolePrint("You hit the " + baddy.name + " for " + damageGive + " damage.");
                baddy.hp -= damageGive;
            } else {//missed
                consolePrint("You miss the " + baddy.name + ".");
            }
        }
    }
    
    this.scrollEffect = function(baddy){ //scroll effect happens
        if(this.inventory[2][0] != undefined){//player has a scroll
            let myScroll = this.inventory[2][0];
            switch(myScroll.ID){
                case SCROLL.OVERHEAT:
                    baddy.scrollTimer += 3;
                    consolePrint(baddy.name + " stopped for 3 turns");
                    break;
                case SCROLL.SHORT_CIRCUIT:
                    map.enemies[baddy.x][baddy.y] = undefined;
                    consolePrint(baddy.name + " was destroyed");
                    break;
                case SCROLL.BLUESCREEN:
                    baddy.scrollTimer += 5;
                    consolePrint(baddy.name + " stopped for 5 turns");
                    break;
                case SCROLL.NULL_POINTER_EXCEPTION:
                    baddy.scrollTimer += 4;
                    consolePrint(baddy.name + " stopped for 4 turns");
                    break;
                case SCROLL.STAT_ERROR:
                    baddy.hp -= Math.floor(baddy.hp / 2);
                    consolePrint(baddy.name + " lost half its hp");
                    break;
                case SCROLL.MISSING_PART:
                    baddy.hp -= Math.floor(baddy.hp*2 / 3);
                    consolePrint(baddy.name + " lost 2/3rd its hp");
                    break;
                case SCROLL.OVERRIDE:
                    baddy.scrollTimer += 7;
                    consolePrint(baddy.name + " stopped for 7 turns");
                    break;
                case SCROLL.RANDOM_EFFECT: //creates a random scroll to use
                    var tempScroll = Scroll();
                    tempScroll.setupInvScroll(Math.floor(Math.random() * (SCROLL.length+1)));
                    this.inventory[2][0] = tempScroll;
                    this.scrollEffect(baddy);
                    break;
                case SCROLL.SCARE:
                    baddy.scared = true;
                    consolePrint(baddy.name + " got scared");
                    break;
                case SCROLL.PARALYSE:
                    baddy.move = false;
                    consolePrint(baddy.name + " can't move");
                    break;
                case SCROLL.BLACK_CHIP: //teleported
                    let xx;
                    let yy;
                    do{
                        xx = Math.floor(Math.random()*map.tiles.length);
                        yy = Math.floor(Math.random()*map.tiles[xx].length);
                    }while(map.isSolid(xx,yy) || map.enemies[xx][yy] != undefined);//tile is solid or enemy on spot
                    map.enemies[xx][yy] = baddy;
                    consolePrint(baddy.name + " was teleported");
                    break;
                default:
                    consolePrint("error, not a spell");
                    return;
            }
            this.inventory[2][0] = undefined;
        }
        else{consolePrint("You don't have a chip!");}
        changeText(TEXT.CONSOLE);
    }
    
    this.attackTarget = function(){//attack the target that target crosshair are over
        if (map.enemies[this.targetX][this.targetY] != undefined) {
            this.attack(map.enemies[this.targetX][this.targetY]);
            changeState(STATE.UPDATE);
        } else {
            if(map.tiles[this.targetX][this.targetY] == map.TILE.OPEN_DOOR){//close door
                map.closeDoor(this.targetX, this.targetY);
            }
            else{ consolePrint("There is nothing to do here!"); }
        }
    }
    
    this.useScroll = function(){//uses chip on target in crosshairs
        if (map.enemies[this.targetX][this.targetY] != undefined) {
            this.scrollEffect(map.enemies[this.targetX][this.targetY]);
            changeState(STATE.UPDATE);
        } else {
            consolePrint("There is nothing to use a chip here!");
        }
    }
    
    this.moveTarget = function(xPos, yPos, usingScroll) {//move target crosshairs around
        this.targetX += xPos;
        this.targetY += yPos;
        var range;
        var myWeapon = this.inventory[0][0];
        if (myWeapon != undefined && !usingScroll) { //has a weapon and is not using a scroll
            range = weaponRange[myWeapon.ID];
        } else {
            range = 1;
        }
        if (!map.visible[this.targetX][this.targetY] || Math.abs(this.x - this.targetX) > range || Math.abs(this.y - this.targetY) > range) {
            this.targetX -= xPos;
            this.targetY -= yPos;
        }
        if(usingScroll){drawScrollCrosshair();}
        else{drawTargetCrosshair();}
    }

    this.resetTarget = function() {//reset target crosshairs
        this.targetX = this.x;
        this.targetY = this.y;
    }
    
    ///Inventory methods///
    
    this.moveInv = function(xPos, yPos){//moves around the inventory
        this.invX += xPos + 4;
        this.invY += yPos + 5;
        this.invX %= 4;
        this.invY %= 5;
        drawInventory();//redraws the inventory
    }
    
    this.swapItem = function(){//swap items in inventory
        var placeholder = this.holding;
        this.holding = this.inventory[this.invX][this.invY];
        this.inventory[this.invX][this.invY] = placeholder;
        this.inventory[3][0] = undefined;//trash item
        //if(this.inventory[0][0] != undefined){//player has weapon
        //    drawPlayer();
        //}
        //if(this.holding != undefined){
        //    drawHolding();
        //}
        if(this.holding!=undefined){
            if(this.holding.itemType == ITEM.BOOKS){
                if(this.holding.ID==BOOK.MEDIKIT){
                    this.hp += Math.floor(10+this.skill_medicine/2);
                    if(this.hp>this.hpMax){this.hp=this.hpMax};
                    changeText(TEXT.CHAR);
                }
                else if (this.holding.ID == BOOK.MAP_PAD) { map.revealAllTiles(); drawMap(); }
                else if (this.holding.ID == BOOK.MDC_BOOK)this.skill_medicine++;
                else if (this.holding.ID == BOOK.DGE_BOOK)this.skill_dodge++;
                else if (this.holding.ID == BOOK.CRD_BOOK)this.skill_coordination++;
                else if (this.holding.ID == BOOK.MLE_BOOK)this.skill_melee++;
                else if (this.holding.ID == BOOK.RNG_BOOK)this.skill_range++;
                else if (this.holding.ID == BOOK.TEK_BOOK)this.skill_tek++;
                else if (this.holding.ID == BOOK.PGM_BOOK)this.skill_programming++;
                else if (this.holding.ID == BOOK.LRN_BOOK)this.skill_learning++;
                else if (this.holding.ID == BOOK.LCK_BOOK)this.skill_luck++;
                changeText(TEXT.INV);
                this.holding=null;
                drawInventory();
            }
        }
    }
    
    this.pickUpItem = function(){
        if (map.items[this.x][this.y] != undefined) {
            var picked = false;
            for (var j = 1; j<5; j++) {
                for (var i = 0; i< 4; i++) {
                    if (this.inventory[i][j] == undefined) {
                        consolePrint("You pick up a " + map.items[this.x][this.y].name + ".");
                        this.inventory[i][j] = map.items[this.x][this.y];
                        map.items[this.x][this.y] = undefined;
                        picked = true;
                        j=100;
                        break;
                    }
                }
            }
            if (!picked) {
                consolePrint("You don't have any room in your inventory!");
            }
        } 
        else if(map.tiles[this.x][this.y] == map.TILE.DOWN_STAIR && mapCounter < maps.length-1){//going down stairs
            mapCounter++;    
            changeMap(mapCounter);
            map.playerToStairs(true);
        }
        else if(map.tiles[this.x][this.y] == map.TILE.UP_STAIR && mapCounter > 0){//going up stairs
            mapCounter--;    
            changeMap(mapCounter);
            map.playerToStairs(false);
        }
        else {
            consolePrint("You waste your time grabbing air.");
        }
        changeState(STATE.UPDATE);
    }
    
    ///utilities methods///
    
    this.levelUp = function(){//changes charater when level up occurs
        let text = "Level Up! ";
        this.level++;
        this.xp = this.xp - this.xpMax;//reset xp
        //var hpUp = Math.floor(this.endurance / 2) + Math.floor(this.intelligence / 4) + Math.floor(this.strength / 4);//calculates how much health is incremented by
        let hpUp = Math.floor(this.skill_learning / 2) + Math.floor(this.skill_medicine / 2); //calculates how much health is incremented by
        if (hpUp < 1) {//just incase health increment is low
            hpUp = 1;
        }
        this.hpMax += hpUp;//adds to max health
        
        this.hp = Math.ceil((this.hp + this.hpMax) / 2); //gets average of health
        var rand = Math.floor(Math.random()*9);
        if(this.level % 2 == 0 && this.inventory[0][0]!=undefined){
                var w = this.inventory[0][0];
                if(weaponType[w.ID] == MELEE)rand = 3;
                else if(weaponType[w.ID] == RANGE)rand=4;
                else if(weaponType[w.ID] == TEK)rand=5;
        }
        switch(rand){//figures out what SPECIAL should be upgraded
            case 0:
                this.skill_medicine++;
                text += "Medic +1, HP up " + hpUp;
                break;
            case 1:
                this.skill_dodge++;
                text += "Dodge +1, HP up " + hpUp;
                break;
            case 2:
                this.skill_coordination++;
                text += "Coord +1, HP up " + hpUp;
                break;
            case 3:
                this.skill_melee++;
                text += "Melee +1, HP up " + hpUp;
                break;
            case 4:
                this.skill_range++;
                text += "Range +1, HP up " + hpUp;
                break;
            case 5:
                this.skill_tek++;
                text += "Tek +1, HP up " + hpUp;
                break;
            case 6:
                this.skill_programming++;
                text += "Progm +1, HP up " + hpUp;
                break;
            case 7:
                this.skill_learning++;
                text += "Learn +1, HP up " + hpUp;
                break;
            default:
                this.skill_luck++;
                text += "Luck +1, HP up " + hpUp;
                break;
        }
        consolePrint(text);
        this.xpMax += this.level + 5;
    }
    
    this.addXP = function(plus){//gaining experience
        this.xp += plus;
        while(this.xp >= this.xpMax){
            this.levelUp();
        }
    }
    
    this.setStartingGear = function(){//sets up character for game
        if(this.skill_range >= this.skill_melee){//weapon setup
            var weap = new Weapon();
            weap.setupInvWeapon(WEAPON.RANGED_TAZOR);
            this.inventory[0][0] = weap;
        }
        else{
            var weap = new Weapon();
            weap.setupInvWeapon(WEAPON.KNIFE);
            this.inventory[0][0] = weap;
        }
        
        if(this.skill_dodge >= this.skill_programming){//armor or scroll
            var armo = new Armor();
            armo.setupInvArmor(ARMOR.LEATHER);
            this.inventory[1][0] = armo;
        }
        else{
            var scr1 = new Scroll(); scr1.setupInvScroll(SCROLL.OVERHEAT);
            var scr2 = new Scroll(); scr2.setupInvScroll(SCROLL.OVERHEAT);
            var scr3 = new Scroll(); scr3.setupInvScroll(SCROLL.OVERHEAT);
            this.inventory[2][0] = scr1;
            this.inventory[1][1] = scr2;
            this.inventory[2][1] = scr3;
        }
        
        if(this.skill_coordination > this.skill_dodge){//better armor
            var armo = new Armor();
            armo.setupInvArmor(ARMOR.CHAINMAIL);
            this.inventory[1][0] = armo;
        }
        
        if(this.skill_luck > this.skill_programming){
            var scr1 = new Scroll();
            scr1.setupInvScroll(Math.floor(Math.random() * scrollName.length));
            this.inventory[3][1] = scr1;
        }
        
        var med = new Item();
        med.setupInvBook(BOOK.MEDIKIT);
        this.inventory[0][1] = med;
        
        //var mapI = new Item();
        //mapI.setupInvBook(BOOK.MAP_PAD);
        //this.inventory[3][3] = mapI;
    }
}