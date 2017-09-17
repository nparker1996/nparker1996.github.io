"use strict";

function Weapon() {
    
    this.itemType = ITEM.WEAPONS;
    this.x = 0;
    this.y = 0;
    this.name = "";
    this.ID = -1;
    
    this.setupWeapon = function(xPos, yPos, wID){
        this.x = xPos;
        this.y = yPos;
        this.ID = wID;
        this.name = weaponName[wID];
    }
    
    this.setupInvWeapon = function(wID){
        this.x = 0;
        this.y = 0;
        this.ID = wID;
        this.name = weaponName[wID];
    }
}