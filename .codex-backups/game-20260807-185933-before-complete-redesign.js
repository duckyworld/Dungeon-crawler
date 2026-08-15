const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  worldName: document.getElementById("worldName"),
  compactWorld: document.getElementById("compactWorld"),
  coins: document.getElementById("coins"),
  goldCompact: document.getElementById("goldCompact"),
  weapon: document.getElementById("weapon"),
  armor: document.getElementById("armor"),
  bossState: document.getElementById("bossState"),
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
  settingsButton: document.getElementById("settingsButton"),
  creditsButton: document.getElementById("creditsButton"),
  quitButton: document.getElementById("quitButton"),
  characterButton: document.getElementById("characterButton"),
  inventoryButton: document.getElementById("inventoryButton"),
  skillsButton: document.getElementById("skillsButton"),
  questsButton: document.getElementById("questsButton"),
  bestiaryButton: document.getElementById("bestiaryButton"),
  mapButton: document.getElementById("mapButton"),
};

const TILE = 32;
const MAP_W = 2400;
const MAP_H = 1600;
const SAVE_KEY = "pixelDungeonWorldsSaveV2";
const keys = new Set();
let slashStart = null;
let saveTimer = 0;

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
    weapon: { name: "Iron Sword", cost: 22, damage: 18 },
    armor: { name: "Leather Armor", cost: 28, defense: 5 },
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
    weapon: { name: "Scimitar", cost: 56, damage: 29 },
    armor: { name: "Scale Mail", cost: 64, defense: 9 },
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
    weapon: { name: "Crystal Axe", cost: 96, damage: 42 },
    armor: { name: "Frost Plate", cost: 108, defense: 14 },
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
    weapon: { name: "Ember Blade", cost: 145, damage: 58 },
    armor: { name: "Dragonhide Armor", cost: 160, defense: 20 },
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
    ],
    boss: { name: "Magma Titan", color: "#e54632", hp: 370, damage: 32, speed: 0.34, xp: 155, level: 23 },
  },
];

const shopItems = [
  { id: "weapon", label: "Buy world weapon", cost: (world) => world.weapon.cost },
  { id: "armor", label: "Buy world armor", cost: (world) => world.armor.cost },
  { id: "potion", label: "Small health potion (+50 HP)", cost: () => 14 },
  { id: "megaPotion", label: "Large health potion (+100 HP)", cost: () => 38 },
  { id: "boots", label: "Explorer boots (+speed)", cost: () => 38 },
  { id: "pack", label: "Coin magnet", cost: () => 46 },
  { id: "shield", label: "Copper shield (-damage)", cost: () => 55 },
  { id: "map", label: "Region map", cost: () => 30 },
  { id: "key", label: "Old mine key", cost: () => 72 },
];

const abilityUnlocks = [
  { id: "powerStrike", name: "Power Strike", level: 3, mana: 20, multiplier: 1.75 },
  { id: "arcaneGuard", name: "Arcane Guard", level: 6, mana: 25, heal: 35 },
  { id: "heroicCleave", name: "Heroic Cleave", level: 10, mana: 45, multiplier: 2.6 },
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
  { name: "Moss Pickaxe", damage: 32 },
  { name: "Sunken Pickaxe", damage: 48 },
  { name: "Starforged Pickaxe", damage: 70 },
  { name: "Dragonheart Pickaxe", damage: 92 },
];

const weaponLooks = [
  { match: "Wooden", color: "#9b6b34", edge: "#4b2d22", shape: "club" },
  { match: "Sword", color: "#d8dde8", edge: "#7c8798", shape: "sword" },
  { match: "Scimitar", color: "#f6d27a", edge: "#946d2c", shape: "curve" },
  { match: "Axe", color: "#aeeaff", edge: "#4e7688", shape: "axe" },
  { match: "Blade", color: "#ff6b3d", edge: "#7d2018", shape: "sword" },
  { match: "Pickaxe", color: "#b7f0ff", edge: "#4b5a70", shape: "pickaxe" },
];

let game;
let lastTime = 0;
let titleOpen = true;
const eventLines = [];
const particles = [];
const floatingTexts = [];
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
    speedBonus: 0,
    magnet: 28,
    hasRegionMap: false,
    hasMineKey: false,
    searchedHouses: [],
    inCamp: true,
    campObjects: [],
    player: { x: 320, y: 280, w: 22, h: 26, hp: 100, maxHp: 100, dirX: 1, dirY: 0, attackTimer: 0, hurtTimer: 0 },
    camera: { x: 0, y: 0 },
    houses: [],
    chests: [],
    discoveries: [],
    backrooms: null,
    stepsSinceAnomaly: 0,
    entities: [],
    coinsOnGround: [],
    portal: null,
    quest: null,
    secretQuest: { found: false, active: false, complete: false, shards: 0, target: 3, claimedWorlds: [] },
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
      discoveries: game.discoveries.map((discovery) => ({ ...discovery })),
    },
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  if (manual) say("Saved your tale. You can close the page and return here later.", 2600);
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
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
    game.campObjects ??= [];
    game.inventory ||= { smallPotion: 1, largePotion: 0 };
    game.story ||= { chapter: game.worldIndex + 1, lastDiscovery: "" };
    game.player.attackTimer = 0;
    game.player.hurtTimer = 0;
    closeMenu();
    ui.battlePanel.classList.add("is-hidden");
    updateCamera();
    refreshUi();
    say("Loaded your saved tale from the last bookmark.", 2800);
    return true;
  } catch (error) {
    console.warn("Could not load save", error);
    return false;
  }
}

function clearSaveAndRestart() {
  localStorage.removeItem(SAVE_KEY);
  startGame();
  saveGame();
}

function hasSaveFile() {
  return !!localStorage.getItem(SAVE_KEY);
}

function closeTitle() {
  titleOpen = false;
  ui.titleOverlay.classList.add("is-hidden");
  refreshUi();
}

