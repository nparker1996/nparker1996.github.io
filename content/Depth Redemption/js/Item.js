"use strict";

function Item() {
    
    this.itemType = ITEM.BOOKS;
    this.x = 0;
    this.y = 0;
    this.name = "";
    this.ID = -1;
    
    this.setupBook = function(xPos, yPos, wID){
        this.x = xPos;
        this.y = yPos;
        this.ID = wID;
        this.name = bookName[wID];
    }
    
    this.setupInvBook = function(wID){
        this.x = 0;
        this.y = 0;
        this.ID = wID;
        this.name = bookName[wID];
    }
}