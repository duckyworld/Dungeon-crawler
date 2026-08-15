const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  hud: document.querySelector(".hud"),
  worldName: document.getElementById("worldName"),
  compactWorld: document.getElementById("compactWorld"),
  coins: document.getElementById("coins"),
  goldCompact: document.getElementById("goldCompact"),
  weapon: document.getElementById("weapon"),
  armor: document.getElementById("armor"),
  bossState: document.getElementById("bossState"),
  minibossState: document.getElementById("minibossState"),
  level: document.getElementById("level"),
  levelCompact: document.getElementById("levelCompact"),
  questState: document.getElementById("questState"),
  stats: document.getElementById("stats"),
  rage: document.getElementById("rage"),
  inventory: document.getElementById("inventory"),
  hpBar: document.getElementById("hpBar"),
  hpText: document.getElementById("hpText"),
  manaBar: document.getElementById("manaBar"),
  manaText: document.getElementById("manaText"),
  xpBar: document.getElementById("xpBar"),
  xpText: document.getElementById("xpText"),
  bossBar: document.getElementById("bossBar"),
  bossText: document.getElementById("bossText"),
  message: document.getElementById("message"),
  interactionPrompt: document.getElementById("interactionPrompt"),
  eventLog: document.getElementById("eventLog"),
  floorBanner: document.getElementById("floorBanner"),
  screenFade: document.getElementById("screenFade"),
  abilityHotbar: document.getElementById("abilityHotbar"),
  menuOverlay: document.getElementById("menuOverlay"),
  menuTitle: document.getElementById("menuTitle"),
  menuText: document.getElementById("menuText"),
  menuActions: document.getElementById("menuActions"),
  closeMenu: document.getElementById("closeMenu"),
  battlePanel: document.getElementById("battlePanel"),
  battleEnemy: document.getElementById("battleEnemy"),
  battlePrompt: document.getElementById("battlePrompt"),
  fightButton: document.getElementById("fightButton"),
  abilityButton: document.getElementById("abilityButton"),
  itemButton: document.getElementById("itemButton"),
  spareButton: document.getElementById("spareButton"),
  runButton: document.getElementById("runButton"),
  saveButton: document.getElementById("saveButton"),
  newRunButton: document.getElementById("newRunButton"),
  titleOverlay: document.getElementById("titleOverlay"),
  continueButton: document.getElementById("continueButton"),
  newGameButton: document.getElementById("newGameButton"),
  loadButton: document.getElementById("loadButton"),
  titleSlots: document.getElementById("titleSlots"),
  settingsButton: document.getElementById("settingsButton"),
  creditsButton: document.getElementById("creditsButton"),
  quitButton: document.getElementById("quitButton"),
  characterButton: document.getElementById("characterButton"),
  inventoryButton: document.getElementById("inventoryButton"),
  skillsButton: document.getElementById("skillsButton"),
  questsButton: document.getElementById("questsButton"),
  bestiaryButton: document.getElementById("bestiaryButton"),
  mapButton: document.getElementById("mapButton"),
  weaponSlot: document.querySelector(".weapon-slot"),
};

const TILE = 32;
const MAP_W = 4800;
const MAP_H = 3200;
const OLD_SAVE_KEY = "pixelDungeonWorldsSaveV2";
const SAVE_SLOT_COUNT = 3;
const ACTIVE_SLOT_KEY = "pixelDungeonWorldsActiveSlot";
const keys = new Set();
let slashStart = null;
let saveTimer = 0;
let uiRefreshTimer = 0;
let activeSaveSlot = Number(localStorage.getItem(ACTIVE_SLOT_KEY)) || 1;

const worlds = [
  {
    name: "Briarwood Once-Upon",
    floor: "#2f6b3a",
    floorAlt: "#275932",
    wall: "#274020",
    path: "#6d5732",
    house: "#8c5a35",
    roof: "#4f2f24",
    shopNpc: "Moss-Crown Smith",
    questNpc: "Pageboy Fern",
    weapon: { name: "Iron Longsword", cost: 55, damage: 18 },
    armor: { name: "Leather Armor", cost: 65, defense: 5 },
    regions: ["Candlewick Village", "Whispering Briars", "Moonmilk Lake", "Glassberry Quarry", "Old Wish Forge", "Thorn-King Gate"],
    routes: [
      { x: 250, y: 0, w: 90, h: 520 },
      { x: 120, y: 340, w: 870, h: 86 },
      { x: 890, y: 340, w: 86, h: 660 },
      { x: 890, y: 910, w: 620, h: 80 },
      { x: 1430, y: 520, w: 80, h: 470 },
      { x: 1430, y: 520, w: 710, h: 80 },
      { x: 2060, y: 520, w: 80, h: 900 },
      { x: 1050, y: 1230, w: 1010, h: 78 },
    ],
    landmarks: ["A wishing well hums an old lullaby under the moss.", "A crooked sign points to a road that only children remember.", "Tree roots lace themselves into a keyhole-shaped arch."],
    spawns: [[820, 310], [1090, 270], [1400, 420], [1900, 520], [710, 760], [1040, 920], [1500, 840], [1820, 940], [640, 1330], [1180, 1280], [1740, 1260], [2110, 980], [360, 735], [1540, 1360]],
    monsters: [
      { name: "Slime", color: "#6ee45f", hp: 30, damage: 5, speed: 0.34, coins: 5, xp: 8, level: 1 },
      { name: "Bramble", color: "#b2e35f", hp: 38, damage: 6, speed: 0.28, coins: 7, xp: 10, level: 2 },
      { name: "Mossling", color: "#4fb36a", hp: 34, damage: 6, speed: 0.42, coins: 6, xp: 9, level: 2 },
      { name: "Goblin Scout", color: "#78b85a", hp: 42, damage: 8, speed: 0.58, coins: 9, xp: 13, level: 3 },
      { name: "Dire Wolf", color: "#7d7f85", hp: 56, damage: 10, speed: 0.68, coins: 11, xp: 16, level: 4 },
      { name: "Spore Witch", color: "#9c73d8", hp: 52, damage: 12, speed: 0.33, coins: 14, xp: 19, level: 4 },
    ],
    boss: { name: "Elder Treant", color: "#8b5b30", hp: 130, damage: 13, speed: 0.25, xp: 55, level: 5 },
  },
  {
    name: "Gilded Dunes of Noon",
    floor: "#c59b4b",
    floorAlt: "#b4863d",
    wall: "#8b6130",
    path: "#d6b76a",
    house: "#b8763c",
    roof: "#704120",
    shopNpc: "Sun-Peddler Maro",
    questNpc: "Oasis Scribe",
    weapon: { name: "Sunfang Scimitar", cost: 240, damage: 29 },
    armor: { name: "Scale Mail", cost: 280, defense: 9 },
    regions: ["Dune Bazaar", "Needle-Hedge Maze", "Mirrorheat Flats", "Buried Bell Quarry", "Sunspun Forge", "Pyramid of the Sleeping Lion"],
    routes: [
      { x: 180, y: 315, w: 760, h: 82 },
      { x: 860, y: 315, w: 80, h: 340 },
      { x: 860, y: 585, w: 540, h: 70 },
      { x: 1340, y: 230, w: 70, h: 880 },
      { x: 500, y: 1040, w: 900, h: 82 },
      { x: 500, y: 650, w: 76, h: 470 },
      { x: 1340, y: 1040, w: 780, h: 82 },
      { x: 2040, y: 660, w: 78, h: 462 },
    ],
    landmarks: ["The sand flows uphill whenever no one admits they saw it.", "A dry fountain repeats your footsteps one beat late.", "A half-buried door has no handle, only a carved eye."],
    spawns: [[760, 260], [1220, 240], [1650, 300], [2040, 430], [540, 690], [940, 790], [1320, 980], [1880, 760], [430, 1240], [850, 1340], [1450, 1210], [2120, 1160], [1760, 1420], [620, 980]],
    monsters: [
      { name: "Scorpion", color: "#5a3924", hp: 48, damage: 9, speed: 0.42, coins: 10, xp: 14, level: 4 },
      { name: "Sand Wisp", color: "#f2e390", hp: 36, damage: 10, speed: 0.55, coins: 11, xp: 16, level: 5 },
      { name: "Dune Raider", color: "#8f5b2d", hp: 62, damage: 13, speed: 0.5, coins: 16, xp: 22, level: 6 },
      { name: "Scarab Swarm", color: "#31361e", hp: 54, damage: 12, speed: 0.66, coins: 15, xp: 21, level: 6 },
      { name: "Mummy Guard", color: "#d8c58a", hp: 76, damage: 15, speed: 0.28, coins: 18, xp: 25, level: 7 },
      { name: "Mirage Sprite", color: "#7fe7ff", hp: 44, damage: 17, speed: 0.72, coins: 19, xp: 27, level: 8 },
    ],
    boss: { name: "Glass Pharaoh", color: "#59c7d3", hp: 195, damage: 19, speed: 0.31, xp: 80, level: 9 },
  },
  {
    name: "Frostglass Kingdom",
    floor: "#5aa9bb",
    floorAlt: "#458e9d",
    wall: "#24566b",
    path: "#92d3df",
    house: "#6f99aa",
    roof: "#354c75",
    shopNpc: "Frostglass Forger",
    questNpc: "Snow-Page Luma",
    weapon: { name: "Frostglass Greatsword", cost: 780, damage: 42 },
    armor: { name: "Frost Plate", cost: 880, defense: 14 },
    regions: ["Snowbell Hamlet", "Bluepine Causeway", "Mirrorlake Court", "Shardling Mines", "Aurora Anvil", "Hydra's Frozen Door"],
    routes: [
      { x: 270, y: 260, w: 88, h: 1120 },
      { x: 270, y: 260, w: 540, h: 82 },
      { x: 740, y: 260, w: 82, h: 410 },
      { x: 740, y: 590, w: 790, h: 80 },
      { x: 1460, y: 590, w: 84, h: 620 },
      { x: 760, y: 1130, w: 780, h: 82 },
      { x: 1460, y: 1130, w: 650, h: 82 },
      { x: 2040, y: 1130, w: 82, h: 300 },
    ],
    landmarks: ["A frozen mirror shows a royal hallway standing behind you.", "Blue candles burn with no warmth and no wick.", "A crack in the ice whispers numbers like a bedtime spell."],
    spawns: [[690, 340], [980, 480], [1380, 260], [1780, 410], [2080, 670], [610, 880], [960, 1080], [1320, 820], [1660, 1020], [2010, 1120], [440, 1320], [1110, 1390], [1540, 1320], [2070, 1400]],
    monsters: [
      { name: "Ice Bat", color: "#d5f7ff", hp: 46, damage: 12, speed: 0.62, coins: 14, xp: 19, level: 8 },
      { name: "Snow Golem", color: "#a6d5e7", hp: 74, damage: 15, speed: 0.26, coins: 17, xp: 24, level: 10 },
      { name: "Frost Archer", color: "#84c4e8", hp: 68, damage: 18, speed: 0.45, coins: 20, xp: 29, level: 11 },
      { name: "Crystal Spider", color: "#b7f0ff", hp: 72, damage: 19, speed: 0.57, coins: 22, xp: 31, level: 12 },
      { name: "Blue Wraith", color: "#7b8dff", hp: 58, damage: 22, speed: 0.62, coins: 24, xp: 34, level: 13 },
      { name: "Runed Yeti", color: "#e7f8ff", hp: 115, damage: 21, speed: 0.3, coins: 27, xp: 38, level: 14 },
    ],
    boss: { name: "Winter Hydra", color: "#7459d3", hp: 275, damage: 25, speed: 0.35, xp: 115, level: 15 },
  },
  {
    name: "Cinder Crown Mountain",
    floor: "#47323a",
    floorAlt: "#5f3732",
    wall: "#1f1a20",
    path: "#a8442e",
    house: "#5b3b38",
    roof: "#1a1519",
    shopNpc: "Ashen Armorer",
    questNpc: "Ember Storykeeper",
    weapon: { name: "Ember Crown Blade", cost: 1650, damage: 58 },
    armor: { name: "Dragonhide Armor", cost: 1820, defense: 20 },
    regions: ["Ashen Camp", "Charred Orchard", "Lava-Lit Basin", "Obsidian Below", "Dragon's Story Forge", "Titan's Crown Gate"],
    routes: [
      { x: 200, y: 300, w: 760, h: 78 },
      { x: 890, y: 300, w: 78, h: 760 },
      { x: 890, y: 990, w: 470, h: 78 },
      { x: 1290, y: 220, w: 78, h: 848 },
      { x: 1290, y: 220, w: 550, h: 78 },
      { x: 1770, y: 220, w: 78, h: 1060 },
      { x: 520, y: 1270, w: 1328, h: 78 },
      { x: 2050, y: 870, w: 78, h: 500 },
    ],
    landmarks: ["A lava clock counts backward to a promise you never made.", "Black glass reflects a crowned version of you.", "A furnace door breathes like a dragon pretending to sleep."],
    spawns: [[830, 220], [1160, 370], [1510, 260], [1960, 350], [520, 720], [880, 960], [1220, 700], [1580, 920], [2020, 840], [410, 1320], [790, 1230], [1280, 1370], [1710, 1270], [2140, 1370]],
    monsters: [
      { name: "Lava Imp", color: "#ff8a3d", hp: 66, damage: 18, speed: 0.55, coins: 19, xp: 26, level: 14 },
      { name: "Cinder Knight", color: "#3a3340", hp: 96, damage: 21, speed: 0.31, coins: 23, xp: 32, level: 17 },
      { name: "Ash Drake", color: "#c94b34", hp: 102, damage: 25, speed: 0.52, coins: 29, xp: 40, level: 18 },
      { name: "Obsidian Hound", color: "#171820", hp: 88, damage: 24, speed: 0.72, coins: 28, xp: 39, level: 18 },
      { name: "Firecaller Mage", color: "#ffcd68", hp: 82, damage: 30, speed: 0.38, coins: 34, xp: 46, level: 20 },
      { name: "Molten Brute", color: "#8c2f28", hp: 150, damage: 29, speed: 0.24, coins: 38, xp: 52, level: 21 },
    ],
    boss: { name: "Magma Titan", color: "#e54632", hp: 370, damage: 32, speed: 0.34, xp: 155, level: 23 },
  },
  {
    name: "Eclipse Final Island",
    floor: "#262334",
    floorAlt: "#332d44",
    wall: "#111018",
    path: "#6d5b8f",
    house: "#3f3548",
    roof: "#15131f",
    shopNpc: "Last-Light Merchant",
    questNpc: "Eclipse Witness",
    weapon: { name: "Eclipse Edge", cost: 3200, damage: 78 },
    armor: { name: "Starlit Aegis", cost: 3600, defense: 28 },
    regions: ["Last-Light Dock", "Broken Crown Field", "Bossbone Garden", "Eclipse Bridge", "Silent Forge", "Throne of All Doors"],
    routes: [
      { x: 260, y: 360, w: 960, h: 86 },
      { x: 1130, y: 360, w: 86, h: 780 },
      { x: 1130, y: 1050, w: 920, h: 86 },
      { x: 1960, y: 620, w: 86, h: 516 },
      { x: 1960, y: 620, w: 920, h: 86 },
      { x: 2800, y: 620, w: 86, h: 980 },
      { x: 1820, y: 1510, w: 1066, h: 86 },
      { x: 3460, y: 1160, w: 86, h: 920 },
    ],
    landmarks: ["The ocean is still, like it is waiting for permission to move.", "Old boss crowns hang from black trees without branches.", "A door-shaped shadow points back toward every island you conquered."],
    spawns: [[820, 410], [1280, 650], [1610, 990], [2140, 680], [2560, 850], [3020, 1090], [1840, 1560], [2320, 1500], [2860, 1680], [3540, 1320], [3800, 1820], [3120, 2380], [1960, 2380], [1180, 2050]],
    monsters: [
      { name: "Crownless Shade", color: "#7b6dd8", hp: 170, damage: 32, speed: 0.55, coins: 45, xp: 62, level: 24 },
      { name: "Door-Eater", color: "#2f2940", hp: 220, damage: 36, speed: 0.42, coins: 52, xp: 74, level: 25 },
      { name: "Eclipse Knight", color: "#b5a2ff", hp: 260, damage: 39, speed: 0.36, coins: 60, xp: 82, level: 26 },
      { name: "Fallen Storymage", color: "#ffd45a", hp: 190, damage: 44, speed: 0.46, coins: 66, xp: 88, level: 27 },
      { name: "Island Maw", color: "#4c2030", hp: 310, damage: 42, speed: 0.28, coins: 78, xp: 98, level: 28 },
      { name: "Last Page Wraith", color: "#d5ccff", hp: 230, damage: 48, speed: 0.62, coins: 86, xp: 110, level: 29 },
    ],
    boss: { name: "The Door That Ends", color: "#d5ccff", hp: 850, damage: 48, speed: 0.38, xp: 360, level: 32 },
  },
];

const shopItems = [
  { id: "weapon", kind: "weapon", name: (world) => world.weapon.name, cost: (world) => world.weapon.cost, damage: (world) => world.weapon.damage, desc: () => "Balanced main-path weapon. Reliable damage with no special condition." },
  { id: "quickBlade", kind: "weapon", name: (world) => worldItemName(["Briar Needleblade", "Glassbite Knife", "Icicle Rapier", "Ashfang Cutter", "Duskneedle"], "Quick Blade"), cost: (world) => Math.max(42, Math.floor(world.weapon.cost * 0.78)), damage: (world) => Math.max(12, world.weapon.damage - 4), desc: () => "Cheaper light weapon. Slightly weaker, but good if you need an upgrade early." },
  { id: "heavyBlade", kind: "weapon", name: (world) => worldItemName(["Rootcleaver", "Sun-Heavy Falchion", "Glacier Breaker", "Cinder Maulblade", "Eclipse Worldmaul"], "Heavy Blade"), cost: (world) => Math.floor(world.weapon.cost * 1.45), damage: (world) => world.weapon.damage + 7, desc: () => "Expensive heavy weapon. More raw attack than the normal shop weapon." },
  { id: "armor", kind: "armor", name: (world) => world.armor.name, cost: (world) => world.armor.cost, defense: (world) => world.armor.defense, desc: () => "Standard armor for this world. Raises Defense." },
  { id: "guardArmor", kind: "armor", name: (world) => worldItemName(["Briar Guard Vest", "Sunscale Harness", "Bluepine Coat", "Ashguard Plate", "Voidguard Mantle"], "Guard Armor"), cost: (world) => Math.floor(world.armor.cost * 1.38), defense: (world) => world.armor.defense + 3, desc: () => "Tougher armor. Costs more, but reduces incoming damage better." },
  { id: "potion", kind: "consumable", name: () => "Small Health Potion", cost: () => 20 + game.worldIndex * 18, desc: () => "Restores 50 HP. Cheap emergency healing." },
  { id: "megaPotion", kind: "consumable", name: () => "Large Health Potion", cost: () => 80 + game.worldIndex * 55, desc: () => "Restores 100 HP. Better for bosses and minibosses." },
  { id: "boots", kind: "upgrade", name: () => "Explorer Boots", cost: () => 260 + game.worldIndex * 180, desc: () => "Permanent movement upgrade. Helps with exploration and dodging enemies." },
  { id: "pack", kind: "upgrade", name: () => "Coin Magnet Charm", cost: () => 340 + game.worldIndex * 220, desc: () => "Permanent pickup-range upgrade for dropped gold." },
  { id: "shield", kind: "upgrade", name: () => "Copper Shield Reinforcement", cost: () => 180 + game.worldIndex * 150, desc: () => "Adds +2 Defense to your current armor." },
  { id: "map", kind: "tool", name: () => "Region Map", cost: () => 120 + game.worldIndex * 90, desc: () => "Shows more route and region information while exploring." },
  { id: "key", kind: "quest", name: () => "Old Mine Key", cost: () => 420 + game.worldIndex * 280, desc: () => "Opens the Hidden Forger's secret weapon quest." },
  { id: "honing", kind: "upgrade", name: () => "Master Blade Honing", cost: () => scalingUpgradeCost("honing", 520, 380), desc: () => "Repeatable weapon service. Permanently adds +4 damage to your current weapon." },
  { id: "vitality", kind: "upgrade", name: () => "Hero Vitality Rite", cost: () => scalingUpgradeCost("vitality", 460, 320), desc: () => "Repeatable training. Permanently adds +18 Max HP and heals you." },
  { id: "focus", kind: "upgrade", name: () => "Moonwell Mana Tuning", cost: () => scalingUpgradeCost("focus", 430, 300), desc: () => "Repeatable training. Permanently adds +14 Max Mana and restores mana." },
];

function worldItemName(names, fallback) {
  return names[game.worldIndex] || `${worlds[game.worldIndex]?.name || "World"} ${fallback}`;
}

const bossLairs = [
  [
    { x: 650, y: 735, final: false, template: { name: "Goblin Camp-Chief", color: "#6fb34a", hp: 86, damage: 12, speed: 0.46, xp: 32, coins: 26, level: 4 } },
    { x: 1515, y: 720, final: false, template: { name: "Spore Matriarch", color: "#b579ff", hp: 104, damage: 14, speed: 0.28, xp: 40, coins: 34, level: 5 } },
    { x: 1810, y: 1210, final: false, template: { name: "Direwolf Alpha", color: "#b0b3b8", hp: 112, damage: 15, speed: 0.72, xp: 44, coins: 38, level: 5 } },
    { x: 2740, y: 1880, final: false, template: { name: "Lantern Hollow Knight", color: "#f0c36a", hp: 122, damage: 16, speed: 0.42, xp: 52, coins: 44, level: 6 } },
    { x: 4040, y: 2460, final: false, template: { name: "Wishwell Root Brute", color: "#5f8f4a", hp: 150, damage: 18, speed: 0.26, xp: 60, coins: 52, level: 7 } },
    { x: 3220, y: 1660, final: true },
  ],
  [
    { x: 650, y: 900, final: false, template: { name: "Scarab Brood-King", color: "#302619", hp: 145, damage: 19, speed: 0.56, xp: 58, coins: 48, level: 8 } },
    { x: 1540, y: 470, final: false, template: { name: "Mirage Djinn", color: "#74e0ff", hp: 132, damage: 22, speed: 0.62, xp: 66, coins: 55, level: 9 } },
    { x: 1970, y: 1040, final: false, template: { name: "Mummy War-Captain", color: "#d8bd74", hp: 170, damage: 21, speed: 0.32, xp: 70, coins: 58, level: 10 } },
    { x: 2890, y: 2020, final: false, template: { name: "Glass Jackal Regent", color: "#8fe8ff", hp: 190, damage: 24, speed: 0.66, xp: 82, coins: 68, level: 11 } },
    { x: 4200, y: 2500, final: false, template: { name: "Oasis Bell Warden", color: "#5ecf9c", hp: 210, damage: 23, speed: 0.34, xp: 88, coins: 76, level: 12 } },
    { x: 3220, y: 1660, final: true },
  ],
  [
    { x: 610, y: 1260, final: false, template: { name: "Crystal Widow", color: "#b7f0ff", hp: 185, damage: 26, speed: 0.56, xp: 84, coins: 64, level: 13 } },
    { x: 1340, y: 760, final: false, template: { name: "Blue Wraith Choir", color: "#7b8dff", hp: 165, damage: 30, speed: 0.6, xp: 92, coins: 72, level: 14 } },
    { x: 1910, y: 1330, final: false, template: { name: "Runed Yeti Elder", color: "#e7f8ff", hp: 230, damage: 28, speed: 0.29, xp: 98, coins: 80, level: 15 } },
    { x: 2960, y: 2040, final: false, template: { name: "Aurora Mirror Baron", color: "#d5ccff", hp: 255, damage: 32, speed: 0.48, xp: 112, coins: 92, level: 16 } },
    { x: 4140, y: 2440, final: false, template: { name: "Snowbell Crownbreaker", color: "#effcff", hp: 295, damage: 34, speed: 0.3, xp: 124, coins: 104, level: 17 } },
    { x: 3220, y: 1660, final: true },
  ],
  [
    { x: 610, y: 1210, final: false, template: { name: "Obsidian Houndmaster", color: "#11131a", hp: 240, damage: 34, speed: 0.68, xp: 118, coins: 92, level: 21 } },
    { x: 1450, y: 610, final: false, template: { name: "Ash Drake Broodlord", color: "#cf5034", hp: 275, damage: 38, speed: 0.48, xp: 132, coins: 105, level: 22 } },
    { x: 1980, y: 1060, final: false, template: { name: "Forbidden Firecaller", color: "#ffd45a", hp: 220, damage: 44, speed: 0.4, xp: 145, coins: 120, level: 23 } },
    { x: 3050, y: 2080, final: false, template: { name: "Cinder Crown Butcher", color: "#ff7a3d", hp: 330, damage: 42, speed: 0.42, xp: 160, coins: 132, level: 24 } },
    { x: 4210, y: 2520, final: false, template: { name: "Lava Clock Sentinel", color: "#ffcd68", hp: 360, damage: 45, speed: 0.32, xp: 172, coins: 148, level: 25 } },
    { x: 3220, y: 1660, final: true },
  ],
  [
    { x: 980, y: 760, final: false, template: { name: "Abandoned Treant King", color: "#6d8f55", hp: 520, damage: 42, speed: 0.28, xp: 180, coins: 150, level: 27 } },
    { x: 1710, y: 1180, final: false, template: { name: "Glass Pharaoh Revenant", color: "#59c7d3", hp: 560, damage: 45, speed: 0.34, xp: 195, coins: 165, level: 28 } },
    { x: 2500, y: 760, final: false, template: { name: "Winter Hydra Prime", color: "#7459d3", hp: 640, damage: 48, speed: 0.36, xp: 215, coins: 182, level: 29 } },
    { x: 3010, y: 1610, final: false, template: { name: "Magma Titan Echo", color: "#e54632", hp: 720, damage: 52, speed: 0.35, xp: 240, coins: 210, level: 30 } },
    { x: 3970, y: 2260, final: false, template: { name: "Crownless Boss Choir", color: "#d5ccff", hp: 760, damage: 54, speed: 0.42, xp: 260, coins: 235, level: 31 } },
    { x: 4400, y: 2680, final: true },
  ],
];

const abilityUnlocks = [
  { id: "powerStrike", name: "Power Strike", teacher: "Sir Bramble", world: 0, level: 2, cost: 90, mana: 20, multiplier: 1.75, icon: "powerStrike" },
  { id: "arcaneGuard", name: "Arcane Guard", teacher: "Mistress Bluebell", world: 0, level: 4, cost: 160, mana: 25, heal: 35, icon: "arcaneGuard" },
  { id: "heroicCleave", name: "Heroic Cleave", teacher: "Captain Thorn", world: 1, level: 7, cost: 420, mana: 45, multiplier: 2.6, icon: "heroicCleave" },
  { id: "sunFlare", name: "Sun Flare", teacher: "Oasis Pyromancer", world: 1, level: 8, cost: 520, mana: 34, multiplier: 1.35, burn: 18, icon: "sunFlare" },
  { id: "frostStep", name: "Frost Step", teacher: "Mirrorlake Dancer", world: 2, level: 11, cost: 950, mana: 30, heal: 18, guard: 10, icon: "frostStep" },
  { id: "moonPiercer", name: "Moon Piercer", teacher: "Aurora Spear-Sage", world: 2, level: 13, cost: 1250, mana: 52, multiplier: 3.15, icon: "moonPiercer" },
  { id: "dragonRoar", name: "Dragon Roar", teacher: "Cinder Voice", world: 3, level: 17, cost: 2100, mana: 64, multiplier: 2.1, weaken: 8, icon: "dragonRoar" },
  { id: "worldBreaker", name: "World Breaker", teacher: "Titan-Bone Master", world: 3, level: 20, cost: 3200, mana: 85, multiplier: 4.2, icon: "worldBreaker" },
];

const abilityTeachers = [
  [
    { x: 1180, y: 1580, abilityId: "powerStrike" },
    { x: 2500, y: 1920, abilityId: "arcaneGuard" },
  ],
  [
    { x: 1220, y: 1510, abilityId: "heroicCleave" },
    { x: 2740, y: 2140, abilityId: "sunFlare" },
  ],
  [
    { x: 1190, y: 1620, abilityId: "frostStep" },
    { x: 2940, y: 2120, abilityId: "moonPiercer" },
  ],
  [
    { x: 1260, y: 1640, abilityId: "dragonRoar" },
    { x: 3120, y: 2260, abilityId: "worldBreaker" },
  ],
];

const regionLayouts = [
  [
    { x: 95, y: 95, w: 610, h: 385, color: "rgba(92, 180, 105, 0.18)" },
    { x: 620, y: 225, w: 450, h: 450, color: "rgba(35, 105, 58, 0.2)" },
    { x: 1220, y: 165, w: 550, h: 430, color: "rgba(73, 160, 190, 0.22)" },
    { x: 620, y: 850, w: 420, h: 430, color: "rgba(130, 140, 170, 0.24)" },
    { x: 1290, y: 790, w: 410, h: 370, color: "rgba(255, 116, 60, 0.18)" },
    { x: 1810, y: 1010, w: 455, h: 420, color: "rgba(160, 70, 90, 0.24)" },
  ],
  [
    { x: 120, y: 205, w: 600, h: 330, color: "rgba(230, 190, 105, 0.22)" },
    { x: 650, y: 465, w: 470, h: 390, color: "rgba(70, 120, 55, 0.18)" },
    { x: 1130, y: 120, w: 460, h: 390, color: "rgba(245, 220, 145, 0.18)" },
    { x: 325, y: 910, w: 500, h: 420, color: "rgba(105, 80, 60, 0.24)" },
    { x: 1260, y: 880, w: 450, h: 390, color: "rgba(245, 145, 65, 0.2)" },
    { x: 1850, y: 590, w: 405, h: 500, color: "rgba(90, 180, 200, 0.2)" },
  ],
  [
    { x: 150, y: 190, w: 450, h: 370, color: "rgba(200, 245, 255, 0.16)" },
    { x: 590, y: 180, w: 440, h: 410, color: "rgba(65, 125, 165, 0.22)" },
    { x: 990, y: 515, w: 510, h: 380, color: "rgba(180, 245, 255, 0.22)" },
    { x: 500, y: 980, w: 480, h: 400, color: "rgba(80, 95, 120, 0.24)" },
    { x: 1240, y: 1020, w: 420, h: 360, color: "rgba(150, 110, 220, 0.16)" },
    { x: 1805, y: 1070, w: 420, h: 410, color: "rgba(90, 75, 180, 0.24)" },
  ],
  [
    { x: 110, y: 190, w: 520, h: 370, color: "rgba(150, 90, 75, 0.22)" },
    { x: 700, y: 230, w: 400, h: 410, color: "rgba(70, 65, 65, 0.24)" },
    { x: 1130, y: 130, w: 430, h: 410, color: "rgba(245, 80, 50, 0.18)" },
    { x: 700, y: 870, w: 460, h: 430, color: "rgba(40, 35, 45, 0.25)" },
    { x: 1290, y: 920, w: 430, h: 390, color: "rgba(255, 120, 50, 0.2)" },
    { x: 1850, y: 860, w: 420, h: 510, color: "rgba(190, 40, 55, 0.22)" },
  ],
];

const secretWeapons = [
  { name: "Moss-King Thornblade", damage: 32 },
  { name: "Sunken Wish Saber", damage: 48 },
  { name: "Starforged Moonbrand", damage: 70 },
  { name: "Dragonheart Worldsplitter", damage: 92 },
];

