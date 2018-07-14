"use strict";

//main class
var TEXT = {
    MENU : 0,
    CHAR : 1,
    INV : 2,
    CONSOLE : 3
}

//Enemy class
var UNIT = {
    GUARD : 0,
    SOLDIER : 1,
    MARINE : 2,
    ADVANCED_MARINE : 3,
    DRONE : 4,
    ARMORED_DRONE : 5,
    ATTACK_DRONE : 6,
    SCOUT_DRONE : 7,
    TURRET : 8,
    CYBORG : 9,
    AUGMENT : 10,
    ZOMBIE : 11,
    CAPTAIN : 12,
    GENERAL : 13,
    CRYSTAL_GUARD : 14
};
    
var unitName = ["Guard","Soldier","Marine","Advanced Marine","Drone","Armored Drone","Attack Drones","Scout Drone","Turret","Cyborg","Augment","Zombie", "Captain","Gen3r1", "Crystal Guard"];
var unitDamage = [2,3,4,4,2,2,5,2,2 ,5 ,4 ,2,5 ,4 ,8 ];
var unitHP =     [5,7,8,8,6,6,6,6,24,15,15,7,17,14,26];
var unitDef =    [0,2,2,3,0,4,1,1,1 ,4 ,2 ,0,4 ,3 ,3 ];
var unitDodge =  [1,2,3,4,2,1,1,4,0 ,2 ,5 ,1,3 ,6 ,5 ];
var unitRange =  [2,3,3,4,1,1,2,1,6 ,2 ,4 ,1,2 ,5 ,3 ];

//floor class

var PROBABILITY = [
    [40, 0 , 0 , 0 , 40, 0 , 0 , 0 , 0, 0, 0, 0], //1, 80
    [40, 15, 10, 0 , 25, 5 , 5 , 10, 0, 0, 0, 0], //2, 110
    [20, 30, 15, 10, 15, 10, 15, 10, 0, 0, 0, 0], //3, 120
    [10, 40, 20, 13, 15, 12, 15, 10, 0, 0, 0, 0], //4, 130
    [], //5
    [7 , 23, 35, 10, 10, 20, 20, 20, 5, 3 , 1, 1], //6, 155
    [7 , 25, 40, 10, 10, 20, 20, 20, 5, 5 , 2, 1], //7, 165
    [5 , 20, 35, 20, 15, 20, 20, 20, 7, 5 , 5, 1], //8, 175
    [0 , 15, 30, 20, 20, 25, 25, 25, 9, 10, 6, 2], //9, 185
    [], //10
    [0, 15, 35, 30, 27, 26, 25, 15, 15, 10, 10, 2], //11, 210
    [0, 4 , 20, 40, 25, 27, 25, 25, 18, 17, 17, 2], //12, 220
    [0, 5 , 30, 20, 15, 35, 25, 25, 23, 30, 20, 2], //13, 230
    [1, 3 , 10, 20, 10, 40, 20, 20, 23, 40, 40, 3], //14, 240
    [] //15
];

//Items

var ITEM = {
    WEAPONS : 0,
    ARMORS : 1,
    SCROLLS : 2,
    BOOKS : 3
};

var BOOK = {
    MEDIKIT : 0,
    MAP_PAD : 1,
    MDC_BOOK : 2, 
    DGE_BOOK : 3, 
    CRD_BOOK : 4,
    MLE_BOOK : 5,
    RNG_BOOK : 6,
    TEK_BOOK : 7,
    PGM_BOOK : 8,
    LRN_BOOK : 9,
    LCK_BOOK : 10
};

var bookName = ["Medikit", "Map Pad", "Medic Book", "Dodge Book", "Coordination Book", "Melee Book", "Range Book", "Tek Book", "Programming Book", "Learning Book", "Luck Book"];

var DROPRATE = {
    GUARD_WEAPON_RANGED_TAZOR : 0.6,
    SOLDIER_WEAPON_COMBAT_KNIFE :0.6,
    MARINE_WEAPON_SHOTGUN :0.6,
    ADVANCED_MARINE_WEAPON_RIFLE :0.65,
    DRONE_WEAPON_PLASMA_PISTOL :0.4,
    ARMORED_DRONE_ARMOR_METAL :0.6,
    ATTACK_DRONE_WEAPON_LASER_RIFLE :0.65,
    SCOUT_DRONE_WEAPON_LIGHT_WAVE_EMITTER :0.4,
    TURRET_WEAPON_SNIPER_RIFLE :0.9,
    CYBORG_WEAPON_PLASMA_RIFLE :0.65,
    AUGMEN_WEAPON_PLASMA_BLADE :0.7,
    ZOMBIE_WEAPON_ALIEN_BLASTER :0.98,
    ALL_MEDKIT : .9
};

