"use strict";

function Enemy(){
    
    this.x = 0;
    this.y = 0;
    this.name = "";
    this.hp = 0;
    this.ID = -1;
    
    this.scrollTimer = 0;
    this.scared = false;
    this.move = true;
    this.targeted = true;
    
    this.setupEnemy = function(xPos, yPos, eID){//create an enemy
        this.x = xPos;
        this.y = yPos;
        this.ID = eID;
        this.hp = unitHP[eID];
        this.name = unitName[eID];
        if(eID == UNIT.TURRET){
            this.move = false;
            this.targeted = false;
        }
    }
    
    this.turn = function(){
        if(this.scrollTimer <= 0){
            if (this.targeted) {
                if (this.ID == UNIT.TURRET) {//if it is a turrent dronw
                    if (!map.visible[this.x][this.y]) {//the player can't see enemy
                        this.targeted = false;
                        consolePrint(this.name + " has lost you");
                    }
                }
            }
            if((this.hp<3 || this.scared) && this.move){//low health or scared, enemy will run
                this.runAway();
            }
            else if (map.visible[this.x][this.y] && Math.abs(this.x - player.x) <= unitRange[this.ID] && Math.abs(this.y - player.y) <= unitRange[this.ID]) {//if within range, attack
                if(this.targeted){
                    this.attack();
                }
                else{
                    this.targeted = true;
                    consolePrint(this.name + " has targeted you");
                }
            } else if(this.move) {//can move, move
                this.moveTowardsPlayer();
            }
        }
        else{
            this.scrollTimer--;
        }
    } 
    
    this.moveTowardsPlayer = function(){//figures out which direction to move
        var minDist = map.distToPlayer[this.x][this.y];
        var dir = -1;
        if(map.distToPlayer[this.x][this.y-1] < minDist){//up
            minDist = map.distToPlayer[this.x][this.y-1];
            dir = 0;
        }
        if(map.distToPlayer[this.x+1][this.y] < minDist){//right
            minDist = map.distToPlayer[this.x+1][this.y];
            dir = 1;
        }
        if(map.distToPlayer[this.x][this.y+1] < minDist){//down
            minDist = map.distToPlayer[this.x][this.y+1];
            dir = 2;
        }
        if(map.distToPlayer[this.x-1][this.y] < minDist){//left
            minDist = map.distToPlayer[this.x-1][this.y];//left
            dir = 3;
        }
        
        if(dir == -1){
            dir = Math.floor(Math.random()*4);
        }
        if (dir==0 && !map.isSolid(this.x, this.y-1)){
            this.y--;
        }
        else if (dir==1 && !map.isSolid(this.x+1, this.y)){
            this.x++;
        }
        else if (dir==2 && !map.isSolid(this.x, this.y+1)){
            this.y++;
        }
        else if (dir==3 && !map.isSolid(this.x-1, this.y)){
            this.x--;
        }
        else{
            
        }
    }
    
    this.runAway = function(){//if the enemy is running
        var maxDist = 1;
        var dir = -1;
        if(map.distToPlayer[this.x][this.y-1] > maxDist){//up
            maxDist = map.distToPlayer[this.x][this.y-1];
            dir = 0;
        }
        if(map.distToPlayer[this.x+1][this.y] > maxDist){//right
            maxDist = map.distToPlayer[this.x+1][this.y];
            dir = 1;
        }
        if(map.distToPlayer[this.x][this.y+1] > maxDist){//down
            maxDist = map.distToPlayer[this.x][this.y+1];
            dir = 2;
        }
        if(map.distToPlayer[this.x-1][this.y] > maxDist){//left
            maxDist = map.distToPlayer[this.x-1][this.y];//left
            dir = 3;
        }
        
        if (dir==0 && !map.isSolid(this.x, this.y-1)){
            this.y--;
        }
        else if (dir==1 && !map.isSolid(this.x+1, this.y)){
            this.x++;
        }
        else if (dir==2 && !map.isSolid(this.x, this.y+1)){
            this.y++;
        }
        else if (dir==3 && !map.isSolid(this.x-1, this.y)){
            this.x--;
        }
        
        if (Math.random()>0.3 && map.visible[this.x][this.y] && Math.abs(this.x - player.x) <= unitRange[this.ID] && Math.abs(this.y - player.y) <= unitRange[this.ID]) { //chance of attacking in defence
            this.attack();
        }
        
    }
    
    this.attack = function(){
        //if (Math.floor(Math.random()*90) >= (player.agility*6 + player.luck+20)) { //player doesnt dodge
        if (Math.floor(Math.random()*90) >= (player.skill_dodge*7 + player.skill_luck+20)) { //player doesnt dodge
            var damageGive = Math.floor((unitDamage[this.ID]+1)*Math.random());
            
            if(player.inventory[1][0] != undefined){
                if(player.inventory[1][0].itemType == ITEM.ARMORS){
                    var myArmor = player.inventory[1][0];
                    damageGive = unitDamage[this.ID] - armorDefence[myArmor.ID];
                }
            }
            if (damageGive < 1) {
                damageGive = 1;
            }
            consolePrint("The "+this.name+" hits you for "+damageGive+".");
            player.hp -= damageGive;
        }
        else{
            consolePrint("You dodge the "+this.name+"'s attack.");
        }
    }
    
}