const weaponLooks = [
  { match: "Wooden", color: "#b9884b", edge: "#4b2d22", shine: "#d9b26b", shape: "training" },
  { match: "Needleblade", color: "#93e070", edge: "#315d2f", shine: "#d8ffd0", shape: "needle" },
  { match: "Knife", color: "#d8dde8", edge: "#4f5b66", shine: "#ffffff", shape: "dagger" },
  { match: "Rapier", color: "#aeeaff", edge: "#37687a", shine: "#f4fbff", shape: "rapier" },
  { match: "Cutter", color: "#ff8a3d", edge: "#7d2018", shine: "#ffd45a", shape: "cleaver" },
  { match: "Rootcleaver", color: "#93e070", edge: "#315d2f", shine: "#d8ffd0", shape: "cleaver" },
  { match: "Falchion", color: "#f6d27a", edge: "#946d2c", shine: "#fff0a0", shape: "falchion" },
  { match: "Breaker", color: "#aeeaff", edge: "#4e7688", shine: "#f4fbff", shape: "hammer" },
  { match: "Maulblade", color: "#ff6b3d", edge: "#5a1c14", shine: "#fff0a0", shape: "hammer" },
  { match: "Longsword", color: "#d8dde8", edge: "#7c8798", shine: "#f4efd7", shape: "longsword" },
  { match: "Scimitar", color: "#f6d27a", edge: "#946d2c", shine: "#fff0a0", shape: "curve" },
  { match: "Greatsword", color: "#aeeaff", edge: "#4e7688", shine: "#f4fbff", shape: "greatsword" },
  { match: "Crown Blade", color: "#ff6b3d", edge: "#7d2018", shine: "#ffd45a", shape: "flame" },
  { match: "Thornblade", color: "#93e070", edge: "#315d2f", shine: "#d8ffd0", shape: "thorn" },
  { match: "Saber", color: "#7bd6ff", edge: "#1f6380", shine: "#ecfbff", shape: "curve" },
  { match: "Moonbrand", color: "#d5ccff", edge: "#55419a", shine: "#ffffff", shape: "rune" },
  { match: "Worldsplitter", color: "#ff9a3d", edge: "#5a1c14", shine: "#fff0a0", shape: "greatsword" },
  { match: "Sword", color: "#d8dde8", edge: "#7c8798", shine: "#f4efd7", shape: "longsword" },
  { match: "Blade", color: "#ff6b3d", edge: "#7d2018", shine: "#ffd45a", shape: "flame" },
];

let game;
let lastTime = 0;
let titleOpen = true;
const eventLines = [];
const particles = [];
const floatingTexts = [];
const battleEffects = [];
let floorBannerTimer = 0;
let transitionTimer = 0;

function startGame() {
  game = {
    worldIndex: 0,
    coins: 0,
    rage: 0,
    level: 1,
    xp: 0,
    xpToNext: 50,
    baseStats: { attack: 10, defense: 5, speed: 5 },
    weapon: { name: "Wooden Sword", damage: 10 },
    armor: { name: "Cloth Armor", defense: 2 },
    mana: 100,
    maxMana: 100,
    inventory: { smallPotion: 1, largePotion: 0 },
    abilities: [],
    equippedAbilities: [],
    beatenWorlds: [],
    abandonedUnlocked: false,
    abandonedMode: false,
    abandonedBeatenWorlds: [],
    finalIslandBossesDefeated: [],
    speedBonus: 0,
    magnet: 28,
    hasRegionMap: false,
    hasMineKey: false,
    upgrades: { honing: 0, vitality: 0, focus: 0 },
    searchedHouses: [],
    worldStructures: {},
    inCamp: true,
    campObjects: [],
    player: { x: 320, y: 280, w: 22, h: 26, hp: 100, maxHp: 100, dirX: 1, dirY: 0, attackTimer: 0, hurtTimer: 0 },
    camera: { x: 0, y: 0 },
    houses: [],
    chests: [],
    hazards: [],
    discoveries: [],
    backrooms: null,
    stepsSinceAnomaly: 0,
    entities: [],
    coinsOnGround: [],
    portal: null,
    quest: null,
    secretQuest: { found: false, active: false, complete: false, keeperReady: false, keeperDefeated: false, keeperHp: {}, shards: 0, target: 6, claimedWorlds: [] },
    minibossRespawns: {},
    story: { chapter: 1, lastDiscovery: "" },
    bossDefeated: false,
    messageTimer: 0,
    menuOpen: false,
    battle: null,
    over: false,
  };
  buildCamp();
  showFloorBanner("Adventurer's Camp - Safe Haven", 2600);
  say("Adventurer's Camp: learn the controls, talk to the merchant, and enter Floor 1 when ready.");
}

function saveGame(manual = false) {
  if (!game || (game.menuOpen && !manual)) return;
  const save = {
    version: 2,
    savedAt: Date.now(),
    game: {
      ...game,
      battle: null,
      menuOpen: false,
      messageTimer: 0,
      camera: { ...game.camera },
      player: { ...game.player, attackTimer: 0, hurtTimer: 0 },
      backrooms: null,
      entities: game.entities.map((entity) => ({ ...entity })),
      coinsOnGround: game.coinsOnGround.map((coin) => ({ ...coin })),
      houses: game.houses.map((house) => ({ ...house })),
      chests: game.chests.map((chest) => ({ ...chest })),
      hazards: (game.hazards || []).map((hazard) => ({ ...hazard })),
      discoveries: game.discoveries.map((discovery) => ({ ...discovery })),
    },
  };
  localStorage.setItem(saveSlotKey(activeSaveSlot), JSON.stringify(save));
  updateTitleSlots();
  if (manual) say(`Saved your tale to Slot ${activeSaveSlot}.`, 2600);
}

function saveSlotKey(slot) {
  return `pixelDungeonWorldsSaveV3-slot-${slot}`;
}

function slotSummary(slot) {
  const raw = localStorage.getItem(saveSlotKey(slot));
  if (!raw) return null;
  try {
    const save = JSON.parse(raw);
    const g = save.game;
    if (!g) return null;
    return {
      level: g.level || 1,
      world: g.inCamp ? "Camp" : worlds[g.worldIndex]?.name || "Unknown",
      gold: g.coins || 0,
    };
  } catch {
    return null;
  }
}

function migrateOldSaveToSlotOne() {
  if (localStorage.getItem(saveSlotKey(1))) return;
  const old = localStorage.getItem(OLD_SAVE_KEY);
  if (old) localStorage.setItem(saveSlotKey(1), old);
}

function loadGame(slot = activeSaveSlot) {
  try {
    activeSaveSlot = slot;
    localStorage.setItem(ACTIVE_SLOT_KEY, String(activeSaveSlot));
    const raw = localStorage.getItem(saveSlotKey(activeSaveSlot));
    if (!raw) return false;
    const save = JSON.parse(raw);
    if (!save || save.version !== 2 || !save.game) return false;
    game = save.game;
    game.menuOpen = false;
    game.battle = null;
    game.backrooms = null;
    game.over = false;
    game.messageTimer = 0;
    game.rage ??= 0;
    game.inCamp ??= false;
    game.abandonedUnlocked ??= false;
    game.abandonedMode ??= false;
    game.abandonedBeatenWorlds ||= [];
    game.finalIslandBossesDefeated ||= [];
    game.campObjects ??= [];
    game.hazards ||= [];
    game.beatenWorlds = migrateBeatenWorlds(game);
    game.inventory ||= { smallPotion: 1, largePotion: 0 };
    game.abilities ||= [];
    game.equippedAbilities ||= game.abilities.slice(0, 4);
    game.equippedAbilities = game.equippedAbilities.filter((id) => game.abilities.includes(id)).slice(0, 4);
    game.upgrades ||= { honing: 0, vitality: 0, focus: 0 };
    game.upgrades.honing ??= 0;
    game.upgrades.vitality ??= 0;
    game.upgrades.focus ??= 0;
    game.worldStructures ||= {};
    if (Array.isArray(game.houses) && game.houses.length && !game.inCamp) {
      game.worldStructures[worldStructureKey()] ||= game.houses.map((house) => ({ ...house }));
    }
    game.secretQuest ||= { found: false, active: false, complete: false, keeperReady: false, keeperDefeated: false, keeperHp: {}, shards: 0, target: secretShardTarget(), claimedWorlds: [] };
    game.secretQuest.keeperReady ??= false;
    game.secretQuest.keeperDefeated ??= false;
    game.secretQuest.keeperHp ||= {};
    if (!game.secretQuest.target || game.secretQuest.target < secretShardTarget()) game.secretQuest.target = secretShardTarget();
    if (game.secretQuest.complete && !game.secretQuest.keeperDefeated) {
      game.secretQuest.complete = false;
      game.secretQuest.keeperReady = true;
    }
    game.secretQuest.claimedWorlds ||= [];
    game.minibossRespawns ||= {};
    game.quest = normalizeQuest(game.quest);
    game.story ||= { chapter: game.worldIndex + 1, lastDiscovery: "" };
    game.player.attackTimer = 0;
    game.player.hurtTimer = 0;
    closeMenu();
    ui.battlePanel.classList.add("is-hidden");
    updateCamera();
    refreshUi();
    updateTitleSlots();
    say(`Loaded Slot ${activeSaveSlot}.`, 2800);
    return true;
  } catch (error) {
    console.warn("Could not load save", error);
    return false;
  }
}

function migrateBeatenWorlds(savedGame) {
  const beaten = new Set(Array.isArray(savedGame.beatenWorlds) ? savedGame.beatenWorlds : []);
  for (let i = 0; i < savedGame.worldIndex; i++) beaten.add(i);
  if (savedGame.bossDefeated) beaten.add(savedGame.worldIndex);
  return [...beaten].filter((index) => index >= 0 && index < worlds.length).sort((a, b) => a - b);
}

function clearSaveAndRestart() {
  localStorage.removeItem(saveSlotKey(activeSaveSlot));
  startGame();
  saveGame();
}

function hasSaveFile() {
  return slotSummary(activeSaveSlot) || Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => slotSummary(i + 1)).some(Boolean);
}

function updateTitleSlots() {
  if (!ui.titleSlots) return;
  [...ui.titleSlots.querySelectorAll("[data-slot]")].forEach((button) => {
    const slot = Number(button.dataset.slot);
    const summary = slotSummary(slot);
    button.classList.toggle("is-selected", slot === activeSaveSlot);
    button.innerHTML = summary
      ? `Slot ${slot}<span>Lv ${summary.level} - ${summary.world} - ${summary.gold}g</span>`
      : `Slot ${slot}<span>Empty</span>`;
  });
  ui.continueButton.disabled = !slotSummary(activeSaveSlot);
  ui.loadButton.disabled = !hasSaveFile();
}

function closeTitle() {
  titleOpen = false;
  ui.titleOverlay.classList.add("is-hidden");
  refreshUi();
}

function continueFromTitle() {
  if (slotSummary(activeSaveSlot)) loadGame(activeSaveSlot);
  else if (hasSaveFile()) loadGame(firstFilledSlot());
  else startGame();
  closeTitle();
}

function newGameFromTitle() {
  const warning = `Start a fresh Level 1 character in Slot ${activeSaveSlot}? This overwrites that slot.`;
  if (slotSummary(activeSaveSlot) && !window.confirm(warning)) return;
  localStorage.removeItem(saveSlotKey(activeSaveSlot));
  startGame();
  saveGame();
  closeTitle();
}

function firstFilledSlot() {
  for (let slot = 1; slot <= SAVE_SLOT_COUNT; slot++) {
    if (slotSummary(slot)) return slot;
  }
  return activeSaveSlot;
}

function openLoadSlotMenu() {
  const actions = [];
  for (let slot = 1; slot <= SAVE_SLOT_COUNT; slot++) {
    const summary = slotSummary(slot);
    actions.push({
      label: summary ? `Load Slot ${slot} - Lv ${summary.level} - ${summary.world}` : `Slot ${slot} - Empty`,
      disabled: !summary,
      action: () => {
        loadGame(slot);
        closeTitle();
      },
    });
  }
  actions.push({ label: "Back", action: closeMenu });
  openMenu("Choose Save Slot", "Pick which adventure slot to play.", actions);
}

function showTitleInfo(title, text) {
  openMenu(title, text, [
    { label: "Back", action: closeMenu },
  ]);
}

function openMapMenu() {
  const beaten = accessibleWorlds();
  const text = game.inCamp
    ? "Use the Moon-Sealed Door in camp to revisit worlds whose final boss you have beaten."
    : `${currentRegionName()}\nPress Return to Camp to use the Moon-Sealed Door world gate.`;
  const actions = [
    ...beaten.map((index) => ({
      label: `Travel to ${worlds[index].name}`,
      action: () => travelToWorld(index),
    })),
  ];
  if (!game.inCamp && !game.backrooms && !game.battle) {
    actions.push({ label: "Return to Camp", action: returnToCamp });
  }
  actions.push({ label: "Close", action: closeMenu });
  openMenu("Map / World Gate", beaten.length ? text : `${text}\n\nNo conquered worlds yet. Beat a final boss to unlock world travel.`, actions);
}

function openCharacterMenu() {
  openMenu("Character", `ADVENTURER PAPER DOLL\nWeapon: ${game.weapon.name} (+${game.weapon.damage})\nArmor: ${game.armor.name} (+${game.armor.defense})\n\nCORE\nLevel ${game.level}    XP ${game.xp}/${game.xpToNext}\nHP ${Math.ceil(game.player.hp)}/${game.player.maxHp}    Mana ${Math.ceil(game.mana)}/${game.maxMana}    Rage ${game.rage || 0}\nATK ${game.baseStats.attack}    DEF ${game.baseStats.defense}    MAG 0    SPD ${totalSpeed()}\n\nCOMBAT\nCritical Chance 5%    Critical Damage 150%\nDodge 0%    Block 0%    Lifesteal 0%\nArmor Penetration 0    True Damage 0\n\nEXPLORATION\nLuck 0    Gold Find 0%    XP Gain 0%    Rare Find 0%`, [
    { label: "Close", action: closeMenu },
  ]);
}

function openInventoryMenu() {
  openMenu("Inventory", `CONSUMABLES\n[Common] Small Health Potion x${game.inventory.smallPotion} - Restores 50 HP\n[Common] Large Health Potion x${game.inventory.largePotion} - Restores a larger amount of HP\n\nEQUIPMENT\nWeapon: ${game.weapon.name} (+${game.weapon.damage})\nArmor: ${game.armor.name} (+${game.armor.defense})\n\nRARITY KEY\nCommon  Rare  Epic  Legendary  Mythic  Celestial  Void  Forbidden`, [
    { label: "Use small potion", disabled: game.inventory.smallPotion <= 0, action: () => {
      game.inventory.smallPotion -= 1;
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + 50);
      floatText(game.player.x, game.player.y - 28, "+50", "#70d66b");
      saveGame();
      closeMenu();
    } },
    { label: "Close", action: closeMenu },
  ]);
}

function openSkillsMenu() {
  const learned = knownAbilities();
  const equipped = equippedAbilities();
  const learnedText = learned.length
    ? learned.map((ability) => `${isAbilityEquipped(ability) ? "[EQUIPPED]" : "[KNOWN]"} ${ability.name} - ${abilityDescription(ability)}`).join("\n")
    : "None yet. Find ability teachers hidden in each world.";
  const teacherText = abilityUnlocks
    .filter((ability) => !hasAbility(ability))
    .map((ability) => `World ${ability.world + 1}: ${ability.teacher} teaches ${ability.name} at Level ${ability.level} for ${abilityGoldCost(ability)}g`)
    .join("\n") || "All teacher abilities learned.";
  const actions = learned.map((ability) => ({
    label: `${isAbilityEquipped(ability) ? "Unequip" : "Equip"} ${ability.name}`,
    disabled: !isAbilityEquipped(ability) && game.equippedAbilities.length >= 4,
    action: () => toggleEquippedAbility(ability),
  }));
  actions.push({ label: "Close", action: closeMenu });
  openMenu("Skills", `BATTLE LOADOUT (${equipped.length}/4)\n${equipped.length ? equipped.map((ability) => ability.name).join(", ") : "No special abilities equipped."}\n\nLEARNED ABILITIES\n${learnedText}\n\nTEACHERS TO FIND\n${teacherText}`, actions);
}

function toggleEquippedAbility(ability, returnNpc = null) {
  game.equippedAbilities ||= [];
  if (isAbilityEquipped(ability)) {
    game.equippedAbilities = game.equippedAbilities.filter((id) => id !== ability.id);
    say(`${ability.name} unequipped.`, 1800);
  } else if (hasAbility(ability) && game.equippedAbilities.length < 4) {
    game.equippedAbilities.push(ability.id);
    say(`${ability.name} equipped.`, 1800);
  }
  saveGame();
  if (returnNpc) openTeacher(returnNpc);
  else openSkillsMenu();
}

function isAbilityEquipped(ability) {
  return (game.equippedAbilities || []).includes(ability.id);
}

function abilityById(id) {
  return abilityUnlocks.find((ability) => ability.id === id);
}

function abilityGoldCost(ability) {
  const abandonedTax = game.abandonedMode ? 1.35 : 1;
  return Math.ceil((ability.cost || (90 + ability.world * 420 + ability.level * 35)) * abandonedTax);
}

function knownAbilities() {
  return abilityUnlocks.filter((ability) => hasAbility(ability));
}

function equippedAbilities() {
  return (game.equippedAbilities || [])
    .map((id) => abilityById(id))
    .filter(Boolean)
    .filter((ability) => hasAbility(ability));
}

function openQuestJournal() {
  const reward = secretWeapons[Math.min(game.worldIndex, secretWeapons.length - 1)];
  const quest = game.quest;
  const mainQuest = !quest
    ? "Main Quest: none active."
    : quest.complete
      ? `Main Quest: ready to turn in. Reward: gold, XP, and potion.`
      : quest.active
        ? `Main Quest: calm monsters. Progress ${quest.defeated}/${quest.target}.`
        : "Main Quest: talk to the quest NPC to start local route scouting.";
  const secret = game.secretQuest;
  const secretQuest = secret.claimedWorlds.includes(game.worldIndex)
    ? `Secret Weapon Quest: claimed ${reward.name} (+${reward.damage}).`
    : secret.complete
      ? `Secret Weapon Quest: ready to claim ${reward.name} (+${reward.damage}) from the Hidden Forger.`
      : secret.keeperReady
        ? `Secret Weapon Quest: ore complete. Fight the Gear Keeper at the Hidden Forger to earn ${reward.name} (+${reward.damage}).`
        : secret.active
        ? `Secret Weapon Quest: collect hidden ore shards from tough enemies only. Progress ${secret.shards}/${secret.target}. Then fight the Gear Keeper. Reward: ${reward.name} (+${reward.damage}).`
        : `Secret Weapon Quest: buy an Old Mine Key, collect ore, then beat the Gear Keeper. Reward: ${reward.name} (+${reward.damage}).`;
  openMenu("Quest Journal", `${mainQuest}\n\n${secretQuest}`, [
    { label: "Close", action: closeMenu },
  ]);
}

function abilityDescription(ability) {
  const specialDescriptions = {
    powerStrike: `Costs ${ability.mana} Mana. Heavy impact damage and removes 1 projectile from the enemy's next attack.`,
    arcaneGuard: `Costs ${ability.mana} Mana. Restores HP, creates a stronger shield, and reflects the next hit.`,
    heroicCleave: `Costs ${ability.mana} Mana. Cleaves for boss-scaling damage and cuts 2 attacks from the next pattern.`,
    sunFlare: `Costs ${ability.mana} Mana. Explodes into fire damage and burns the enemy for 3 turns.`,
    frostStep: `Costs ${ability.mana} Mana. Heals, creates ice guard, and slows the next attack wave.`,
    moonPiercer: `Costs ${ability.mana} Mana. Pierces bosses for bonus max-HP damage and makes the next wave aim cleaner.`,
    dragonRoar: `Costs ${ability.mana} Mana. Deals roar damage, lowers enemy damage, and removes 2 attacks from the next pattern.`,
    worldBreaker: `Costs ${ability.mana} Mana. Cracks the arena, deals execute-style damage, gives guard, and slows the next 3 rhythms.`,
  };
  if (specialDescriptions[ability.id]) return specialDescriptions[ability.id];
  const parts = [`Costs ${ability.mana} Mana`];
  if (ability.multiplier) parts.push(`deals about ${Math.round(ability.multiplier * 100)}% weapon damage`);
  if (ability.heal) parts.push(`restores ${ability.heal} HP`);
  if (ability.guard) parts.push(`blocks ${ability.guard} incoming damage`);
  if (ability.burn) parts.push(`adds ${ability.burn} burn damage`);
  if (ability.weaken) parts.push(`lowers enemy damage by ${ability.weaken}`);
  return `${parts.join(". ")}.`;
}

function openPauseMenu() {
  const actions = [
    { label: "Resume", action: closeMenu },
    { label: "Character", action: openCharacterMenu },
    { label: "Inventory", action: openInventoryMenu },
    { label: "Skills", action: openSkillsMenu },
    { label: "Map / Worlds", action: openMapMenu },
    { label: "Save", action: () => saveGame(true) },
    { label: "New Run", action: clearSaveAndRestart },
    { label: "Return to title", action: () => {
      closeMenu();
      titleOpen = true;
      ui.titleOverlay.classList.remove("is-hidden");
    } },
  ];
  if (!game.inCamp && !game.backrooms && !game.battle) {
    actions.splice(5, 0, { label: "Return to Camp", action: returnToCamp });
  }
  openMenu("Paused", "The dungeon waits. Save before doing anything reckless, naturally.", actions);
}

function buildWorld() {
  const world = worlds[game.worldIndex];
  const worldBeaten = currentWorldBeaten(game.worldIndex);
  game.entities = [];
  game.coinsOnGround = [];
  game.chests = [];
  game.discoveries = [];
  game.hazards = generateWorldHazards();
  game.backrooms = null;
  game.houses = structuresForCurrentWorld(world);
  game.portal = null;
  game.quest = createGeneratedQuest();
  game.bossDefeated = worldBeaten;
  const shopHouse = game.houses.find((house) => house.role === "shop");
  game.player.x = shopHouse ? shopHouse.x + shopHouse.w / 2 : 330;
  game.player.y = shopHouse ? shopHouse.y + shopHouse.h + 66 : 365;
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + 45);

  spawnStructureNpcs(world);
  spawnAbilityTeachers();
  if (worldBeaten) {
    game.portal = nextWorldAvailable() ? { x: 3220, y: 1660, w: 44, h: 44 } : null;
  }
  spawnWorldBosses();

  world.spawns.forEach((spot, index) => {
    const template = world.monsters[index % world.monsters.length];
    const spread = spreadSpawnSpot(spot, index);
    spawnMonster(spread.x, spread.y, template);
  });
  spawnExtraMobs(world);

  generateChests();
  generateDiscoveries();

  for (let i = 0; i < 38; i++) {
    game.coinsOnGround.push({
      x: 120 + Math.random() * (MAP_W - 240),
      y: 120 + Math.random() * (MAP_H - 240),
      value: 1 + Math.floor(Math.random() * 3),
      bob: Math.random() * 100,
    });
  }

  closeMenu();
  updateCamera();
}

function currentWorldRoutes() {
  const routes = worlds[game.worldIndex].routes;
  const expansion = [
    { x: 2120, y: 1240, w: 780, h: 78 },
    { x: 2860, y: 760, w: 78, h: 558 },
    { x: 2860, y: 760, w: 520, h: 78 },
    { x: 3190, y: 760, w: 78, h: 900 },
    { x: 1960, y: 1660, w: 1260, h: 78 },
    { x: 1960, y: 1280, w: 78, h: 458 },
    { x: 580, y: 1750, w: 1450, h: 78 },
    { x: 580, y: 1300, w: 78, h: 528 },
    { x: 3220, y: 1660, w: 1120, h: 78 },
    { x: 4260, y: 1660, w: 78, h: 980 },
    { x: 2820, y: 2480, w: 1518, h: 78 },
    { x: 2820, y: 1880, w: 78, h: 678 },
    { x: 980, y: 2420, w: 1900, h: 78 },
    { x: 980, y: 1750, w: 78, h: 748 },
  ];
  return routes.concat(expansion);
}

function generateWorldStructures(world) {
  const blueprints = [
    { key: "shop", w: 160, h: 122, label: "Tinker Shop", loot: "coins", role: "shop" },
    { key: "quest", w: 150, h: 112, label: "Story Hall", loot: "heal", role: "quest" },
    { key: "elder", w: 164, h: 118, label: "Village Elder House", loot: "mixed", role: "talk" },
    { key: "forge", w: 176, h: 128, label: "Hidden Forge", loot: "mixed", role: "secret" },
    { key: "home", w: 172, h: 126, label: "Grandmother House", loot: "mixed" },
    { key: "inn", w: 150, h: 118, label: "Lantern Inn", loot: "heal" },
    { key: "barn", w: 180, h: 130, label: "Moon Barn", loot: "coins" },
    { key: "cabin", w: 150, h: 118, label: "Hidden Cottage", loot: "mixed" },
  ];
  const placed = [];
  blueprints.forEach((blueprint, index) => {
    const house = placeWorldStructure(blueprint, index, placed);
    placed.push({
      id: `${worldStructureKey()}-${blueprint.key}`,
      ...house,
      label: blueprint.label,
      loot: blueprint.loot,
      role: blueprint.role || "",
    });
  });
  return placed;
}

function structuresForCurrentWorld(world) {
  game.worldStructures ||= {};
  const key = worldStructureKey();
  if (!Array.isArray(game.worldStructures[key]) || !game.worldStructures[key].length) {
    game.worldStructures[key] = generateWorldStructures(world).map((house) => ({ ...house }));
  }
  return game.worldStructures[key].map((house) => ({ ...house }));
}

function worldStructureKey(index = game.worldIndex, abandoned = game.abandonedMode) {
  return `${abandoned ? "abandoned" : "normal"}-${index}`;
}

function placeWorldStructure(blueprint, index, placed) {
  const routes = currentWorldRoutes();
  for (let attempt = 0; attempt < 90; attempt++) {
    const route = routes[(index * 3 + attempt + Math.floor(Math.random() * routes.length)) % routes.length];
    const horizontal = route.w >= route.h;
    const side = Math.random() < 0.5 ? -1 : 1;
    const along = horizontal
      ? route.x + 45 + Math.random() * Math.max(40, route.w - 90)
      : route.y + 45 + Math.random() * Math.max(40, route.h - 90);
    const offset = 82 + Math.random() * 165;
    const x = horizontal
      ? along - blueprint.w / 2
      : route.x + route.w / 2 + side * offset - blueprint.w / 2;
    const y = horizontal
      ? route.y + route.h / 2 + side * offset - blueprint.h / 2
      : along - blueprint.h / 2;
    const house = {
      x: Math.round(clamp(x, 70, MAP_W - blueprint.w - 70)),
      y: Math.round(clamp(y, 70, MAP_H - blueprint.h - 70)),
      w: blueprint.w,
      h: blueprint.h,
    };
    if (structureLocationOk(house, placed)) return house;
  }
  return {
    x: Math.round(clamp(190 + index * 235, 70, MAP_W - blueprint.w - 70)),
    y: Math.round(clamp(170 + (index % 3) * 285, 70, MAP_H - blueprint.h - 70)),
    w: blueprint.w,
    h: blueprint.h,
  };
}

function structureLocationOk(house, placed) {
  const center = { x: house.x + house.w / 2, y: house.y + house.h / 2 };
  if (nearPath(center.x, center.y)) return false;
  const padded = { x: house.x - 46, y: house.y - 46, w: house.w + 92, h: house.h + 92 };
  if (currentWorldRoutes().some((route) => rectsOverlap(padded, route))) return false;
  if (placed.some((other) => rectsOverlap(padded, other))) return false;
  return true;
}

function spawnStructureNpcs(world) {
  const npcByRole = {
    shop: { name: world.shopNpc, role: "shop" },
    quest: { name: world.questNpc, role: "quest" },
    talk: { name: "Village Elder", role: "talk" },
    secret: { name: "Hidden Forger", role: "secret" },
  };
  game.houses.forEach((house) => {
    const npc = npcByRole[house.role];
    if (!npc) return;
    spawnNpc(house.x + house.w / 2, house.y + house.h + 32, npc.name, npc.role);
  });
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function buildCamp() {
  game.inCamp = true;
  game.entities = [];
  game.coinsOnGround = [];
  game.chests = [];
  game.discoveries = [];
  game.backrooms = null;
  game.portal = null;
  game.quest = createGeneratedQuest();
  game.bossDefeated = false;
  game.houses = [
    { id: "camp-merchant", x: 210, y: 520, w: 168, h: 116, label: "Pip's Starter Stall", loot: "none" },
    { id: "camp-blacksmith", x: 650, y: 185, w: 188, h: 126, label: "Cold Anvil Smithy", loot: "none" },
  ];
  game.campObjects = [
    { id: "campfire", type: "campfire", x: 560, y: 560, w: 46, h: 46, label: "Storyfire" },
    { id: "sealed-door", type: "sealedDoor", x: 1090, y: 285, w: 86, h: 108, label: "Moon-Sealed Door" },
    { id: "dungeon-entrance", type: "dungeonEntrance", x: 1110, y: 1035, w: 132, h: 98, label: "Dungeon Entrance" },
    { id: "dummy", type: "dummy", x: 720, y: 760, w: 34, h: 58, hp: 999, maxHp: 999, label: "Training Dummy" },
  ];
  game.player.x = 560;
  game.player.y = 650;
  spawnNpc(330, 665, "Pip the Pack-Seller", "shop");
  spawnNpc(760, 355, "Anvil Auntie", "smithLocked");
  spawnNpc(470, 590, "Old Campfire Keeper", "campGuide");
  closeMenu();
  updateCamera();
}

function generateDiscoveries() {
  const world = worlds[game.worldIndex];
  game.discoveries = world.landmarks.map((text, index) => ({
    id: `w${game.worldIndex}-discovery-${index}`,
    x: 540 + ((index * 610 + game.worldIndex * 170) % 1500),
    y: 250 + ((index * 370 + game.worldIndex * 210) % 980),
    text,
    found: false,
  }));
}

function generateChests() {
  for (let i = 0; i < 10; i++) {
    let chest;
    do {
      chest = {
        id: `w${game.worldIndex}-chest-${i}`,
        x: 90 + Math.random() * (MAP_W - 180),
        y: 90 + Math.random() * (MAP_H - 180),
        w: 24,
        h: 20,
        hidden: i >= 6,
        opened: false,
      };
    } while (nearPath(chest.x, chest.y) || game.houses.some((house) => rectTouchesHouse(chest, house)));
    game.chests.push(chest);
  }
}

function rectTouchesHouse(rect, house) {
  return rect.x + rect.w / 2 > house.x - 20 &&
    rect.x - rect.w / 2 < house.x + house.w + 20 &&
    rect.y + rect.h / 2 > house.y - 20 &&
    rect.y - rect.h / 2 < house.y + house.h + 20;
}

function spawnNpc(x, y, name, role, extra = {}) {
  game.entities.push({ type: "npc", role, name, x, y, w: 24, h: 28, color: role === "shop" ? "#e8cb87" : "#99e3bf", ...extra });
}

function spawnAbilityTeachers() {
  (abilityTeachers[game.worldIndex] || []).forEach((teacher) => {
    const ability = abilityById(teacher.abilityId);
    if (!ability) return;
    spawnNpc(teacher.x, teacher.y, ability.teacher, "teacher", { abilityId: ability.id });
  });
}

function spawnMonster(x, y, template) {
  const hp = scaledMonsterHp(template);
  const damage = Math.ceil(template.damage * (game.abandonedMode ? 1.55 : 1));
  const level = template.level + (game.abandonedMode ? 8 : 0);
  game.entities.push({ ...template, type: "monster", x, y, spawnX: x, spawnY: y, w: 24, h: 24, hp, maxHp: hp, damage, level, hurtTimer: 0 });
}

function spreadSpawnSpot(spot, index) {
  const spreadX = 1.36 + game.worldIndex * 0.04;
  const spreadY = 1.34 + game.worldIndex * 0.04;
  const bandX = (index % 4) * 130 + Math.floor(index / 4) * 54;
  const bandY = Math.floor(index / 4) * 170 + (index % 3) * 42;
  return {
    x: clamp(Math.round(spot[0] * spreadX + bandX + game.worldIndex * 80), 110, MAP_W - 110),
    y: clamp(Math.round(spot[1] * spreadY + bandY + game.worldIndex * 70), 110, MAP_H - 110),
  };
}

function scaledMonsterHp(template) {
  const worldIndex = game?.worldIndex || 0;
  const worldHpScale = (1 + worldIndex * 0.18) * (game.abandonedMode ? 2.35 : 1);
  const baseHp = Math.ceil(template.hp * worldHpScale);
  if (!game?.weapon) return baseHp;

  const shopDamage = worlds[worldIndex]?.weapon?.damage || 10;
  const overgeared = Math.max(0, game.weapon.damage - shopDamage);
  if (overgeared <= 0) return baseHp;

  const basicHit = totalAttack() + Math.max(0, game.level - template.level) * 2 + 5;
  const desiredHits = 1.85 + worldIndex * 0.18 + Math.min(0.45, overgeared / 80);
  const antiOneTapHp = Math.ceil(basicHit * desiredHits + template.level * 3);
  return Math.max(baseHp, antiOneTapHp);
}

function reinforceMonsterForCurrentGear(enemy) {
  if (!enemy || enemy.type !== "monster") return;
  const newMaxHp = scaledMonsterHp(enemy);
  if (newMaxHp <= enemy.maxHp) return;
  const wasFullHealth = enemy.hp >= enemy.maxHp;
  const missingHp = Math.max(0, enemy.maxHp - enemy.hp);
  enemy.maxHp = newMaxHp;
  enemy.hp = wasFullHealth ? newMaxHp : Math.max(1, newMaxHp - missingHp);
}

function spawnBoss(x, y, template, finalBoss = false, lairIndex = -1) {
  const size = finalBoss ? 64 : 54;
  const abandonedScale = game.abandonedMode ? 1.6 : 1;
  const hpScale = (finalBoss ? 1.45 : 1.28) * abandonedScale;
  const damageScale = (finalBoss ? 1.28 : 1.18) * (game.abandonedMode ? 1.35 : 1);
  const hp = Math.ceil(template.hp * hpScale);
  const damage = Math.ceil(template.damage * damageScale);
  const level = template.level + (game.abandonedMode ? 8 : 0);
  game.entities.push({ ...template, type: "boss", finalBoss, lairIndex, x, y, spawnX: x, spawnY: y, w: size, h: size, hp, maxHp: hp, damage, level, hurtTimer: 0 });
}

function spawnWorldBosses() {
  const lairs = bossLairs[game.worldIndex] || [];
  lairs.forEach((lair, index) => {
    if (lair.final && hasBeatenWorld(game.worldIndex)) return;
    if (!lair.final && minibossRespawnRemaining(game.worldIndex, index) > 0) return;
    const template = lair.final ? worlds[game.worldIndex].boss : lair.template;
    spawnBoss(lair.x, lair.y, template, !!lair.final, index);
  });
}

function spawnExtraMobs(world) {
  const routes = currentWorldRoutes();
  for (let i = 0; i < 24; i++) {
    const route = routes[(i * 2 + game.worldIndex) % routes.length];
    const side = i % 2 === 0 ? -1 : 1;
    const x = clamp(route.x + ((i * 311) % Math.max(140, route.w)) + side * (180 + (i % 5) * 54), 95, MAP_W - 95);
    const y = clamp(route.y + ((i * 397) % Math.max(140, route.h)) - side * (160 + (i % 4) * 58), 95, MAP_H - 95);
    if (game.houses.some((house) => rectTouchesHouse({ x, y, w: 24, h: 24 }, house))) continue;
    if (game.entities.some((entity) => (entity.type === "monster" || entity.type === "boss") && distance(entity, { x, y }) < 180)) continue;
    const template = world.monsters[(i + Math.floor(i / 3)) % world.monsters.length];
    spawnMonster(x, y, template);
  }
}

function say(text, time = 2600) {
  ui.message.textContent = text;
  game.messageTimer = time;
  addLog(text);
}

function addLog(text) {
  if (!text) return;
  eventLines.unshift(text);
  eventLines.length = Math.min(eventLines.length, 5);
  ui.eventLog.innerHTML = eventLines.map((line) => `<div>${escapeHtml(line)}</div>`).join("");
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char]);
}