//weapon class

var WEAPON = {
    KNIFE : 0,
    TAZOR : 1,
    BATON : 2,
    COMBAT_KNIFE : 3,
    FIRE_SWORD : 4,
    PLASMA_BLADE : 5,
    RANGED_TAZOR : 6,
    PISTOL : 7,
    SHOTGUN : 8,
    RIFLE : 9,
    SNIPER_RIFLE : 10,
    PLASMA_PISTOL : 11,
    LIGHT_WAVE_EMITTER : 12,
    LASER_RIFLE : 13,
    PLASMA_RIFLE : 14,
    X_2_ANTENNA : 15,
    RPG_SWORD : 16,
    THAT_GUN : 17,
    LIGHT_IN_DARK : 18,
    ALIEN_BLASTER : 19,
    DARK_WAVE_ZAPPER : 20,
    Q_35_MATTER_MODULATOR : 21,
    EUCLIDS_C_FINDER : 22,
};

var MELEE = 1;
var RANGE = 2;
var TEK = 3;

var weaponName = ["Knife","Tazor","Baton","Combat Knife", "Fire Sword","Plasma Blade","Ranged Tazor","Pistol","Shotgun", "Rifle","Sniper Rifle","Plasma Pistol","Light Wave Emitter","Laser Rifle", "Plasma Rifle","X-2 Antenna","An RPG Sword","That Gun","A Light in the Dark","Alien Blaster","Dark Wave Zapper", "Q-35 Matter Modulator" ,"Euclid's C-Finder"];
var weaponDamage =  [2 ,2 ,2 ,4 ,6,6,2 ,3 ,4 ,5 ,7,4 ,4 ,5 ,5 ,3,5,6,7,8,6,10,12];
var weaponType =   [MELEE, MELEE, MELEE, MELEE, MELEE, MELEE, RANGE, RANGE, RANGE, RANGE, RANGE, TEK, TEK, TEK, TEK, MELEE, MELEE, RANGE, RANGE, RANGE, TEK, TEK, TEK];
var weaponRange = [1 ,1 ,1 ,1 ,1,1,2 ,3 ,3 ,4 ,6,2 ,4 ,4 ,3 ,1,1,3,3,4,2,6 ,4 ];
var weaponRarity = [50,30,35,25,5,3,25,45,25,30,3,25,25,20,15,5,2,1,3,1,2,1 ,1 ];

//armor class

var ARMOR = {
    LEATHER : 0,
    CHAINMAIL : 1,
    METAL : 2,
    BULLET_PROOF : 3,
    COMBAT : 4,
    MILITARY : 5,
    POWER : 6,
    OMEGA_CRYSTAL : 7
};

var armorName = ["Leather Armor", "Chainmail", "Metal Armor", "Bullet Proof Vest", "Combat Armor", "Military Grade Armor", "Power Armor", "Omega Crystal Armor"];
var armorDefence = [1, 2, 3, 4, 5, 6, 7, 8];

//scroll class
var SCROLL = {
    OVERHEAT : 0,
    SHORT_CIRCUIT : 1,
    BLUESCREEN : 2,
    NULL_POINTER_EXCEPTION : 3,
    STAT_ERROR : 4,
    MISSING_PART : 5,
    OVERRIDE : 6,
    RANDOM_EFFECT : 7,
    SCARE : 8,
    PARALYSE : 9,
    BLACK_CHIP : 10
};

var scrollName = ["Overheat","Short Circuit","Blue Screen","NullPointerException","Stat Error", "Missing Part","Override","Random Effect","Scare","Paralyse","Black Chip"];

//main menu
var MENU = {
    MAIN : 0,
    CHARACTER : 1,
    HELP : 2,
    ABOUT : 3,
    VERSION : 4,
}
var menuTitles = ["Depth Redemption v2.2"," Start"," Controls"," About - by Noah Parker"," Version History"];