function continueFromTitle() {
  if (hasSaveFile()) loadGame();
  else startGame();
  closeTitle();
}

function newGameFromTitle() {
  const warning = "Start a fresh Level 1 character? This overwrites the current autosave.";
  if (hasSaveFile() && !window.confirm(warning)) return;
  localStorage.removeItem(SAVE_KEY);
  startGame();
  saveGame();
  closeTitle();
}

function showTitleInfo(title, text) {
  openMenu(title, text, [
    { label: "Back", action: closeMenu },
  ]);
}

function openCharacterMenu() {
  openMenu("Character", `Level ${game.level}\nHP ${Math.ceil(game.player.hp)}/${game.player.maxHp}  Mana ${Math.ceil(game.mana)}/${game.maxMana}  Rage ${game.rage || 0}\nATK ${game.baseStats.attack}  DEF ${game.baseStats.defense}  SPD ${totalSpeed()}\nCrit 5%  Crit Damage 150%  Dodge 0%  Luck 0\nLifesteal 0%  Armor Pen 0  True Damage 0\nGold Find 0%  XP Gain 0%  Rare Find 0%`, [
    { label: "Close", action: closeMenu },
  ]);
}

function openInventoryMenu() {
  openMenu("Inventory", `Consumables: Small Health Potion x${game.inventory.smallPotion}, Large Health Potion x${game.inventory.largePotion}\nWeapon: ${game.weapon.name} (+${game.weapon.damage})\nArmor: ${game.armor.name} (+${game.armor.defense})\nMore grid inventory polish is staged on this foundation.`, [
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
  openMenu("Skills", `Slot 1: Basic Attack\nSlots 2-5: Locked\nUnlocked abilities: ${game.abilities.length ? game.abilities.join(", ") : "None yet"}`, [
    { label: "Close", action: closeMenu },
  ]);
}

function openPauseMenu() {
  openMenu("Paused", "The dungeon waits. Save before doing anything reckless, naturally.", [
    { label: "Resume", action: closeMenu },
    { label: "Character", action: openCharacterMenu },
    { label: "Inventory", action: openInventoryMenu },
    { label: "Skills", action: openSkillsMenu },
    { label: "Map", action: () => showTitleInfo("Map", `${currentRegionName()} - discovered routes and landmarks appear on the minimap.`) },
    { label: "Save", action: () => saveGame(true) },
    { label: "Return to title", action: () => {
      closeMenu();
      titleOpen = true;
      ui.titleOverlay.classList.remove("is-hidden");
    } },
  ]);
}

function buildWorld() {
  const world = worlds[game.worldIndex];
  game.entities = [];
  game.coinsOnGround = [];
  game.chests = [];
  game.discoveries = [];
  game.backrooms = null;
  game.houses = [
    { id: `w${game.worldIndex}-shop`, x: 210, y: 175, w: 160, h: 122, label: "Tinker Shop", loot: "coins" },
    { id: `w${game.worldIndex}-quest`, x: 480, y: 210, w: 140, h: 112, label: "Story Hall", loot: "heal" },
    { id: `w${game.worldIndex}-home`, x: 980, y: 510, w: 172, h: 126, label: "Grandmother House", loot: "mixed" },
    { id: `w${game.worldIndex}-inn`, x: 1630, y: 330, w: 150, h: 118, label: "Lantern Inn", loot: "heal" },
    { id: `w${game.worldIndex}-barn`, x: 350, y: 1070, w: 180, h: 130, label: "Moon Barn", loot: "coins" },
    { id: `w${game.worldIndex}-cabin`, x: 1350, y: 1030, w: 150, h: 118, label: "Hidden Cottage", loot: "mixed" },
  ];
  game.portal = null;
  game.quest = { active: false, complete: false, target: 4 + game.worldIndex, defeated: 0 };
  game.bossDefeated = false;
  game.player.x = 330;
  game.player.y = 365;
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + 45);

  spawnNpc(292, 340, world.shopNpc, "shop");
  spawnNpc(544, 366, world.questNpc, "quest");
  spawnNpc(1020, 665, "Village Elder", "talk");
  spawnNpc(1490, 1110, "Hidden Forger", "secret");
  spawnBoss(2080, 1320, world.boss);

  world.spawns.forEach((spot, index) => {
    const template = world.monsters[index % world.monsters.length];
    spawnMonster(spot[0], spot[1], template);
  });

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

function buildCamp() {
  game.inCamp = true;
  game.entities = [];
  game.coinsOnGround = [];
  game.chests = [];
  game.discoveries = [];
  game.backrooms = null;
  game.portal = null;
  game.quest = { active: false, complete: false, target: 3, defeated: 0 };
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

function spawnNpc(x, y, name, role) {
  game.entities.push({ type: "npc", role, name, x, y, w: 24, h: 28, color: role === "shop" ? "#e8cb87" : "#99e3bf" });
}

function spawnMonster(x, y, template) {
  game.entities.push({ ...template, type: "monster", x, y, spawnX: x, spawnY: y, w: 24, h: 24, maxHp: template.hp, hurtTimer: 0 });
}

function spawnBoss(x, y, template) {
  game.entities.push({ ...template, type: "boss", x, y, spawnX: x, spawnY: y, w: 52, h: 52, maxHp: template.hp, hurtTimer: 0 });
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
      collectCoins();
    } else {
      collectCoins();
      checkDiscoveries();
      updateEnemies(delta);
      updatePortal();
    }
  }

  game.player.attackTimer = Math.max(0, game.player.attackTimer - delta);
  game.player.hurtTimer = Math.max(0, game.player.hurtTimer - delta);
  game.messageTimer = Math.max(0, game.messageTimer - delta);
  floorBannerTimer = Math.max(0, floorBannerTimer - delta);
  transitionTimer = Math.max(0, transitionTimer - delta);
  updateVisualEffects(delta);
  saveTimer += delta;
  if (saveTimer > 5000 && !game.battle && !game.backrooms && !game.over) {
    saveTimer = 0;
    saveGame();
  }
  updateCamera();
  updateOverlays();
  refreshUi();
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
  if (entity.type === "backroomsBoss") {
    game.coins += reward.coins;
    gainXp(reward.xp);
    game.mana = Math.min(game.maxMana, game.mana + 35);
    say(`${entity.name} collapses wrong-side-out. Reward: ${reward.coins} coins, ${reward.xp} XP, and 35 Mana.`, 3600);
  } else if (entity.type === "boss") {
    game.bossDefeated = true;
    game.portal = { x: entity.x, y: entity.y, w: 44, h: 44 };
    game.coins += reward.coins;
    gainXp(reward.xp);
    scatterCoins(entity.x, entity.y, reward.drops, reward.coinValue);
    say(`${entity.name} defeated. Boss reward: ${reward.coins} coins and ${reward.xp} XP.`, 3400);
  } else {
    game.coins += reward.coins;
    gainXp(reward.xp);
    scatterCoins(entity.x, entity.y, reward.drops, reward.coinValue);
    if (game.secretQuest.active && !game.secretQuest.complete && Math.random() < reward.oreChance) {
      game.secretQuest.shards += 1;
      if (game.secretQuest.shards >= game.secretQuest.target) {
        game.secretQuest.complete = true;
        say("Secret ore complete. Return to the Hidden Forger.", 3400);
      } else {
        say(`Secret ore shard found: ${game.secretQuest.shards}/${game.secretQuest.target}.`, 2200);
      }
    }
    if (game.quest && game.quest.active && !game.quest.complete) {
      game.quest.defeated += 1;
      if (game.quest.defeated >= game.quest.target) {
        game.quest.complete = true;
        say("Quest complete. Return to the quest NPC for your reward.", 3200);
      }
    }
  }
  entity.dead = true;
}

function enemyReward(entity) {
  const dangerBonus = Math.max(0, entity.level - game.level);
  const bossBonus = entity.type === "boss" ? 2.4 : 1;
  const levelScale = 1 + entity.level * 0.16 + dangerBonus * 0.12;
  const baseCoins = entity.coins ?? 18 + entity.level * 4;
  const coins = Math.ceil(baseCoins * levelScale * bossBonus + dangerBonus * 3);
  const xp = Math.ceil(entity.xp * (1 + entity.level * 0.12 + dangerBonus * 0.18) * bossBonus);
  return {
    coins,
    xp,
    drops: Math.min(12, 3 + Math.ceil(entity.level / 3) + (entity.type === "boss" ? 4 : 0)),
    coinValue: Math.max(2, Math.ceil(coins / 8)),
    oreChance: Math.min(0.88, 0.22 + entity.level * 0.025 + dangerBonus * 0.08 + (entity.type === "boss" ? 0.2 : 0)),
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
    unlockAbilities();
    say(`Level up! Level ${game.level}: stats improved and your HP/Mana are restored.`, 3200);
  }
}

function unlockAbilities() {
  abilityUnlocks.forEach((ability) => {
    if (game.level >= ability.level && !game.abilities.includes(ability.id)) {
      game.abilities.push(ability.id);
      say(`${ability.name} learned. Ability skills are earned through leveling.`, 3600);
    }
  });
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
    entity.pathTimer = 420 + Math.random() * 260;
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

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
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

  return [];
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
  game.battle = {
    enemy,
    phase: "choose",
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
  game.battle = {
    enemy,
    phase: "choose",
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

function setBattlePrompt(text) {
  const enemy = game.battle && game.battle.enemy;
  if (enemy) ui.battleEnemy.textContent = `${enemy.name} Lv. ${enemy.level}  HP ${Math.max(0, enemy.hp)}/${enemy.maxHp}`;
  ui.battlePrompt.textContent = text;
  const canChoose = game.battle && game.battle.phase === "choose";
  ui.fightButton.disabled = !canChoose;
  ui.abilityButton.disabled = !canChoose || !bestAbility();
  ui.itemButton.disabled = !canChoose;
  ui.spareButton.disabled = !canChoose;
  ui.runButton.disabled = !canChoose;
}

function playerBattleAttack() {
  const battle = game.battle;
  if (!battle || battle.phase !== "choose") return;
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
  const ability = bestAbility();
  if (!ability) {
    setBattlePrompt("No abilities learned yet. Reach Level 3 to earn the first one.");
    return;
  }
  if (game.mana < ability.mana) {
    setBattlePrompt(`${ability.name} needs ${ability.mana} Mana.`);
    return;
  }

  game.mana -= ability.mana;
  if (ability.heal) {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + ability.heal);
    setBattlePrompt(`${ability.name} restores ${ability.heal} HP before the enemy attacks.`);
    beginEnemyTurn();
    return;
  }

  const enemy = battle.enemy;
  const damage = Math.floor(totalAttack() * ability.multiplier) + Math.floor(Math.random() * 8);
  enemy.hp -= damage;
  enemy.hurtTimer = 220;
  setBattlePrompt(`${ability.name} hits ${enemy.name} for ${damage}.`);
  if (enemy.hp <= 0) {
    winBattle();
    return;
  }
  beginEnemyTurn();
}

function bestAbility() {
  for (let i = abilityUnlocks.length - 1; i >= 0; i--) {
    if (game.abilities.includes(abilityUnlocks[i].id)) return abilityUnlocks[i];
  }
  return null;
}

function beginEnemyTurn() {
  const battle = game.battle;
  battle.phase = "enemy";
  battle.attacks = [];
  battle.spawnTimer = 250;
  battle.blocked = 0;
  battle.neededBlocks = blocksNeeded(battle.enemy);
  battle.totalSpawned = 0;
  setBattlePrompt(`${battle.enemy.name} attacks. Click red, drag orange, double-click purple.`);
}

function updateBattle(delta) {
  const battle = game.battle;
  if (!battle || battle.phase !== "enemy") return;
  if (game.backrooms) {
    game.backrooms.time += delta;
    game.backrooms.darkness = clamp(game.backrooms.time / 210000, 0, 0.82);
  }

  battle.spawnTimer -= delta;
  if (battle.spawnTimer <= 0) {
    spawnBattleAttack();
    const bossPressure = battle.enemy.type === "backroomsBoss" ? 0.58 : 1;
    battle.spawnTimer = Math.max(150, (820 - battle.enemy.level * 24) * bossPressure);
  }

  battle.attacks.forEach((attackNote) => {
    attackNote.y += attackNote.speed;
    if (attackNote.drift) attackNote.x += Math.sin(attackNote.life * 0.01 + attackNote.phase) * attackNote.drift;
    if (attackNote.kind === "turn") attackNote.x += Math.cos(attackNote.angle) * 1.2;
    attackNote.life -= delta;
  });

  const landed = battle.attacks.filter((attackNote) => attackNote.y > battleFloorY() || attackNote.life <= 0);
  if (landed.length) {
    landed.forEach((attackNote) => takeDamage(reduceDamage(attackNote.damage), battle.enemy.name));
    battle.attacks = battle.attacks.filter((attackNote) => attackNote.y <= battleFloorY() && attackNote.life > 0);
  }

  if (battle.blocked >= battle.neededBlocks) {
    battle.phase = "choose";
    battle.attacks = [];
    setBattlePrompt(`Blocked ${battle.blocked} boxes. Choose your next move.`);
  }
}

function spawnBattleAttack() {
  const battle = game.battle;
  const kind = attackKindForLevel(battle.enemy.level, battle.totalSpawned);
  const lane = 210 + ((battle.totalSpawned * 137 + battle.enemy.level * 23) % 540);
  battle.totalSpawned += 1;
  battle.attacks.push({
    x: lane,
    y: 120,
    r: 17 + Math.min(9, Math.floor(battle.enemy.level / 5)),
    kind,
    angle: 0,
    drift: kind === "slice" ? 1.3 : kind === "turn" ? 0.7 : 0,
    phase: Math.random() * 6,
    speed: 1.65 + battle.enemy.level * 0.11 + Math.random() * 0.35,
    damage: battle.enemy.damage + Math.floor(battle.enemy.level * (battle.enemy.type === "backroomsBoss" ? 0.9 : 0.55)),
    life: battle.enemy.type === "backroomsBoss" ? 3000 : 4200,
  });
}

function battleFloorY() {
  return game.battle && game.battle.enemy.type === "backroomsBoss" ? 380 : 520;
}

function blocksNeeded(enemy) {
  if (enemy.type === "backroomsBoss") return 12 + Math.floor(enemy.level / 2);
  return 4 + Math.floor(enemy.level / 3) + (enemy.type === "boss" ? 3 : 0);
}

function attackKindForLevel(level, count) {
  if (level >= 10 && count % 5 === 3) return "turn";
  if (level >= 8 && count % 4 === 1) return "slice";
  if (level >= 12 && count % 4 === 2) return "turn";
  if (level >= 5 && count % 3 === 1) return "slice";
  return "click";
}

function clickBattleAttack(x, y) {
  return clearBattleAttack(x, y, "click");
}

function turnBattleAttack(x, y) {
  return clearBattleAttack(x, y, "turn");
}

function sliceBattleAttack(start, end) {
  const battle = game.battle;
  if (!battle || battle.phase !== "enemy") return false;
  const hitIndex = battle.attacks.findIndex((attackNote) => (
    attackNote.kind === "slice" &&
    lineHitsCircle(start.x, start.y, end.x, end.y, attackNote.x, attackNote.y, attackNote.r + 8) &&
    Math.hypot(end.x - start.x, end.y - start.y) > 28
  ));
  if (hitIndex === -1) return false;
  clearBattleAttackByIndex(hitIndex);
  return true;
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
  const potion = choosePotion();
  if (!potion) {
    setBattlePrompt("Your pack has no health potions. Find chests or buy potions in town.");
    return;
  }
  game.inventory[potion.id] -= 1;
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + potion.heal);
  floatText(game.player.x, game.player.y - 28, `+${potion.heal}`, "#70d66b");
  setBattlePrompt(`You drink a ${potion.name} and restore ${potion.heal} HP.`);
  beginEnemyTurn();
}

function choosePotion() {
  const missingHp = game.player.maxHp - game.player.hp;
  if (game.inventory.smallPotion > 0 && (missingHp <= 70 || game.inventory.largePotion === 0)) {
    return { id: "smallPotion", name: "Small Health Potion", heal: 50 };
  }
  if (game.inventory.largePotion > 0) {
    return { id: "largePotion", name: "Large Health Potion", heal: 100 };
  }
  if (game.inventory.smallPotion > 0) {
    return { id: "smallPotion", name: "Small Health Potion", heal: 50 };
  }
  return null;
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
  defeat(enemy);
  endBattle(`${enemy.name} defeated. Reward: ${reward.coins} coins and ${reward.xp} XP.`);
}

function endBattle(text) {
  game.battle = null;
  ui.battlePanel.classList.add("is-hidden");
  say(text, 2600);
  saveGame();
}

function takeDamage(amount, source) {
  game.player.hp -= amount;
  game.player.hurtTimer = 760;
  floatText(game.player.x, game.player.y - 30, `-${amount}`, "#ff6b5f");
  spawnParticle(game.player.x, game.player.y, "#ff6b5f", 5);
  if (game.player.hp <= 0) {
    game.player.hp = 0;
    game.over = true;
    if (game.backrooms) {
      const closest = game.backrooms.entities
        .slice()
        .sort((a, b) => distance(a, game.player) - distance(b, game.player))[0];
      game.backrooms.deathRush = {
        x: closest ? closest.x : game.player.x + 180,
        y: closest ? closest.y : game.player.y,
        size: 1,
        timer: 0,
      };
    }
    closeMenu();
    ui.battlePanel.classList.add("is-hidden");
    game.battle = null;
    say(`${source} defeated you. Press R to restart.`);
  }
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
    openMenu("Sealed Stone Door", "No keyhole. No handle. The stone says: Come back when the dungeon starts saying your name.", [
      { label: "Step away", action: closeMenu },
    ]);
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
    openMenu("Training Dummy", "Left click or press Space near enemies to start battle. In battle, block incoming marks, then choose your next action.", [
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
      if (object.type === "sealedDoor") return "[E] Inspect seal";
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
    if (npc.role === "smithLocked") return "[E] Locked Smithy";
    return "[E] Talk";
  }
  return "";
}

function enterDungeonFloorOne() {
  game.inCamp = false;
  game.worldIndex = 0;
  startTransition();
  buildWorld();
  game.story.chapter = 1;
  showFloorBanner("Dungeon Floor 1 - Forgotten Passage");
  say("Floor 1: the story-road sinks under the roots. You are still weak. Be careful.", 4200);
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

function findNearbyChest() {
  return game.chests.find((chest) => !chest.opened && distance(game.player, chest) < 46);
}

function openChest(chest) {
  chest.opened = true;
  const coins = 10 + Math.floor(Math.random() * 18) + game.worldIndex * 7;
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
  const coins = 8 + Math.floor(Math.random() * 16) + game.worldIndex * 5;
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
  openMenu(house.label, text, [
    { label: "Leave", action: closeMenu },
  ]);
  saveGame();
}

function openShop(npc) {
  const world = worlds[game.worldIndex];
  openMenu(`${npc.name}'s Shop`, "Every upgrade here costs gold earned from exploration, quests, and battles.", shopItems.map((item) => {
    const cost = item.cost(world);
    return {
      label: `${item.label} - ${cost} coins`,
      disabled: !canBuy(item.id, cost, world),
      action: () => buyItem(item.id, cost, world, npc),
    };
  }));
}

function canBuy(id, cost, world) {
  if (game.coins < cost) return false;
  if (id === "weapon" && game.weapon.name === world.weapon.name) return false;
  if (id === "armor" && game.armor.name === world.armor.name) return false;
  if (id === "boots" && game.speedBonus >= 0.55) return false;
  if (id === "pack" && game.magnet >= 58) return false;
  if (id === "shield" && game.armor.defense >= world.armor.defense + 2) return false;
  if (id === "map" && game.hasRegionMap) return false;
  if (id === "key" && game.hasMineKey) return false;
  return true;
}

function buyItem(id, cost, world, npc) {
  if (!canBuy(id, cost, world)) return;
  game.coins -= cost;
  if (id === "weapon") game.weapon = { ...world.weapon };
  if (id === "armor") game.armor = { ...world.armor };
  if (id === "potion") game.inventory.smallPotion += 1;
  if (id === "megaPotion") game.inventory.largePotion += 1;
  if (id === "boots") game.speedBonus = 0.55;
  if (id === "pack") game.magnet = 58;
  if (id === "shield") game.armor = { name: `Reinforced ${game.armor.name}`, defense: game.armor.defense + 2 };
  if (id === "map") game.hasRegionMap = true;
  if (id === "key") game.hasMineKey = true;
  say(`${npc.name}: Sold. Come back when your pack is heavier.`, 2200);
  saveGame();
  openShop(npc);
}

function openQuest(npc) {
  const quest = game.quest;
  if (quest.complete) {
    openMenu(npc.name, "You finished the monster scout quest. Claim the reward.", [
      { label: "Claim reward (+30 coins, +45 XP)", action: () => claimQuest(npc) },
    ]);
    return;
  }

  if (quest.active) {
    openMenu(npc.name, `Quest active: calm ${quest.target} monsters. Progress: ${quest.defeated}/${quest.target}.`, [
      { label: "Keep exploring", action: closeMenu },
    ]);
    return;
  }

  openMenu(npc.name, `Quest: map the unsafe routes by calming ${quest.target} creatures. This opens safer exploration and earns supplies.`, [
    { label: "Accept quest", action: () => {
      quest.active = true;
      say(`${npc.name}: Good luck. Explore beyond town to find monsters.`, 2200);
      closeMenu();
    } },
    { label: "Maybe later", action: closeMenu },
  ]);
}

function claimQuest(npc) {
  game.coins += 30;
  game.inventory.smallPotion += 1;
  gainXp(45);
  game.quest.complete = false;
  game.quest.active = false;
  game.quest.defeated = 0;
  game.quest.target += 2;
  say(`${npc.name}: Route notes updated. Take this potion and keep an eye on the side paths.`, 3200);
  closeMenu();
  saveGame();
}

function openSecretQuest(npc) {
  const secret = game.secretQuest;
  const reward = secretWeapons[Math.min(game.worldIndex, secretWeapons.length - 1)];
  if (!game.hasMineKey && !secret.found) {
    openMenu(npc.name, "A locked forge door hums. The shop sometimes sells old mine keys.", [
      { label: "Leave", action: closeMenu },
    ]);
    return;
  }

  secret.found = true;
  if (secret.claimedWorlds.includes(game.worldIndex)) {
    openMenu(npc.name, `The forge is quiet. You already claimed this world's secret weapon: ${reward.name}.`, [
      { label: "Leave", action: closeMenu },
    ]);
    return;
  }

  if (secret.complete) {
    openMenu(npc.name, `Secret quest complete. Claim the ${reward.name}, stronger than shop weapons.`, [
      { label: `Claim ${reward.name}`, action: () => claimSecretWeapon(npc, reward) },
    ]);
    return;
  }

  if (secret.active) {
    openMenu(npc.name, `Secret forge quest: collect hidden ore shards from tough monsters. Progress: ${secret.shards}/${secret.target}.`, [
      { label: "Keep searching", action: closeMenu },
    ]);
    return;
  }

  openMenu(npc.name, `Secret quest unlocked: gather ${secret.target} ore shards. The reward is ${reward.name}.`, [
    { label: "Accept secret quest", action: () => {
      secret.active = true;
      say("Secret quest started. Tough monsters can drop ore shards.", 2800);
      closeMenu();
    } },
    { label: "Leave", action: closeMenu },
  ]);
}

function claimSecretWeapon(npc, reward) {
  game.weapon = { name: reward.name, damage: reward.damage };
  game.secretQuest.claimedWorlds.push(game.worldIndex);
  game.secretQuest.active = false;
  game.secretQuest.complete = false;
  game.secretQuest.shards = 0;
  game.secretQuest.target += 1;
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
    button.textContent = action.label;
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
  if (game.worldIndex < worlds.length - 1) {
    game.worldIndex += 1;
    buildWorld();
    game.story.chapter = game.worldIndex + 1;
    say(`Chapter ${game.story.chapter}: ${worlds[game.worldIndex].name}. The road turns another page.`);
    saveGame();
  } else {
    game.over = true;
    say("You cleared every world. Press R to begin a new run.");
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

function drawCamp() {
  ctx.fillStyle = "#2f5a37";
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  ctx.fillStyle = "#3e7244";
  for (let y = 0; y < MAP_H / TILE; y++) {
    for (let x = 0; x < MAP_W / TILE; x++) {
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
  ctx.fillStyle = world.floor;
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  for (let y = 0; y < MAP_H / TILE; y++) {
    for (let x = 0; x < MAP_W / TILE; x++) {
      if ((x * 3 + y + game.worldIndex) % 5 === 0) {
        ctx.fillStyle = world.floorAlt;
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }
  }

  ctx.fillStyle = world.path;
  world.routes.forEach((route) => ctx.fillRect(route.x, route.y, route.w, route.h));

  drawBorders(world);
  drawRegions();
  drawWorldDetails(world);
  drawDungeonDressings(world);
  game.houses.forEach((house) => drawHouse(house, world));
  drawTreesAndRocks(world);
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
  regionLayouts[game.worldIndex].forEach((region, index) => {
    const name = worlds[game.worldIndex].regions[index];
    ctx.fillStyle = region.color;
    ctx.fillRect(region.x, region.y, region.w, region.h);
    if (game.hasRegionMap || distance(game.player, { x: region.x + region.w / 2, y: region.y + region.h / 2 }) < 430) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(region.x + 18, region.y + 18, name.length * 11 + 22, 28);
      ctx.fillStyle = "#f4efd7";
      ctx.font = "16px Courier New";
      ctx.fillText(name, region.x + 30, region.y + 38);
    }
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
  ctx.fillStyle = "#d7c56f";
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  ctx.fillStyle = "#c8b95f";
  for (let y = 0; y < MAP_H; y += 96) {
    for (let x = 0; x < MAP_W; x += 128) {
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
  drawPixelRect(house.x, house.y, house.w, house.h, world.house, "#1a1110");
  ctx.fillStyle = world.roof;
  ctx.fillRect(house.x - 10, house.y - 22, house.w + 20, 38);
  ctx.fillStyle = "#211817";
  ctx.fillRect(house.x + house.w / 2 - 16, house.y + house.h - 36, 32, 36);
  ctx.fillStyle = searched ? "#5a4e46" : "#f4efd7";
  ctx.fillRect(house.x + house.w / 2 - 9, house.y + house.h - 26, 8, 8);
  ctx.fillStyle = "#ffd45a";
  ctx.fillRect(house.x + 18, house.y + 38, 24, 22);
  ctx.fillRect(house.x + house.w - 42, house.y + 38, 24, 22);
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(house.x + 8, house.y - 48, house.label.length * 9 + 16, 18);
  ctx.fillStyle = "#f4efd7";
  ctx.font = "12px Courier New";
  ctx.fillText(house.label, house.x + 16, house.y - 35);
}

function drawTreesAndRocks(world) {
  for (let i = 0; i < 72; i++) {
    const x = 70 + ((i * 173) % (MAP_W - 140));
    const y = 70 + ((i * 257) % (MAP_H - 140));
    if (nearPath(x, y)) continue;
    if (i % 3 === 0) {
      drawPixelRect(x - 10, y - 9, 20, 18, world.wall, "#111");
    } else {
      ctx.fillStyle = "#4b2d22";
      ctx.fillRect(x - 4, y + 8, 8, 18);
      drawPixelRect(x - 18, y - 15, 36, 28, world.wall, "#111");
    }
  }
}

function drawCoins() {
  game.coinsOnGround.forEach((coin) => {
    coin.bob += 0.08;
    const y = coin.y + Math.sin(coin.bob) * 2;
    drawPixelRect(coin.x - 6, y - 6, 12, 12, "#ffd45a", "#7d4e18");
    ctx.fillStyle = "#fff0a0";
    ctx.fillRect(coin.x - 2, y - 4, 3, 8);
  });
}

function drawChests() {
  game.chests.forEach((chest) => {
    if (chest.opened) return;
    if (chest.hidden && distance(game.player, chest) > 120) return;
    drawPixelRect(chest.x - 12, chest.y - 10, 24, 20, chest.hidden ? "#6b4acb" : "#b56b2b", "#21140d");
    ctx.fillStyle = "#ffd45a";
    ctx.fillRect(chest.x - 8, chest.y - 5, 16, 4);
    ctx.fillRect(chest.x - 2, chest.y - 8, 4, 14);
  });
}

function drawPortal() {
  if (!game.portal) return;
  const p = game.portal;
  ctx.fillStyle = "#0d0b24";
  ctx.fillRect(p.x - 28, p.y - 28, 56, 56);
  ctx.fillStyle = "#7c5cff";
  ctx.fillRect(p.x - 21, p.y - 21, 42, 42);
  ctx.fillStyle = "#69f0ff";
  ctx.fillRect(p.x - 10, p.y - 16, 20, 32);
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
  drawPixelRect(npc.x - 10, npc.y - 14, 20, 28, npc.color, "#4a2b18");
  ctx.fillStyle = "#f0c590";
  ctx.fillRect(npc.x - 8, npc.y - 22, 16, 12);
  ctx.fillStyle = npc.role === "shop" ? "#c2413b" : npc.role === "smithLocked" ? "#4b4f5c" : "#2e5f44";
  ctx.fillRect(npc.x - 11, npc.y - 27, 22, 7);
  ctx.fillStyle = "#2e222f";
  ctx.fillRect(npc.x - 5, npc.y - 18, 3, 3);
  ctx.fillRect(npc.x + 3, npc.y - 18, 3, 3);
  ctx.fillStyle = "#111";
  ctx.fillRect(npc.x - 24, npc.y - 38, 48, 13);
  ctx.fillStyle = npc.role === "shop" ? "#ffd45a" : "#79d2ff";
  ctx.fillRect(npc.x - 17, npc.y - 35, 34, 7);
}

function drawMonster(monster) {
  const flash = monster.hurtTimer > 0 ? "#fff2d6" : monster.color;
  drawShadow(monster.x, monster.y + 12, 30, 8);
  drawPixelRect(monster.x - 12, monster.y - 12, 24, 24, flash, "#111");
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(monster.x - 7, monster.y - 5, 5, 5);
  ctx.fillRect(monster.x + 2, monster.y - 5, 5, 5);
  drawHealth(monster, 30);
  drawEnemyLabel(monster);
}

function drawBoss(boss) {
  const flash = boss.hurtTimer > 0 ? "#fff2d6" : boss.color;
  drawShadow(boss.x, boss.y + 26, 66, 14);
  drawPixelRect(boss.x - 26, boss.y - 26, 52, 52, flash, "#111");
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
  ctx.fillStyle = "#2b4c72";
  ctx.fillRect(p.x - 10, p.y - 8 + bob, 20, 24);
  ctx.fillStyle = flash ? "#fff2d6" : "#5fc9ff";
  ctx.fillRect(p.x - 8, p.y - 6 + bob, 16, 18);
  ctx.fillStyle = "#f0c590";
  ctx.fillRect(p.x - 7, p.y - 21 + bob, 14, 13);
  ctx.fillStyle = "#6b4328";
  ctx.fillRect(p.x - 9, p.y - 25 + bob, 18, 6);
  ctx.fillStyle = "#2d2d44";
  ctx.fillRect(p.x - 5, p.y - 16 + bob, 3, 3);
  ctx.fillRect(p.x + 3, p.y - 16 + bob, 3, 3);
  ctx.fillStyle = "#4b2d22";
  ctx.fillRect(p.x - 9, p.y + 12 + bob, 6, 10);
  ctx.fillRect(p.x + 3, p.y + 12 - bob, 6, 10);

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
  const length = attacking ? 30 : 22;
  const thick = look.shape === "club" ? 8 : 5;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(dirY, dirX));
  ctx.fillStyle = look.edge;
  ctx.fillRect(-5, -thick / 2 - 2, length + 8, thick + 4);
  ctx.fillStyle = look.color;
  if (look.shape === "axe") {
    ctx.fillRect(-2, -2, length, 4);
    ctx.fillRect(length - 8, -14, 12, 28);
  } else if (look.shape === "pickaxe") {
    ctx.fillRect(-2, -2, length, 4);
    ctx.fillRect(length - 14, -12, 26, 6);
    ctx.fillRect(length - 6, 4, 14, 6);
  } else if (look.shape === "curve") {
    ctx.fillRect(-2, -3, length, 6);
    ctx.fillRect(length - 8, -12, 10, 12);
  } else if (look.shape === "club") {
    ctx.fillRect(-2, -4, length - 5, 8);
    ctx.fillRect(length - 8, -8, 12, 16);
  } else {
    ctx.fillRect(-2, -3, length, 6);
    ctx.fillRect(length - 4, -7, 8, 14);
  }
  ctx.fillStyle = "#8a6232";
  ctx.fillRect(-8, -4, 8, 8);
  ctx.restore();
}

function weaponLook() {
  return weaponLooks.find((look) => game.weapon.name.includes(look.match)) || weaponLooks[0];
}

function drawTopText() {
  const world = worlds[game.worldIndex];
  ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
  ctx.fillRect(12, 10, 620, 36);
  ctx.fillStyle = "#f4efd7";
  ctx.font = "18px Courier New";
  const label = game.inCamp ? "Adventurer's Camp" : `World ${game.worldIndex + 1}: ${world.name}`;
  ctx.fillText(`${label} - ${currentRegionName()}  Map ${Math.round(game.player.x)},${Math.round(game.player.y)}`, 24, 34);
}

function currentRegionName() {
  if (game.inCamp) return "Adventurer's Camp";
  if (game.backrooms) return "The Yellow Halls";
  const index = regionLayouts[game.worldIndex].findIndex((item) => (
    game.player.x >= item.x &&
    game.player.x <= item.x + item.w &&
    game.player.y >= item.y &&
    game.player.y <= item.y + item.h
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
}

function drawBattleAttacks() {
  if (!game.battle) return;
  const isBackroomsBoss = game.battle.enemy.type === "backroomsBoss";
  const arenaY = isBackroomsBoss ? 72 : 100;
  const arenaH = isBackroomsBoss ? 330 : 430;
  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.fillRect(170, arenaY, 620, arenaH);
  ctx.strokeStyle = "#f4efd7";
  ctx.strokeRect(170, arenaY, 620, arenaH);

  if (game.battle.phase === "enemy") {
    game.battle.attacks.forEach((attackNote) => {
      attackNote.angle += 0.05 + game.battle.enemy.level * 0.002;
      drawAttackBox(attackNote);
    });
    ctx.fillStyle = "#f4efd7";
    ctx.font = "18px Courier New";
    ctx.fillText(`Block ${game.battle.blocked}/${game.battle.neededBlocks}: click red, drag orange, double-click purple`, 190, arenaY + 35);
  } else {
    ctx.fillStyle = "#f4efd7";
    ctx.font = "18px Courier New";
    ctx.fillText("Choose a battle command below", 310, arenaY + arenaH / 2);
  }
}

function drawAttackBox(attackNote) {
  const label = attackNote.kind === "slice" ? "SLICE" : attackNote.kind === "turn" ? "TURN" : "CLICK";
  const fill = attackNote.kind === "slice" ? "#ff7c3d" : attackNote.kind === "turn" ? "#a45cff" : "#ff3d4f";
  ctx.save();
  ctx.translate(attackNote.x, attackNote.y);
  if (attackNote.kind === "turn") ctx.rotate(attackNote.angle);
  ctx.fillStyle = "#090b10";
  ctx.fillRect(-attackNote.r - 4, -attackNote.r - 4, attackNote.r * 2 + 8, attackNote.r * 2 + 8);
  ctx.fillStyle = fill;
  ctx.fillRect(-attackNote.r, -attackNote.r, attackNote.r * 2, attackNote.r * 2);
  ctx.fillStyle = "#ffd45a";
  if (attackNote.kind === "slice") {
    ctx.fillRect(-attackNote.r, -3, attackNote.r * 2, 6);
    ctx.fillRect(4, -attackNote.r, 6, attackNote.r * 2);
  } else if (attackNote.kind === "turn") {
    ctx.fillRect(-3, -attackNote.r, 6, attackNote.r * 2);
    ctx.fillRect(-attackNote.r, -3, attackNote.r * 2, 6);
  } else {
    ctx.fillRect(-5, -attackNote.r, 10, attackNote.r * 2);
    ctx.fillRect(-attackNote.r, -5, attackNote.r * 2, 10);
  }
  ctx.restore();
  ctx.fillStyle = "#f4efd7";
  ctx.font = "11px Courier New";
  ctx.fillText(label, attackNote.x - 18, attackNote.y + attackNote.r + 15);
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
  const placeName = game.backrooms ? "Backrooms" : game.inCamp ? "Adventurer's Camp" : world.name;
  ui.worldName.textContent = placeName;
  if (ui.compactWorld) ui.compactWorld.textContent = placeName;
  ui.coins.textContent = game.coins;
  if (ui.goldCompact) ui.goldCompact.textContent = game.coins;
  ui.weapon.textContent = `${game.weapon.name} (+${game.weapon.damage})`;
  ui.armor.textContent = `${game.armor.name} (+${game.armor.defense})`;
  ui.bossState.textContent = game.backrooms ? "Elsewhere" : game.bossDefeated ? "Defeated" : "Alive";
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
  if (game.messageTimer <= 0 && !game.menuOpen && !game.battle) {
    ui.message.textContent = game.backrooms
      ? "The lights buzz. Find a pale exit square before this place starts to feel normal."
      : game.inCamp
        ? "Adventurer's Camp: E talks and opens things. The purple doorway leads to Dungeon Floor 1."
        : `Chapter ${game.story.chapter}: follow the story-road, read strange landmarks, and search cottages between the thorns.`;
  }
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
  if (game.secretQuest && game.secretQuest.active) return `Ore ${game.secretQuest.shards}/${game.secretQuest.target}`;
  if (!game.quest) return "None";
  if (game.quest.complete) return "Turn in";
  if (game.quest.active) return `${game.quest.defeated}/${game.quest.target}`;
  return "Find NPC";
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
  return worlds[game.worldIndex].routes.some((route) => (
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
ui.fightButton.addEventListener("click", playerBattleAttack);
ui.abilityButton.addEventListener("click", useBattleAbility);
ui.itemButton.addEventListener("click", useBattleItem);
ui.spareButton.addEventListener("click", spareEnemy);
ui.runButton.addEventListener("click", runBattle);
ui.saveButton.addEventListener("click", () => saveGame(true));
ui.newRunButton.addEventListener("click", clearSaveAndRestart);
ui.continueButton.addEventListener("click", continueFromTitle);
ui.loadButton.addEventListener("click", continueFromTitle);
ui.newGameButton.addEventListener("click", newGameFromTitle);
ui.settingsButton.addEventListener("click", () => showTitleInfo("Settings", "Difficulty, manual save slots, and audio settings are planned next. Current mode: Normal, permadeath off."));
ui.creditsButton.addEventListener("click", () => showTitleInfo("Credits", "Dungeon Beneath the Storybook: built with placeholder pixel shapes so the whole game stays playable while real art and sound can be added later."));
ui.quitButton.addEventListener("click", () => showTitleInfo("Quit", "Browsers do not allow this page to close itself safely. Use Save, then close the tab whenever you are ready."));
ui.characterButton.addEventListener("click", openCharacterMenu);
ui.inventoryButton.addEventListener("click", openInventoryMenu);
ui.skillsButton.addEventListener("click", openSkillsMenu);
ui.questsButton.addEventListener("click", () => showTitleInfo("Quests", questText()));
ui.bestiaryButton.addEventListener("click", () => showTitleInfo("Bestiary", "Discovered creatures will be cataloged here as the dungeon grows."));
ui.mapButton.addEventListener("click", () => showTitleInfo("Map", `${currentRegionName()} - discovered routes and landmarks appear on the minimap.`));

if (!loadGame()) startGame();
ui.continueButton.disabled = !hasSaveFile();
ui.loadButton.disabled = !hasSaveFile();
refreshUi();
requestAnimationFrame(loop);