function spawnParticle(x, y, color, count = 1) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: Math.random() * 1.4 - 0.7,
      vy: -0.5 - Math.random() * 1.2,
      life: 480 + Math.random() * 420,
      maxLife: 900,
      color,
      size: 2 + Math.random() * 3,
    });
  }
}

function floatText(x, y, text, color = "#f4efd7") {
  floatingTexts.push({ x, y, text, color, life: 900, maxLife: 900 });
}

function update(delta) {
  if (titleOpen) return;
  if (game.over) {
    updateDeathRush(delta);
    if (keys.has("r")) startGame();
    return;
  }

  if (game.battle) {
    updateBattle(delta);
  } else if (!game.menuOpen) {
    updatePlayer(delta);
    if (game.backrooms) {
      updateBackrooms(delta);
    } else if (game.inCamp) {
      updateMinibossRespawns(delta);
      collectCoins();
    } else {
      collectCoins();
      checkDiscoveries();
      updateHazards(delta);
      updateMinibossRespawns(delta);
      updateEnemies(delta);
      updatePortal();
    }
  }

  game.player.attackTimer = Math.max(0, game.player.attackTimer - delta);
  game.player.hurtTimer = Math.max(0, game.player.hurtTimer - delta);
  game.messageTimer = Math.max(0, game.messageTimer - delta);
  floorBannerTimer = Math.max(0, floorBannerTimer - delta);
  transitionTimer = Math.max(0, transitionTimer - delta);
  uiRefreshTimer = Math.max(0, uiRefreshTimer - delta);
  updateVisualEffects(delta);
  saveTimer += delta;
  if (saveTimer > 5000 && !game.battle && !game.backrooms && !game.over) {
    saveTimer = 0;
    saveGame();
  }
  updateCamera();
  updateOverlays();
  if (uiRefreshTimer <= 0 || game.battle) {
    uiRefreshTimer = game.battle ? 80 : 180;
    refreshUi();
  }
}

function updateOverlays() {
  const prompt = currentInteractionPrompt();
  ui.interactionPrompt.textContent = prompt;
  ui.interactionPrompt.classList.toggle("is-hidden", !prompt);
  ui.floorBanner.classList.toggle("is-hidden", floorBannerTimer <= 0);
  ui.screenFade.classList.toggle("is-hidden", transitionTimer <= 0);
  ui.screenFade.classList.toggle("is-active", transitionTimer > 120);
}

function showFloorBanner(text, time = 2400) {
  ui.floorBanner.textContent = text;
  floorBannerTimer = time;
}

function startTransition(time = 360) {
  transitionTimer = time;
}

function updateVisualEffects(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.012;
    p.life -= delta;
    if (p.life <= 0) particles.splice(i, 1);
  }
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const text = floatingTexts[i];
    text.y -= delta * 0.035;
    text.life -= delta;
    if (text.life <= 0) floatingTexts.splice(i, 1);
  }
  for (let i = battleEffects.length - 1; i >= 0; i--) {
    const effect = battleEffects[i];
    effect.life -= delta;
    effect.age = (effect.age || 0) + delta;
    if (effect.life <= 0) battleEffects.splice(i, 1);
  }
  if (game?.inCamp && !titleOpen && Math.random() < 0.22) {
    spawnParticle(330 + Math.random() * 18 - 9, 402 + Math.random() * 10, "#ffb33d", 1);
  }
}

function updatePlayer() {
  const player = game.player;
  const speed = 1.7 + totalSpeed() * 0.13 + game.speedBonus + (keys.has("shift") ? 0.85 : 0);
  let mx = 0;
  let my = 0;

  if (keys.has("arrowleft") || keys.has("a")) mx -= 1;
  if (keys.has("arrowright") || keys.has("d")) mx += 1;
  if (keys.has("arrowup") || keys.has("w")) my -= 1;
  if (keys.has("arrowdown") || keys.has("s")) my += 1;

  if (mx || my) {
    const len = Math.hypot(mx, my);
    mx /= len;
    my /= len;
    player.dirX = mx;
    player.dirY = my;
    movePlayer(mx * speed, my * speed);
    maybeFallThroughFloor();
  }
}

function maybeFallThroughFloor() {
  if (game.inCamp || game.backrooms || game.menuOpen || game.battle) return;
  game.stepsSinceAnomaly += 1;
  if (Math.random() >= 1 / 1000000) return;
  const walls = createBackroomsWalls();
  const exits = createBackroomsExits(walls);
  game.backrooms = {
    returnX: game.player.x,
    returnY: game.player.y,
    exits,
    walls,
    bodies: createBackroomsBodies(walls, exits),
    entities: createBackroomsEntities(walls),
    hum: Math.random() * 100,
    hitCooldown: 0,
    time: 0,
    spawnTimer: 18000 + Math.random() * 8000,
    darkness: 0,
    deathRush: null,
  };
  game.player.x = 1120;
  game.player.y = 940;
  game.stepsSinceAnomaly = 0;
  say("The floor forgets you. You fall into a humming yellow place between rooms.", 5200);
}

function createBackroomsWalls() {
  const walls = [
    { x: 0, y: 0, w: MAP_W, h: 36 },
    { x: 0, y: MAP_H - 36, w: MAP_W, h: 36 },
    { x: 0, y: 0, w: 36, h: MAP_H },
    { x: MAP_W - 36, y: 0, w: 36, h: MAP_H },
  ];

  for (let i = 0; i < 9; i++) {
    const vertical = Math.random() < 0.52;
    if (vertical) addWallWithGap(walls, 260 + Math.random() * 1840, 120 + Math.random() * 180, 64, 980 + Math.random() * 320, "v");
    else addWallWithGap(walls, 170 + Math.random() * 250, 190 + Math.random() * 1140, 1420 + Math.random() * 620, 64, "h");
  }

  // Keep the entry chamber from becoming a sealed closet.
  walls.push({ x: 780, y: 760, w: 320, h: 54 });
  walls.push({ x: 1260, y: 1010, w: 420, h: 54 });
  const entry = { x: 1120, y: 940, w: 220, h: 180 };
  return walls.filter((wall) => !rectOverlaps(entry, wall) || wall.x <= 36 || wall.y <= 36 || wall.x + wall.w >= MAP_W - 36 || wall.y + wall.h >= MAP_H - 36);
}

function addWallWithGap(walls, x, y, w, h, axis) {
  const gap = 170 + Math.random() * 120;
  if (axis === "v") {
    const gapY = y + 160 + Math.random() * Math.max(80, h - gap - 260);
    walls.push({ x, y, w, h: Math.max(80, gapY - y) });
    walls.push({ x, y: gapY + gap, w, h: Math.max(80, y + h - gapY - gap) });
  } else {
    const gapX = x + 180 + Math.random() * Math.max(80, w - gap - 300);
    walls.push({ x, y, w: Math.max(90, gapX - x), h });
    walls.push({ x: gapX + gap, y, w: Math.max(90, x + w - gapX - gap), h });
  }
}

function createBackroomsExits(walls) {
  return [findOpenBackroomsSpot(walls, 1780, 1040, 540, 420)];
}

function createBackroomsBodies(walls, exits) {
  const bodies = [];
  for (let i = 0; i < 7; i++) {
    const body = findOpenBackroomsSpot(walls, 120, 150, MAP_W - 240, MAP_H - 300);
    if (exits.every((exit) => distance(body, exit) > 260) && distance(body, { x: 1120, y: 940 }) > 220) {
      bodies.push({
        ...body,
        angle: Math.random() * Math.PI,
        armA: 32 + Math.random() * 48,
        armB: 24 + Math.random() * 58,
        legA: 38 + Math.random() * 70,
        legB: 34 + Math.random() * 76,
      });
    }
  }
  return bodies;
}

function findOpenBackroomsSpot(walls, x, y, w, h) {
  for (let i = 0; i < 80; i++) {
    const spot = { x: x + Math.random() * w, y: y + Math.random() * h, w: 36, h: 48 };
    if (!walls.some((wall) => rectOverlaps(spot, wall))) return { x: spot.x, y: spot.y };
  }
  return { x: 2100, y: 1250 };
}

function rectOverlaps(a, b) {
  return a.x + a.w / 2 > b.x &&
    a.x - a.w / 2 < b.x + b.w &&
    a.y + a.h / 2 > b.y &&
    a.y - a.h / 2 < b.y + b.h;
}

function createBackroomsEntities(walls) {
  const first = findOpenBackroomsSpot(walls, 260, 1060, 480, 360);
  const second = findOpenBackroomsSpot(walls, 1780, 130, 440, 360);
  return [
    createBackroomsEntity(first.x, first.y, 0),
    createBackroomsEntity(second.x, second.y, 2.4),
  ];
}

function createBackroomsEntity(x, y, phase = 0) {
  const countBonus = game.backrooms ? game.backrooms.entities.length : 0;
  const level = Math.max(8, game.level + 5 + countBonus);
  return {
    name: "Smiler",
    x,
    y,
    w: 34,
    h: 58,
    hp: 260 + level * 24,
    maxHp: 260 + level * 24,
    damage: 26 + level * 2,
    speed: 0.95 + Math.random() * 0.22,
    level,
    type: "backroomsBoss",
    coins: 80 + level * 8,
    xp: 95 + level * 9,
    phase,
    dashCooldown: 2200 + Math.random() * 2400,
    dashTimer: 0,
    dashX: 0,
    dashY: 0,
    path: [],
    pathTimer: 0,
    bodyW: 20 + Math.random() * 18,
    bodyH: 42 + Math.random() * 34,
    neck: Math.random() * 16,
    leftArm: 38 + Math.random() * 60,
    rightArm: 38 + Math.random() * 72,
    leftLeg: 48 + Math.random() * 72,
    rightLeg: 48 + Math.random() * 86,
    faceShakeRate: 4 + Math.random() * 9,
  };
}

function movePlayer(dx, dy) {
  const p = game.player;
  const oldX = p.x;
  const oldY = p.y;
  p.x = clamp(p.x + dx, 34, MAP_W - 34);
  p.y = clamp(p.y + dy, 42, MAP_H - 42);
  if ((game.backrooms && hitsBackroomsWall(p)) || (!game.backrooms && (hitsHouse(p) || hitsCampObject(p)))) {
    p.x = oldX;
    p.y = oldY;
  }
}

function generateWorldHazards() {
  if (game.worldIndex !== 3) return [];
  return [
    { type: "lava", x: 540, y: 560, w: 260, h: 150 },
    { type: "lava", x: 1120, y: 660, w: 330, h: 140 },
    { type: "lava", x: 1960, y: 360, w: 300, h: 170 },
    { type: "lava", x: 2320, y: 1110, w: 360, h: 160 },
    { type: "lava", x: 980, y: 1500, w: 420, h: 150 },
    { type: "lava", x: 2880, y: 1500, w: 330, h: 170 },
  ];
}

function updateHazards(delta) {
  if (game.worldIndex !== 3 || game.inCamp || game.backrooms || game.battle) return;
  game.player.lavaCooldown = Math.max(0, (game.player.lavaCooldown || 0) - delta);
  const lava = (game.hazards || []).find((hazard) => hazard.type === "lava" && pointInRect(game.player, hazard));
  if (!lava || game.player.lavaCooldown > 0) return;
  game.player.lavaCooldown = 1600;
  floatText(game.player.x, game.player.y - 48, "HOT!", "#ff8a38");
}

function pointInRect(point, rect) {
  return point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h;
}

function attack() {
  if (game.battle) {
    playerBattleAttack();
    return;
  }
  if (game.menuOpen || game.player.attackTimer > 0) return;
  if (game.backrooms) {
    const target = game.backrooms.entities.find((entity) => distance(game.player, entity) < 74);
    if (target) {
      startBackroomsBoss(target);
      game.player.attackTimer = 330;
      return;
    }
    game.player.attackTimer = 330;
    say("Your sword cuts only buzzing air. The Smilers notice the sound.", 1300);
    return;
  }
  if (game.inCamp) {
    const dummy = game.campObjects.find((item) => item.type === "dummy" && distance(game.player, item) < 82);
    game.player.attackTimer = 330;
    say(dummy ? "Thwack. The dummy survives heroically. Real enemies will start turn battles." : "You practice a basic swing.", 1300);
    return;
  }

  const p = game.player;
  const hit = {
    x: p.x + p.dirX * 28,
    y: p.y + p.dirY * 28,
    w: 48,
    h: 48,
  };

  let struck = false;
  game.entities.forEach((entity) => {
    if ((entity.type === "monster" || entity.type === "boss") && overlapsCentered(hit, entity)) {
      startBattle(entity);
      struck = true;
    }
  });

  p.attackTimer = 330;
  say(struck ? "Battle started. Choose Fight, Item, Spare, or Run." : "Left click near an enemy to start an RPG battle.", 900);
}

function defeat(entity) {
  const reward = enemyReward(entity);
  let extraMessage = "";
  if (entity.type === "backroomsBoss") {
    game.coins += reward.coins;
    gainXp(reward.xp);
    game.mana = Math.min(game.maxMana, game.mana + 35);
    say(`${entity.name} collapses wrong-side-out. Reward: ${reward.coins} coins, ${reward.xp} XP, and 35 Mana.`, 3600);
  } else if (entity.secretKeeper) {
    game.coins += reward.coins;
    gainXp(reward.xp);
    scatterCoins(entity.x, entity.y, reward.drops, reward.coinValue);
    game.secretQuest.complete = true;
    game.secretQuest.keeperReady = false;
    game.secretQuest.keeperDefeated = true;
    game.secretQuest.active = false;
    delete game.secretQuest.keeperHp[game.worldIndex];
    say(`${entity.name} defeated. Return to the Hidden Forger and claim the sealed weapon.`, 3800);
  } else if (entity.type === "boss") {
    if (game.worldIndex === worlds.length - 1 && !game.abandonedMode && !entity.finalBoss) {
      markFinalIslandBossDefeated(entity.lairIndex);
    }
    if (entity.finalBoss) {
      game.bossDefeated = true;
      markWorldBeaten(game.worldIndex);
      if (game.worldIndex === worlds.length - 1 && !game.abandonedMode) {
        if (finalIslandBossesCleared()) {
          game.abandonedUnlocked = true;
          extraMessage = " Abandoned islands have awakened at the Moon-Sealed Door.";
        } else {
          extraMessage = " The island refuses to abandon itself until every final-island boss has fallen.";
        }
      }
      game.portal = nextWorldAvailable() ? { x: entity.x, y: entity.y, w: 44, h: 44 } : null;
      if (game.portal) {
        const portalText = portalLocationText(game.portal);
        extraMessage += ` Portal opened at ${portalText}.`;
        showFloorBanner(`Portal opened: ${portalText}`, 3600);
      }
    } else {
      const respawnTime = scheduleMinibossRespawn(entity);
      extraMessage = ` It will respawn in ${formatClock(respawnTime)}.`;
    }
    game.coins += reward.coins;
    gainXp(reward.xp);
    scatterCoins(entity.x, entity.y, reward.drops, reward.coinValue);
    extraMessage += maybeDropSecretOre(reward, entity);
    advanceQuest("monster", entity);
    extraMessage += maybeUnlockAbandonedIslands();
    say(`${entity.name} defeated. ${entity.finalBoss ? "World boss" : "Miniboss"} reward: ${reward.coins} coins and ${reward.xp} XP.`, 3400);
  } else {
    game.coins += reward.coins;
    gainXp(reward.xp);
    scatterCoins(entity.x, entity.y, reward.drops, reward.coinValue);
    extraMessage = maybeDropSecretOre(reward, entity);
    advanceQuest("monster", entity);
  }
  entity.dead = true;
  return extraMessage;
}

function scheduleMinibossRespawn(entity) {
  if (entity.lairIndex == null || entity.lairIndex < 0) return 0;
  game.minibossRespawns ||= {};
  const seconds = 90 + Math.min(45, entity.level * 2);
  const ms = seconds * 1000;
  game.minibossRespawns[minibossRespawnKey(game.worldIndex, entity.lairIndex)] = ms;
  return ms;
}

function updateMinibossRespawns(delta) {
  if (game.backrooms || game.battle || game.menuOpen) return;
  game.minibossRespawns ||= {};
  Object.keys(game.minibossRespawns).forEach((key) => {
    const [worldText, lairText] = key.split("-");
    const worldIndex = Number(worldText);
    const lairIndex = Number(lairText);
    game.minibossRespawns[key] -= delta;
    if (game.minibossRespawns[key] > 0) return;
    if (game.inCamp) return;
    if (worldIndex !== game.worldIndex) return;
    const lairs = bossLairs[game.worldIndex] || [];
    const lair = lairs[lairIndex];
    if (!lair || lair.final || game.entities.some((entity) => entity.type === "boss" && entity.lairIndex === lairIndex && !entity.dead)) {
      delete game.minibossRespawns[key];
      return;
    }
    spawnBoss(lair.x, lair.y, lair.template, false, lairIndex);
    delete game.minibossRespawns[key];
    say(`${lair.template.name} has returned to its lair.`, 2800);
  });
}

function minibossRespawnRemaining(worldIndex, lairIndex) {
  game.minibossRespawns ||= {};
  return game.minibossRespawns[minibossRespawnKey(worldIndex, lairIndex)] || 0;
}

function nextMinibossRespawnTime(worldIndex = game.worldIndex) {
  game.minibossRespawns ||= {};
  return Object.entries(game.minibossRespawns)
    .map(([key, time]) => {
      const [keyWorld] = key.split("-");
      return Number(keyWorld) === worldIndex ? time : Infinity;
    })
    .reduce((soonest, time) => Math.min(soonest, time), Infinity);
}

function minibossRespawnText() {
  if (game.backrooms) return "--";
  if (game.inCamp) {
    const next = nextAnyMinibossRespawn();
    return next ? `W${next.worldIndex + 1} ${formatClock(next.time)}` : "--";
  }
  const waiting = nextMinibossRespawnTime();
  if (Number.isFinite(waiting) && waiting > 0) return formatClock(waiting);
  const alive = game.entities.some((entity) => entity.type === "boss" && !entity.finalBoss && !entity.dead);
  return alive ? "Ready" : "Soon";
}

function nextAnyMinibossRespawn() {
  game.minibossRespawns ||= {};
  return Object.entries(game.minibossRespawns)
    .filter(([, time]) => time > 0)
    .map(([key, time]) => ({ worldIndex: Number(key.split("-")[0]), time }))
    .sort((a, b) => a.time - b.time)[0] || null;
}

