"use strict";

function Armor() {
    
    this.itemType = ITEM.ARMORS;
    this.x = 0;
    this.y = 0;
    this.name = "";
    this.ID = -1;
    
    this.setupArmor = function(xPos, yPos, wID){
        this.x = xPos;
        this.y = yPos;
        this.ID = wID;
        this.name = armorName[wID];
    }
    
    this.setupInvArmor = function(wID){
        this.x = 0;
        this.y = 0;
        this.ID = wID;
        this.name = armorName[wID];
    }
}