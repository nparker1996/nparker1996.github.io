"use strict";

function Scroll() {
    
    this.itemType = ITEM.SCROLLS;
    this.x = 0;
    this.y = 0;
    this.name = "";
    this.ID = -1;
    
    this.setupScroll = function(xPos, yPos, wID){
        this.x = xPos;
        this.y = yPos;
        this.ID = wID;
        this.name = scrollName[wID];
    }
    
    this.setupInvScroll = function(wID){
        this.x = 0;
        this.y = 0;
        this.ID = wID;
        this.name = scrollName[wID];
    }
}