function formatClock(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function minibossRespawnKey(worldIndex, lairIndex) {
  return `${worldIndex}-${lairIndex}`;
}

function advanceQuest(type, entity = null) {
  const quest = game.quest;
  if (!quest || !quest.active || quest.complete) return;
  const step = currentQuestStep(quest);
  if (!step || step.type !== type) return;
  if (step.minLevel && (!entity || entity.level < step.minLevel)) return;
  step.progress = (step.progress || 0) + 1;
  quest.defeated = step.progress;
  quest.target = step.target;
  if (step.progress < step.target) return;

  quest.stepIndex = (quest.stepIndex || 0) + 1;
  if (quest.stepIndex >= quest.steps.length) {
    quest.complete = true;
    say(`${quest.title} complete. Return to the quest NPC for your reward.`, 3200);
    return;
  }
  const next = currentQuestStep(quest);
  quest.defeated = next.progress || 0;
  quest.target = next.target;
  say(`Quest step complete. Next: ${next.text}`, 3200);
}

function maybeDropSecretOre(reward, entity) {
  if (!game.secretQuest.active || game.secretQuest.complete || game.secretQuest.keeperReady) return "";
  const worldBossLevel = worlds[game.worldIndex].boss.level;
  const toughEnough = entity.type === "boss" || entity.level >= worldBossLevel - 2;
  if (!toughEnough) return "";
  const bonus = entity.type === "boss" ? 0.28 : entity.level >= worldBossLevel ? 0.12 : 0;
  const chance = Math.min(0.78, reward.oreChance * 0.55 + bonus);
  if (Math.random() >= chance) return "";
  game.secretQuest.shards += 1;
  if (game.secretQuest.shards >= game.secretQuest.target) {
    game.secretQuest.keeperReady = true;
    floatText(game.player.x, game.player.y - 58, "ORB COMPLETE", "#79d2ff");
    return ` Ore orb found: ${game.secretQuest.shards}/${game.secretQuest.target}. Materials complete. Return to the Hidden Forger and face the Gear Keeper.`;
  }
  floatText(game.player.x, game.player.y - 58, "ORB FOUND", "#79d2ff");
  return ` Ore orb found: ${game.secretQuest.shards}/${game.secretQuest.target}.`;
}

function markWorldBeaten(index) {
  if (game.abandonedMode) {
    game.abandonedBeatenWorlds ??= [];
    if (!game.abandonedBeatenWorlds.includes(index)) game.abandonedBeatenWorlds.push(index);
    game.abandonedBeatenWorlds.sort((a, b) => a - b);
    return;
  }
  game.beatenWorlds ??= [];
  if (!game.beatenWorlds.includes(index)) game.beatenWorlds.push(index);
  game.beatenWorlds.sort((a, b) => a - b);
}

function hasBeatenWorld(index) {
  return Array.isArray(game.beatenWorlds) && game.beatenWorlds.includes(index);
}

function markFinalIslandBossDefeated(lairIndex) {
  if (lairIndex == null || lairIndex < 0) return;
  game.finalIslandBossesDefeated ||= [];
  if (!game.finalIslandBossesDefeated.includes(lairIndex)) game.finalIslandBossesDefeated.push(lairIndex);
}

function finalIslandBossesCleared() {
  const finalIndex = worlds.length - 1;
  const required = (bossLairs[finalIndex] || [])
    .map((lair, index) => (lair.final ? null : index))
    .filter((index) => index != null);
  game.finalIslandBossesDefeated ||= [];
  return required.length > 0 && required.every((index) => game.finalIslandBossesDefeated.includes(index));
}

function maybeUnlockAbandonedIslands() {
  if (game.abandonedUnlocked || game.abandonedMode || game.worldIndex !== worlds.length - 1) return "";
  if (!hasBeatenWorld(worlds.length - 1) || !finalIslandBossesCleared()) return "";
  game.abandonedUnlocked = true;
  return " Every final-island boss has fallen. Abandoned islands have awakened at the Moon-Sealed Door.";
}

function currentWorldBeaten(index) {
  if (game.abandonedMode) return Array.isArray(game.abandonedBeatenWorlds) && game.abandonedBeatenWorlds.includes(index);
  return hasBeatenWorld(index);
}

function nextWorldAvailable() {
  return !game.abandonedMode && game.worldIndex < worlds.length - 1;
}

function portalLocationText(portal = game.portal) {
  if (!portal) return "unknown";
  return `${currentRegionNameAt(portal.x, portal.y)} (${Math.round(portal.x)}, ${Math.round(portal.y)})`;
}

function enemyReward(entity) {
  const dangerBonus = Math.max(0, entity.level - game.level);
  const bossBonus = entity.secretKeeper ? 2.4 : entity.type === "backroomsBoss" ? 2.25 : isBossEnemy(entity) ? (entity.finalBoss ? 2.6 : 1.8) : 1;
  const levelScale = 1 + entity.level * 0.045 + dangerBonus * 0.05;
  const baseCoins = entity.coins ?? 18 + entity.level * 4;
  const coins = Math.ceil(baseCoins * levelScale * bossBonus + dangerBonus);
  const xp = Math.ceil(entity.xp * (1 + entity.level * 0.12 + dangerBonus * 0.18) * bossBonus);
  const drops = Math.min(11, 2 + Math.ceil(entity.level / 5) + (isBossEnemy(entity) ? 4 : 0));
  return {
    coins,
    xp,
    drops,
    coinValue: Math.max(1, Math.ceil(coins / (drops * 5))),
    oreChance: Math.min(0.9, 0.22 + entity.level * 0.025 + dangerBonus * 0.08 + (isBossEnemy(entity) ? 0.24 : 0)),
  };
}

function gainXp(amount) {
  game.xp += amount;
  while (game.xp >= game.xpToNext) {
    game.xp -= game.xpToNext;
    game.level += 1;
    game.xpToNext = Math.floor(game.xpToNext * 1.35 + 20);
    game.baseStats.attack += 2;
    game.baseStats.defense += 1;
    if (game.level % 3 === 0) game.baseStats.speed += 1;
    game.player.maxHp += 12;
    game.player.hp = game.player.maxHp;
    game.maxMana += 8;
    game.mana = game.maxMana;
    say(`Level up! Level ${game.level}: stats improved and your HP/Mana are restored. Find teachers to learn new abilities.`, 3200);
  }
}

function unlockAbilities() {
  // Abilities are now learned from teachers found while exploring.
}

function totalAttack() {
  return game.baseStats.attack + game.weapon.damage;
}

function totalDefense() {
  return game.baseStats.defense + game.armor.defense;
}

function totalSpeed() {
  return game.baseStats.speed;
}

function reduceDamage(amount) {
  return Math.max(1, amount - Math.floor(totalDefense() * 0.55));
}

function scatterCoins(x, y, amount, value) {
  for (let i = 0; i < amount; i++) {
    game.coinsOnGround.push({
      x: clamp(x + Math.random() * 54 - 27, 48, MAP_W - 48),
      y: clamp(y + Math.random() * 54 - 27, 48, MAP_H - 48),
      value,
      bob: Math.random() * 100,
    });
  }
}

function collectCoins() {
  game.coinsOnGround = game.coinsOnGround.filter((coin) => {
    if (distance(game.player, coin) < game.magnet) {
      game.coins += coin.value;
      floatText(coin.x, coin.y - 10, `+${coin.value}g`, "#ffd45a");
      return false;
    }
    return true;
  });
}

function checkDiscoveries() {
  game.discoveries.forEach((discovery) => {
    if (!discovery.found && distance(game.player, discovery) < 58) {
      discovery.found = true;
      game.coins += 4 + game.worldIndex * 2;
      game.mana = Math.min(game.maxMana, game.mana + 12);
      game.story.lastDiscovery = discovery.text;
      advanceQuest("discovery");
      say(`Discovery: ${discovery.text} You mark it on your map.`, 3800);
      saveGame();
    }
  });
}

function updateBackrooms(delta) {
  game.backrooms.hum += delta * 0.0012;
  game.backrooms.time += delta;
  game.backrooms.darkness = clamp(game.backrooms.time / 210000, 0, 0.82);
  game.backrooms.hitCooldown = Math.max(0, game.backrooms.hitCooldown - delta);
  game.backrooms.spawnTimer -= delta;
  if (game.backrooms.spawnTimer <= 0 && game.backrooms.entities.length < 8) {
    spawnBackroomsEntity();
    game.backrooms.spawnTimer = Math.max(9000, 24000 - game.backrooms.time * 0.025);
    say("Another shape steps out from behind the wallpaper.", 2400);
  }
  updateBackroomsEntities(delta);
  const exit = game.backrooms.exits.find((spot) => distance(game.player, spot) < 52);
  if (!exit) return;
  game.player.x = clamp(game.backrooms.returnX + Math.random() * 120 - 60, 60, MAP_W - 60);
  game.player.y = clamp(game.backrooms.returnY + Math.random() * 120 - 60, 60, MAP_H - 60);
  game.backrooms = null;
  game.mana = Math.min(game.maxMana, game.mana + 25);
  say("You find a buzzing exit light and tumble back into the dungeon. Something followed only as a memory.", 4800);
  saveGame();
}

function spawnBackroomsEntity() {
  const zones = [
    { x: 80, y: 90, w: 360, h: 360 },
    { x: 1960, y: 90, w: 360, h: 360 },
    { x: 90, y: 1160, w: 420, h: 360 },
    { x: 1900, y: 1150, w: 420, h: 360 },
  ];
  const zone = zones[Math.floor(Math.random() * zones.length)];
  const spot = findOpenBackroomsSpot(game.backrooms.walls, zone.x, zone.y, zone.w, zone.h);
  game.backrooms.entities.push(createBackroomsEntity(spot.x, spot.y, Math.random() * 6));
}

function updateBackroomsEntities(delta) {
  game.backrooms.entities = game.backrooms.entities.filter((entity) => !entity.dead);
  game.backrooms.entities.forEach((entity) => {
    entity.phase += delta * 0.003;
    entity.dashCooldown = Math.max(0, entity.dashCooldown - delta);
    entity.pathTimer = Math.max(0, entity.pathTimer - delta);
    const dist = distance(entity, game.player);
    let dx;
    let dy;
    if (dist > 0 && dist < 760) {
      const chase = backroomsChaseVector(entity);
      dx = chase.x;
      dy = chase.y;
      if (entity.dashCooldown <= 0 && dist < 430) {
        entity.dashTimer = 300;
        entity.dashCooldown = 3200 + Math.random() * 2600;
        entity.dashX = dx;
        entity.dashY = dy;
      }
    } else {
      dx = Math.cos(entity.phase);
      dy = Math.sin(entity.phase * 0.7);
    }
    if (entity.dashTimer > 0) {
      entity.dashTimer = Math.max(0, entity.dashTimer - delta);
      dx = entity.dashX;
      dy = entity.dashY;
    }
    moveBackroomsEntity(entity, dx * entity.speed * (entity.dashTimer > 0 ? 5.2 : 1), dy * entity.speed * (entity.dashTimer > 0 ? 5.2 : 1));
    if (distance(entity, game.player) < 34 && game.backrooms.hitCooldown <= 0) {
      game.backrooms.hitCooldown = 900;
      takeDamage(12 + game.worldIndex * 4, "A Smiler in the Backrooms");
      if (!game.over) say("A Smiler catches your shoulder. Keep moving and break line through walls.", 2600);
    }
  });
}

function moveBackroomsEntity(entity, dx, dy) {
  const oldX = entity.x;
  const oldY = entity.y;
  entity.x = clamp(entity.x + dx, 42, MAP_W - 42);
  entity.y = clamp(entity.y + dy, 48, MAP_H - 48);
  if (!hitsBackroomsWall(entity)) return;

  const candidates = [
    { x: oldX + dx, y: oldY },
    { x: oldX, y: oldY + dy },
    { x: oldX + dy * 1.25, y: oldY - dx * 1.25 },
    { x: oldX - dy * 1.25, y: oldY + dx * 1.25 },
  ];
  const open = candidates
    .map((candidate) => ({ ...candidate, score: Math.hypot(game.player.x - candidate.x, game.player.y - candidate.y) }))
    .sort((a, b) => a.score - b.score)
    .find((candidate) => {
      entity.x = clamp(candidate.x, 42, MAP_W - 42);
      entity.y = clamp(candidate.y, 48, MAP_H - 48);
      return !hitsBackroomsWall(entity);
    });

  if (!open) {
    entity.x = oldX;
    entity.y = oldY;
  }
}

function backroomsChaseVector(entity) {
  if (!lineBlocked(entity, game.player)) {
    const dist = Math.max(1, distance(entity, game.player));
    entity.path = [];
    return { x: (game.player.x - entity.x) / dist, y: (game.player.y - entity.y) / dist };
  }

  if (entity.pathTimer <= 0 || !entity.path.length) {
    entity.path = findBackroomsPath(entity, game.player);
    entity.pathTimer = 950 + Math.random() * 650;
  }

  const next = entity.path[0];
  if (!next) {
    const dist = Math.max(1, distance(entity, game.player));
    return { x: (game.player.x - entity.x) / dist, y: (game.player.y - entity.y) / dist };
  }

  if (distance(entity, next) < 42) entity.path.shift();
  const target = entity.path[0] || next;
  const dist = Math.max(1, distance(entity, target));
  return { x: (target.x - entity.x) / dist, y: (target.y - entity.y) / dist };
}

function findBackroomsPath(from, to) {
  const cell = 96;
  const cols = Math.ceil(MAP_W / cell);
  const rows = Math.ceil(MAP_H / cell);
  const start = pointToCell(from, cell, cols, rows);
  const goal = pointToCell(to, cell, cols, rows);
  const key = (node) => `${node.x},${node.y}`;
  const open = [{ ...start, g: 0, f: cellHeuristic(start, goal) }];
  const cameFrom = new Map();
  const best = new Map([[key(start), 0]]);
  const dirs = [
    { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 },
  ];
  let iterations = 0;
  let closest = start;
  let closestScore = cellHeuristic(start, goal);

  while (open.length && iterations < 240) {
    iterations += 1;
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    const score = cellHeuristic(current, goal);
    if (score < closestScore) {
      closest = current;
      closestScore = score;
    }
    if (current.x === goal.x && current.y === goal.y) return rebuildBackroomsPath(cameFrom, current, cell);

    dirs.forEach((dir) => {
      const next = { x: current.x + dir.x, y: current.y + dir.y };
      if (next.x < 0 || next.y < 0 || next.x >= cols || next.y >= rows || backroomsCellBlocked(next, cell)) return;
      const stepCost = dir.x && dir.y ? 1.4 : 1;
      const nextG = current.g + stepCost;
      const nextKey = key(next);
      if (best.has(nextKey) && best.get(nextKey) <= nextG) return;
      cameFrom.set(nextKey, current);
      best.set(nextKey, nextG);
      open.push({ ...next, g: nextG, f: nextG + cellHeuristic(next, goal) });
    });
  }

  return closest !== start ? rebuildBackroomsPath(cameFrom, closest, cell) : [];
}

function rebuildBackroomsPath(cameFrom, current, cell) {
  const path = [];
  const key = (node) => `${node.x},${node.y}`;
  let node = current;
  while (cameFrom.has(key(node)) && path.length < 22) {
    path.unshift(cellCenter(node, cell));
    node = cameFrom.get(key(node));
  }
  return path.slice(0, 8);
}

function pointToCell(point, cell, cols, rows) {
  return {
    x: clamp(Math.floor(point.x / cell), 0, cols - 1),
    y: clamp(Math.floor(point.y / cell), 0, rows - 1),
  };
}

function cellCenter(node, cell) {
  return { x: node.x * cell + cell / 2, y: node.y * cell + cell / 2 };
}

function cellHeuristic(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function backroomsCellBlocked(node, cell) {
  const center = cellCenter(node, cell);
  const probe = { x: center.x, y: center.y, w: 42, h: 58 };
  return game.backrooms.walls.some((wall) => rectOverlaps(probe, wall));
}

function lineBlocked(a, b) {
  const steps = Math.max(4, Math.ceil(distance(a, b) / 42));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const probe = {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      w: 24,
      h: 36,
    };
    if (hitsBackroomsWall(probe)) return true;
  }
  return false;
}

function updateEnemies(delta) {
  const p = game.player;
  game.entities = game.entities.filter((entity) => !entity.dead);

  game.entities.forEach((entity) => {
    if (entity.type !== "monster" && entity.type !== "boss") return;
    entity.hurtTimer = Math.max(0, entity.hurtTimer - delta);
    const dist = distance(p, entity);

    if (dist > 0 && dist < (entity.type === "boss" ? 430 : 250)) {
      const dx = (p.x - entity.x) / dist;
      const dy = (p.y - entity.y) / dist;
      entity.x += dx * entity.speed;
      entity.y += dy * entity.speed;
    } else if (distance(entity, { x: entity.spawnX, y: entity.spawnY }) > 8) {
      const homeDist = distance(entity, { x: entity.spawnX, y: entity.spawnY });
      entity.x += ((entity.spawnX - entity.x) / homeDist) * entity.speed * 0.45;
      entity.y += ((entity.spawnY - entity.y) / homeDist) * entity.speed * 0.45;
    }

    if (dist < (entity.type === "boss" ? 58 : 38)) {
      startBattle(entity);
    }
  });
}

function startBattle(enemy) {
  if (game.battle || enemy.dead) return;
  battleEffects.length = 0;
  reinforceMonsterForCurrentGear(enemy);
  game.battle = {
    enemy,
    phase: "choose",
    actionMode: "default",
    attacks: [],
    spawnTimer: 0,
    blocked: 0,
    neededBlocks: blocksNeeded(enemy),
    totalSpawned: 0,
  };
  enemy.hurtTimer = 180;
  ui.battlePanel.classList.remove("is-hidden");
  setBattlePrompt(encounterText(enemy));
  say(`${enemy.name} interrupts your exploration. Read its pattern, survive, then decide what to do.`, 2800);
}

function startBackroomsBoss(enemy) {
  if (game.battle || enemy.dead) return;
  battleEffects.length = 0;
  game.battle = {
    enemy,
    phase: "choose",
    actionMode: "default",
    attacks: [],
    spawnTimer: 0,
    blocked: 0,
    neededBlocks: blocksNeeded(enemy) + 5,
    totalSpawned: 0,
  };
  enemy.hurtTimer = 220;
  ui.battlePanel.classList.remove("is-hidden");
  setBattlePrompt(`${enemy.name} unfolds into a boss. Survive its rushes.`);
  say("The Smiler stops chasing and starts learning your timing.", 3200);
}

function encounterText(enemy) {
  const moods = ["curious", "territorial", "lost", "hungry", "afraid"];
  const mood = moods[(enemy.name.length + enemy.level + game.worldIndex) % moods.length];
  return `A ${mood} Lv. ${enemy.level} ${enemy.name} blocks the route. Fight, spare, use an item, or study its attack rhythm.`;
}

function setBattlePrompt(text, resetActions = true) {
  const enemy = game.battle && game.battle.enemy;
  if (enemy) ui.battleEnemy.textContent = `${enemy.name} Lv. ${enemy.level}  HP ${Math.max(0, enemy.hp)}/${enemy.maxHp}`;
  ui.battlePrompt.textContent = text;
  const canChoose = game.battle && game.battle.phase === "choose";
  if (canChoose && resetActions) {
    resetBattleActions();
  } else {
    [ui.fightButton, ui.abilityButton, ui.itemButton, ui.spareButton, ui.runButton].forEach((button) => {
      if (!canChoose) button.disabled = true;
    });
  }
}

function playerBattleAttack() {
  const battle = game.battle;
  if (!battle || battle.phase !== "choose") return;
  battle.actionMode = "default";
  const enemy = battle.enemy;
  const levelBonus = Math.max(0, game.level - enemy.level);
  const damage = totalAttack() + levelBonus * 2 + Math.floor(Math.random() * 6);
  enemy.hp -= damage;
  enemy.hurtTimer = 180;
  floatText(enemy.x, enemy.y - 24, `-${damage}`, "#ffdf70");
  spawnParticle(enemy.x, enemy.y, "#ffd45a", 6);
  setBattlePrompt(`You hit ${enemy.name} for ${damage}.`);
  if (enemy.hp <= 0) {
    winBattle();
    return;
  }
  beginEnemyTurn();
}

function useBattleAbility() {
  const battle = game.battle;
  if (!battle || battle.phase !== "choose") return;
  const equipped = equippedAbilities();
  if (!equipped.length) {
    setBattlePrompt("No special abilities equipped. Open Skills outside battle to set your loadout.");
    return;
  }
  if (equipped.length === 1) {
    castBattleAbility(equipped[0]);
    return;
  }
  openBattleAbilityChoices();
}

function openBattleAbilityChoices() {
  const learned = equippedAbilities();
  const actions = [
    ...learned.map((ability) => ({
      label: `${ability.name} - ${ability.mana} Mana`,
      name: ability.name,
      meta: `${ability.mana} Mana`,
      icon: ability.icon || ability.id,
      disabled: game.mana < ability.mana,
      action: () => castBattleAbility(ability),
    })),
    { label: "Back", name: "Back", meta: "Return", icon: "back", action: closeBattleAbilityChoices },
  ];
  game.battle.actionMode = "abilityChoice";
  setBattlePrompt("Choose an attack or ability.", false);
  renderBattleActions(actions);
}

function closeBattleAbilityChoices() {
  if (game.battle) game.battle.actionMode = "default";
  setBattlePrompt("Choose your next move.");
}

function castBattleAbility(ability) {
  const battle = game.battle;
  if (!battle || battle.phase !== "choose") return;
  if (game.mana < ability.mana) {
    setBattlePrompt(`${ability.name} needs ${ability.mana} Mana.`);
    return;
  }
  battle.actionMode = "default";
  game.mana -= ability.mana;
  const result = applyAbilityEffect(ability, battle);
  setBattlePrompt(result);
  if (battle.enemy.hp <= 0) {
    winBattle();
    return;
  }
  beginEnemyTurn();
}

function applyAbilityEffect(ability, battle) {
  switch (ability.id) {
    case "powerStrike":
      return castPowerStrike(ability, battle);
    case "arcaneGuard":
      return castArcaneGuard(ability, battle);
    case "heroicCleave":
      return castHeroicCleave(ability, battle);
    case "sunFlare":
      return castSunFlare(ability, battle);
    case "frostStep":
      return castFrostStep(ability, battle);
    case "moonPiercer":
      return castMoonPiercer(ability, battle);
    case "dragonRoar":
      return castDragonRoar(ability, battle);
    case "worldBreaker":
      return castWorldBreaker(ability, battle);
    default:
      return castSimpleAbility(ability, battle);
  }
}

function castSimpleAbility(ability, battle) {
  const damage = abilityDamage(ability.multiplier || 1.5);
  damageEnemy(battle.enemy, damage, ability.name, "#ffd45a");
  addBattleEffect("slash", battle.enemy.x, battle.enemy.y, "#ffd45a");
  return `${ability.name} hits ${battle.enemy.name} for ${damage}.`;
}

function castPowerStrike(ability, battle) {
  const damage = abilityDamage(1.55) + Math.floor(game.level * 1.4);
  damageEnemy(battle.enemy, damage, ability.name, "#ffd45a");
  battle.enemyStagger = Math.max(battle.enemyStagger || 0, 1);
  addBattleEffect("impact", battle.enemy.x, battle.enemy.y, "#ffd45a");
  spawnParticle(battle.enemy.x, battle.enemy.y, "#ffd45a", 12);
  return `Power Strike slams ${battle.enemy.name} for ${damage}. Its next attack has 1 fewer projectile.`;
}

function castArcaneGuard(ability, battle) {
  const heal = ability.heal;
  const guard = 38 + Math.floor(game.maxMana * 0.08);
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + heal);
  battle.guard = Math.max(battle.guard || 0, guard);
  battle.reflect = Math.max(battle.reflect || 0, 1);
  addBattleEffect("shield", game.player.x, game.player.y, "#5fc9ff");
  floatText(game.player.x, game.player.y - 34, `+${heal}`, "#70d66b");
  return `Arcane Guard restores ${heal} HP, shields ${guard} damage, and reflects the next hit.`;
}

function castHeroicCleave(ability, battle) {
  const damage = abilityDamage(1.35) + Math.floor(battle.enemy.maxHp * 0.06);
  damageEnemy(battle.enemy, damage, ability.name, "#ff6b5f");
  battle.cleaveEcho = 2;
  battle.neededBlocks = Math.max(1, battle.neededBlocks - 2);
  addBattleEffect("cleave", battle.enemy.x, battle.enemy.y, "#ff6b5f");
  return `Heroic Cleave carves ${damage} damage and cuts 2 attacks from the next enemy pattern.`;
}

function castSunFlare(ability, battle) {
  const damage = abilityDamage(0.9) + ability.burn;
  damageEnemy(battle.enemy, damage, ability.name, "#ff9a3d");
  battle.enemyBurn = (battle.enemyBurn || 0) + 3;
  addBattleEffect("flare", battle.enemy.x, battle.enemy.y, "#ff9a3d");
  return `Sun Flare bursts for ${damage} and burns ${battle.enemy.name} for the next 3 turns.`;
}

function castFrostStep(ability, battle) {
  const heal = ability.heal;
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + heal);
  battle.guard = Math.max(battle.guard || 0, ability.guard + 18);
  battle.slowNext = true;
  addBattleEffect("frost", game.player.x, game.player.y, "#aeeaff");
  floatText(game.player.x, game.player.y - 34, `+${heal}`, "#70d66b");
  return `Frost Step restores ${heal} HP, raises ice guard, and slows the next attack wave.`;
}

function castMoonPiercer(ability, battle) {
  const pierceBonus = isBossEnemy(battle.enemy) ? Math.floor(battle.enemy.maxHp * 0.08) : Math.floor(battle.enemy.maxHp * 0.04);
  const damage = abilityDamage(1.65) + pierceBonus;
  damageEnemy(battle.enemy, damage, ability.name, "#d5ccff");
  battle.moonMarked = true;
  addBattleEffect("pierce", battle.enemy.x, battle.enemy.y, "#d5ccff");
  return `Moon Piercer ignores defenses for ${damage} and marks ${battle.enemy.name} for cleaner aim.`;
}

function castDragonRoar(ability, battle) {
  const damage = abilityDamage(0.8);
  damageEnemy(battle.enemy, damage, ability.name, "#ff6b3d");
  battle.enemy.damage = Math.max(1, battle.enemy.damage - ability.weaken);
  battle.fear = 2;
  addBattleEffect("roar", battle.enemy.x, battle.enemy.y, "#ff6b3d");
  return `Dragon Roar deals ${damage}, lowers enemy damage by ${ability.weaken}, and frightens 2 attacks away.`;
}

function castWorldBreaker(ability, battle) {
  const damage = abilityDamage(2.25) + Math.floor((battle.enemy.maxHp - battle.enemy.hp) * 0.18);
  damageEnemy(battle.enemy, damage, ability.name, "#b579ff");
  battle.crackedArena = 3;
  battle.guard = Math.max(battle.guard || 0, 22);
  addBattleEffect("break", battle.enemy.x, battle.enemy.y, "#b579ff");
  return `World Breaker cracks the arena for ${damage}. Your next 3 dodges happen in a wider safe rhythm.`;
}

function abilityDamage(multiplier) {
  return Math.floor(totalAttack() * multiplier) + Math.floor(Math.random() * 8);
}

function damageEnemy(enemy, damage, source, color) {
  enemy.hp -= damage;
  enemy.hurtTimer = 260;
  floatText(enemy.x, enemy.y - 26, `-${damage}`, color);
  spawnParticle(enemy.x, enemy.y, color, 8);
}

function addBattleEffect(kind, x, y, color) {
  battleEffects.push({ kind, x, y, color, life: 760, maxLife: 760, age: 0 });
}

function renderBattleActions(actions) {
  const buttons = [ui.fightButton, ui.abilityButton, ui.itemButton, ui.spareButton, ui.runButton];
  buttons.forEach((button, index) => {
    const action = actions[index];
    if (!action) {
      button.innerHTML = "";
      button.disabled = true;
      button.classList.add("is-hidden-action");
      return;
    }
    button.classList.remove("is-hidden-action");
    button.className = button.className
      .split(" ")
      .filter((className) => !className.startsWith("battle-command-") && !className.startsWith("weapon-shape-"))
      .join(" ");
    button.classList.add("battle-command", `battle-command-${action.icon || commandIconFor(action.label)}`);
    if (action.weapon) {
      const look = weaponLookForName(action.weapon);
      button.classList.add(`weapon-shape-${look.shape}`);
      button.style.setProperty("--weapon-color", look.color);
      button.style.setProperty("--weapon-edge", look.edge);
      button.style.setProperty("--weapon-shine", look.shine);
    } else {
      button.style.removeProperty("--weapon-color");
      button.style.removeProperty("--weapon-edge");
      button.style.removeProperty("--weapon-shine");
    }
    button.innerHTML = battleActionHtml(action);
    button.disabled = !!action.disabled;
    button.onclick = action.action;
  });
}

function resetBattleActions() {
  const learned = equippedAbilities();
  const skillLabel = learned.length === 0 ? "Choose Ability" : learned.length === 1 ? learned[0].name : "Choose Ability";
  renderBattleActions([
    { label: "Fight", name: "Fight", meta: game.weapon.name, icon: "fight", weapon: game.weapon.name, action: playerBattleAttack },
    { label: skillLabel, name: skillLabel, meta: learned.length > 1 ? `${learned.length} skills` : learned[0] ? `${learned[0].mana} Mana` : "No Mana", icon: learned.length > 1 ? "ability" : learned[0]?.id || "attack", action: useBattleAbility },
    { label: "Item", name: "Item", meta: potionCount() ? `${potionCount()} ready` : "Empty", icon: "item", action: useBattleItem },
    { label: "Spare", name: "Spare", meta: "Mercy", icon: "spare", action: spareEnemy },
    { label: "Run", name: "Run", meta: "Escape", icon: "run", action: runBattle },
  ]);
}

function battleActionHtml(action) {
  const name = escapeHtml(action.name || action.label);
  const meta = action.meta ? `<span class="battle-command-meta">${escapeHtml(action.meta)}</span>` : "";
  return `<span class="battle-command-icon" aria-hidden="true"></span><span class="battle-command-name">${name}</span>${meta}`;
}

function commandIconFor(label) {
  const lower = String(label).toLowerCase();
  if (lower.includes("power")) return "powerStrike";
  if (lower.includes("arcane")) return "arcaneGuard";
  if (lower.includes("cleave")) return "heroicCleave";
  if (lower.includes("basic")) return "attack";
  if (lower.includes("ability")) return "ability";
  if (lower.includes("item")) return "item";
  if (lower.includes("spare")) return "spare";
  if (lower.includes("run") || lower.includes("back")) return "run";
  return "fight";
}

function learnedAbilities() {
  return equippedAbilities();
}

function hasAbility(ability) {
  return game.abilities.includes(ability.id) || game.abilities.includes(ability.name);
}

function bestAbility() {
  const equipped = equippedAbilities();
  if (equipped.length) return equipped[equipped.length - 1];
  for (let i = abilityUnlocks.length - 1; i >= 0; i--) {
    if (hasAbility(abilityUnlocks[i])) return abilityUnlocks[i];
  }
  return null;
}

function beginEnemyTurn() {
  const battle = game.battle;
  applyAbilityTurnEffects(battle);
  battle.phase = "enemy";
  battle.attacks = [];
  battle.spawnTimer = 250;
  battle.blocked = 0;
  battle.neededBlocks = Math.max(1, blocksNeeded(battle.enemy) - (battle.enemyStagger || 0) - (battle.fear || 0));
  battle.enemyStagger = 0;
  battle.fear = 0;
  battle.totalSpawned = 0;
  battle.dodger = createBattleDodger();
  setBattlePrompt(`${battle.enemy.name} attacks with ${attackPatternText(battle.enemy)}. Move inside the dodge box.`);
}

function applyAbilityTurnEffects(battle) {
  if (battle.enemyBurn > 0) {
    const burnDamage = 10 + game.worldIndex * 4 + Math.floor(totalAttack() * 0.12);
    battle.enemyBurn -= 1;
    damageEnemy(battle.enemy, burnDamage, "Burn", "#ff9a3d");
    addBattleEffect("flare", battle.enemy.x, battle.enemy.y, "#ff9a3d");
  }
  if (battle.cleaveEcho > 0) battle.cleaveEcho -= 1;
  if (battle.crackedArena > 0) battle.crackedArena -= 1;
}

function updateBattle(delta) {
  const battle = game.battle;
  if (!battle || battle.phase !== "enemy") return;
  if (game.backrooms) {
    game.backrooms.time += delta;
    game.backrooms.darkness = clamp(game.backrooms.time / 210000, 0, 0.82);
  }

  const arena = battleArena();
  updateBattleDodger(delta, arena);

  battle.spawnTimer -= delta;
  if (battle.spawnTimer <= 0 && battle.totalSpawned < battle.neededBlocks) {
    spawnBattleAttack();
    const pressure = battleDifficulty(battle.enemy);
    const bossPressure = battle.enemy.type === "backroomsBoss" ? 0.68 : battle.enemy.secretKeeper ? 0.72 : battle.enemy.finalBoss ? 0.78 : isBossEnemy(battle.enemy) ? 0.86 : 1;
    const abilitySlow = battle.slowNext ? 1.34 : battle.crackedArena > 0 ? 1.18 : 1;
    battle.spawnTimer = Math.max(isBossEnemy(battle.enemy) ? 430 : 330, (1080 - pressure * 38) * bossPressure * abilitySlow);
    battle.slowNext = false;
  }

  const step = delta / 16.67;
  battle.attacks.forEach((attackNote) => {
    attackNote.age = (attackNote.age || 0) + delta;
    if (attackNote.kind === "split" && !attackNote.splitDone && attackNote.age > attackNote.splitAfter) {
      splitBattleAttack(attackNote);
      attackNote.life = 0;
      attackNote.splitDone = true;
      return;
    }
    if (attackNote.homing && battle.dodger) {
      const angle = Math.atan2(battle.dodger.y - attackNote.y, battle.dodger.x - attackNote.x);
      attackNote.vx += Math.cos(angle) * attackNote.homingStrength * step;
      attackNote.vy += Math.sin(angle) * attackNote.homingStrength * step;
      const speed = Math.hypot(attackNote.vx, attackNote.vy);
      const maxSpeed = attackNote.speed + attackNote.homingCap;
      if (speed > maxSpeed) {
        attackNote.vx = (attackNote.vx / speed) * maxSpeed;
        attackNote.vy = (attackNote.vy / speed) * maxSpeed;
      }
    }
    if (attackNote.kind === "poison") {
      attackNote.r = Math.min(attackNote.maxR, attackNote.r + 0.055 * step);
      attackNote.x += attackNote.vx * step * 0.45;
      attackNote.y += attackNote.vy * step * 0.45;
    } else {
      attackNote.x += attackNote.vx * step;
      attackNote.y += attackNote.vy * step;
    }
    if (attackNote.kind === "bounce") {
      if ((attackNote.x < arena.x + attackNote.r && attackNote.vx < 0) || (attackNote.x > arena.x + arena.w - attackNote.r && attackNote.vx > 0)) {
        attackNote.vx *= -1;
        attackNote.bounces -= 1;
      }
      if ((attackNote.y < arena.y + attackNote.r && attackNote.vy < 0) || (attackNote.y > arena.y + arena.h - attackNote.r && attackNote.vy > 0)) {
        attackNote.vy *= -1;
        attackNote.bounces -= 1;
      }
    }
    if (attackNote.kind === "burn") {
      const wave = Math.sin(attackNote.age * 0.02 + attackNote.phase) * attackNote.wave * step;
      if (attackNote.axis === "x") attackNote.y += wave;
      else attackNote.x += wave;
    } else if (attackNote.drift) {
      const side = attackNote.kind === "slice" ? "y" : "x";
      attackNote[side] += Math.sin(attackNote.life * 0.006 + attackNote.phase) * attackNote.drift * step;
    }
    attackNote.life -= delta;
  });

  const dodger = battle.dodger;
  const hits = dodger && dodger.invuln <= 0
    ? battle.attacks.filter((attackNote) => attackHitsDodger(attackNote, dodger))
    : [];
  if (hits.length) {
    applyBattleAttackHit(hits[0]);
    if (game.over) return;
    dodger.invuln = 1150;
    battle.blocked += 1;
    battle.attacks = battle.attacks.filter((attackNote) => !hits.includes(attackNote));
  }

  const escaped = battle.attacks.filter((attackNote) => (
    (attackNote.kind === "bounce" && attackNote.bounces < 0) ||
    attackEscapedArena(attackNote, arena) ||
    attackNote.life <= 0
  ));
  if (escaped.length) {
    battle.blocked += escaped.length;
    battle.attacks = battle.attacks.filter((attackNote) => !escaped.includes(attackNote));
  }

  if (battle.totalSpawned >= battle.neededBlocks && battle.attacks.length === 0) {
    battle.phase = "choose";
    battle.attacks = [];
    battle.dodger = null;
    setBattlePrompt(`Dodged ${battle.blocked}/${battle.neededBlocks} attacks. Choose your next move.`);
  }
}

function spawnBattleAttack() {
  const battle = game.battle;
  const pressure = battleDifficulty(battle.enemy);
  const kind = attackKindForLevel(battle.enemy.level, battle.totalSpawned, battle.enemy);
  const arena = battleArena();
  const edge = (battle.totalSpawned + battle.enemy.level) % 4;
  const target = battle.dodger || { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2 };
  const start = attackStartPoint(arena, edge);
  const aimChaos = battle.moonMarked ? 0.12 : clamp(0.58 - pressure * 0.009, 0.22, 0.58);
  const angle = Math.atan2(target.y - start.y, target.x - start.x) + (Math.random() - 0.5) * aimChaos;
  const rhythmScale = battle.crackedArena > 0 ? 0.84 : 1;
  const speed = attackSpeedForKind(kind, pressure) * bossProjectileSpeedScale(battle.enemy) * rhythmScale;
  const axis = Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle)) ? "x" : "y";
  const radius = attackRadiusForKind(kind, pressure);
  battle.totalSpawned += 1;
  battle.attacks.push({
    x: start.x,
    y: start.y,
    r: radius,
    baseR: radius,
    maxR: radius + 13 + Math.floor(pressure / 5),
    kind,
    axis,
    angle: 0,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    speed,
    width: kind === "burn" ? 30 + Math.floor(pressure * 1.25) : radius * 2,
    height: kind === "burn" ? 82 + Math.floor(pressure * 1.8) : radius * 2,
    wave: 0.62 + pressure * 0.025,
    drift: kind === "slice" ? 0.42 + pressure * 0.024 : kind === "turn" ? 0.28 + pressure * 0.017 : 0,
    homing: kind === "turn" && isBossEnemy(battle.enemy),
    homingStrength: 0.012 + pressure * 0.0018,
    homingCap: 0.4 + pressure * 0.028,
    phase: Math.random() * 6,
    damage: battle.enemy.damage + Math.floor(pressure * bossAttackDamageScale(battle.enemy)),
    life: attackLifeForKind(kind, pressure, battle.enemy.type === "backroomsBoss"),
    age: 0,
    splitAfter: 650 + Math.random() * 420,
    bounces: kind === "bounce" ? 1 + Math.floor(pressure / 14) : 0,
  });
  if ((pressure >= 22 || battle.enemy.type === "backroomsBoss" || battle.enemy.finalBoss) && battle.totalSpawned < battle.neededBlocks && battle.totalSpawned % 7 === 0) {
    spawnBattleAttack();
  }
}

function attackHitsDodger(attackNote, dodger) {
  if (attackNote.kind === "burn") {
    return Math.abs(attackNote.x - dodger.x) < attackNote.width / 2 + dodger.r &&
      Math.abs(attackNote.y - dodger.y) < attackNote.height / 2 + dodger.r;
  }
  return Math.hypot(attackNote.x - dodger.x, attackNote.y - dodger.y) < attackNote.r + dodger.r;
}

function attackSpeedForKind(kind, pressure) {
  if (kind === "poison") return 1.0 + pressure * 0.045;
  if (kind === "burn") return 1.35 + pressure * 0.068;
  if (kind === "bounce") return 1.9 + pressure * 0.105;
  if (kind === "split") return 1.0 + pressure * 0.032;
  return 1.65 + pressure * 0.092 + Math.random() * 0.34;
}

function bossProjectileSpeedScale(enemy) {
  if (!isBossEnemy(enemy)) return 1;
  if (enemy.type === "backroomsBoss") return 0.84;
  if (enemy.secretKeeper) return 0.8;
  if (enemy.finalBoss) return 0.82;
  return 0.76;
}

function attackRadiusForKind(kind, pressure) {
  if (kind === "poison") return 12 + Math.floor(pressure / 6);
  if (kind === "burn") return 10 + Math.floor(pressure / 7);
  if (kind === "bounce") return 12 + Math.floor(pressure / 5.5);
  if (kind === "split") return 17 + Math.floor(pressure / 6);
  return 13 + Math.min(12, Math.floor(pressure / 4.5));
}

function attackLifeForKind(kind, pressure, backroomsBoss) {
  if (kind === "poison") return 5200;
  if (kind === "split") return 2000;
  if (kind === "bounce") return 4700;
  if (kind === "burn") return 3700;
  return Math.max(2400, (backroomsBoss ? 5000 : 4500) - pressure * 32);
}

function applyBattleAttackHit(attackNote) {
  let damage = reduceDamage(attackNote.damage);
  if (game.battle.reflect > 0) {
    game.battle.reflect -= 1;
    const reflectDamage = Math.ceil(damage * 0.45);
    damageEnemy(game.battle.enemy, reflectDamage, "Reflect", "#5fc9ff");
    addBattleEffect("shield", game.player.x, game.player.y, "#5fc9ff");
  }
  if (game.battle.guard) {
    const blocked = Math.min(damage, game.battle.guard);
    damage -= blocked;
    game.battle.guard -= blocked;
    if (blocked > 0) floatText(game.player.x, game.player.y - 58, `Guard -${blocked}`, "#79d2ff");
  }
  if (attackNote.kind === "burn") damage += Math.ceil(battleDifficulty(game.battle.enemy) * 0.24);
  takeDamage(damage, game.battle.enemy.name);
  if (game.over) return;
  if (attackNote.kind === "poison") {
    const manaLoss = Math.min(game.mana, 8 + Math.floor(battleDifficulty(game.battle.enemy) * 0.48));
    game.mana -= manaLoss;
    floatText(game.player.x, game.player.y - 46, `-${manaLoss} mana`, "#70d66b");
    setBattlePrompt("Poison shot hit you. Mana drained.");
  }
  if (attackNote.kind === "burn") {
    game.player.hurtTimer = 1300;
    setBattlePrompt("Burning shot hit you. Extra damage taken.");
  }
}

function splitBattleAttack(attackNote) {
  const battle = game.battle;
  const pieces = 2;
  for (let i = 0; i < pieces; i++) {
    const angle = (Math.PI * 2 * i) / pieces + attackNote.phase;
    battle.attacks.push({
      ...attackNote,
      x: attackNote.x,
      y: attackNote.y,
      r: Math.max(7, Math.floor(attackNote.r * 0.5)),
      kind: "click",
      vx: Math.cos(angle) * (attackNote.speed * 0.65),
      vy: Math.sin(angle) * (attackNote.speed * 0.65),
      damage: Math.ceil(attackNote.damage * 0.44),
      life: 1350,
      splitDone: true,
      homing: false,
      drift: 0,
    });
  }
  attackNote.splitDone = true;
}

function createBattleDodger() {
  const arena = battleArena();
  return {
    x: arena.x + arena.w / 2,
    y: arena.y + arena.h - 58,
    r: 11,
    invuln: 0,
  };
}

function updateBattleDodger(delta, arena) {
  const dodger = game.battle.dodger || createBattleDodger();
  game.battle.dodger = dodger;
  const speed = (3.55 + totalSpeed() * 0.125) * (delta / 16.67);
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;
  if (dx || dy) {
    const length = Math.hypot(dx, dy);
    dodger.x += (dx / length) * speed;
    dodger.y += (dy / length) * speed;
  }
  dodger.x = clamp(dodger.x, arena.x + dodger.r + 8, arena.x + arena.w - dodger.r - 8);
  dodger.y = clamp(dodger.y, arena.y + dodger.r + 8, arena.y + arena.h - dodger.r - 8);
  dodger.invuln = Math.max(0, dodger.invuln - delta);
}

function battleArena() {
  const w = Math.min(760, canvas.width - 360);
  const h = game.battle?.enemy.type === "backroomsBoss" ? 340 : Math.min(420, canvas.height - 250);
  return {
    x: Math.round((canvas.width - w) / 2),
    y: 92,
    w,
    h,
  };
}

function attackStartPoint(arena, edge) {
  if (edge === 0) return { x: arena.x + Math.random() * arena.w, y: arena.y - 28 };
  if (edge === 1) return { x: arena.x + arena.w + 28, y: arena.y + Math.random() * arena.h };
  if (edge === 2) return { x: arena.x + Math.random() * arena.w, y: arena.y + arena.h + 28 };
  return { x: arena.x - 28, y: arena.y + Math.random() * arena.h };
}

function attackEscapedArena(attackNote, arena) {
  const margin = 46;
  return attackNote.x < arena.x - margin ||
    attackNote.x > arena.x + arena.w + margin ||
    attackNote.y < arena.y - margin ||
    attackNote.y > arena.y + arena.h + margin;
}

function battleFloorY() {
  return game.battle && game.battle.enemy.type === "backroomsBoss" ? 380 : 520;
}

function blocksNeeded(enemy) {
  const pressure = battleDifficulty(enemy);
  if (enemy.type === "backroomsBoss") return 12 + Math.floor(pressure / 2.8);
  if (enemy.secretKeeper) return 13 + Math.floor(pressure / 2.6);
  if (enemy.finalBoss) return 10 + Math.floor(pressure / 3);
  if (isBossEnemy(enemy)) return 7 + Math.floor(pressure / 3.2);
  return 4 + Math.floor(pressure / 3.8);
}

function attackKindForLevel(level, count, enemy = null) {
  if (isBossEnemy(enemy)) {
    if (count % 7 === 5) return "split";
    if (count % 6 === 2) return "burn";
    if (count % 5 === 0) return "bounce";
    if (count % 5 === 3) return "poison";
    if (count % 4 === 1) return "turn";
  }
  if (level >= 20 && count % 7 === 5) return "split";
  if (level >= 17 && count % 6 === 2) return "burn";
  if (level >= 14 && count % 5 === 0) return "bounce";
  if (level >= 11 && count % 4 === 2) return "poison";
  if (level >= 18 && count % 6 === 4) return "turn";
  if (level >= 15 && count % 5 === 2) return "slice";
  if (level >= 10 && count % 5 === 3) return "turn";
  if (level >= 8 && count % 4 === 1) return "slice";
  if (level >= 12 && count % 4 === 2) return "turn";
  if (level >= 5 && count % 3 === 1) return "slice";
  return "click";
}

function attackPatternText(enemy) {
  if (enemy.type === "backroomsBoss") return "homing smiles, split bursts, and bouncing rushes";
  if (enemy.secretKeeper) return "guarded split bursts, fire walls, ricochets, and poison drains";
  if (enemy.finalBoss) return "boss ricochets, split bombs, fire walls, and homing curves";
  if (isBossEnemy(enemy)) return "miniboss ricochets, poison clouds, slices, and homing curves";
  if (enemy.level >= 20) return "split bombs, fire walls, poison clouds, and ricochets";
  if (enemy.level >= 17) return "burning walls, poison clouds, and ricochets";
  if (enemy.level >= 14) return "bouncing shots and poison clouds";
  if (enemy.level >= 11) return "poison clouds and curving shots";
  if (enemy.level >= 8) return "slicing waves";
  return "simple shots";
}

function battleDifficulty(enemy) {
  const bossBonus = enemy.type === "backroomsBoss" ? 13 : enemy.secretKeeper ? 14 : enemy.finalBoss ? 11 : isBossEnemy(enemy) ? 8 : 0;
  const overleveled = Math.max(0, enemy.level - game.level);
  return enemy.level + bossBonus + overleveled * 1.5;
}

function isBossEnemy(enemy) {
  return !!enemy && (
    enemy.type === "boss" ||
    enemy.type === "backroomsBoss" ||
    enemy.secretKeeper ||
    String(enemy.name || "").toLowerCase().includes("boss")
  );
}

function bossAttackDamageScale(enemy) {
  if (enemy.type === "backroomsBoss") return 0.82;
  if (enemy.secretKeeper) return 0.78;
  if (enemy.finalBoss) return 0.68;
  if (isBossEnemy(enemy)) return 0.6;
  return 0.42;
}

function clickBattleAttack(x, y) {
  return false;
}

function turnBattleAttack(x, y) {
  return false;
}

function sliceBattleAttack(start, end) {
  return false;
}

function clearBattleAttack(x, y, kind) {
  const battle = game.battle;
  if (!battle || battle.phase !== "enemy") return false;
  const hitIndex = battle.attacks.findIndex((attackNote) => attackNote.kind === kind && Math.hypot(attackNote.x - x, attackNote.y - y) <= attackNote.r + 8);
  if (hitIndex === -1) return false;
  clearBattleAttackByIndex(hitIndex);
  return true;
}

function clearBattleAttackByIndex(hitIndex) {
  const battle = game.battle;
  const attackNote = battle.attacks[hitIndex];
  battle.attacks.splice(hitIndex, 1);
  battle.blocked += 1;
  setBattlePrompt(`${instructionPast(attackNote.kind)} ${battle.blocked}/${battle.neededBlocks} boxes blocked.`);
}

function lineHitsCircle(x1, y1, x2, y2, cx, cy, radius) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(cx - x1, cy - y1) <= radius;
  const t = clamp(((cx - x1) * dx + (cy - y1) * dy) / lengthSq, 0, 1);
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;
  return Math.hypot(cx - closestX, cy - closestY) <= radius;
}

function instructionPast(kind) {
  if (kind === "slice") return "Sliced!";
  if (kind === "turn") return "Turned!";
  return "Clicked!";
}

function useBattleItem() {
  if (!game.battle || game.battle.phase !== "choose") return;
  const items = battleInventoryItems();
  if (!items.some((item) => item.count > 0)) {
    setBattlePrompt("Your pack has no battle items. Find chests or buy potions in town.");
    return;
  }
  openBattleItemChoices();
}

function openBattleItemChoices() {
  const actions = [
    ...battleInventoryItems().map((item) => ({
      label: `${item.name} x${item.count}`,
      name: item.shortName,
      meta: item.count > 0 ? `x${item.count}  +${item.heal} HP` : "Empty",
      icon: "item",
      disabled: item.count <= 0,
      action: () => useSpecificBattleItem(item),
    })),
    { label: "Back", name: "Back", meta: "Return", icon: "back", action: closeBattleItemChoices },
  ];
  game.battle.actionMode = "itemChoice";
  setBattlePrompt("Choose an item from your inventory.", false);
  renderBattleActions(actions);
}

function closeBattleItemChoices() {
  if (game.battle) game.battle.actionMode = "default";
  setBattlePrompt("Choose your next move.");
}

function useSpecificBattleItem(item) {
  if (!game.battle || game.battle.phase !== "choose") return;
  if ((game.inventory[item.id] || 0) <= 0) {
    setBattlePrompt(`You do not have any ${item.name}.`);
    return;
  }
  game.battle.actionMode = "default";
  game.inventory[item.id] -= 1;
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.heal);
  floatText(game.player.x, game.player.y - 28, `+${item.heal}`, "#70d66b");
  setBattlePrompt(`You use ${item.name} and restore ${item.heal} HP.`);
  beginEnemyTurn();
}

function battleInventoryItems() {
  return [
    { id: "smallPotion", name: "Small Health Potion", shortName: "Small Potion", heal: 50, count: game.inventory.smallPotion || 0 },
    { id: "largePotion", name: "Large Health Potion", shortName: "Large Potion", heal: 100, count: game.inventory.largePotion || 0 },
  ];
}

function potionCount() {
  return (game.inventory.smallPotion || 0) + (game.inventory.largePotion || 0);
}

function spareEnemy() {
  const battle = game.battle;
  if (!battle || battle.phase !== "choose") return;
  if (battle.enemy.hp <= battle.enemy.maxHp * 0.35 && battle.enemy.type !== "boss") {
    const reward = enemyReward(battle.enemy);
    const spareCoins = Math.ceil(reward.coins * 0.55);
    const spareXp = Math.ceil(reward.xp * 0.35);
    game.coins += spareCoins;
    gainXp(spareXp);
    battle.enemy.dead = true;
    endBattle(`You spared the monster. Reward: ${spareCoins} coins and ${spareXp} XP.`);
  } else {
    setBattlePrompt("It is not ready to stop fighting yet.");
    beginEnemyTurn();
  }
}

function runBattle() {
  const battle = game.battle;
  if (!battle || battle.phase !== "choose") return;
  if (battle.enemy.type === "boss") {
    setBattlePrompt("The boss blocks your escape.");
    beginEnemyTurn();
    return;
  }
  const p = game.player;
  p.x = clamp(p.x - p.dirX * 80, 34, MAP_W - 34);
  p.y = clamp(p.y - p.dirY * 80, 42, MAP_H - 42);
  endBattle("You ran from the battle.");
}

function winBattle() {
  const enemy = game.battle.enemy;
  const reward = enemyReward(enemy);
  const extraMessage = defeat(enemy);
  endBattle(`${enemy.name} defeated. Reward: ${reward.coins} coins and ${reward.xp} XP.${extraMessage}`);
}

function endBattle(text) {
  game.battle = null;
  ui.battlePanel.classList.add("is-hidden");
  game.mana = game.maxMana;
  say(`${text} Mana restored.`, 2800);
  saveGame();
}

function takeDamage(amount, source) {
  amount = Math.max(0, Math.ceil(amount));
  if (amount <= 0) {
    floatText(game.player.x, game.player.y - 30, "Blocked", "#79d2ff");
    return;
  }
  game.player.hp -= amount;
  game.player.hurtTimer = 760;
  floatText(game.player.x, game.player.y - 30, `-${amount}`, "#ff6b5f");
  spawnParticle(game.player.x, game.player.y, "#ff6b5f", 5);
  if (game.player.hp <= 0) {
    knockOutPlayer(source);
  }
}

function knockOutPlayer(source) {
  let keeperMessage = "";
  if (game.battle?.enemy?.secretKeeper) {
    const keeper = game.battle.enemy;
    game.secretQuest.keeperHp ||= {};
    game.secretQuest.keeperHp[game.worldIndex] = Math.max(1, Math.ceil(keeper.hp * 0.82));
    keeperMessage = " The Gear Keeper repairs some damage, but not all of it.";
  }
  const lostGold = deathGoldPenalty();
  game.coins = Math.max(0, game.coins - lostGold);
  game.player.hp = Math.max(1, Math.ceil(game.player.maxHp * 0.65));
  game.mana = Math.max(0, Math.ceil(game.maxMana * 0.45));
  game.player.hurtTimer = 1200;
  game.battle = null;
  ui.battlePanel.classList.add("is-hidden");
  closeMenu();

  if (game.backrooms) {
    game.backrooms = null;
    buildWorld();
  }

  respawnAtShop();
  game.over = false;
  startTransition();
  floatText(game.player.x, game.player.y - 34, `-${lostGold}g`, "#ffd45a");
  say(`${source} knocked you out. You wake up at the shop and lose ${lostGold} gold, but keep your gear and progress.${keeperMessage}`, 4600);
  saveGame();
}

function deathGoldPenalty() {
  if (game.coins <= 0) return 0;
  return Math.min(2050, Math.max(25, Math.floor(game.coins * 0.22)));
}

function respawnAtShop() {
  if (game.inCamp) {
    game.player.x = 330;
    game.player.y = 665;
  } else {
    const shopHouse = game.houses.find((house) => house.role === "shop" || house.id.includes("shop"));
    game.player.x = shopHouse ? shopHouse.x + shopHouse.w / 2 : 292;
    game.player.y = shopHouse ? shopHouse.y + shopHouse.h + 66 : 390;
  }
  game.player.dirX = 0;
  game.player.dirY = -1;
}

function updateDeathRush(delta) {
  if (!game.backrooms || !game.backrooms.deathRush) return;
  const rush = game.backrooms.deathRush;
  rush.timer += delta;
  rush.size += delta * 0.012;
  rush.x += (game.player.x - rush.x) * 0.08;
  rush.y += (game.player.y - rush.y) * 0.08;
}

function interact() {
  if (game.menuOpen) return;
  if (game.backrooms) {
    say("No doors answer here. Find the buzzing exit light before the Smilers close in.", 2200);
    return;
  }
  if (game.inCamp && interactCamp()) return;
  const chest = findNearbyChest();
  if (chest) {
    openChest(chest);
    return;
  }
  const house = findNearbyHouse();
  if (house) {
    enterHouse(house);
    return;
  }
  const npc = game.entities.find((entity) => entity.type === "npc" && distance(game.player, entity) < 62);
  if (!npc) {
    say("No one nearby. Follow side paths, look for odd landmarks, and press E near chests or buildings.", 2200);
    return;
  }
  if (npc.role === "shop") openShop(npc);
  if (npc.role === "smithLocked") openLockedSmithy(npc);
  if (npc.role === "campGuide") openCampGuide(npc);
  if (npc.role === "quest") openQuest(npc);
  if (npc.role === "secret") openSecretQuest(npc);
  if (npc.role === "teacher") openTeacher(npc);
  if (npc.role === "talk") say(`${npc.name}: Every region touches another. The best rewards are usually off the obvious road.`, 3200);
}

function interactCamp() {
  const object = game.campObjects.find((item) => distance(game.player, item) < 72);
  if (!object) return false;
  if (object.type === "campfire") {
    game.player.hp = game.player.maxHp;
    game.mana = game.maxMana;
    openMenu("Old Campfire", "The fire remembers every adventurer who ran away and every adventurer who came back stronger. HP and Mana restored.", [
      { label: "Warm your hands", action: closeMenu },
    ]);
    saveGame();
    return true;
  }
  if (object.type === "sealedDoor") {
    openWorldGate();
    return true;
  }
  if (object.type === "dungeonEntrance") {
    openMenu("Dungeon Entrance", "Enter Dungeon Floor 1? The camp is safe. The floor below is not.", [
      { label: "Enter Floor 1", action: enterDungeonFloorOne },
      { label: "Stay in camp", action: closeMenu },
    ]);
    return true;
  }
  if (object.type === "dummy") {
    openMenu("Training Dummy", "Left click or press Space near enemies to start battle. When a monster attacks, dodge inside the battle box with WASD or arrow keys.", [
      { label: "Practice later", action: closeMenu },
    ]);
    return true;
  }
  return false;
}

function currentInteractionPrompt() {
  if (titleOpen || game.menuOpen || game.battle || game.over) return "";
  if (game.backrooms) return "[E] Listen for the exit";
  if (game.inCamp) {
    const object = game.campObjects.find((item) => distance(game.player, item) < 82);
    if (object) {
      if (object.type === "campfire") return "[E] Rest";
      if (object.type === "sealedDoor") return accessibleWorlds().length ? "[E] World Gate" : "[E] Inspect seal";
      if (object.type === "dungeonEntrance") return "[E] Enter Dungeon";
      if (object.type === "dummy") return "[E] Inspect dummy";
    }
  }
  if (findNearbyChest()) return "[E] Open chest";
  if (findNearbyHouse()) return "[E] Enter";
  const npc = game.entities.find((entity) => entity.type === "npc" && distance(game.player, entity) < 62);
  if (npc) {
    if (npc.role === "shop") return "[E] Shop";
    if (npc.role === "quest") return "[E] Quest";
    if (npc.role === "teacher") return "[E] Learn ability";
    if (npc.role === "smithLocked") return "[E] Locked Smithy";
    return "[E] Talk";
  }
  return "";
}

function enterDungeonFloorOne() {
  game.inCamp = false;
  game.worldIndex = 0;
  game.abandonedMode = false;
  startTransition();
  buildWorld();
  game.story.chapter = 1;
  showFloorBanner("Dungeon Floor 1 - Forgotten Passage");
  say("Floor 1: the story-road sinks under the roots. You are still weak. Be careful.", 4200);
  saveGame();
}

function returnToCamp() {
  startTransition();
  game.abandonedMode = false;
  buildCamp();
  showFloorBanner("Adventurer's Camp - Safe Haven");
  say("You return to camp. Use the Moon-Sealed Door to revisit conquered worlds.", 3200);
  closeMenu();
  saveGame();
}

function openWorldGate() {
  const beaten = accessibleWorlds();
  if (!beaten.length) {
    openMenu("Moon-Sealed Door", "The door is asleep. Beat a world's boss and its doorway will stay open here forever.", [
      { label: "Step away", action: closeMenu },
    ]);
    return;
  }
  const actions = [
    ...beaten.map((index) => ({
      label: `Travel to ${worldDisplayName(index, false)}`,
      action: () => travelToWorld(index, false),
    })),
  ];
  if (game.abandonedUnlocked) {
    actions.push(...[0, 1, 2, 3].map((index) => ({
      label: `Abandoned ${worlds[index].name}`,
      action: () => travelToWorld(index, true),
    })));
  }
  actions.push(
    { label: "Step away", action: closeMenu },
  );
  openMenu("Moon-Sealed Door", game.abandonedUnlocked
    ? "Choose a conquered world, or enter its abandoned version. Abandoned islands reset bosses and make every monster tougher."
    : "Choose a conquered world to revisit. Bosses you already defeated stay defeated, but chests, roads, shops, monsters, and secrets remain available.", actions);
}

function accessibleWorlds() {
  game.beatenWorlds ??= [];
  return game.beatenWorlds.filter((index) => index >= 0 && index < worlds.length);
}

function worldDisplayName(index = game.worldIndex, abandoned = game.abandonedMode) {
  const name = worlds[index]?.name || "Unknown Island";
  return abandoned ? `Abandoned ${name}` : name;
}

function travelToWorld(index, abandoned = false) {
  game.inCamp = false;
  game.worldIndex = index;
  game.abandonedMode = abandoned;
  startTransition();
  buildWorld();
  game.story.chapter = index + 1;
  showFloorBanner(`${worldDisplayName(index, abandoned)} - ${abandoned ? "Abandoned Path" : "Reopened Path"}`);
  say(`The Moon-Sealed Door opens to ${worldDisplayName(index, abandoned)}.`, 3200);
  closeMenu();
  saveGame();
}

function openLockedSmithy(npc) {
  openMenu(npc.name, "The blacksmith stall is locked. Anvil Auntie says she opens after you bring back proof that Floor 1 did not eat you.", [
    { label: "Nod bravely", action: closeMenu },
  ]);
}

function openCampGuide(npc) {
  openMenu(npc.name, "WASD moves. E talks and opens things. Click or Space attacks. Save before you descend. No legendary nonsense yet, little hero.", [
    { label: "Got it", action: closeMenu },
  ]);
}

function openTeacher(npc) {
  const ability = abilityById(npc.abilityId);
  if (!ability) return;
  const learned = hasAbility(ability);
  const equipped = isAbilityEquipped(ability);
  const locked = game.level < ability.level;
  const cost = abilityGoldCost(ability);
  const tooPoor = game.coins < cost;
  const actions = [];
  if (!learned) {
    actions.push({
      label: locked ? `Requires Level ${ability.level}` : `Learn ${ability.name} - ${cost}g`,
      disabled: locked || tooPoor,
      action: () => learnAbilityFromTeacher(npc, ability),
    });
  } else {
    actions.push({
      label: equipped ? "Unequip ability" : "Equip ability",
      disabled: !equipped && game.equippedAbilities.length >= 4,
      action: () => toggleEquippedAbility(ability, npc),
    });
  }
  actions.push({ label: "Manage skills", action: openSkillsMenu });
  actions.push({ label: "Leave", action: closeMenu });
  const equipText = learned
    ? equipped
      ? "Equipped for battle."
      : game.equippedAbilities.length >= 4
        ? "Learned, but your 4 battle slots are full."
        : "Learned, not equipped."
    : locked
      ? `Come back at Level ${ability.level}.`
      : tooPoor
        ? `Training costs ${cost} gold. You have ${game.coins}.`
        : `Training costs ${cost} gold.`;
  openMenu(npc.name, `${ability.name}\n${abilityDescription(ability)}\n\nTeacher: ${ability.teacher}\nCost: ${learned ? "Paid" : `${cost} gold`}\nYour Gold: ${game.coins}\nStatus: ${equipText}`, actions);
}

function learnAbilityFromTeacher(npc, ability) {
  const cost = abilityGoldCost(ability);
  if (game.level < ability.level || hasAbility(ability) || game.coins < cost) return;
  game.coins -= cost;
  game.abilities.push(ability.id);
  if (game.equippedAbilities.length < 4) game.equippedAbilities.push(ability.id);
  say(`${npc.name} teaches you ${ability.name} for ${cost} gold. Equip it from Skills anytime.`, 3600);
  saveGame();
  openTeacher(npc);
}

function findNearbyChest() {
  return game.chests.find((chest) => !chest.opened && distance(game.player, chest) < 46);
}

function openChest(chest) {
  chest.opened = true;
  advanceQuest("chest");
  const coins = 8 + Math.floor(Math.random() * 11) + game.worldIndex * 5;
  game.coins += coins;
  floatText(chest.x, chest.y - 18, `+${coins} gold`, "#ffd45a");
  spawnParticle(chest.x, chest.y, "#ffd45a", 12);
  let text = `You open a ${chest.hidden ? "hidden " : ""}treasure chest and collect ${coins} gold.`;
  if (Math.random() < 0.5) {
    game.inventory.smallPotion += 1;
    text += " It also contains a Small Health Potion.";
  } else if (game.worldIndex >= 1 && Math.random() < 0.25) {
    game.inventory.largePotion += 1;
    text += " It also contains a Large Health Potion.";
  }
  openMenu("Treasure Chest", text, [
    { label: "Keep exploring", action: closeMenu },
  ]);
  saveGame();
}

function findNearbyHouse() {
  return game.houses.find((house) => (
    game.player.x > house.x - 24 &&
    game.player.x < house.x + house.w + 24 &&
    game.player.y > house.y - 34 &&
    game.player.y < house.y + house.h + 42
  ));
}

function enterHouse(house) {
  const searched = game.searchedHouses.includes(house.id);
  if (searched) {
    openMenu(house.label, "You already searched this house. The rooms are quiet now.", [
      { label: "Leave", action: closeMenu },
    ]);
    return;
  }

  let text = "";
  const coins = 6 + Math.floor(Math.random() * 10) + game.worldIndex * 4;
  if (house.loot === "coins") {
    game.coins += coins;
    text = `You enter ${house.label} and find ${coins} coins inside a dusty chest.`;
  } else if (house.loot === "heal") {
    const heal = 35 + game.worldIndex * 10;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + heal);
    text = `You rest inside ${house.label} and recover ${heal} HP.`;
  } else {
    game.coins += coins;
    if (Math.random() < 0.55) {
      game.inventory.smallPotion += 1;
      text = `You search ${house.label}, finding ${coins} coins and a Small Health Potion in a chest.`;
    } else {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + 25);
      text = `You search ${house.label}, finding ${coins} coins and a small heal.`;
    }
  }
  game.searchedHouses.push(house.id);
  advanceQuest("house");
  openMenu(house.label, text, [
    { label: "Leave", action: closeMenu },
  ]);
  saveGame();
}

function openShop(npc) {
  const world = worlds[game.worldIndex];
  openMenu(`${npc.name}'s Shop`, `Gold: ${game.coins}\nGear prices rise hard by world. Repeatable master services give rich heroes something worth spending on.`, shopItems.map((item) => {
    const cost = item.cost(world);
    const name = item.name(world);
    return {
      label: `${name} - ${cost}g`,
      html: shopItemHtml(item, world, name, cost),
      className: `shop-card ${shopIconClass(item, name)}`,
      title: item.desc(world),
      tooltip: shopTooltipText(item, world, name, cost),
      disabled: !canBuy(item, cost, world),
      action: () => buyItem(item, cost, world, npc),
    };
  }));
}

function shopKindLabel(kind) {
  return {
    weapon: "[Weapon]",
    armor: "[Armor]",
    consumable: "[Item]",
    upgrade: "[Upgrade]",
    tool: "[Tool]",
    quest: "[Quest]",
  }[kind] || "[Item]";
}

function shopItemStats(item, world) {
  if (item.kind === "weapon") {
    const damage = item.damage(world);
    const diff = damage - game.weapon.damage;
    return `${diff >= 0 ? "+" : ""}${diff} ATK`;
  }
  if (item.kind === "armor") {
    const defense = item.defense(world);
    const diff = defense - game.armor.defense;
    return `${diff >= 0 ? "+" : ""}${diff} DEF`;
  }
  if (item.id === "potion") return "+50 HP";
  if (item.id === "megaPotion") return "+100 HP";
  if (item.id === "boots") return "+SPD";
  if (item.id === "pack") return "+PICKUP";
  if (item.id === "shield") return "+2 DEF";
  if (item.id === "map") return "MAP";
  if (item.id === "key") return "KEY";
  if (item.id === "honing") return "+4 ATK";
  if (item.id === "vitality") return "+18 HP";
  if (item.id === "focus") return "+14 MANA";
  return "ITEM";
}

function shopItemHtml(item, world, name, cost) {
  const style = item.kind === "weapon" ? weaponIconStyle(name) : "";
  return `
    <span class="shop-icon" ${style} aria-hidden="true"></span>
    <span class="shop-copy">
      <strong>${escapeHtml(name)}</strong>
      <small>${escapeHtml(shopShortDescription(item, world))}</small>
    </span>
    <span class="shop-stat">${escapeHtml(shopItemStats(item, world))}</span>
    <span class="shop-cost">${cost}g</span>
  `;
}

function shopTooltipText(item, world, name, cost) {
  const lines = [
    name,
    shopKindLabel(item.kind),
    item.desc(world),
    `Effect: ${shopItemStats(item, world)}`,
    `Cost: ${cost} gold`,
  ];
  if (item.kind === "weapon") lines.push(`Damage: ${item.damage(world)} total weapon power`);
  if (item.kind === "armor") lines.push(`Defense: ${item.defense(world)} total armor defense`);
  if (item.id === "honing") lines.push(`Current honing rank: ${game.upgrades?.honing || 0}/8`);
  if (item.id === "vitality") lines.push(`Current vitality rank: ${game.upgrades?.vitality || 0}/8`);
  if (item.id === "focus") lines.push(`Current focus rank: ${game.upgrades?.focus || 0}/8`);
  lines.push(canBuy(item, cost, world) ? "Click to buy." : game.coins < cost ? `Need ${cost - game.coins} more gold.` : "Already owned or maxed out.");
  return lines.join("\n");
}

function shopIconClass(item, name = "") {
  if (item.kind === "weapon") return `shop-weapon ${weaponShapeClass(name)}`;
  if (item.kind === "armor") return "shop-armor";
  if (item.id === "potion" || item.id === "megaPotion") return "shop-potion";
  if (item.id === "boots") return "shop-boots";
  if (item.id === "pack") return "shop-magnet";
  if (item.id === "shield") return "shop-shield";
  if (item.id === "map") return "shop-map";
  if (item.id === "key") return "shop-key";
  if (item.id === "honing") return "shop-honing";
  if (item.id === "vitality") return "shop-vitality";
  if (item.id === "focus") return "shop-focus";
  return "shop-item";
}

function scalingUpgradeCost(id, base, step) {
  game.upgrades ||= { honing: 0, vitality: 0, focus: 0 };
  return base + game.worldIndex * Math.floor(step * 0.7) + (game.upgrades[id] || 0) * step;
}

function weaponIconStyle(name) {
  const look = weaponLookForName(name);
  return `style="--weapon-color:${look.color};--weapon-edge:${look.edge};--weapon-shine:${look.shine};"`;
}

function shopShortDescription(item, world) {
  if (item.kind === "weapon") return item.damage(world) > game.weapon.damage ? "More damage" : "Light weapon";
  if (item.kind === "armor") return item.defense(world) > game.armor.defense ? "More defense" : "Protection";
  if (item.id === "potion") return "+50 HP";
  if (item.id === "megaPotion") return "+100 HP";
  if (item.id === "boots") return "Speed up";
  if (item.id === "pack") return "Pulls gold";
  if (item.id === "shield") return "+2 DEF";
  if (item.id === "map") return "Reveals routes";
  if (item.id === "key") return "Secret forge";
  if (item.id === "honing") return `Rank ${((game.upgrades && game.upgrades.honing) || 0) + 1}`;
  if (item.id === "vitality") return `Rank ${((game.upgrades && game.upgrades.vitality) || 0) + 1}`;
  if (item.id === "focus") return `Rank ${((game.upgrades && game.upgrades.focus) || 0) + 1}`;
  return "Useful";
}

function canBuy(item, cost, world) {
  const id = item.id;
  if (game.coins < cost) return false;
  if (item.kind === "weapon" && game.weapon.name === item.name(world)) return false;
  if (item.kind === "armor" && game.armor.name === item.name(world)) return false;
  if (id === "boots" && game.speedBonus >= 0.55) return false;
  if (id === "pack" && game.magnet >= 58) return false;
  if (id === "shield" && game.armor.defense >= world.armor.defense + 2) return false;
  if (id === "map" && game.hasRegionMap) return false;
  if (id === "key" && game.hasMineKey) return false;
  if (id === "honing" && (game.upgrades?.honing || 0) >= 8) return false;
  if (id === "vitality" && (game.upgrades?.vitality || 0) >= 8) return false;
  if (id === "focus" && (game.upgrades?.focus || 0) >= 8) return false;
  return true;
}

function buyItem(item, cost, world, npc) {
  if (!canBuy(item, cost, world)) return;
  const id = item.id;
  game.coins -= cost;
  if (item.kind === "weapon") game.weapon = { name: item.name(world), damage: item.damage(world) };
  if (item.kind === "armor") game.armor = { name: item.name(world), defense: item.defense(world) };
  if (id === "potion") game.inventory.smallPotion += 1;
  if (id === "megaPotion") game.inventory.largePotion += 1;
  if (id === "boots") game.speedBonus = 0.55;
  if (id === "pack") game.magnet = 58;
  if (id === "shield") game.armor = { name: `Reinforced ${game.armor.name}`, defense: game.armor.defense + 2 };
  if (id === "map") game.hasRegionMap = true;
  if (id === "key") game.hasMineKey = true;
  if (id === "honing") {
    game.upgrades.honing += 1;
    game.weapon = { ...game.weapon, damage: game.weapon.damage + 4 };
  }
  if (id === "vitality") {
    game.upgrades.vitality += 1;
    game.player.maxHp += 18;
    game.player.hp = game.player.maxHp;
  }
  if (id === "focus") {
    game.upgrades.focus += 1;
    game.maxMana += 14;
    game.mana = game.maxMana;
  }
  advanceQuest("shop");
  say(`${npc.name}: ${item.name(world)} is yours.`, 2200);
  saveGame();
  openShop(npc);
}

function openQuest(npc) {
  const quest = normalizeQuest(game.quest);
  game.quest = quest;
  const coins = questRewardCoins();
  const xp = questRewardXp();
  if (quest.complete) {
    openMenu(npc.name, `Quest complete: ${quest.title}\n${questDescription(quest)}\n\nClaim your reward.`, [
      { label: `Claim reward (+${coins} coins, +${xp} XP)`, action: () => claimQuest(npc) },
    ]);
    return;
  }

  if (quest.active) {
    openMenu(npc.name, `${quest.title}\n${questDescription(quest)}\n\nProgress: ${questProgressText(quest)}`, [
      { label: "Keep exploring", action: closeMenu },
    ]);
    return;
  }

  openMenu(npc.name, `${quest.title}\n${questDescription(quest)}\n\nReward: ${coins} gold, ${xp} XP, and a Small Health Potion.`, [
    { label: "Accept quest", action: () => {
      quest.active = true;
      const step = currentQuestStep(quest);
      say(`${npc.name}: Start with this: ${step.text}`, 2600);
      closeMenu();
    } },
    { label: "Maybe later", action: closeMenu },
  ]);
}

function claimQuest(npc) {
  game.coins += questRewardCoins();
  game.inventory.smallPotion += 1;
  gainXp(questRewardXp());
  game.quest.complete = false;
  game.quest.active = false;
  game.quest = createGeneratedQuest();
  say(`${npc.name}: Route notes updated. Take this potion and keep an eye on the side paths.`, 3200);
  closeMenu();
  saveGame();
}

function createGeneratedQuest() {
  const worldIndex = game?.worldIndex || 0;
  const world = worlds[worldIndex];
  const plans = [
    {
      title: `Map the ${world.regions[(worldIndex + 1) % world.regions.length]}`,
      steps: [
        questStep("discovery", 1 + Math.min(2, worldIndex), "Find strange landmarks and mark them on your map."),
        questStep("chest", 2 + Math.min(2, worldIndex), "Open treasure chests along side paths."),
        questStep("house", 1 + Math.min(2, worldIndex), "Search quiet buildings for route notes."),
      ],
    },
    {
      title: `Prepare the Story-Road`,
      steps: [
        questStep("shop", 1, "Buy any useful shop item or upgrade."),
        questStep("house", 2, "Search buildings for supplies."),
        questStep("discovery", 1 + Math.min(1, worldIndex), "Find a landmark that explains the road."),
      ],
    },
    {
      title: `Treasure Before Trouble`,
      steps: [
        questStep("chest", 2 + Math.min(2, worldIndex), "Open treasure chests."),
        questStep("discovery", 1, "Find one odd landmark."),
        questStep("monster", 1 + Math.min(2, worldIndex), `Defeat a few enemies only after you have explored.`, worldIndex > 0 ? world.boss.level - 4 : 0),
      ],
    },
    {
      title: `The Long Way Around`,
      steps: [
        questStep("house", 2 + Math.min(2, worldIndex), "Search off-road buildings."),
        questStep("shop", 1, "Prepare with a shop purchase or upgrade."),
        questStep("chest", 1 + Math.min(2, worldIndex), "Open a chest after preparing."),
      ],
    },
  ];
  const plan = plans[Math.floor(Math.random() * plans.length)];
  return normalizeQuest({
    title: plan.title,
    description: "",
    steps: plan.steps,
    stepIndex: 0,
    active: false,
    complete: false,
  });
}

function normalizeQuest(quest) {
  if (!quest || !quest.title) return createGeneratedQuest();
  if (!Array.isArray(quest.steps)) {
    const target = quest.target || 1;
    quest.steps = [questStep(quest.type || "monster", target, quest.description || "Finish the task.", quest.minLevel || 0)];
    quest.stepIndex = 0;
  }
  quest.stepIndex ||= 0;
  quest.steps.forEach((step) => {
    step.progress ||= 0;
    step.target ||= 1;
  });
  const step = currentQuestStep(quest);
  quest.type = step?.type || quest.type;
  quest.target = step?.target || quest.target || 1;
  quest.defeated = step?.progress || quest.defeated || 0;
  quest.description = questDescription(quest);
  return quest;
}

function questStep(type, target, text, minLevel = 0) {
  return { type, target, text, minLevel, progress: 0 };
}

function currentQuestStep(quest = game.quest) {
  if (!quest || !Array.isArray(quest.steps)) return null;
  return quest.steps[Math.min(quest.stepIndex || 0, quest.steps.length - 1)] || null;
}

function questDescription(quest = game.quest) {
  if (!quest?.steps?.length) return quest?.description || "";
  return quest.steps
    .map((step, index) => {
      const marker = index < (quest.stepIndex || 0) ? "Done" : index === (quest.stepIndex || 0) ? "Now" : "Next";
      const levelText = step.minLevel ? ` Level ${step.minLevel}+.` : "";
      return `${index + 1}. ${marker}: ${step.text} (${step.progress || 0}/${step.target})${levelText}`;
    })
    .join("\n");
}

function questProgressText(quest = game.quest) {
  const step = currentQuestStep(quest);
  if (!step) return "No active step.";
  return `Step ${(quest.stepIndex || 0) + 1}/${quest.steps.length}: ${step.progress || 0}/${step.target} - ${step.text}`;
}

function questRewardCoins() {
  return 35 + game.worldIndex * 35;
}

function questRewardXp() {
  return 45 + game.worldIndex * 30;
}

function openSecretQuest(npc) {
  const secret = game.secretQuest;
  const reward = secretWeapons[Math.min(game.worldIndex, secretWeapons.length - 1)];
  if (!game.hasMineKey && !secret.found) {
    openMenu(npc.name, `A locked forge door hums.\n\nSecret Weapon Quest path:\n1. Buy an Old Mine Key from the shop.\n2. Collect ${secretShardTarget()} hidden ore shards.\n3. ${secretMaterialSourceText()}\n4. Return here and fight the Gear Keeper across as many tries as it takes.\n5. Claim ${reward.name} (+${reward.damage}).`, [
      { label: "Leave", action: closeMenu },
    ]);
    return;
  }

  secret.found = true;
  if (secret.claimedWorlds.includes(game.worldIndex)) {
    openMenu(npc.name, `The forge is quiet. You already claimed this world's secret weapon: ${reward.name} (+${reward.damage}).`, [
      { label: "Leave", action: closeMenu },
    ]);
    return;
  }

  if (secret.complete) {
    openMenu(npc.name, `The Gear Keeper is broken and the forge finally obeys.\n\nReward: ${reward.name} (+${reward.damage})\nThis beats the normal shop weapon in this world.`, [
      { label: `Claim ${reward.name}`, action: () => claimSecretWeapon(npc, reward) },
    ]);
    return;
  }

  if (secret.keeperReady) {
    const keeperHp = secret.keeperHp?.[game.worldIndex];
    const keeperLine = keeperHp ? `\nKeeper remaining HP: ${keeperHp}. It repaired some damage after your last defeat.` : "";
    openMenu(npc.name, `The hidden ore wakes the guardian.\n\nFinal Trial: defeat the ${secretKeeperName()}.\nReward: ${reward.name} (+${reward.damage})${keeperLine}\n\nThe key opened the forge. The keeper decides if you deserve what is inside.`, [
      { label: `Fight ${secretKeeperName()}`, action: () => startSecretKeeperFight(npc) },
      { label: "Prepare first", action: closeMenu },
    ]);
    return;
  }

  if (secret.active) {
    openMenu(npc.name, `Secret Weapon Quest\nReward: ${reward.name} (+${reward.damage})\nMaterials: ${secret.target} hidden ore shards.\nHow to get them: ${secretMaterialSourceText()} Minibosses and bosses have the best chance.\nNext step: bring all shards here, then fight the Gear Keeper.\nProgress: ${secret.shards}/${secret.target}`, [
      { label: "Keep searching", action: closeMenu },
    ]);
    return;
  }

  secret.target = Math.max(secret.target || 0, secretShardTarget());
  openMenu(npc.name, `Secret Weapon Quest unlocked.\n\nReward: ${reward.name} (+${reward.damage})\nIt is stronger than ${worlds[game.worldIndex].weapon.name} (+${worlds[game.worldIndex].weapon.damage}).\n\nMaterials: ${secret.target} hidden ore shards.\nHow to get materials: ${secretMaterialSourceText()} Minibosses and bosses have the best chance. After the shards are done, return here and defeat the Gear Keeper guarding the weapon.`, [
    { label: "Accept secret quest", action: () => {
      secret.active = true;
      secret.keeperReady = false;
      secret.keeperDefeated = false;
      secret.target = secretShardTarget();
      say("Secret quest started. Tough monsters can drop ore shards. The keeper waits after that.", 3200);
      closeMenu();
    } },
    { label: "Leave", action: closeMenu },
  ]);
}

function startSecretKeeperFight(npc) {
  const keeper = secretKeeper();
  closeMenu();
  say(`${npc.name}: Prove the weapon cannot own you.`, 2400);
  startBattle(keeper);
}

function secretKeeper() {
  const reward = secretWeapons[Math.min(game.worldIndex, secretWeapons.length - 1)];
  const level = worlds[game.worldIndex].boss.level + 7 + game.worldIndex * 2;
  const maxHp = 520 + game.worldIndex * 260 + level * 35;
  const savedHp = game.secretQuest.keeperHp?.[game.worldIndex];
  return {
    type: "boss",
    secretKeeper: true,
    name: secretKeeperName(),
    color: ["#7fd66b", "#ffd45a", "#9edcff", "#ff6b5f"][game.worldIndex] || "#b579ff",
    hp: Math.max(1, Math.min(maxHp, savedHp || maxHp)),
    maxHp,
    damage: 26 + game.worldIndex * 11 + Math.floor(level * 1.15),
    speed: 0.42 + game.worldIndex * 0.06,
    xp: 110 + game.worldIndex * 70,
    coins: 70 + game.worldIndex * 55,
    level,
    x: game.player.x,
    y: game.player.y - 44,
    w: 34,
    h: 42,
    dead: false,
    finalBoss: false,
    rewardName: reward.name,
  };
}

function secretKeeperName() {
  return ["Thorn Gear Keeper", "Glass Gear Keeper", "Moon Gear Keeper", "Dragon Gear Keeper"][game.worldIndex] || "Gear Keeper";
}

function secretShardTarget() {
  return 6 + game.worldIndex * 2;
}

function secretMaterialSourceText() {
  const level = worlds[game.worldIndex].boss.level - 2;
  return `Only tough enemies can drop ore orbs: minibosses, bosses, and normal monsters around Level ${level}+ in this world. Weak monsters do not drop secret ore.`;
}

function claimSecretWeapon(npc, reward) {
  game.weapon = { name: reward.name, damage: reward.damage };
  game.secretQuest.claimedWorlds.push(game.worldIndex);
  game.secretQuest.active = false;
  game.secretQuest.complete = false;
  game.secretQuest.keeperReady = false;
  game.secretQuest.keeperDefeated = false;
  delete game.secretQuest.keeperHp[game.worldIndex];
  game.secretQuest.shards = 0;
  game.secretQuest.target = secretShardTarget();
  say(`${npc.name}: The ${reward.name} is yours. Secret weapons beat shop gear.`, 3200);
  closeMenu();
  saveGame();
}

function openMenu(title, text, actions) {
  game.menuOpen = true;
  ui.menuTitle.textContent = title;
  ui.menuText.textContent = text;
  ui.menuActions.innerHTML = "";
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    if (action.className) button.className = action.className;
    if (action.title) button.title = action.title;
    if (action.tooltip) button.dataset.tooltip = action.tooltip;
    if (action.html) button.innerHTML = action.html;
    else button.textContent = action.label;
    button.disabled = !!action.disabled;
    button.addEventListener("click", action.action);
    ui.menuActions.appendChild(button);
  });
  ui.menuOverlay.classList.remove("is-hidden");
}

function closeMenu() {
  game.menuOpen = false;
  ui.menuOverlay.classList.add("is-hidden");
}

function updatePortal() {
  if (game.backrooms) return;
  if (!game.portal || distance(game.player, game.portal) >= 42) return;
  if (nextWorldAvailable()) {
    game.worldIndex += 1;
    game.abandonedMode = false;
    buildWorld();
    game.story.chapter = game.worldIndex + 1;
    say(`Chapter ${game.story.chapter}: ${worlds[game.worldIndex].name}. The road turns another page.`);
    saveGame();
  } else {
    say(game.abandonedUnlocked ? "The final island is silent. Abandoned islands wait at the Moon-Sealed Door." : "You cleared this path. Return to camp and choose where to go next.");
    saveGame();
  }
}

function updateCamera() {
  const targetX = clamp(game.player.x - canvas.width / 2, 0, MAP_W - canvas.width);
  const targetY = clamp(game.player.y - canvas.height / 2, 0, MAP_H - canvas.height);
  game.camera.x += (targetX - game.camera.x) * 0.16;
  game.camera.y += (targetY - game.camera.y) * 0.16;
}

function draw() {
  const world = worlds[game.worldIndex];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-Math.round(game.camera.x), -Math.round(game.camera.y));
  if (game.backrooms) {
    drawBackrooms();
    drawPlayer();
  } else if (game.inCamp) {
    drawCamp();
    drawEntities();
    drawPlayer();
  } else {
    drawWorld(world);
    drawChests();
    drawCoins();
    drawPortal();
    drawDiscoveries();
    drawEntities();
    drawPlayer();
  }
  drawParticles();
  drawFloatingTexts();
  ctx.restore();
  if (game.backrooms) {
    drawBackroomsDarkness();
    drawDeathRush();
  }
  drawBattleAttacks();
  drawMiniMap();
  drawTopText();
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.globalAlpha = 1;
  });
}

function drawFloatingTexts() {
  floatingTexts.forEach((item) => {
    ctx.globalAlpha = Math.max(0, item.life / item.maxLife);
    ctx.fillStyle = "rgba(0,0,0,0.72)";
    ctx.fillRect(item.x - item.text.length * 4 - 4, item.y - 14, item.text.length * 8 + 8, 18);
    ctx.fillStyle = item.color;
    ctx.font = "14px Courier New";
    ctx.fillText(item.text, item.x - item.text.length * 4, item.y);
    ctx.globalAlpha = 1;
  });
}

function visibleWorldRect(pad = 96) {
  return {
    x: Math.max(0, Math.floor(game.camera.x) - pad),
    y: Math.max(0, Math.floor(game.camera.y) - pad),
    w: canvas.width + pad * 2,
    h: canvas.height + pad * 2,
  };
}

function visibleTileRange(pad = TILE * 2) {
  const view = visibleWorldRect(pad);
  return {
    startX: Math.max(0, Math.floor(view.x / TILE)),
    endX: Math.min(Math.ceil(MAP_W / TILE), Math.ceil((view.x + view.w) / TILE)),
    startY: Math.max(0, Math.floor(view.y / TILE)),
    endY: Math.min(Math.ceil(MAP_H / TILE), Math.ceil((view.y + view.h) / TILE)),
  };
}

function drawCamp() {
  const view = visibleWorldRect();
  ctx.fillStyle = "#2f5a37";
  ctx.fillRect(view.x, view.y, view.w, view.h);
  ctx.fillStyle = "#3e7244";
  const tiles = visibleTileRange();
  for (let y = tiles.startY; y < tiles.endY; y++) {
    for (let x = tiles.startX; x < tiles.endX; x++) {
      if ((x * 3 + y * 5) % 11 === 0) ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      if ((x + y * 7) % 17 === 0) {
        ctx.fillStyle = "#284b31";
        ctx.fillRect(x * TILE + 6, y * TILE + 18, 18, 8);
        ctx.fillStyle = "#3e7244";
      }
    }
  }
  drawCampPaths();
  drawGroundDetails();
  drawCampForestFrame();
  drawBorders({ wall: "#273b2d" });
  game.houses.forEach((house) => drawHouse(house, { house: "#8c6540", roof: "#4f2f24" }));
  drawCampBuildingDetails();
  game.campObjects.forEach(drawCampObject);
  ctx.fillStyle = "rgba(13, 15, 18, 0.62)";
  ctx.fillRect(390, 112, 420, 34);
  ctx.fillStyle = "#ffd45a";
  ctx.font = "18px Courier New";
  ctx.fillText("Adventurer's Camp", 502, 136);
}

function campPathLines() {
  return [
    [{ x: 560, y: 560 }, { x: 350, y: 645 }, { x: 270, y: 640 }],
    [{ x: 560, y: 560 }, { x: 690, y: 425 }, { x: 744, y: 310 }],
    [{ x: 560, y: 560 }, { x: 720, y: 680 }, { x: 720, y: 760 }],
    [{ x: 560, y: 560 }, { x: 760, y: 585 }, { x: 975, y: 760 }, { x: 1110, y: 1035 }],
    [{ x: 744, y: 310 }, { x: 920, y: 275 }, { x: 1090, y: 285 }],
    [{ x: 560, y: 560 }, { x: 560, y: 650 }, { x: 560, y: 710 }],
  ];
}

function drawCampPaths() {
  campPathLines().forEach((points, index) => drawCampPath(points, index === 3 ? 92 : 74));
  ctx.fillStyle = "#9a7741";
  for (let i = 0; i < 90; i++) {
    const line = campPathLines()[i % campPathLines().length];
    const a = line[(i + 1) % (line.length - 1)];
    const b = line[(i + 2) % line.length];
    const t = ((i * 37) % 100) / 100;
    const x = a.x + (b.x - a.x) * t + ((i * 29) % 18) - 9;
    const y = a.y + (b.y - a.y) * t + ((i * 43) % 18) - 9;
    ctx.fillRect(x, y, 8 + (i % 3) * 3, 4 + (i % 2) * 3);
  }
}

function drawCampPath(points, width) {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const steps = Math.max(12, Math.ceil(distance(a, b) / 22));
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const wobble = Math.sin((step + i * 7) * 0.9) * 10;
      const x = a.x + (b.x - a.x) * t + wobble;
      const y = a.y + (b.y - a.y) * t + Math.cos((step + i * 5) * 0.8) * 7;
      ctx.fillStyle = "#6f5731";
      ctx.fillRect(x - width / 2, y - width / 2, width, width);
      ctx.fillStyle = "#8a6b3a";
      ctx.fillRect(x - width / 2 + 8, y - width / 2 + 8, width - 16, width - 16);
    }
  }
}

function drawCampForestFrame() {
  for (let i = 0; i < 72; i++) {
    const edge = i % 4;
    const x = edge < 2 ? 48 + ((i * 149) % (MAP_W - 96)) : edge === 2 ? 46 : MAP_W - 56;
    const y = edge >= 2 ? 52 + ((i * 197) % (MAP_H - 104)) : edge === 0 ? 44 : MAP_H - 58;
    drawPixelRect(x - 14, y - 10, 28, 22, i % 3 === 0 ? "#1f3b28" : "#244832", "#102116");
    ctx.fillStyle = "#57391f";
    ctx.fillRect(x - 4, y + 10, 8, 18);
  }
  for (let i = 0; i < 28; i++) {
    const x = 120 + ((i * 271) % (MAP_W - 240));
    const y = 120 + ((i * 389) % (MAP_H - 240));
    if (nearCampPath(x, y, 110)) continue;
    drawPixelRect(x - 18, y - 10, 36, 20, "#3f463f", "#171916");
  }
}

function drawGroundDetails() {
  for (let i = 0; i < 90; i++) {
    const x = 60 + ((i * 191) % (MAP_W - 120));
    const y = 80 + ((i * 271) % (MAP_H - 160));
    if (game.inCamp ? nearCampPath(x, y, 70) : nearPath(x, y)) continue;
    ctx.fillStyle = i % 5 === 0 ? "#d8c15f" : i % 3 === 0 ? "#5f8a55" : "#253c2b";
    ctx.fillRect(x, y, 4 + (i % 3), 3 + (i % 2));
  }
  for (let i = 0; i < 34; i++) {
    const x = 80 + ((i * 313) % (MAP_W - 160));
    const y = 90 + ((i * 223) % (MAP_H - 180));
    if (game.inCamp ? nearCampPath(x, y, 90) : nearPath(x, y)) continue;
    drawPixelRect(x - 13, y - 9, 26, 18, "#294b31", "#152217");
  }
}

function drawCampBuildingDetails() {
  const smith = game.houses.find((house) => house.id === "camp-blacksmith");
  const shop = game.houses.find((house) => house.id === "camp-merchant");
  if (smith) {
    drawLight(smith.x + smith.w - 34, smith.y + 70, 90, "rgba(255, 116, 40, 0.24)");
    ctx.fillStyle = "#2b1d16";
    ctx.fillRect(smith.x + 110, smith.y - 58, 34, 42);
    ctx.fillStyle = "#ff8a38";
    ctx.fillRect(smith.x + 112, smith.y + 62, 28, 18);
    ctx.fillStyle = "#b9b0a0";
    ctx.fillRect(smith.x + 34, smith.y + 82, 28, 12);
    ctx.fillStyle = "#20242d";
    ctx.fillRect(smith.x + 88, smith.y + 42, 8, 44);
    ctx.fillRect(smith.x + 106, smith.y + 46, 8, 40);
    ctx.fillStyle = "#ff6b5f";
    ctx.fillRect(smith.x + smith.w - 28, smith.y + 44, 18, 18);
  }
  if (shop) {
    ctx.fillStyle = "#c2413b";
    ctx.fillRect(shop.x - 8, shop.y - 10, shop.w + 16, 28);
    ctx.fillStyle = "#f4efd7";
    for (let i = 0; i < 4; i++) ctx.fillRect(shop.x + i * 38, shop.y - 10, 18, 28);
    ctx.fillStyle = "#79d2ff";
    ctx.fillRect(shop.x + 25, shop.y + 70, 10, 16);
    ctx.fillStyle = "#ff6b5f";
    ctx.fillRect(shop.x + 44, shop.y + 70, 10, 16);
    ctx.fillStyle = "#8a6232";
    ctx.fillRect(shop.x + 98, shop.y + 76, 36, 24);
  }
}

function drawLight(x, y, r, color) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function drawCampObject(object) {
  if (object.type === "campfire") {
    drawLight(object.x, object.y - 18, 115, "rgba(255, 142, 50, 0.28)");
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(object.x - 46, object.y + 18, 92, 14);
    ctx.fillStyle = "#6b4a2e";
    ctx.fillRect(object.x - 86, object.y + 42, 54, 12);
    ctx.fillRect(object.x + 34, object.y + 42, 54, 12);
    drawPixelRect(object.x - 20, object.y - 12, 40, 24, "#6b3f2b", "#1b100b");
    ctx.fillStyle = "#8a4e2a";
    ctx.fillRect(object.x - 28, object.y - 7, 56, 8);
    ctx.fillStyle = Math.floor(game.messageTimer / 90) % 2 ? "#ffb33d" : "#ff7c3d";
    ctx.fillRect(object.x - 12, object.y - 36, 24, 28);
    ctx.fillStyle = "#ffed70";
    ctx.fillRect(object.x - 5, object.y - 27, 10, 18);
  } else if (object.type === "sealedDoor") {
    drawLight(object.x, object.y, 120, "rgba(121, 210, 255, 0.18)");
    drawPixelRect(object.x - 54, object.y - 58, 108, 116, "#454b58", "#151820");
    drawPixelRect(object.x - 34, object.y - 42, 68, 84, "#6d7180", "#1a1c25");
    ctx.fillStyle = "#79d2ff";
    ctx.fillRect(object.x - 4, object.y - 32, 8, 64);
    for (let i = 0; i < 6; i++) ctx.fillRect(object.x - 42 + i * 16, object.y - 54 + (i % 2) * 96, 7, 7);
    spawnAmbientPixel(object.x + Math.random() * 70 - 35, object.y + Math.random() * 90 - 45, "#79d2ff");
  } else if (object.type === "dungeonEntrance") {
    drawLight(object.x - 60, object.y - 28, 90, "rgba(255, 145, 55, 0.18)");
    drawLight(object.x + 60, object.y - 28, 90, "rgba(255, 145, 55, 0.18)");
    drawPixelRect(object.x - 70, object.y - 50, 140, 100, "#373540", "#09070d");
    ctx.fillStyle = "#b98d3c";
    ctx.fillRect(object.x - 86, object.y - 70, 26, 58);
    ctx.fillRect(object.x + 60, object.y - 70, 26, 58);
    ctx.fillStyle = "#ff8a38";
    ctx.fillRect(object.x - 76, object.y - 80, 8, 14);
    ctx.fillRect(object.x + 70, object.y - 80, 8, 14);
    ctx.fillStyle = "#121019";
    for (let i = 0; i < 5; i++) ctx.fillRect(object.x - 46 + i * 18, object.y - 20 + i * 9, 92 - i * 18, 9);
    ctx.fillStyle = "#5c3b91";
    ctx.fillRect(object.x - 38, object.y - 25, 76, 50);
    drawSmallLabel(object.x, object.y + 72, "Dungeon Entrance - Floor 1");
  } else if (object.type === "dummy") {
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(object.x - 24, object.y + 28, 48, 10);
    drawPixelRect(object.x - 15, object.y - 30, 30, 60, "#b58a4a", "#3b2412");
    ctx.fillStyle = "#7a4724";
    ctx.fillRect(object.x - 44, object.y - 10, 88, 10);
    ctx.fillStyle = "#f4efd7";
    ctx.fillRect(object.x - 10, object.y - 14, 20, 20);
    ctx.fillStyle = "#c2413b";
    ctx.fillRect(object.x - 6, object.y - 10, 12, 12);
    ctx.fillStyle = "#f4efd7";
    ctx.fillRect(object.x - 7, object.y - 19, 5, 5);
    ctx.fillRect(object.x + 3, object.y - 19, 5, 5);
  }
  if (distance(game.player, object) < 180) drawSmallLabel(object.x, object.y - 58, object.label);
}

function spawnAmbientPixel(x, y, color) {
  if (Math.random() < 0.08) spawnParticle(x, y, color, 1);
}

function drawSmallLabel(x, y, label) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  ctx.fillRect(x - label.length * 3.8 - 5, y - 12, label.length * 7.6 + 10, 18);
  ctx.fillStyle = "#f4efd7";
  ctx.font = "12px Courier New";
  ctx.fillText(label, x - label.length * 3.8, y + 1);
}

function drawWorld(world) {
  const view = visibleWorldRect();
  ctx.fillStyle = world.floor;
  ctx.fillRect(view.x, view.y, view.w, view.h);

  const tiles = visibleTileRange();
  for (let y = tiles.startY; y < tiles.endY; y++) {
    for (let x = tiles.startX; x < tiles.endX; x++) {
      drawGroundTile(x * TILE, y * TILE, world, x, y);
      if ((x * 3 + y + game.worldIndex) % 5 === 0) {
        ctx.fillStyle = world.floorAlt;
        ctx.globalAlpha = 0.38;
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        ctx.globalAlpha = 1;
      }
    }
  }

  currentWorldRoutes().forEach((route) => drawOrganicRoute(route, world));

  drawBorders(world);
  drawRegions();
  drawWorldDetails(world);
  drawDungeonDressings(world);
  drawHazards();
  game.houses.forEach((house) => drawHouse(house, world));
  drawTreesAndRocks(world);
  drawAbandonedOverlay();
}

function drawAbandonedOverlay() {
  if (!game.abandonedMode) return;
  const view = visibleWorldRect();
  ctx.fillStyle = "rgba(20, 18, 24, 0.32)";
  ctx.fillRect(view.x, view.y, view.w, view.h);
  ctx.fillStyle = "rgba(213, 204, 255, 0.12)";
  for (let i = 0; i < 18; i++) {
    const x = view.x + ((i * 271 + game.worldIndex * 53) % Math.max(1, view.w));
    const y = view.y + ((i * 193 + game.worldIndex * 71) % Math.max(1, view.h));
    ctx.fillRect(x, y, 34, 4);
  }
}

function drawHazards() {
  (game.hazards || []).forEach((hazard) => {
    if (hazard.type !== "lava") return;
    const pulse = Math.sin(Date.now() * 0.006 + hazard.x * 0.01) * 0.5 + 0.5;
    drawLight(hazard.x + hazard.w / 2, hazard.y + hazard.h / 2, Math.max(hazard.w, hazard.h) * 0.6, "rgba(255, 100, 24, 0.16)");
    ctx.fillStyle = "#3b1410";
    ctx.fillRect(hazard.x - 8, hazard.y - 8, hazard.w + 16, hazard.h + 16);
    ctx.fillStyle = "#b93220";
    ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
    ctx.fillStyle = pulse > 0.5 ? "#ff8a38" : "#ffcd68";
    for (let i = 0; i < 9; i++) {
      const lx = hazard.x + 12 + ((i * 61 + Math.floor(pulse * 30)) % Math.max(24, hazard.w - 24));
      const ly = hazard.y + 10 + ((i * 37) % Math.max(24, hazard.h - 20));
      ctx.fillRect(lx, ly, 42 + (i % 3) * 18, 8);
    }
  });
}

function drawGroundTile(x, y, world, tx, ty) {
  ctx.fillStyle = (tx * 7 + ty * 11 + game.worldIndex) % 4 === 0 ? world.floorAlt : world.floor;
  ctx.fillRect(x, y, TILE, TILE);
  const detail = (tx * 13 + ty * 17 + game.worldIndex * 5) % 19;
  if (detail === 0) {
    ctx.fillStyle = "#d8c15f";
    ctx.fillRect(x + 7, y + 10, 3, 3);
    ctx.fillRect(x + 15, y + 18, 4, 3);
  } else if (detail === 3) {
    ctx.fillStyle = "#1f3b28";
    ctx.fillRect(x + 8, y + 23, 13, 3);
    ctx.fillRect(x + 20, y + 18, 4, 7);
  } else if (detail === 7) {
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(x + 5, y + 26, 18, 3);
  }
}

function drawOrganicRoute(route, world) {
  const horizontal = route.w >= route.h;
  const step = 24;
  ctx.fillStyle = "#4b3825";
  ctx.fillRect(route.x - 10, route.y - 10, route.w + 20, route.h + 20);
  for (let offset = 0; offset < (horizontal ? route.w : route.h); offset += step) {
    const wobble = Math.sin((offset + route.x + route.y) * 0.04) * 8;
    const x = horizontal ? route.x + offset : route.x + wobble;
    const y = horizontal ? route.y + wobble : route.y + offset;
    const w = horizontal ? step + 12 : route.w + 14;
    const h = horizontal ? route.h + 14 : step + 12;
    ctx.fillStyle = world.path;
    ctx.fillRect(x - 7, y - 7, w, h);
    ctx.fillStyle = "#8c7245";
    if (offset % 48 === 0) ctx.fillRect(x + 8, y + 6, horizontal ? 18 : 5, horizontal ? 5 : 18);
    ctx.fillStyle = "#31472e";
    if (offset % 72 === 0) {
      ctx.fillRect(x - 10, y - 12, 16, 4);
      ctx.fillRect(x + w - 6, y + h + 4, 14, 4);
    }
  }
}

function drawDungeonDressings(world) {
  if (game.worldIndex !== 0) return;
  for (let i = 0; i < 85; i++) {
    const x = 70 + ((i * 211) % (MAP_W - 140));
    const y = 75 + ((i * 167) % (MAP_H - 150));
    if (nearPath(x, y) && i % 3 !== 0) continue;
    ctx.fillStyle = i % 4 === 0 ? "#3b4038" : "#253022";
    ctx.fillRect(x, y, 10 + (i % 3) * 6, 3);
    if (i % 7 === 0) ctx.fillRect(x + 4, y - 6, 3, 15);
  }
  for (let i = 0; i < 28; i++) {
    const x = 140 + ((i * 281) % (MAP_W - 280));
    const y = 140 + ((i * 349) % (MAP_H - 280));
    if (nearPath(x, y)) continue;
    if (i % 4 === 0) {
      drawShadow(x, y + 22, 48, 11);
      drawPixelRect(x - 14, y - 24, 28, 48, "#5c625b", "#1a2119");
      ctx.fillStyle = "#3b4038";
      ctx.fillRect(x - 19, y - 29, 38, 9);
      ctx.fillRect(x - 18, y + 16, 36, 8);
    } else if (i % 4 === 1) {
      ctx.fillStyle = "#2b261f";
      ctx.fillRect(x - 22, y - 9, 44, 18);
      ctx.fillStyle = "#8a6232";
      ctx.fillRect(x - 18, y - 14, 36, 11);
      ctx.fillStyle = "#c7ced8";
      ctx.fillRect(x - 12, y - 19, 24, 4);
      ctx.fillRect(x + 7, y - 22, 5, 14);
    } else if (i % 4 === 2) {
      ctx.fillStyle = "#c9c0a7";
      ctx.fillRect(x - 16, y, 16, 5);
      ctx.fillRect(x - 7, y - 7, 5, 16);
      ctx.fillRect(x + 6, y - 2, 16, 5);
    } else {
      ctx.fillStyle = "#2f2458";
      ctx.fillRect(x - 18, y - 26, 36, 42);
      ctx.fillStyle = "#7c5cff";
      ctx.fillRect(x - 14, y - 18, 28, 7);
      ctx.fillStyle = "#161222";
      ctx.fillRect(x - 14, y + 10, 28, 6);
    }
  }
  for (let i = 0; i < 18; i++) {
    const x = 160 + ((i * 353) % (MAP_W - 320));
    const y = 170 + ((i * 251) % (MAP_H - 340));
    if (nearPath(x, y)) continue;
    drawShadow(x, y + 14, 42, 12);
    drawPixelRect(x - 16, y - 18, 32, 36, "#596052", "#1a2119");
    ctx.fillStyle = "#30372f";
    ctx.fillRect(x - 10, y - 6, 20, 5);
  }
  for (let i = 0; i < 10; i++) {
    const x = 310 + ((i * 421) % (MAP_W - 620));
    const y = 360 + ((i * 199) % (MAP_H - 720));
    drawLight(x, y, 95, "rgba(255, 142, 50, 0.15)");
    ctx.fillStyle = "#4b2d22";
    ctx.fillRect(x - 5, y - 20, 10, 34);
    ctx.fillStyle = "#ff8a38";
    ctx.fillRect(x - 4, y - 30, 8, 12);
    if (Math.random() < 0.04) spawnParticle(x, y - 27, "#ffb33d", 1);
  }
  for (let i = 0; i < 14; i++) {
    const x = 100 + ((i * 271) % (MAP_W - 200));
    const y = 105 + ((i * 337) % (MAP_H - 210));
    if (nearPath(x, y)) continue;
    ctx.fillStyle = "#c9c0a7";
    ctx.fillRect(x, y, 16, 5);
    ctx.fillRect(x + 5, y - 5, 5, 16);
  }
}

function drawWorldDetails(world) {
  if (game.worldIndex === 0) {
    ctx.fillStyle = "#4ba1b0";
    ctx.fillRect(1490, 220, 260, 170);
    ctx.fillStyle = "#74d6d8";
    ctx.fillRect(1530, 260, 180, 18);
    ctx.fillRect(1510, 330, 220, 16);
  } else if (game.worldIndex === 1) {
    ctx.fillStyle = "#d8bd74";
    for (let i = 0; i < 12; i++) ctx.fillRect(740 + i * 95, 170 + (i % 4) * 62, 58, 10);
    ctx.fillStyle = "#6c8f3f";
    ctx.fillRect(1450, 430, 80, 28);
  } else if (game.worldIndex === 2) {
    ctx.fillStyle = "#c8f7ff";
    for (let i = 0; i < 14; i++) drawPixelRect(760 + i * 82, 190 + (i % 5) * 70, 18, 36, "#c8f7ff", "#4e7c91");
  } else {
    ctx.fillStyle = "#f35b2f";
    ctx.fillRect(1430, 1110, 260, 70);
    ctx.fillRect(1860, 760, 220, 62);
    ctx.fillStyle = "#ffd45a";
    ctx.fillRect(1460, 1130, 180, 16);
  }
}

function drawRegions() {
  (regionLayouts[game.worldIndex] || []).forEach((region, index) => {
    ctx.fillStyle = region.color;
    ctx.fillRect(region.x, region.y, region.w, region.h);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let i = 0; i < 8; i++) ctx.fillRect(region.x + 30 + i * 61, region.y + 36 + (i % 3) * 45, 26, 4);
  });
}

function drawDiscoveries() {
  game.discoveries.forEach((discovery) => {
    if (!discovery.found && distance(game.player, discovery) > 220) return;
    ctx.fillStyle = discovery.found ? "#79d2ff" : "#f4efd7";
    ctx.fillRect(discovery.x - 12, discovery.y - 12, 24, 4);
    ctx.fillRect(discovery.x - 12, discovery.y + 8, 24, 4);
    ctx.fillRect(discovery.x - 4, discovery.y - 12, 8, 24);
  });
}

function drawBackrooms() {
  const view = visibleWorldRect();
  ctx.fillStyle = "#d7c56f";
  ctx.fillRect(view.x, view.y, view.w, view.h);
  ctx.fillStyle = "#c8b95f";
  const startY = Math.max(0, Math.floor(view.y / 96) * 96);
  const endY = Math.min(MAP_H, view.y + view.h);
  const startX = Math.max(0, Math.floor(view.x / 128) * 128);
  const endX = Math.min(MAP_W, view.x + view.w);
  for (let y = startY; y < endY; y += 96) {
    for (let x = startX; x < endX; x += 128) {
      ctx.fillRect(x, y, 74, 10);
      ctx.fillRect(x + 56, y + 32, 10, 74);
    }
  }
  ctx.fillStyle = "#b5a551";
  game.backrooms.walls.forEach((wall) => {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.fillStyle = "rgba(85, 76, 35, 0.55)";
    ctx.fillRect(wall.x + 6, wall.y + 6, Math.max(0, wall.w - 12), Math.max(0, wall.h - 12));
    ctx.fillStyle = "#b5a551";
  });
  game.backrooms.exits.forEach((exit) => {
    const glow = 8 + Math.sin(game.backrooms.hum * 5) * 3;
    ctx.fillStyle = "#efff9a";
    ctx.fillRect(exit.x - glow, exit.y - glow, glow * 2, glow * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(exit.x - 4, exit.y - 18, 8, 36);
  });
  game.backrooms.bodies.forEach(drawBackroomsBody);
  game.backrooms.entities.forEach(drawBackroomsEntity);
}

function drawBackroomsBody(body) {
  ctx.save();
  ctx.translate(body.x, body.y);
  ctx.rotate(body.angle);
  ctx.fillStyle = "rgba(55, 39, 23, 0.86)";
  ctx.fillRect(-13, -9, 26, 18);
  ctx.fillRect(-body.armA, -7, body.armA, 8);
  ctx.fillRect(0, -6, body.armB, 8);
  ctx.fillRect(-8, 8, 8, body.legA);
  ctx.fillRect(2, 8, 8, body.legB);
  ctx.fillStyle = "rgba(18, 12, 8, 0.9)";
  ctx.fillRect(-9, -19, 18, 13);
  ctx.fillStyle = "rgba(130, 0, 0, 0.45)";
  ctx.fillRect(-body.armA - 4, -4, 10, 5);
  ctx.restore();
}

function drawBackroomsEntity(entity) {
  const shake = Math.floor(game.backrooms.hum * entity.faceShakeRate + entity.phase) % 2 === 0 ? -3 : 3;
  const flicker = Math.sin(game.backrooms.hum * 7 + entity.phase) > 0.25;
  const bw = entity.bodyW;
  const bh = entity.bodyH;
  const neck = entity.neck;
  ctx.fillStyle = flicker ? "#050505" : "#17120c";
  ctx.fillRect(entity.x - bw / 2, entity.y - bh / 2, bw, bh);
  ctx.fillRect(entity.x - 6, entity.y - bh / 2 - neck, 12, neck + 10);
  ctx.fillRect(entity.x - entity.leftArm, entity.y - bh / 2 + 10, entity.leftArm - bw / 2 + 2, 10);
  ctx.fillRect(entity.x + bw / 2 - 2, entity.y - bh / 2 + 13, entity.rightArm, 10);
  ctx.fillRect(entity.x - entity.leftArm - 8, entity.y - bh / 2 + 13, 12, 40 + entity.leftArm * 0.35);
  ctx.fillRect(entity.x + bw / 2 + entity.rightArm - 5, entity.y - bh / 2 + 16, 12, 44 + entity.rightArm * 0.32);
  ctx.fillRect(entity.x - bw / 2 + 4, entity.y + bh / 2 - 3, 9, entity.leftLeg);
  ctx.fillRect(entity.x + bw / 2 - 13, entity.y + bh / 2 - 3, 9, entity.rightLeg);
  if (entity.dashTimer > 0) {
    ctx.fillStyle = "rgba(5, 5, 5, 0.35)";
    ctx.fillRect(entity.x - entity.dashX * 56 - bw / 2, entity.y - entity.dashY * 56 - bh / 2, bw, bh);
  }
  ctx.fillStyle = "#fff6b4";
  ctx.fillRect(entity.x - 8 + shake, entity.y - bh / 2 - neck + 2, 5, 5);
  ctx.fillRect(entity.x + 3 + shake, entity.y - bh / 2 - neck + 2, 5, 5);
  ctx.fillStyle = "#f4efd7";
  ctx.fillRect(entity.x - 9 + shake, entity.y - bh / 2 - neck + 16, 18, 3);
}

function drawBackroomsDarkness() {
  const close = game.backrooms.darkness || 0;
  const edge = Math.floor(Math.max(canvas.width, canvas.height) * close);
  ctx.fillStyle = `rgba(0, 0, 0, ${0.25 + close * 0.55})`;
  ctx.fillRect(0, 0, canvas.width, edge);
  ctx.fillRect(0, canvas.height - edge, canvas.width, edge);
  ctx.fillRect(0, 0, edge * 0.72, canvas.height);
  ctx.fillRect(canvas.width - edge * 0.72, 0, edge * 0.72, canvas.height);
  if (close > 0.65) {
    ctx.fillStyle = `rgba(0, 0, 0, ${(close - 0.65) * 1.6})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawDeathRush() {
  if (!game.backrooms.deathRush) return;
  const rush = game.backrooms.deathRush;
  const sx = rush.x - game.camera.x;
  const sy = rush.y - game.camera.y;
  ctx.fillStyle = `rgba(150, 0, 0, ${Math.min(0.78, 0.28 + rush.timer / 1400)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(rush.size, rush.size);
  ctx.fillStyle = "#030000";
  ctx.fillRect(-20, -55, 40, 90);
  ctx.fillRect(-70, -36, 50, 16);
  ctx.fillRect(20, -36, 58, 16);
  ctx.fillRect(-78, -26, 18, 100);
  ctx.fillRect(60, -26, 18, 112);
  ctx.fillStyle = "#fff7c8";
  ctx.fillRect(-14, -28, 8, 8);
  ctx.fillRect(6, -28, 8, 8);
  ctx.fillRect(-18, -6, 36, 6);
  ctx.restore();
}

function drawBorders(world) {
  ctx.fillStyle = world.wall;
  ctx.fillRect(0, 0, MAP_W, 32);
  ctx.fillRect(0, MAP_H - 32, MAP_W, 32);
  ctx.fillRect(0, 0, 32, MAP_H);
  ctx.fillRect(MAP_W - 32, 0, 32, MAP_H);
}

function drawHouse(house, world) {
  const searched = game.searchedHouses.includes(house.id);
  drawShadow(house.x + house.w / 2, house.y + house.h + 8, house.w + 28, 22);
  const roof = house.id.includes("blacksmith") ? "#34343b" : house.id.includes("merchant") ? "#c2413b" : world.roof;
  const wall = house.id.includes("blacksmith") ? "#6f6254" : house.id.includes("merchant") ? "#8f6843" : world.house;
  ctx.fillStyle = "#2b2118";
  ctx.fillRect(house.x - 14, house.y + house.h - 8, house.w + 28, 18);
  drawPixelRect(house.x, house.y + 8, house.w, house.h - 8, wall, "#1a1110");
  ctx.fillStyle = roof;
  ctx.fillRect(house.x - 16, house.y - 22, house.w + 32, 22);
  ctx.fillRect(house.x - 7, house.y - 42, house.w + 14, 24);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  for (let x = house.x + 8; x < house.x + house.w - 12; x += 26) ctx.fillRect(x, house.y - 36, 13, 5);
  ctx.fillStyle = "#2d1d18";
  ctx.fillRect(house.x + house.w / 2 - 18, house.y + house.h - 43, 36, 43);
  ctx.fillStyle = searched ? "#5a4e46" : "#f4efd7";
  ctx.fillRect(house.x + house.w / 2 + 9, house.y + house.h - 24, 5, 5);
  drawWindow(house.x + 18, house.y + 38, searched);
  drawWindow(house.x + house.w - 42, house.y + 42, searched);
  ctx.fillStyle = "#5a3b23";
  ctx.fillRect(house.x + 12, house.y + house.h - 20, 34, 10);
  ctx.fillRect(house.x + house.w - 48, house.y + house.h - 24, 9, 22);
  if (house.id.includes("blacksmith")) drawBlacksmithHouseProps(house);
  if (house.id.includes("merchant")) drawMerchantHouseProps(house);
  if (distance(game.player, { x: house.x + house.w / 2, y: house.y + house.h / 2 }) < 190) {
    drawSmallLabel(house.x + house.w / 2, house.y - 58, house.label);
  }
}

function drawTreesAndRocks(world) {
  for (let i = 0; i < 72; i++) {
    const x = 70 + ((i * 173) % (MAP_W - 140));
    const y = 70 + ((i * 257) % (MAP_H - 140));
    if (nearPath(x, y)) continue;
    if (i % 3 === 0) {
      drawPixelRock(x, y, i);
    } else {
      drawPixelTree(x, y, world, i);
    }
  }
}

function drawWindow(x, y, dim) {
  ctx.fillStyle = "#2a1b15";
  ctx.fillRect(x - 3, y - 3, 30, 25);
  ctx.fillStyle = dim ? "#6d583c" : "#ffd45a";
  ctx.fillRect(x, y, 24, 19);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(x + 4, y + 4, 5, 11);
  ctx.fillRect(x + 14, y + 3, 4, 13);
}

function drawBlacksmithHouseProps(house) {
  drawLight(house.x + house.w - 26, house.y + 72, 85, "rgba(255, 116, 40, 0.22)");
  ctx.fillStyle = "#201611";
  ctx.fillRect(house.x + house.w - 46, house.y - 76, 30, 58);
  ctx.fillStyle = "rgba(120,120,130,0.28)";
  ctx.fillRect(house.x + house.w - 44, house.y - 92 - (Math.floor(lastTime / 240) % 3) * 4, 10, 10);
  ctx.fillRect(house.x + house.w - 32, house.y - 108, 14, 8);
  ctx.fillStyle = "#c7ced8";
  ctx.fillRect(house.x + 24, house.y + house.h + 4, 32, 8);
  ctx.fillRect(house.x + 32, house.y + house.h - 6, 16, 18);
  if (Math.random() < 0.04) spawnParticle(house.x + house.w - 22, house.y + 72, "#ffb33d", 1);
}

function drawMerchantHouseProps(house) {
  ctx.fillStyle = "#e6d58c";
  ctx.fillRect(house.x - 14, house.y + 34, house.w + 28, 20);
  ctx.fillStyle = "#c2413b";
  for (let i = 0; i < 6; i++) ctx.fillRect(house.x - 12 + i * 31, house.y + 34, 15, 20);
  ctx.fillStyle = "#8a6232";
  ctx.fillRect(house.x + 10, house.y + house.h + 3, 34, 20);
  ctx.fillRect(house.x + house.w - 48, house.y + house.h + 2, 28, 18);
  ctx.fillStyle = "#79d2ff";
  ctx.fillRect(house.x + 58, house.y + house.h + 4, 7, 12);
  ctx.fillStyle = "#ff6b5f";
  ctx.fillRect(house.x + 70, house.y + house.h + 6, 7, 10);
}

function drawPixelTree(x, y, world, seed) {
  const sway = Math.sin(lastTime / 900 + seed) * 2;
  drawShadow(x, y + 24, 50, 14);
  ctx.fillStyle = "#4b2d22";
  ctx.fillRect(x - 5, y + 6, 10, 28);
  ctx.fillStyle = "#6b4328";
  ctx.fillRect(x, y + 8, 4, 20);
  const leaf = seed % 2 ? world.wall : "#244832";
  drawPixelRect(x - 24 + sway, y - 28, 48, 34, leaf, "#102116");
  drawPixelRect(x - 15 - sway, y - 44, 38, 30, "#2f6840", "#102116");
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(x - 9 + sway, y - 36, 15, 4);
}

function drawPixelRock(x, y, seed) {
  drawShadow(x, y + 10, 30, 8);
  drawPixelRect(x - 13, y - 9, 26, 18, seed % 2 ? "#4c554d" : "#596052", "#1a2119");
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(x - 7, y - 5, 9, 3);
}

function drawCoins() {
  game.coinsOnGround.forEach((coin) => {
    coin.bob += 0.08;
    const y = coin.y + Math.sin(coin.bob) * 2;
    drawLight(coin.x, y, 24, "rgba(255, 212, 90, 0.12)");
    drawPixelRect(coin.x - 6, y - 6, 12, 12, "#ffd45a", "#7d4e18");
    ctx.fillStyle = "#fff0a0";
    ctx.fillRect(coin.x - 2, y - 4, 3, 8);
  });
}

function drawChests() {
  game.chests.forEach((chest) => {
    if (chest.opened) return;
    if (chest.hidden && distance(game.player, chest) > 120) return;
    const glow = chest.hidden ? "rgba(124, 92, 255, 0.18)" : "rgba(255, 212, 90, 0.1)";
    drawLight(chest.x, chest.y, 38, glow);
    drawShadow(chest.x, chest.y + 11, 34, 8);
    drawPixelRect(chest.x - 16, chest.y - 9, 32, 20, chest.hidden ? "#6b4acb" : "#b56b2b", "#21140d");
    ctx.fillStyle = chest.hidden ? "#69f0ff" : "#ffd45a";
    ctx.fillRect(chest.x - 12, chest.y - 5, 24, 4);
    ctx.fillRect(chest.x - 2, chest.y - 9, 5, 17);
    ctx.fillStyle = "#3b2412";
    ctx.fillRect(chest.x - 14, chest.y - 14, 28, 8);
  });
}

function drawPortal() {
  if (!game.portal) return;
  const p = game.portal;
  const pulse = Math.sin(lastTime / 180) * 6;
  drawLight(p.x, p.y, 150 + pulse * 4, "rgba(124, 92, 255, 0.28)");
  ctx.fillStyle = "rgba(105, 240, 255, 0.18)";
  ctx.fillRect(p.x - 8, p.y - 210, 16, 180);
  ctx.fillStyle = "#ffd45a";
  ctx.fillRect(p.x - 8, p.y - 96 + pulse, 16, 38);
  ctx.fillRect(p.x - 22, p.y - 66 + pulse, 44, 12);
  ctx.fillRect(p.x - 14, p.y - 54 + pulse, 28, 12);
  ctx.fillStyle = "#0d0b24";
  ctx.fillRect(p.x - 28, p.y - 28, 56, 56);
  ctx.fillStyle = "#7c5cff";
  ctx.fillRect(p.x - 21, p.y - 21, 42, 42);
  ctx.fillStyle = "#69f0ff";
  ctx.fillRect(p.x - 10, p.y - 16, 20, 32);
  drawSmallLabel(p.x, p.y - 118 + pulse, `PORTAL ${Math.round(p.x)}, ${Math.round(p.y)}`);
}

function drawEntities() {
  game.entities.forEach((entity) => {
    if (entity.type === "npc") drawNpc(entity);
    if (entity.type === "monster") drawMonster(entity);
    if (entity.type === "boss") drawBoss(entity);
  });
}

function drawNpc(npc) {
  drawShadow(npc.x, npc.y + 13, 34, 10);
  const bob = Math.sin(lastTime / 650 + npc.x) * 1.2;
  const robe = npc.role === "shop" ? "#b94735" : npc.role === "teacher" ? "#5140a8" : npc.role === "smithLocked" ? "#4b4f5c" : "#2e5f44";
  drawPixelRect(npc.x - 11, npc.y - 13 + bob, 22, 28, robe, "#4a2b18");
  ctx.fillStyle = "#f0c590";
  ctx.fillRect(npc.x - 8, npc.y - 24 + bob, 16, 14);
  ctx.fillStyle = npc.role === "shop" ? "#ffd45a" : npc.role === "teacher" ? "#d5ccff" : npc.role === "smithLocked" ? "#2d3038" : "#5a3b23";
  ctx.fillRect(npc.x - 12, npc.y - 29 + bob, 24, 7);
  ctx.fillStyle = "#2e222f";
  ctx.fillRect(npc.x - 5, npc.y - 19 + bob, 3, 3);
  ctx.fillRect(npc.x + 3, npc.y - 19 + bob, 3, 3);
  ctx.fillStyle = "#f0c590";
  ctx.fillRect(npc.x - 17, npc.y - 3 + bob, 6, 13);
  ctx.fillRect(npc.x + 11, npc.y - 3 - bob, 6, 13);
  if (npc.role === "smithLocked") {
    ctx.fillStyle = "#c7ced8";
    ctx.fillRect(npc.x + 15, npc.y + 3 - bob, 18, 5);
    ctx.fillRect(npc.x + 28, npc.y - 4 - bob, 7, 15);
  }
  if (npc.role === "shop") {
    ctx.fillStyle = "#79d2ff";
    ctx.fillRect(npc.x - 25, npc.y + 5 + bob, 7, 12);
    ctx.fillStyle = "#ff6b5f";
    ctx.fillRect(npc.x - 34, npc.y + 7 + bob, 7, 10);
  }
  if (npc.role === "teacher") {
    ctx.fillStyle = "#ffd45a";
    ctx.fillRect(npc.x - 22, npc.y - 2 + bob, 7, 7);
    ctx.fillRect(npc.x + 15, npc.y + 5 - bob, 7, 7);
  }
  ctx.fillStyle = npc.role === "shop" ? "#ffd45a" : npc.role === "teacher" ? "#d5ccff" : "#79d2ff";
  ctx.fillRect(npc.x - 4, npc.y - 43 + bob, 8, 8);
}

function drawMonster(monster) {
  const flash = monster.hurtTimer > 0 ? "#fff2d6" : monster.color;
  const squash = Math.sin(lastTime / 180 + monster.x) * 2;
  const flap = Math.sin(lastTime / 120 + monster.x) * 4;
  drawShadow(monster.x, monster.y + 12, 30, 8);
  if (monster.name.includes("Bat")) {
    drawPixelRect(monster.x - 10, monster.y - 10 + flap * 0.2, 20, 18, flash, "#111");
    ctx.fillStyle = flash;
    ctx.fillRect(monster.x - 31, monster.y - 7 - flap, 22, 8);
    ctx.fillRect(monster.x + 9, monster.y - 7 + flap, 22, 8);
  } else if (monster.name.includes("Spider") || monster.name.includes("Scorpion") || monster.name.includes("Scarab")) {
    drawPixelRect(monster.x - 14, monster.y - 9 + squash, 28, 18, flash, "#111");
    ctx.fillStyle = "#111";
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(monster.x - 24, monster.y - 9 + i * 5, 12, 3);
      ctx.fillRect(monster.x + 12, monster.y - 9 + i * 5, 12, 3);
    }
  } else if (monster.name.includes("Wolf") || monster.name.includes("Hound")) {
    drawPixelRect(monster.x - 18, monster.y - 9 + squash, 36, 18, flash, "#111");
    ctx.fillStyle = flash;
    ctx.fillRect(monster.x + 12, monster.y - 17 + squash, 14, 12);
    ctx.fillRect(monster.x - 24, monster.y - 6 + squash, 9, 6);
    ctx.fillStyle = "#111";
    ctx.fillRect(monster.x + 18, monster.y - 13 + squash, 4, 4);
  } else if (monster.name.includes("Golem") || monster.name.includes("Yeti") || monster.name.includes("Brute")) {
    drawPixelRect(monster.x - 16, monster.y - 20 + squash * 0.4, 32, 38, flash, "#111");
    ctx.fillStyle = "#111";
    ctx.fillRect(monster.x - 24, monster.y - 2, 8, 18);
    ctx.fillRect(monster.x + 16, monster.y - 2, 8, 18);
  } else if (monster.name.includes("Witch") || monster.name.includes("Mage") || monster.name.includes("Wraith") || monster.name.includes("Wisp") || monster.name.includes("Sprite")) {
    drawLight(monster.x, monster.y, 48, `${monster.color}33`);
    drawPixelRect(monster.x - 12, monster.y - 16 + squash, 24, 31, flash, "#111");
    ctx.fillStyle = flash;
    ctx.fillRect(monster.x - 18, monster.y - 24 + squash, 36, 7);
    ctx.fillStyle = "#ffd45a";
    ctx.fillRect(monster.x + 16, monster.y - 4, 6, 6);
  } else if (monster.name.includes("Knight") || monster.name.includes("Guard") || monster.name.includes("Raider") || monster.name.includes("Goblin")) {
    drawPixelRect(monster.x - 11, monster.y - 17 + squash, 22, 32, flash, "#111");
    ctx.fillStyle = "#c7ced8";
    ctx.fillRect(monster.x + 13, monster.y - 8 + squash, 18, 5);
    ctx.fillRect(monster.x - 18, monster.y - 7 + squash, 8, 16);
  } else {
    drawPixelRect(monster.x - 13, monster.y - 10 + squash, 26, 22 - squash, flash, "#111");
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(monster.x - 8, monster.y - 6 + squash, 10, 3);
  }
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(monster.x - 7, monster.y - 4 + squash, 5, 5);
  ctx.fillRect(monster.x + 2, monster.y - 4 + squash, 5, 5);
  drawHealth(monster, 30);
  drawEnemyLabel(monster);
}

function drawBoss(boss) {
  const flash = boss.hurtTimer > 0 ? "#fff2d6" : boss.color;
  const pulse = Math.sin(lastTime / 260) * 3;
  drawLight(boss.x, boss.y, boss.finalBoss ? 135 : 105, boss.finalBoss ? "rgba(255, 107, 95, 0.22)" : "rgba(255, 212, 90, 0.15)");
  drawShadow(boss.x, boss.y + 30, boss.finalBoss ? 86 : 72, 18);
  const size = boss.finalBoss ? 68 : 54;
  drawPixelRect(boss.x - size / 2 - pulse / 2, boss.y - size / 2 - pulse / 2, size + pulse, size - 2 + pulse, flash, "#111");
  ctx.fillStyle = "#3b1f2a";
  ctx.fillRect(boss.x - size / 2 - 14, boss.y - 8, 18, 12);
  ctx.fillRect(boss.x + size / 2 - 4, boss.y - 8, 18, 12);
  if (boss.finalBoss) {
    ctx.fillStyle = "#ffd45a";
    ctx.fillRect(boss.x - 18, boss.y - size / 2 - 14, 36, 8);
    ctx.fillRect(boss.x - 5, boss.y - size / 2 - 25, 10, 14);
  }
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(boss.x - 15, boss.y - 8, 9, 9);
  ctx.fillRect(boss.x + 6, boss.y - 8, 9, 9);
  ctx.fillRect(boss.x - 13, boss.y + 12, 26, 6);
  drawHealth(boss, 66);
  drawEnemyLabel(boss);
}

function drawEnemyLabel(enemy) {
  const label = `${enemy.name} Lv.${enemy.level}`;
  const width = label.length * 8 + 10;
  const y = enemy.y - enemy.h / 2 - 34;
  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  ctx.fillRect(enemy.x - width / 2, y, width, 16);
  ctx.fillStyle = enemy.level > game.level + 4 ? "#ff6b5f" : "#f4efd7";
  ctx.font = "12px Courier New";
  ctx.fillText(label, enemy.x - width / 2 + 5, y + 12);
}

function drawPlayer() {
  const p = game.player;
  const flash = p.hurtTimer > 0 && Math.floor(p.hurtTimer / 80) % 2 === 0;
  drawShadow(p.x, p.y + 15, 32, 9);
  const walking = keys.has("arrowleft") || keys.has("a") || keys.has("arrowright") || keys.has("d") || keys.has("arrowup") || keys.has("w") || keys.has("arrowdown") || keys.has("s");
  const bob = walking ? Math.sin(lastTime / 90) * 1.5 : 0;
  const facingSide = Math.abs(p.dirX) > Math.abs(p.dirY);
  ctx.fillStyle = "#24334f";
  ctx.fillRect(p.x - 12, p.y - 8 + bob, 24, 25);
  ctx.fillStyle = flash ? "#fff2d6" : "#5fc9ff";
  ctx.fillRect(p.x - 8, p.y - 7 + bob, 16, 18);
  ctx.fillStyle = "#d9c58a";
  ctx.fillRect(p.x - 9, p.y + 2 + bob, 18, 4);
  ctx.fillStyle = "#f0c590";
  ctx.fillRect(p.x - 7, p.y - 21 + bob, 14, 13);
  ctx.fillStyle = "#6b4328";
  ctx.fillRect(p.x - 10, p.y - 26 + bob, 20, 7);
  ctx.fillRect(p.x - 8, p.y - 21 + bob, facingSide && p.dirX < 0 ? 5 : 3, 8);
  ctx.fillStyle = "#2d2d44";
  if (p.dirY >= 0) {
    ctx.fillRect(p.x - 5, p.y - 16 + bob, 3, 3);
    ctx.fillRect(p.x + 3, p.y - 16 + bob, 3, 3);
  }
  ctx.fillStyle = "#f0c590";
  ctx.fillRect(p.x - 17, p.y - 2 + bob, 6, 13);
  ctx.fillRect(p.x + 11, p.y - 2 - bob, 6, 13);
  ctx.fillStyle = "#4b2d22";
  ctx.fillRect(p.x - 9, p.y + 12 + bob, 6, 10);
  ctx.fillRect(p.x + 3, p.y + 12 - bob, 6, 10);
  ctx.fillStyle = "#161820";
  ctx.fillRect(p.x - 11, p.y + 22 + bob, 9, 4);
  ctx.fillRect(p.x + 2, p.y + 22 - bob, 9, 4);

  if (p.attackTimer > 170) {
    drawWeaponSprite(p.x + p.dirX * 18, p.y + p.dirY * 18, p.dirX, p.dirY, true);
  } else {
    drawWeaponSprite(p.x + 14, p.y + 2, 1, 0, false);
  }
}

function drawShadow(x, y, w, h) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

function drawWeaponSprite(x, y, dirX, dirY, attacking) {
  const look = weaponLook();
  const length = attacking ? 36 : 28;
  const thick = look.shape === "greatsword" ? 8 : look.shape === "training" ? 7 : 5;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(dirY, dirX));
  if (attacking && look.shape !== "training") {
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = look.shine || look.color;
    ctx.fillRect(2, -14, length + 10, 28);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = look.edge;
  ctx.fillRect(-5, -thick / 2 - 2, length + 9, thick + 4);
  ctx.fillStyle = look.color;
  if (look.shape === "greatsword") {
    ctx.fillRect(-2, -4, length, 8);
    ctx.fillRect(length - 5, -10, 11, 20);
    ctx.fillStyle = look.shine;
    ctx.fillRect(8, -1, length - 12, 2);
  } else if (look.shape === "flame") {
    ctx.fillRect(-2, -3, length - 5, 6);
    ctx.fillRect(length - 10, -10, 10, 20);
    ctx.fillStyle = look.shine;
    ctx.fillRect(length - 17, -5, 8, 10);
  } else if (look.shape === "thorn") {
    ctx.fillRect(-2, -3, length, 6);
    for (let i = 8; i < length - 3; i += 9) ctx.fillRect(i, i % 2 ? -9 : 3, 5, 7);
  } else if (look.shape === "rune") {
    ctx.fillRect(-2, -3, length, 6);
    ctx.fillRect(length - 4, -7, 8, 14);
    ctx.fillStyle = look.shine;
    for (let i = 8; i < length - 2; i += 11) ctx.fillRect(i, -1, 4, 2);
  } else if (look.shape === "curve") {
    ctx.fillRect(-2, -3, length, 6);
    ctx.fillRect(length - 8, -12, 10, 12);
    ctx.fillStyle = look.shine;
    ctx.fillRect(length - 10, -8, 4, 7);
  } else if (look.shape === "falchion") {
    ctx.fillRect(-2, -5, length - 4, 10);
    ctx.fillRect(length - 14, -12, 14, 12);
    ctx.fillStyle = look.shine;
    ctx.fillRect(length - 15, -7, 7, 6);
  } else if (look.shape === "rapier" || look.shape === "needle") {
    ctx.fillRect(-2, -2, length + 4, 4);
    ctx.fillStyle = look.shine;
    ctx.fillRect(7, -1, length - 8, 1);
    if (look.shape === "needle") {
      ctx.fillStyle = look.edge;
      for (let i = 8; i < length - 2; i += 10) ctx.fillRect(i, -6, 3, 5);
    }
  } else if (look.shape === "dagger") {
    const shortLength = Math.max(18, length - 12);
    ctx.fillRect(-2, -4, shortLength, 8);
    ctx.fillRect(shortLength - 2, -8, 8, 16);
    ctx.fillStyle = look.shine;
    ctx.fillRect(5, -1, shortLength - 8, 2);
  } else if (look.shape === "cleaver") {
    ctx.fillRect(-2, -7, length - 7, 14);
    ctx.fillRect(length - 14, -12, 12, 24);
    ctx.fillStyle = look.shine;
    ctx.fillRect(7, -4, length - 18, 3);
  } else if (look.shape === "hammer") {
    ctx.fillRect(-2, -3, length - 10, 6);
    ctx.fillRect(length - 18, -12, 18, 24);
    ctx.fillStyle = look.shine;
    ctx.fillRect(length - 15, -8, 4, 16);
  } else if (look.shape === "training") {
    ctx.fillRect(-2, -4, length - 5, 8);
    ctx.fillRect(length - 10, -6, 13, 12);
    ctx.fillStyle = look.shine;
    ctx.fillRect(7, -2, length - 16, 3);
  } else {
    ctx.fillRect(-2, -3, length, 6);
    ctx.fillRect(length - 4, -7, 8, 14);
    ctx.fillStyle = look.shine;
    ctx.fillRect(8, -1, length - 12, 2);
  }
  ctx.fillStyle = "#8a6232";
  ctx.fillRect(-10, -5, 10, 10);
  ctx.fillStyle = "#ffd45a";
  ctx.fillRect(-3, -8, 4, 16);
  ctx.restore();
}

function weaponLook() {
  return weaponLookForName(game.weapon.name);
}

function weaponLookForName(name) {
  return weaponLooks.find((look) => name.includes(look.match)) || weaponLooks.find((look) => look.match === "Sword") || weaponLooks[0];
}

function weaponShapeClass(name) {
  return `weapon-shape-${weaponLookForName(name).shape}`;
}

function drawTopText() {
  if (game.battle || game.backrooms) return;
  const label = game.inCamp ? "Safe Settlement" : currentRegionName();
  ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
  ctx.fillRect(canvas.width / 2 - 118, 14, 236, 24);
  ctx.fillStyle = "#f4efd7";
  ctx.font = "13px Courier New";
  ctx.textAlign = "center";
  ctx.fillText(label, canvas.width / 2, 31);
  ctx.textAlign = "left";
}

function currentRegionName() {
  if (game.inCamp) return "Adventurer's Camp";
  if (game.backrooms) return "The Yellow Halls";
  return currentRegionNameAt(game.player.x, game.player.y);
}

function currentRegionNameAt(x, y) {
  const layouts = regionLayouts[game.worldIndex] || [];
  const index = layouts.findIndex((item) => (
    x >= item.x &&
    x <= item.x + item.w &&
    y >= item.y &&
    y <= item.y + item.h
  ));
  return index >= 0 ? worlds[game.worldIndex].regions[index] : "Wild Road";
}

function drawMiniMap() {
  const x = canvas.width - 150;
  const y = 14;
  const w = 132;
  const h = 88;
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(x - 8, y - 8, w + 16, h + 16);
  ctx.fillStyle = "#17202a";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#f4efd7";
  ctx.strokeRect(x, y, w, h);
  drawMiniDot(x, y, w, h, game.player, "#5fc9ff", 4);
  if (game.backrooms) {
    game.backrooms.exits.forEach((exit) => drawMiniDot(x, y, w, h, exit, "#efff9a", 4));
    game.backrooms.entities.forEach((entity) => drawMiniDot(x, y, w, h, entity, "#050505", 4));
    return;
  }
  if (game.inCamp) {
    game.campObjects.forEach((object) => {
      const color = object.type === "dungeonEntrance" ? "#a45cff" : object.type === "sealedDoor" ? "#79d2ff" : "#ffd45a";
      drawMiniDot(x, y, w, h, object, color, 4);
    });
  }
  game.discoveries.forEach((discovery) => {
    if (discovery.found) drawMiniDot(x, y, w, h, discovery, "#79d2ff", 3);
  });
  game.entities.forEach((entity) => {
    if (entity.type === "npc") drawMiniDot(x, y, w, h, entity, "#ffd45a", 3);
    if (entity.type === "boss") drawMiniDot(x, y, w, h, entity, "#ff6b5f", 4);
  });
  if (game.portal) drawMiniDot(x, y, w, h, game.portal, "#b579ff", 6);
  drawMinibossRespawnDots(x, y, w, h);
}

function drawMinibossRespawnDots(x, y, w, h) {
  if (game.inCamp || game.backrooms) return;
  const lairs = bossLairs[game.worldIndex] || [];
  lairs.forEach((lair, index) => {
    if (lair.final) return;
    const remaining = minibossRespawnRemaining(game.worldIndex, index);
    if (remaining <= 0) return;
    const dotX = x + (lair.x / MAP_W) * w;
    const dotY = y + (lair.y / MAP_H) * h;
    ctx.fillStyle = "#090b10";
    ctx.fillRect(dotX - 4, dotY - 4, 8, 8);
    ctx.fillStyle = "#ffd45a";
    ctx.fillRect(dotX - 3, dotY - 3, 6, 6);
    ctx.fillStyle = "#090b10";
    ctx.fillRect(dotX - 1, dotY - 3, 2, 4);
    ctx.fillRect(dotX, dotY, 3, 1);
  });
}

function drawBattleAttacks() {
  if (!game.battle) return;
  const arena = battleArena();
  ctx.fillStyle = "rgba(0, 0, 0, 0.54)";
  ctx.fillRect(arena.x, arena.y, arena.w, arena.h);
  ctx.fillStyle = "rgba(121, 210, 255, 0.07)";
  for (let y = arena.y + 18; y < arena.y + arena.h; y += 38) ctx.fillRect(arena.x + 1, y, arena.w - 2, 1);
  for (let x = arena.x + 18; x < arena.x + arena.w; x += 38) ctx.fillRect(x, arena.y + 1, 1, arena.h - 2);
  ctx.strokeStyle = "#f4efd7";
  ctx.lineWidth = 3;
  ctx.strokeRect(arena.x, arena.y, arena.w, arena.h);
  ctx.lineWidth = 1;
  drawBattleCaster(game.battle.enemy, arena);
  drawBattleAbilityEffects();

  if (game.battle.phase === "enemy") {
    game.battle.attacks.forEach((attackNote) => {
      attackNote.angle += 0.05 + game.battle.enemy.level * 0.002;
      drawDodgingAttack(attackNote);
    });
    drawBattleDodger(game.battle.dodger);
    ctx.fillStyle = "#f4efd7";
    ctx.font = "18px Courier New";
    ctx.fillText(`Dodge ${game.battle.blocked}/${game.battle.neededBlocks}: move with WASD or arrow keys`, arena.x + 20, arena.y + 35);
  } else {
    ctx.fillStyle = "#f4efd7";
    ctx.font = "18px Courier New";
    ctx.fillText("Choose a battle command below", arena.x + arena.w / 2 - 150, arena.y + arena.h / 2);
  }
}

function drawBattleAbilityEffects() {
  battleEffects.forEach((effect) => {
    const t = 1 - effect.life / effect.maxLife;
    const fade = Math.max(0, effect.life / effect.maxLife);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.strokeStyle = effect.color;
    ctx.fillStyle = effect.color;
    ctx.lineWidth = 4;
    ctx.translate(effect.x, effect.y);
    if (effect.kind === "impact") {
      const r = 18 + t * 52;
      ctx.strokeRect(-r / 2, -r / 2, r, r);
      ctx.fillRect(-42, -5, 84, 10);
      ctx.fillRect(-5, -42, 10, 84);
    } else if (effect.kind === "shield") {
      const r = 34 + Math.sin(effect.age * 0.02) * 5;
      ctx.strokeRect(-r, -r, r * 2, r * 2);
      ctx.globalAlpha = fade * 0.28;
      ctx.fillRect(-r + 8, -r + 8, r * 2 - 16, r * 2 - 16);
    } else if (effect.kind === "cleave") {
      ctx.rotate(-0.6 + t * 1.2);
      ctx.fillRect(-80, -7, 160, 14);
      ctx.fillRect(54, -22, 22, 44);
    } else if (effect.kind === "flare") {
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 + t * 2;
        ctx.fillRect(Math.cos(a) * (22 + t * 42), Math.sin(a) * (22 + t * 42), 28, 6);
      }
      ctx.fillRect(-16, -16, 32, 32);
    } else if (effect.kind === "frost") {
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.fillRect(8, -3, 54 + t * 24, 6);
      }
      ctx.strokeRect(-34 - t * 16, -34 - t * 16, 68 + t * 32, 68 + t * 32);
    } else if (effect.kind === "pierce") {
      ctx.fillRect(-100 + t * 55, -4, 200, 8);
      ctx.fillRect(44, -18, 12, 36);
      ctx.globalAlpha = fade * 0.4;
      ctx.fillRect(-8, -70, 16, 140);
    } else if (effect.kind === "roar") {
      for (let i = 0; i < 4; i++) {
        const r = 26 + i * 18 + t * 26;
        ctx.strokeRect(-r, -r * 0.55, r * 2, r * 1.1);
      }
    } else if (effect.kind === "break") {
      for (let i = 0; i < 7; i++) {
        const x = -90 + i * 30;
        ctx.fillRect(x, -8 + (i % 2) * 14, 40, 6);
        ctx.fillRect(x + 14, -48 + t * 30, 6, 96);
      }
    } else {
      ctx.fillRect(-40, -4, 80, 8);
    }
    ctx.restore();
  });
}

function drawDodgingAttack(attackNote) {
  const fill = attackColor(attackNote.kind);
  ctx.save();
  ctx.translate(attackNote.x, attackNote.y);
  ctx.rotate(attackNote.angle);
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = fill;
  if (attackNote.kind === "burn") {
    ctx.fillRect(-attackNote.width / 2 - 8, -attackNote.height / 2 - 8, attackNote.width + 16, attackNote.height + 16);
  } else {
    ctx.fillRect(-attackNote.r * 1.45, -attackNote.r * 1.45, attackNote.r * 2.9, attackNote.r * 2.9);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#090b10";
  if (attackNote.kind === "burn") ctx.fillRect(-attackNote.width / 2 - 3, -attackNote.height / 2 - 3, attackNote.width + 6, attackNote.height + 6);
  else ctx.fillRect(-attackNote.r - 3, -attackNote.r - 3, attackNote.r * 2 + 6, attackNote.r * 2 + 6);
  ctx.fillStyle = fill;
  if (attackNote.kind === "slice") {
    ctx.fillRect(-attackNote.r - 8, -5, attackNote.r * 2 + 16, 10);
    ctx.fillRect(attackNote.r - 5, -12, 10, 24);
  } else if (attackNote.kind === "turn") {
    ctx.fillRect(-5, -attackNote.r - 4, 10, attackNote.r * 2 + 8);
    ctx.fillRect(-attackNote.r - 4, -5, attackNote.r * 2 + 8, 10);
    ctx.fillStyle = "#f4efd7";
    ctx.fillRect(-3, -3, 6, 6);
  } else if (attackNote.kind === "poison") {
    ctx.globalAlpha = 0.74;
    ctx.beginPath();
    ctx.arc(0, 0, attackNote.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#102414";
    ctx.fillRect(-attackNote.r / 2, -3, attackNote.r, 6);
    ctx.fillRect(-3, -attackNote.r / 2, 6, attackNote.r);
  } else if (attackNote.kind === "burn") {
    ctx.fillRect(-attackNote.width / 2, -attackNote.height / 2, attackNote.width, attackNote.height);
    ctx.fillStyle = "#ffd45a";
    for (let y = -attackNote.height / 2 + 8; y < attackNote.height / 2; y += 18) {
      ctx.fillRect(-attackNote.width / 2 + 6, y, attackNote.width - 12, 7);
    }
  } else if (attackNote.kind === "bounce") {
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-attackNote.r, -attackNote.r, attackNote.r * 2, attackNote.r * 2);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = "#79d2ff";
    ctx.fillRect(-attackNote.r + 5, -4, attackNote.r * 2 - 10, 8);
  } else if (attackNote.kind === "split") {
    ctx.beginPath();
    ctx.arc(0, 0, attackNote.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4efd7";
    const fuse = Math.max(0, 1 - attackNote.age / attackNote.splitAfter);
    ctx.fillRect(-attackNote.r * fuse, -3, attackNote.r * 2 * fuse, 6);
    ctx.fillRect(-3, -attackNote.r, 6, attackNote.r * 2);
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, attackNote.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#ffd45a";
  ctx.fillRect(-3, -attackNote.r + 4, 6, 8);
  ctx.restore();
}

function attackColor(kind) {
  if (kind === "slice") return "#ff8a3d";
  if (kind === "turn") return "#b579ff";
  if (kind === "poison") return "#70d66b";
  if (kind === "burn") return "#ff6b3d";
  if (kind === "bounce") return "#55aaff";
  if (kind === "split") return "#ffd45a";
  return "#ff3d4f";
}

function drawBattleDodger(dodger) {
  if (!dodger) return;
  ctx.save();
  ctx.globalAlpha = dodger.invuln > 0 && Math.floor(dodger.invuln / 80) % 2 === 0 ? 0.45 : 1;
  ctx.fillStyle = "#090b10";
  ctx.fillRect(dodger.x - 14, dodger.y - 18, 28, 34);
  ctx.fillStyle = "#5fc9ff";
  ctx.fillRect(dodger.x - 10, dodger.y - 14, 20, 20);
  ctx.fillStyle = "#f0c590";
  ctx.fillRect(dodger.x - 5, dodger.y - 19, 10, 7);
  ctx.fillStyle = "#162033";
  ctx.fillRect(dodger.x - 8, dodger.y + 6, 7, 12);
  ctx.fillRect(dodger.x + 2, dodger.y + 6, 7, 12);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(dodger.x - 6, dodger.y - 9, 4, 4);
  ctx.fillRect(dodger.x + 3, dodger.y - 9, 4, 4);
  ctx.restore();
}

function drawBattleCaster(enemy, arena) {
  const x = arena.x + arena.w / 2;
  const y = arena.y + 66;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.fillRect(x - 86, y - 38, 172, 72);
  ctx.fillStyle = enemy.color || "#ff6b5f";
  ctx.fillRect(x - 24, y - 24, 48, 48);
  ctx.fillStyle = "#090b10";
  ctx.fillRect(x - 13, y - 10, 8, 8);
  ctx.fillRect(x + 5, y - 10, 8, 8);
  ctx.fillRect(x - 12, y + 12, 24, 5);
  ctx.fillStyle = "#ffd45a";
  ctx.font = "13px Courier New";
  ctx.textAlign = "center";
  ctx.fillText(enemy.name, x, y + 48);
  ctx.textAlign = "left";
  ctx.restore();
}

function drawMiniDot(x, y, w, h, point, color, size) {
  ctx.fillStyle = color;
  ctx.fillRect(x + (point.x / MAP_W) * w - size / 2, y + (point.y / MAP_H) * h - size / 2, size, size);
}

function drawHealth(entity, width) {
  const x = entity.x - width / 2;
  const y = entity.y - entity.h / 2 - 12;
  ctx.fillStyle = "#11131a";
  ctx.fillRect(x, y, width, 6);
  ctx.fillStyle = entity.type === "boss" ? "#ff6b5f" : "#70d66b";
  ctx.fillRect(x, y, width * Math.max(0, entity.hp / entity.maxHp), 6);
}

function drawPixelRect(x, y, w, h, fill, stroke) {
  ctx.fillStyle = stroke;
  ctx.fillRect(Math.round(x - 3), Math.round(y - 3), Math.round(w + 6), Math.round(h + 6));
  ctx.fillStyle = fill;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(Math.round(x + 4), Math.round(y + 4), Math.max(0, Math.round(w - 8)), 4);
}

function refreshUi() {
  const world = worlds[game.worldIndex];
  const boss = game.entities.find((entity) => entity.type === "boss");
  const placeName = game.backrooms ? "Backrooms" : game.inCamp ? "Adventurer's Camp" : worldDisplayName();
  ui.worldName.textContent = placeName;
  if (ui.compactWorld) ui.compactWorld.textContent = placeName;
  ui.coins.textContent = game.coins;
  if (ui.goldCompact) ui.goldCompact.textContent = game.coins;
  ui.weapon.textContent = `${game.weapon.name} (+${game.weapon.damage})`;
  refreshWeaponSlot();
  ui.armor.textContent = `${game.armor.name} (+${game.armor.defense})`;
  ui.bossState.textContent = game.backrooms ? "Elsewhere" : game.bossDefeated ? "Defeated" : "Alive";
  if (ui.minibossState) ui.minibossState.textContent = minibossRespawnText();
  ui.level.textContent = game.level;
  if (ui.levelCompact) ui.levelCompact.textContent = game.level;
  ui.questState.textContent = questText();
  ui.stats.textContent = `ATK ${game.baseStats.attack} DEF ${game.baseStats.defense} SPD ${totalSpeed()}`;
  ui.rage.textContent = game.rage || 0;
  ui.inventory.textContent = inventoryText();
  ui.hpBar.max = game.player.maxHp;
  ui.hpBar.value = game.player.hp;
  ui.hpText.textContent = `${Math.ceil(game.player.hp)}/${game.player.maxHp}`;
  ui.manaBar.max = game.maxMana;
  ui.manaBar.value = game.mana;
  ui.manaText.textContent = `${Math.ceil(game.mana)}/${game.maxMana}`;
  ui.xpBar.max = game.xpToNext;
  ui.xpBar.value = game.xp;
  ui.xpText.textContent = `${game.xp}/${game.xpToNext}`;
  ui.bossBar.value = boss ? boss.hp : 0;
  ui.bossBar.max = boss ? boss.maxHp : 100;
  ui.bossText.textContent = boss ? `${Math.max(0, Math.ceil(boss.hp))}/${boss.maxHp}` : "--";
  ui.hud.classList.toggle("has-boss", !!boss || !!game.battle?.enemy?.type?.includes("Boss"));
  refreshAbilityHotbar();
  if (game.messageTimer <= 0 && !game.menuOpen && !game.battle) {
    ui.message.textContent = game.backrooms
      ? "The lights buzz. Find a pale exit square before this place starts to feel normal."
      : game.inCamp
        ? "Adventurer's Camp: E talks and opens things. The purple doorway leads to Dungeon Floor 1."
        : game.abandonedMode
          ? `Abandoned chapter ${game.story.chapter}: every old path is meaner now. Bosses have returned.`
          : `Chapter ${game.story.chapter}: follow the story-road, read strange landmarks, and search cottages between the thorns.`;
  }
}

function refreshWeaponSlot() {
  if (!ui.weaponSlot) return;
  const look = weaponLook();
  ui.weaponSlot.className = `slot weapon-slot ${weaponShapeClass(game.weapon.name)}`;
  ui.weaponSlot.style.setProperty("--weapon-color", look.color);
  ui.weaponSlot.style.setProperty("--weapon-edge", look.edge);
  ui.weaponSlot.style.setProperty("--weapon-shine", look.shine);
  ui.weaponSlot.title = `${game.weapon.name} - Equipped weapon. +${game.weapon.damage} damage.`;
}

function refreshAbilityHotbar() {
  if (!ui.abilityHotbar) return;
  const buttons = [...ui.abilityHotbar.querySelectorAll("button")];
  const equipped = equippedAbilities();
  const slots = [
    {
      name: "Basic Attack",
      short: "Basic",
      detail: `${game.weapon.name} strike. No mana cost. Uses your weapon damage and ATK.`,
      locked: false,
    },
    ...equipped.map((ability) => ({
      name: ability.name,
      short: ability.name.split(" ")[0],
      detail: abilityDescription(ability),
      locked: false,
    })),
  ];
  buttons.forEach((button, index) => {
    const slot = slots[index] || { name: "Empty Slot", short: "Empty", detail: "No ability assigned.", locked: true };
    const key = index + 1;
    button.classList.toggle("is-locked", !!slot.locked);
    button.classList.toggle("is-learned", !slot.locked);
    button.title = slot.locked
      ? `${slot.name} - Find teachers and equip abilities from Skills.`
      : `${slot.name} - ${slot.detail}`;
    button.innerHTML = `${key}<span>${slot.locked ? "Empty" : slot.short}</span>`;
  });
  const learned = equippedAbilities();
  if (!game.battle) {
    ui.abilityButton.textContent = learned.length === 0 ? "Choose Ability" : learned.length === 1 ? learned[0].name : "Choose Ability";
    ui.abilityButton.title = learned.length
      ? "Use an equipped teacher ability, or open the chooser when multiple abilities are equipped."
      : "No special abilities equipped. Find teachers, then equip abilities from Skills.";
  }
}

function useHotbarSlot(index) {
  if (index === 0) {
    if (game.battle) playerBattleAttack();
    else say(`Basic Attack: ${game.weapon.name} strike. Click or press Space near an enemy to start battle.`, 2200);
    return;
  }
  const ability = equippedAbilities()[index - 1];
  if (!ability) return;
  if (game.battle) castBattleAbility(ability);
  else say(`${ability.name}: ${abilityDescription(ability)}`, 2400);
}

function inventoryText() {
  const items = [];
  if (game.inventory.smallPotion > 0) items.push(`Small Potion x${game.inventory.smallPotion}`);
  if (game.inventory.largePotion > 0) items.push(`Large Potion x${game.inventory.largePotion}`);
  const ability = bestAbility();
  if (ability) items.push(ability.name);
  return items.length ? items.join(", ") : "Empty";
}

function questText() {
  if (game.secretQuest && game.secretQuest.complete) return "Secret turn in";
  if (game.secretQuest && game.secretQuest.keeperReady) return "Fight Keeper";
  if (game.secretQuest && game.secretQuest.active) return `Ore ${game.secretQuest.shards}/${game.secretQuest.target}`;
  if (!game.quest) return "None";
  if (game.quest.complete) return "Turn in";
  if (game.quest.active) {
    const quest = normalizeQuest(game.quest);
    const step = currentQuestStep(quest);
    return step ? `Step ${(quest.stepIndex || 0) + 1}/${quest.steps.length} ${step.progress || 0}/${step.target}` : `${quest.defeated || 0}/${quest.target}`;
  }
  return game.quest.title || "Find NPC";
}

function hitsHouse(rect) {
  return game.houses.some((house) => (
    !isAtHouseDoor(rect, house) &&
    rect.x + rect.w / 2 > house.x + 8 &&
    rect.x - rect.w / 2 < house.x + house.w - 8 &&
    rect.y + rect.h / 2 > house.y + 6 &&
    rect.y - rect.h / 2 < house.y + house.h - 2
  ));
}

function hitsCampObject(rect) {
  if (!game.inCamp) return false;
  return game.campObjects.some((object) => (
    object.type !== "dungeonEntrance" &&
    rect.x + rect.w / 2 > object.x - object.w / 2 &&
    rect.x - rect.w / 2 < object.x + object.w / 2 &&
    rect.y + rect.h / 2 > object.y - object.h / 2 &&
    rect.y - rect.h / 2 < object.y + object.h / 2
  ));
}

function hitsBackroomsWall(rect) {
  return game.backrooms.walls.some((wall) => (
    rect.x + rect.w / 2 > wall.x &&
    rect.x - rect.w / 2 < wall.x + wall.w &&
    rect.y + rect.h / 2 > wall.y &&
    rect.y - rect.h / 2 < wall.y + wall.h
  ));
}

function isAtHouseDoor(rect, house) {
  return rect.x > house.x + house.w / 2 - 26 &&
    rect.x < house.x + house.w / 2 + 26 &&
    rect.y > house.y + house.h - 46 &&
    rect.y < house.y + house.h + 24;
}

function nearPath(x, y) {
  return currentWorldRoutes().some((route) => (
    x > route.x - 24 &&
    x < route.x + route.w + 24 &&
    y > route.y - 24 &&
    y < route.y + route.h + 24
  ));
}

function nearCampPath(x, y, radius = 72) {
  return campPathLines().some((points) => {
    for (let i = 0; i < points.length - 1; i++) {
      if (distanceToSegment({ x, y }, points[i], points[i + 1]) < radius) return true;
    }
    return false;
  });
}

function distanceToSegment(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq, 0, 1);
  return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
}

function overlapsCentered(a, b) {
  return a.x - a.w / 2 < b.x + b.w / 2 &&
    a.x + a.w / 2 > b.x - b.w / 2 &&
    a.y - a.h / 2 < b.y + b.h / 2 &&
    a.y + a.h / 2 > b.y - b.h / 2;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function loop(time) {
  const delta = Math.min(50, time - lastTime);
  lastTime = time;
  update(delta);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  keys.add(key);
  if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) event.preventDefault();
  if (key === " ") attack();
  if (key === "e") interact();
  if (key === "i") openInventoryMenu();
  if (key === "m") showTitleInfo("Map", `${currentRegionName()} - discovered routes and landmarks appear on the minimap.`);
  if (key === "c") openCharacterMenu();
  if (key === "escape") {
    if (game.menuOpen) closeMenu();
    else openPauseMenu();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  if (game.battle && clickBattleAttack(x, y)) return;
  if (game.battle) return;
  attack();
});

canvas.addEventListener("dblclick", (event) => {
  const point = canvasPoint(event);
  if (game.battle && turnBattleAttack(point.x, point.y)) event.preventDefault();
});

canvas.addEventListener("mousedown", (event) => {
  slashStart = canvasPoint(event);
});

canvas.addEventListener("mouseup", (event) => {
  if (!slashStart) return;
  const end = canvasPoint(event);
  const didSlice = sliceBattleAttack(slashStart, end);
  slashStart = null;
  if (didSlice) event.preventDefault();
});

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

ui.closeMenu.addEventListener("click", closeMenu);
ui.fightButton.onclick = playerBattleAttack;
ui.abilityButton.onclick = useBattleAbility;
ui.itemButton.onclick = useBattleItem;
ui.spareButton.onclick = spareEnemy;
ui.runButton.onclick = runBattle;
ui.abilityHotbar.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const index = [...ui.abilityHotbar.querySelectorAll("button")].indexOf(button);
  useHotbarSlot(index);
});
ui.saveButton.addEventListener("click", () => saveGame(true));
ui.newRunButton.addEventListener("click", clearSaveAndRestart);
ui.continueButton.addEventListener("click", continueFromTitle);
ui.loadButton.addEventListener("click", openLoadSlotMenu);
ui.newGameButton.addEventListener("click", newGameFromTitle);
ui.titleSlots.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slot]");
  if (!button) return;
  activeSaveSlot = Number(button.dataset.slot);
  localStorage.setItem(ACTIVE_SLOT_KEY, String(activeSaveSlot));
  updateTitleSlots();
  const summary = slotSummary(activeSaveSlot);
  if (summary) showTitleInfo(`Slot ${activeSaveSlot}`, `Level ${summary.level}\n${summary.world}\n${summary.gold} gold\n\nPress Continue to play this slot, or New Game to overwrite it.`);
});
ui.settingsButton.addEventListener("click", () => showTitleInfo("Settings", "Display: Pixel scale on. Screen shake: normal. Flash reduction: off. Audio hooks are wired for future SFX and music assets."));
ui.creditsButton.addEventListener("click", () => showTitleInfo("Credits", "Pixel Dungeon Worlds: original procedural pixel-art presentation, dungeon systems, and fairytale RPG progression."));
ui.quitButton.addEventListener("click", () => showTitleInfo("Quit", "Browsers do not allow this page to close itself safely. Use Save, then close the tab whenever you are ready."));
ui.characterButton.addEventListener("click", openCharacterMenu);
ui.inventoryButton.addEventListener("click", openInventoryMenu);
ui.skillsButton.addEventListener("click", openSkillsMenu);
ui.questsButton.addEventListener("click", openQuestJournal);
ui.bestiaryButton.addEventListener("click", () => showTitleInfo("Bestiary", "Discovered creatures will be cataloged here as the dungeon grows."));
ui.mapButton.addEventListener("click", openMapMenu);

migrateOldSaveToSlotOne();
if (!loadGame(activeSaveSlot)) startGame();
updateTitleSlots();
refreshUi();
requestAnimationFrame(loop);
