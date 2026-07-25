export const roles = {
  VANGUARD: 'Vanguard',
  DUELIST: 'Duelist',
  STRATEGIST: 'Strategist'
};

export const heroes = [
  // VANGUARDS (14)
  { id: 'angela', name: 'Angela', role: roles.VANGUARD },
  { id: 'captainamerica', name: 'Captain America', role: roles.VANGUARD },
  { id: 'devildinosaur', name: 'Devil Dinosaur', role: roles.VANGUARD },
  { id: 'doctorstrange', name: 'Doctor Strange', role: roles.VANGUARD },
  { id: 'emmafrost', name: 'Emma Frost', role: roles.VANGUARD },
  { id: 'groot', name: 'Groot', role: roles.VANGUARD },
  { id: 'hulk', name: 'Hulk', role: roles.VANGUARD },
  { id: 'magneto', name: 'Magneto', role: roles.VANGUARD },
  { id: 'peniparker', name: 'Peni Parker', role: roles.VANGUARD },
  { id: 'rogue', name: 'Rogue', role: roles.VANGUARD },
  { id: 'thehood', name: 'The Hood', role: roles.VANGUARD },
  { id: 'thething', name: 'The Thing', role: roles.VANGUARD },
  { id: 'thor', name: 'Thor', role: roles.VANGUARD },
  { id: 'venom', name: 'Venom', role: roles.VANGUARD },
  
  // STRATEGISTS (12)
  { id: 'adamwarlock', name: 'Adam Warlock', role: roles.STRATEGIST },
  { id: 'cloakdagger', name: 'Cloak & Dagger', role: roles.STRATEGIST },
  { id: 'gambit', name: 'Gambit', role: roles.STRATEGIST },
  { id: 'invisiblewoman', name: 'Invisible Woman', role: roles.STRATEGIST },
  { id: 'jeff', name: 'Jeff the Land Shark', role: roles.STRATEGIST },
  { id: 'jubilee', name: 'Jubilee', role: roles.STRATEGIST },
  { id: 'loki', name: 'Loki', role: roles.STRATEGIST },
  { id: 'lunasnow', name: 'Luna Snow', role: roles.STRATEGIST },
  { id: 'mantis', name: 'Mantis', role: roles.STRATEGIST },
  { id: 'rocket', name: 'Rocket Raccoon', role: roles.STRATEGIST },
  { id: 'ultron', name: 'Ultron', role: roles.STRATEGIST },
  { id: 'whitefox', name: 'White Fox', role: roles.STRATEGIST },
  
  // DUELISTS (27)
  { id: 'blackcat', name: 'Black Cat', role: roles.DUELIST },
  { id: 'blackpanther', name: 'Black Panther', role: roles.DUELIST },
  { id: 'blackwidow', name: 'Black Widow', role: roles.DUELIST },
  { id: 'blade', name: 'Blade', role: roles.DUELIST },
  { id: 'cyclops', name: 'Cyclops', role: roles.DUELIST },
  { id: 'daredevil', name: 'Daredevil', role: roles.DUELIST },
  { id: 'deadpool', name: 'Deadpool', role: roles.DUELIST },
  { id: 'elsabloodstone', name: 'Elsa Bloodstone', role: roles.DUELIST },
  { id: 'hawkeye', name: 'Hawkeye', role: roles.DUELIST },
  { id: 'hela', name: 'Hela', role: roles.DUELIST },
  { id: 'humantorch', name: 'Human Torch', role: roles.DUELIST },
  { id: 'ironfist', name: 'Iron Fist', role: roles.DUELIST },
  { id: 'ironman', name: 'Iron Man', role: roles.DUELIST },
  { id: 'magik', name: 'Magik', role: roles.DUELIST },
  { id: 'misterfantastic', name: 'Mister Fantastic', role: roles.DUELIST },
  { id: 'moonknight', name: 'Moon Knight', role: roles.DUELIST },
  { id: 'namor', name: 'Namor', role: roles.DUELIST },
  { id: 'phoenix', name: 'Phoenix', role: roles.DUELIST },
  { id: 'psylocke', name: 'Psylocke', role: roles.DUELIST },
  { id: 'scarletwitch', name: 'Scarlet Witch', role: roles.DUELIST },
  { id: 'spiderman', name: 'Spider-Man', role: roles.DUELIST },
  { id: 'squirrelgirl', name: 'Squirrel Girl', role: roles.DUELIST },
  { id: 'starlord', name: 'Star-Lord', role: roles.DUELIST },
  { id: 'storm', name: 'Storm', role: roles.DUELIST },
  { id: 'punisher', name: 'Punisher', role: roles.DUELIST },
  { id: 'wintersoldier', name: 'Winter Soldier', role: roles.DUELIST },
  { id: 'wolverine', name: 'Wolverine', role: roles.DUELIST }
];

// Season 9 team-ups. Direction matters: `provider` grants the ability to
// `recipient`. A hero can only benefit from one team-up at a time, so multiple
// entries sharing a recipient are mutually exclusive choices.
export const teamUps = [
  {
    id: 'cosmic-cyclone',
    name: 'Cosmic Cyclone',
    heroes: ["adamwarlock","storm"],
    provider: 'storm',
    recipient: 'adamwarlock',
    description: 'Soul Bonded allies receive a Speed Boost. Soul Bond range is increased.',
    enhanced: 'Speed Boost is increased. Bonded allies also receive a Damage Boost.'
  },
  {
    id: 'flawless-design',
    name: 'Flawless Design',
    heroes: ["adamwarlock","ultron"],
    provider: 'ultron',
    recipient: 'adamwarlock',
    description: 'Cosmic Cluster now heals allies. Successful healing also reduces Avatar Life Stream’s cooldown. Ammo capacity is increased.',
    enhanced: 'Cosmic Cluster now has splash damage and splash healing.'
  },
  {
    id: 'asgardians-of-the-galaxy',
    name: 'Asgardians of the Galaxy',
    heroes: ["angela","starlord"],
    provider: 'starlord',
    recipient: 'angela',
    description: 'Reveals enemies on activation. Second activation performs slam that Grounds enemies. Cooldown applied.',
    enhanced: 'Slam now provides Bonus Health per target hit, up to a maximum.'
  },
  {
    id: 'odin’s-unacknowledged',
    name: 'Odin’s Unacknowledged',
    heroes: ["angela","loki"],
    provider: 'loki',
    recipient: 'angela',
    description: 'Send a charging illusion forward that carries enemies. Cooldown applied.',
    enhanced: 'Ability gains a second charge.'
  },
  {
    id: 'feline-alliance',
    name: 'Feline Alliance',
    heroes: ["blackcat","blackpanther"],
    provider: 'blackpanther',
    recipient: 'blackcat',
    description: 'Absorb damage to release an explosion that damages and Knocks back enemies. Gain a Speed Boost and Bonus Health. Cooldown applied.',
    enhanced: 'No required threshold of absorbed damage. Explosion can be triggered at any time.'
  },
  {
    id: 'binding-ties',
    name: 'Binding Ties',
    heroes: ["blackcat","spiderman"],
    provider: 'spiderman',
    recipient: 'blackcat',
    description: 'Turn of Fortune now applies a Spider-Tracer. Attacking an enemy with a Spider-Tracer deals bonus damage. Ability also gains a second charge.',
    enhanced: 'Turn of Fortune now Immobilizes enemies already marked with a Spider-Tracer.'
  },
  {
    id: 'damisa-yao',
    name: 'Damisa-Yao',
    heroes: ["blackpanther","storm"],
    provider: 'storm',
    recipient: 'blackpanther',
    description: 'Deal damage, apply Slow, and attach Vibranium Marks to enemies. Cooldown applied.',
    enhanced: 'Slow effect is increased. Enemies within range are launched inwards.'
  },
  {
    id: 'dimensional-shortcut',
    name: 'Dimensional Shortcut',
    heroes: ["blackpanther","magik"],
    provider: 'magik',
    recipient: 'blackpanther',
    description: 'Teleport to your position from a few seconds ago, gaining Bonus Health, then deal an explosion that applies Vibranium Marks. Cooldown applied.',
    enhanced: 'Teleportation can now be cancelled manually.'
  },
  {
    id: 'allied-agents',
    name: 'Allied Agents',
    heroes: ["blackwidow","hawkeye"],
    provider: 'hawkeye',
    recipient: 'blackwidow',
    description: 'Land hits with Red Room Rifle to build Focus. Land crits to build more Focus. At max Focus, the next hit has Damage Boost and can pierce.',
    enhanced: 'Landing crits stops Focus from expiring.'
  },
  {
    id: 'burning-bullets',
    name: 'Burning Bullets',
    heroes: ["blackwidow","phoenix"],
    provider: 'phoenix',
    recipient: 'blackwidow',
    description: 'Red Room Rifle has increased Fire Rate. Electro-Plasma Blast is now a hitscan explosion.',
    enhanced: 'Electro-Plasma Blast gains a second charge.'
  },
  {
    id: 'blade-of-khonshu',
    name: 'Blade of Khonshu',
    heroes: ["blade","moonknight"],
    provider: 'moonknight',
    recipient: 'blade',
    description: 'Cleave forward with a short dash. Then slash multiple times, sending Darkmoon Blades that bounce to nearby targets with a damage falloff per bounce. Cooldown applied.',
    enhanced: 'Whirlwind Slash generates an additional Darkmoon Blade.'
  },
  {
    id: 'bleed-for-battle',
    name: 'Bleed for Battle',
    heroes: ["blade","captainamerica"],
    provider: 'captainamerica',
    recipient: 'blade',
    description: 'Gain a stack of Bloodline Awakening for damage taken.',
    enhanced: 'Taking critical health damage instantly activates Bloodline Awakening and adds bonus stacks. The stack cap is increased.'
  },
  {
    id: 'stars-aligned',
    name: 'Stars Aligned',
    heroes: ["captainamerica","wintersoldier"],
    provider: 'wintersoldier',
    recipient: 'captainamerica',
    description: 'Leap to an ally, providing Bonus Health to both of you. Absorb some of the ally’s incoming damage to yourself. Cooldown applied.',
    enhanced: 'Leaping to an ally now provides a Speed Boost. Upon confirmation, leap to Winter Soldier to apply Bonus Health to all nearby allies.'
  },
  {
    id: 'voltaic-union',
    name: 'Voltaic Union',
    heroes: ["captainamerica","thor"],
    provider: 'thor',
    recipient: 'captainamerica',
    description: 'Activating will make Sentinel Strike pierce enemies. Cooldown applied.',
    enhanced: 'Each hit now deals splash damage.'
  },
  {
    id: 'oblivion-shroud',
    name: 'Oblivion Shroud',
    heroes: ["cloakdagger","thehood"],
    provider: 'thehood',
    recipient: 'cloakdagger',
    description: 'Veil of Lightforce now halts in place after a moment, decreasing enemy damage passing through it. Terror Cape now halts in place after a moment, decreasing enemy healing passing through it.',
    enhanced: 'Both veils increase in size and allies receive Damage Boost when passing through them.'
  },
  {
    id: 'frozen-haven',
    name: 'Frozen Haven',
    heroes: ["cloakdagger","lunasnow"],
    provider: 'lunasnow',
    recipient: 'cloakdagger',
    description: 'Freeze in place, becoming Invulnerable and healing yourself and nearby allies. Cooldown applied.',
    enhanced: 'Healing is increased.'
  },
  {
    id: 'slim-and-red',
    name: 'Slim and Red',
    heroes: ["cyclops","phoenix"],
    provider: 'phoenix',
    recipient: 'cyclops',
    description: 'Ricochet Force applies burn damage over time. Hitting a burning target with Optic Blast or Concussive Beam instantly triggers a portion of the remaining damage.',
    enhanced: 'Spark detonations reduce Ricochet Force cooldown.'
  },
  {
    id: 'kinetic-kin',
    name: 'Kinetic Kin',
    heroes: ["cyclops","gambit"],
    provider: 'gambit',
    recipient: 'cyclops',
    description: 'Activate to gain a Speed Boost and increased jump height. Cooldown applied.',
    enhanced: 'Activating now increases attack speed for Optic Blast and Concussive Beam.'
  },
  {
    id: 'comprehensive-defense',
    name: 'Comprehensive Defense',
    heroes: ["daredevil","ironfist"],
    provider: 'ironfist',
    recipient: 'daredevil',
    description: 'Objection! now deflects projectiles from all directions and deals damage to nearby enemies.',
    enhanced: 'Objection! now also applies self-healing.'
  },
  {
    id: 'devilish-affair',
    name: 'Devilish Affair',
    heroes: ["blackwidow","daredevil"],
    provider: 'blackwidow',
    recipient: 'daredevil',
    description: 'Deal damage in a cone that inflicts Slow. Cooldown applied.',
    enhanced: 'Increase damage cone size and now recover Fury on hit. Deadpool (All Roles)'
  },
  {
    id: '“hel-yeah-honey”',
    name: '“Hel-Yeah, Honey”',
    heroes: ["daredevil","hela"],
    provider: 'hela',
    recipient: 'daredevil',
    description: 'Either Desert Eagles or Katanas can be upgraded once more. Upgraded Desert Eagles now pierce, and emojis now home in on enemies. Upgraded Katanas deal an explosion after hitting an enemy multiple times.',
    enhanced: 'Both weapons can now be upgraded.'
  },
  {
    id: 'gumbo-chimichangas',
    name: 'Gumbo Chimichangas',
    heroes: ["daredevil","gambit"],
    provider: 'gambit',
    recipient: 'daredevil',
    description: 'Leap forward and deal damage to nearby enemies upon landing. Cooldown applied. Landing deals variable damage depending on chosen role.',
    enhanced: 'Decrease the ability’s cooldown. Landing now inflicts Stun.'
  },
  {
    id: 'primal-punishment',
    name: 'Primal Punishment',
    heroes: ["devildinosaur","punisher"],
    provider: 'punisher',
    recipient: 'devildinosaur',
    description: 'Activate to replace Primal Bite with cannons that fire for a duration. Cannonballs deal direct damage, splash damage, and inflict Bleed. Cooldown applied.',
    enhanced: 'The Punisher can ride Devil Dinosaur for Damage Reduction. Devil Dinosaur also absorbs damage inflicted on The Punisher.'
  },
  {
    id: 'surf-&-turf',
    name: 'Surf & Turf',
    heroes: ["devildinosaur","jeff"],
    provider: 'jeff',
    recipient: 'devildinosaur',
    description: 'Impact Beam now provides piercing healing for allies and has increased range and duration.',
    enhanced: 'Jeff the Land Shark can ride Devil Dinosaur, providing both heroes with Damage Reduction and healing.'
  },
  {
    id: 'gamma-maelstrom',
    name: 'Gamma Maelstrom',
    heroes: ["doctorstrange","hulk"],
    provider: 'hulk',
    recipient: 'doctorstrange',
    description: 'Maelstrom of Madness’s range is increased and Dark Magic gained by hitting enemies is increased. Anti-Heal curse is also removed. Cooldown is increased.',
    enhanced: 'Using Maelstrom of Madness will now retain energy. Energy also now does not decay over time.'
  },
  {
    id: 'psionic-vortex',
    name: 'Psionic Vortex',
    heroes: ["doctorstrange","invisiblewoman"],
    provider: 'invisiblewoman',
    recipient: 'doctorstrange',
    description: 'Maelstrom of Madness now launches enemies inwards. Shield of the Seraphim now has increased health.',
    enhanced: 'Maelstrom of Madness now provides Bonus Health based on damage dealt, up to a set maximum.'
  },
  {
    id: 'prehistoric-trap',
    name: 'Prehistoric Trap',
    heroes: ["devildinosaur","elsabloodstone"],
    provider: 'devildinosaur',
    recipient: 'elsabloodstone',
    description: 'Smoky Snare has a larger detection range and will now also release a gas that deals damage over time.',
    enhanced: 'Ability gains a second charge and multiple Smoky Snares can be active at once.'
  },
  {
    id: 'loudmouth-mercs',
    name: 'Loudmouth Mercs',
    heroes: ["deadpool","elsabloodstone"],
    provider: 'deadpool',
    recipient: 'elsabloodstone',
    description: 'Living Bullet now Slows targets, deals damage over time, and Taunts targets. Bullet then auto-recalls, healing Elsa based on damage dealt and adding a stack to Inherited Instinct.',
    enhanced: 'The rate of acquiring Inherited Instinct is also increased.'
  },
  {
    id: 'spirit-breaker',
    name: 'Spirit Breaker',
    heroes: ["emmafrost","mantis"],
    provider: 'mantis',
    recipient: 'emmafrost',
    description: 'Dealing damage to Psychic Spear’s crystal now grants Bonus Health to you based on damage dealt.',
    enhanced: 'Breaking Psychic Spear’s crystal now also grants additional Bonus Health and reduces the cooldown for Psychic Spear.'
  },
  {
    id: 'iced-out-diamond',
    name: 'Iced Out Diamond',
    heroes: ["emmafrost","lunasnow"],
    provider: 'lunasnow',
    recipient: 'emmafrost',
    description: 'Deal damage in a cone that inflicts Slow and summons a wall of ice. Cooldown applied.',
    enhanced: 'Attacks dealt in Diamond Form now apply Slow. Telepathic Pulse also applies Slow scaled to current energy.'
  },
  {
    id: 'favorable-odds',
    name: 'Favorable Odds',
    heroes: ["gambit","magneto"],
    provider: 'magneto',
    recipient: 'gambit',
    description: 'Summon a dome that heals allies and damages enemies in range, while also launching enemies back. Cooldown applied.',
    enhanced: 'The dome now explodes at the end of its duration, dealing additional damage and healing.'
  },
  {
    id: 'sparkling-staff',
    name: 'Sparkling Staff',
    heroes: ["gambit","jubilee"],
    provider: 'jubilee',
    recipient: 'gambit',
    description: 'Provide healing to nearby allies and damage to nearby enemies while blocking damage from projectiles. Cooldown applied.',
    enhanced: 'Bayou Bash and Big Easy Impact now provide additional healing over time.'
  },
  {
    id: 'wild-wall',
    name: 'Wild Wall',
    heroes: ["groot","mantis"],
    provider: 'mantis',
    recipient: 'groot',
    description: 'Summon a wall that provides healing over time and Bonus Health over time to nearby allies. Cooldown applied.',
    enhanced: 'Wall now upgrades after providing a threshold of healing. Upgraded wall heals allies faster and has more health.'
  },
  {
    id: 'bubble-buddies',
    name: 'Bubble Buddies',
    heroes: ["groot","jeff"],
    provider: 'jeff',
    recipient: 'groot',
    description: 'Activate to float in a shield that can float and provide healing. Cooldown applied.',
    enhanced: 'Healing effect is doubled and excess healing becomes Bonus Health. Jeff can also ride Groot, but he will not receive healing.'
  },
  {
    id: 'senbonzakura-strike',
    name: 'Senbonzakura Strike',
    heroes: ["hawkeye","psylocke"],
    provider: 'psylocke',
    recipient: 'hawkeye',
    description: 'Blast Arrow becomes Psionic Arrow, allowing multiple arrows to be nocked and fired at once. Arrows do not deal splash damage.',
    enhanced: 'Arrow damage is decreased, but nocking speed is increased and arrows deal splash damage. Cloak & Dagger provide: Moonlit Slash Crescent Slash now fires a projectile that heals and boosts healing for allies, and damages and applies Vulnerability to enemies. Enhanced: Ability now has decreased healing and damage but fires multiple projectiles in quick succession.'
  },
  {
    id: 'hel-tendrils',
    name: 'Hel Tendrils',
    heroes: ["hela","venom"],
    provider: 'venom',
    recipient: 'hela',
    description: 'Soul Drainer now deals more damage, pulls nearby enemies to its center, and applies Slow based on distance from center.',
    enhanced: 'Piercing Night now fire more Nightsword Thorns which restore health.'
  },
  {
    id: 'deep-wrath',
    name: 'Deep Wrath',
    heroes: ["hela","namor"],
    provider: 'namor',
    recipient: 'hela',
    description: 'Participating in a KO spawns an Undead Monstro that expires, autonomously dealing damage. Piercing Night will command the Monstro to attack the nearest enemy you hit.',
    enhanced: 'Attacks during Goddess of Night spawn additional Undead Monstros.'
  },
  {
    id: 'savage-slam',
    name: 'Savage Slam',
    heroes: ["captainamerica","hulk"],
    provider: 'captainamerica',
    recipient: 'hulk',
    description: 'Activate to jump and slam the ground, dealing damage to nearby enemies and recovering your ability cooldowns based on your current health. Can be activated mid-jump. Cooldown applied.',
    enhanced: 'Slam has increased damage and applies Vulnerability to enemies.'
  },
  {
    id: 'gamma-fastball',
    name: 'Gamma Fastball',
    heroes: ["hulk","wolverine"],
    provider: 'wolverine',
    recipient: 'hulk',
    description: 'Activate to become Furious for a period, gaining Speed Boost and increased attack speed, plus Unstoppable when health is low. Cooldown applied.',
    enhanced: 'Hulk can throw Wolverine, also activating the Furious state on its own separate cooldown.'
  },
  {
    id: 'fiery-sparks',
    name: 'Fiery Sparks',
    heroes: ["humantorch","jubilee"],
    provider: 'jubilee',
    recipient: 'humantorch',
    description: 'Send out projectiles that deal damage autonomously to all nearby enemies over a period of time. Cooldown applied.',
    enhanced: 'Also gain Bonus Health for each projectile that hits an enemy.'
  },
  {
    id: 'storming-ignition',
    name: 'Storming Ignition',
    heroes: ["humantorch","storm"],
    provider: 'storm',
    recipient: 'humantorch',
    description: 'Summon a dome that deals damage and damage over time, pulling enemies to its center. Cooldown applied.',
    enhanced: 'Flame Tornados can now ignite Storm’s Omega Hurricane, increasing its radius and its duration up to a maximum.'
  },
  {
    id: 'united-siblings',
    name: 'United Siblings',
    heroes: ["humantorch","invisiblewoman"],
    provider: 'humantorch',
    recipient: 'invisiblewoman',
    description: 'Guardian Shield has increased health and now boosts damage from projectiles fired by allies that pass through it.',
    enhanced: 'Guardian Shield is larger and has further increased health.'
  },
  {
    id: 'first-family',
    name: 'First Family',
    heroes: ["invisiblewoman","misterfantastic"],
    provider: 'misterfantastic',
    recipient: 'invisiblewoman',
    description: 'Enter Invisible state with nearby allies, gaining healing and a Speed Boost. Invisible state ends briefly if damage is taken or dealt. Cooldown applied.',
    enhanced: 'Invisible lasts longer, heals more, and has a stronger Speed Boost.'
  },
  {
    id: 'iron-&-stone',
    name: 'Iron & Stone',
    heroes: ["ironfist","thething"],
    provider: 'thething',
    recipient: 'ironfist',
    description: 'Activate to uppercut nearby enemies, Launching Up enemies. Cooldown applied.',
    enhanced: 'Uppercut can be followed up with a second attack.'
  },
  {
    id: 'kumiho-palm',
    name: 'Kumiho Palm',
    heroes: ["ironfist","whitefox"],
    provider: 'whitefox',
    recipient: 'ironfist',
    description: 'Yat Jee Chung Kuen now provides healing to nearby allies.',
    enhanced: 'Healing is increased and Yat Jee Chung Kuen’s lock-on distance is increased.'
  },
  {
    id: 'gamma-charge',
    name: 'Gamma Charge',
    heroes: ["hulk","ironman"],
    provider: 'hulk',
    recipient: 'ironman',
    description: 'Armor Overdrive now provides a Gamma Shield and increases the damage of Repulsor Blast’s direct hits, its splash damage, and Unibeam even further.',
    enhanced: 'Invincible Pulse Cannon now also provides a Gamma Shield and its projectile deals damage to nearby enemies as it flies.'
  },
  {
    id: 'thunder-overdrive',
    name: 'Thunder Overdrive',
    heroes: ["ironman","thor"],
    provider: 'thor',
    recipient: 'ironman',
    description: 'The range of Unibeam is increased. Unibeam also deals bonus damage to enemies caught near the beam’s outer ring. Armor Overdrive increases bonus damage and outer ring size.',
    enhanced: 'Armor Overdrive’s cooldown is reduced.'
  },
  {
    id: 'guardian-of-the-deep',
    name: 'Guardian of the Deep',
    heroes: ["jeff","venom"],
    provider: 'venom',
    recipient: 'jeff',
    description: 'Shoot tendrils that link to nearby allies, providing healing and healing over time until they expire. Excess healing is converted to Bonus Health. Cooldown applied.',
    enhanced: 'Tendrils now also link to nearby enemies, dealing damage over time.'
  },
  {
    id: 'mr.-pool’s-interdimensional-toy-box',
    name: 'Mr. Pool’s Interdimensional Toy Box',
    heroes: ["deadpool","jeff"],
    provider: 'deadpool',
    recipient: 'jeff',
    description: 'Summon a dome that heals allies over time and Taunts enemies for its duration. Cooldown applied.',
    enhanced: 'The Taunt effect is increased, and damage is now dealt to enemies over time.'
  },
  {
    id: 'hellfire-sparks',
    name: 'Hellfire Sparks',
    heroes: ["jubilee","thehood"],
    provider: 'thehood',
    recipient: 'jubilee',
    description: 'When Attack Speed is increased, Energy Plasmoids become hitscan, grant self-healing on hit, and can deal critical hits.',
    enhanced: 'Sparkle Marks are not cleared on hit, allowing Attack Speed increase to be re-triggered indefinitely.'
  },
  {
    id: 'vampiric-kin',
    name: 'Vampiric Kin',
    heroes: ["blade","jubilee"],
    provider: 'blade',
    recipient: 'jubilee',
    description: 'Activate a field around you that converts damage into healing for you and allies for its duration. Cooldown applied.',
    enhanced: 'The field now also provides healing over time.'
  },
  {
    id: 'villain’s-illusion',
    name: 'Villain’s Illusion',
    heroes: ["hela","loki"],
    provider: 'hela',
    recipient: 'loki',
    description: 'Assume the form of a defeated hero for a period and use their abilities, except Ultimates. Cooldown applied.',
    enhanced: 'The period is extended. Taking lethal damage while transformed will revert you back to Loki with some health.'
  },
  {
    id: 'vibrant-vitality',
    name: 'Vibrant Vitality',
    heroes: ["loki","mantis"],
    provider: 'mantis',
    recipient: 'loki',
    description: 'Regenerative Domain has an increased radius and provides a damage boost.',
    enhanced: 'Summoning Regenerative Domain now deals damage to enemies and Knocks them back.'
  },
  {
    id: 'atlas-bond',
    name: 'Atlas Bond',
    heroes: ["lunasnow","whitefox"],
    provider: 'whitefox',
    recipient: 'lunasnow',
    description: 'Fire a projectile forward that Charms enemies, heals allies, and cleanses negative effects on you. Cooldown applied.',
    enhanced: 'The projectile now returns after reaching its max distance, repeating its effects. Cooldown is reduced.'
  },
  {
    id: 'duality-dance',
    name: 'Duality Dance',
    heroes: ["adamwarlock","lunasnow"],
    provider: 'adamwarlock',
    recipient: 'lunasnow',
    description: 'Link to nearby allies and enemies for a period. Damaging linked enemies and healing linked allies restores your health. Cooldown applied.',
    enhanced: 'Critical hits with Light & Dark Ice now reduce the cooldowns of Absolute Zero and Ice Arts.'
  },
  {
    id: 'chain-of-cyttorak',
    name: 'Chain of Cyttorak',
    heroes: ["doctorstrange","magik"],
    provider: 'doctorstrange',
    recipient: 'magik',
    description: 'Tether two enemies together, dealing damage over time pulling them to the center and applying Slow based on distance from center until duration ends. Cooldown applied.',
    enhanced: 'Tether can now connect an unlimited number of enemies together.'
  },
  {
    id: 'void-pentagram',
    name: 'Void Pentagram',
    heroes: ["magik","thehood"],
    provider: 'thehood',
    recipient: 'magik',
    description: 'Summon a field that exists for a period. Using Stepping Discs in the field refunds some of its cooldown cost and automatically summons a Limbo Demon. Cooldown applied.',
    enhanced: 'Limbo Demons summoned in the field have increased health and attack range.'
  },
  {
    id: 'metallic-chaos',
    name: 'Metallic Chaos',
    heroes: ["magneto","scarletwitch"],
    provider: 'scarletwitch',
    recipient: 'magneto',
    description: 'Activate to replace Iron Volley with large projectiles that are sent forward, dealing direct damage and splash damage for its duration. Cooldown applied.',
    enhanced: 'Mag-Cannon is replaced, allowing you to charge and fire multiple projectiles quickly, dealing direct damage and splash damage.'
  },
  {
    id: 'magnetic-resonance',
    name: 'Magnetic Resonance',
    heroes: ["emmafrost","magneto"],
    provider: 'emmafrost',
    recipient: 'magneto',
    description: 'Cast a projection that mimics your movement and abilities for a percentage of damage until its duration ends. Cooldown applied.',
    enhanced: 'The projection has increased health and no longer expires.'
  },
  {
    id: 'star-blossom',
    name: 'Star Blossom',
    heroes: ["mantis","starlord"],
    provider: 'starlord',
    recipient: 'mantis',
    description: 'Healing Flower has increased healing. Applying a Healing Flower on an ally who already has the effect will enhance its healing rate and heal nearby allies.',
    enhanced: 'Healing Flower now applies the enhanced healing rate and heals nearby allies on its initial cast.'
  },
  {
    id: 'vitality-pact',
    name: 'Vitality Pact',
    heroes: ["adamwarlock","mantis"],
    provider: 'adamwarlock',
    recipient: 'mantis',
    description: 'Self-healing from using Natural Anger is increased. Also, freely move as a soul upon defeat, healing allies in a radius and reviving at a chosen spot. Cooldown applied.',
    enhanced: 'You can now use Soul Bond with allies when freely moving as a soul, providing healing over time and sharing damage across allies up to a set maximum.'
  },
  {
    id: 'fantastic-amplifier',
    name: 'Fantastic Amplifier',
    heroes: ["misterfantastic","rocket"],
    provider: 'rocket',
    recipient: 'misterfantastic',
    description: 'Elasticity’s limit is increased. Inflation State can be activated manually. Cooldown applied.',
    enhanced: 'Brainiac Bounce now Launches enemies inwards.'
  },
  {
    id: 'clobberin’-research-dept.',
    name: 'Clobberin’ Research Dept.',
    heroes: ["misterfantastic","thething"],
    provider: 'thething',
    recipient: 'misterfantastic',
    description: 'Activate to enter a brawling stance. Stretch Punch becomes chargeable, with damage that scales with charge and providing Bonus Health that scales with damage up to a maximum. Fully charged hits also Launch enemies back. Cooldown applied.',
    enhanced: 'Brawling stance now also makes Distended Grip chargeable, slamming down an attack on a shorter cooldown with damage that scales with charge.'
  },
  {
    id: 'blood-moon',
    name: 'Blood Moon',
    heroes: ["elsabloodstone","moonknight"],
    provider: 'elsabloodstone',
    recipient: 'moonknight',
    description: 'Deploy an Ankh Trap that summons a Talon of Khonshu that deals damage and launches enemies inwards when they enter its radius. Ankh Traps become invisible after a period. Cooldown applied.',
    enhanced: 'Talon of Khonshu is replaced with weaker Talons that fall in quick succession.'
  },
  {
    id: 'gamma-monstro',
    name: 'Gamma Monstro',
    heroes: ["hulk","namor"],
    provider: 'hulk',
    recipient: 'namor',
    description: 'Summon an additional Monstro that autonomously attacks the nearest enemy, with damage increasing on single targets over time. Cooldown applied.',
    enhanced: 'Blessing of the Deep grants active Gamma Monstro a damage boost and increases its cooldown recovery speed.'
  },
  {
    id: 'chilling-charisma',
    name: 'Chilling Charisma',
    heroes: ["lunasnow","namor"],
    provider: 'lunasnow',
    recipient: 'namor',
    description: 'Send a large projectile forward that damages, pushes back, and inflicts Slow on all enemies hit. Cooldown applied.',
    enhanced: 'Projectile applies damage and inflicts a stronger Slow when it reaches max distance. Ability also gains a second charge.'
  },
  {
    id: 'vibranium-mech',
    name: 'Vibranium Mech',
    heroes: ["blackpanther","peniparker"],
    provider: 'blackpanther',
    recipient: 'peniparker',
    description: 'Activate to increase the fire rate of Cyber-Web Cluster and summon a frontal shield for its duration. Cooldown applied.',
    enhanced: 'The frontal shield is now larger and has more health.'
  },
  {
    id: 'rocket-network',
    name: 'Rocket Network',
    heroes: ["peniparker","rocket"],
    provider: 'rocket',
    recipient: 'peniparker',
    description: 'Activate to summon an additional nest that drops Armor Packs periodically and spawns Spider-Drones. Cooldown applied.',
    enhanced: 'The additional nest will now regenerate its health, and Rocket Raccoon’s item is now summoned with a Cyber-Web, generating Spider-Drones and Arachno-Mines.'
  },
  {
    id: 'circle-of-life',
    name: 'Circle of Life',
    heroes: ["hela","phoenix"],
    provider: 'hela',
    recipient: 'phoenix',
    description: 'Telekinesis Burst is replaced with Phoenix Netherfire which quickly blasts the same location multiple times, each time applying a Spark. First blast inflicts damage and Stun. Additional blasts inflict damage and Healing Reduction. Cooldown is increased.',
    enhanced: 'Each explosion now applies multiple Sparks.'
  },
  {
    id: 'telekinetic-beatdown',
    name: 'Telekinetic Beatdown',
    heroes: ["phoenix","rogue"],
    provider: 'rogue',
    recipient: 'phoenix',
    description: 'Fire a delayed hitscan shot forward that sends the Phoenix Force to attack the target, attacking additional targets if they are in range of the previous up to a set maximum of bounces. Each attack also applies a Spark and provides self-healing. Cooldown applied.',
    enhanced: 'Detection radius is increased, max bounces increased, self-healing increased, and attacks now apply multiple Sparks.'
  },
  {
    id: 'mental-projection',
    name: 'Mental Projection',
    heroes: ["emmafrost","psylocke"],
    provider: 'emmafrost',
    recipient: 'psylocke',
    description: 'Project an illusion forward that uses Psi-Blade Dash, while you enter Stealth. The illusion mimics your movement and attacks for a portion of damage. Cooldown applied.',
    enhanced: 'Activate the ability again to swap places with the illusion. Cloak & Dagger provide: Light & Dark Darts Summon a field that activates your Stealth, and send out darts around you that deal damage and heal you upon impact until duration ends. Cooldown applied. Enhanced: The field’s size is increased and re-entering it will send darts out again.'
  },
  {
    id: 'mammalian-bond',
    name: 'Mammalian Bond',
    heroes: ["rocket","squirrelgirl"],
    provider: 'squirrelgirl',
    recipient: 'rocket',
    description: 'Throw acorns that can be consumed by allies, providing healing and reducing all cooldowns. Multiple charges. Cooldown applied.',
    enhanced: 'Ability gains an additional charge.'
  },
  {
    id: 'planet-x-pals',
    name: 'Planet X Pals',
    heroes: ["groot","rocket"],
    provider: 'groot',
    recipient: 'rocket',
    description: 'Bombard Mode is replaced for a period, launching projectiles that deal damage and damage over time within the splash, while providing healing and Bonus Health to allies. Cooldown applied.',
    enhanced: 'The ability’s duration is increased. You can also ride on Groot’s shoulder.'
  },
  {
    id: 'mr.-&-mrs.-x',
    name: 'Mr. & Mrs. X',
    heroes: ["gambit","rogue"],
    provider: 'gambit',
    recipient: 'rogue',
    description: 'Activating makes every attack trigger an explosion that deals damage and healing for a period. Cooldown applied.',
    enhanced: 'The effect no longer ends.'
  },
  {
    id: 'explosive-entanglement',
    name: 'Explosive Entanglement',
    heroes: ["magneto","rogue"],
    provider: 'magneto',
    recipient: 'rogue',
    description: 'Defensive Stance’s damage reduction is increased and now incoming damage is entirely converted for Southern Brawl.',
    enhanced: 'Southern Brawl now Knocks enemies back, and if they hit a wall it deals extra damage.'
  },
  {
    id: 'sorcerers-supreme',
    name: 'Sorcerers Supreme',
    heroes: ["doctorstrange","scarletwitch"],
    provider: 'doctorstrange',
    recipient: 'scarletwitch',
    description: 'Chthonian Burst is replaced with rapid-fire projectiles that deal damage. This uses an energy pool that recharges when using Chaos Control. Holding fire drains energy.',
    enhanced: 'The energy pool is increased and recharging with Chaos Control is faster. Holding fire also drains energy faster.'
  },
  {
    id: 'hex-fireworks',
    name: 'Hex Fireworks',
    heroes: ["jubilee","scarletwitch"],
    provider: 'jubilee',
    recipient: 'scarletwitch',
    description: 'Dark Seal can now be activated again to detonate an explosion that deals damage and applies Vulnerability.',
    enhanced: 'Mystic Projection now provides self-healing.'
  },
  {
    id: 'symbiote-bond',
    name: 'Symbiote Bond',
    heroes: ["spiderman","venom"],
    provider: 'venom',
    recipient: 'spiderman',
    description: 'Activate to receive damage reduction and send spikes out that deal damage and damage over time to nearby enemies. Cooldown applied.',
    enhanced: 'Damage over time is increased and hit enemies are also inflicted with Slow.'
  },
  {
    id: 'parker-power-up',
    name: 'Parker Power-Up',
    heroes: ["peniparker","spiderman"],
    provider: 'peniparker',
    recipient: 'spiderman',
    description: 'Activate to receive Bonus Health and prime a bomb that can be thrown to deal damage and apply Spider-Tracers to hit enemies after it explodes. Or hold onto the bomb to recharge Web-Cluster shots when it explodes. Cooldown applied.',
    enhanced: 'Hitting enemies who have Spider-Tracers now provides Bonus Health.'
  },
  {
    id: 'squirrel-missile',
    name: 'Squirrel Missile',
    heroes: ["ironman","squirrelgirl"],
    provider: 'ironman',
    recipient: 'squirrelgirl',
    description: 'Fire a homing missile that deals an explosion. Cooldown applied.',
    enhanced: 'Using Squirrel Blockade now also fires a homing missile.'
  },
  {
    id: 'esu-alumnus',
    name: 'ESU Alumnus',
    heroes: ["spiderman","squirrelgirl"],
    provider: 'spiderman',
    recipient: 'squirrelgirl',
    description: 'Fire a bomb that explodes on impact, dealing damage and applying Slow to enemies in range. Cooldown applied.',
    enhanced: 'The bomb now creates a field for a period that applies damage over time and completely stuns enemies who are in it for too long.'
  },
  {
    id: 'flora-munitions',
    name: 'Flora Munitions',
    heroes: ["groot","starlord"],
    provider: 'groot',
    recipient: 'starlord',
    description: 'Throw a projectile that spawns snares after a moment and last for a period that each deal damage and Stun enemies. Cooldown applied.',
    enhanced: 'The amount of snares that are spawned is increased and they each deal more damage.'
  },
  {
    id: 'star-soul',
    name: 'Star-Soul',
    heroes: ["adamwarlock","starlord"],
    provider: 'adamwarlock',
    recipient: 'starlord',
    description: 'Place a beacon that you can teleport to at any point by activating the ability again. Cooldown applied. Also, respawn at the beacon automatically upon death with a longer cooldown attached.',
    enhanced: 'Participating in a KO now reduces the ability’s cooldown.'
  },
  {
    id: 'god-of-thunder',
    name: 'God of Thunder',
    heroes: ["storm","thor"],
    provider: 'thor',
    recipient: 'storm',
    description: 'Wind Blade deals less direct damage but is now hitscan with splash damage and the ability to critical hit.',
    enhanced: 'Bolt Rush has a faster cooldown, greater range and can now bounce from surfaces and enemies to nearby enemies for additional direct damage.'
  },
  {
    id: 'jaws-of-fate',
    name: 'Jaws of Fate',
    heroes: ["jeff","storm"],
    provider: 'jeff',
    recipient: 'storm',
    description: 'Activate a field that provides healing over time to self and allies for a period. Cooldown applied.',
    enhanced: 'Jeff the Land Shark can enter Omega Hurricane to increase its range and duration. Enemies caught in the hurricane for enough time are also swallowed until the ability ends.'
  },
  {
    id: 'bestial-hunt',
    name: 'Bestial Hunt',
    heroes: ["daredevil","punisher"],
    provider: 'daredevil',
    recipient: 'punisher',
    description: 'Adjudication and Deliverance receive a damage boost and their bullets now penetrate targets.',
    enhanced: 'Adjudication and Deliverance now deal more damage to shields.'
  },
  {
    id: 'ammo-overload',
    name: 'Ammo Overload',
    heroes: ["punisher","rocket"],
    provider: 'rocket',
    recipient: 'punisher',
    description: 'Summon a field that provides a faster fire rate for Adjudication and Deliverance. Cooldown applied.',
    enhanced: 'The field now grants infinite ammo for Adjudication and Deliverance.'
  },
  {
    id: 'two-in-one',
    name: 'Two In One',
    heroes: ["humantorch","thething"],
    provider: 'humantorch',
    recipient: 'thething',
    description: 'Activate an enhanced state where Rocky Jab now deals splash damage and Stone Haymaker deals long-range damage in a cone. Cooldown applied.',
    enhanced: 'The Thing can be picked up by Human Torch and carried at high speed. Being dropped deals splash damage and applies Stun, and automatically activates The Thing’s enhanced state. Cooldown applied.'
  },
  {
    id: 'unbreakable-forces',
    name: 'Unbreakable Forces',
    heroes: ["invisiblewoman","thething"],
    provider: 'invisiblewoman',
    recipient: 'thething',
    description: 'Activate to gain Bonus Health per second up to a set maximum for a period. Being at low health increases the rate of Bonus Health accumulation. A portion of damage from incoming hits returns to you as Bonus Health. Cooldown applied.',
    enhanced: 'When ability is active, taking enough damage sends a pulse of healing for allies. A higher portion of damage from incoming hits returns to you as Bonus Health.'
  },
  {
    id: 'ragnarok-rebirth',
    name: 'Ragnarok Rebirth',
    heroes: ["hela","thor"],
    provider: 'hela',
    recipient: 'thor',
    description: 'Temporarily revive with damage reduction, a decaying pool of Bonus Health, and total Anti-Heal upon death, fully resurrecting with some health upon participation of a KO. Cooldown applied.',
    enhanced: 'Resurrection now happens if Hela participates in a KO. Resurrection also now comes with some healing over time.'
  },
  {
    id: 'divine-armory',
    name: 'Divine Armory',
    heroes: ["angela","thor"],
    provider: 'angela',
    recipient: 'thor',
    description: 'Throw a spear that deals splash damage and restores Thorforce when hitting an enemy. Activate again to leap to the spear, dealing another instance of splash damage. Cooldown applied.',
    enhanced: 'Leaping to the spear now grants Bonus Health.'
  },
  {
    id: 'stark-protocol',
    name: 'Stark Protocol',
    heroes: ["ironman","ultron"],
    provider: 'ironman',
    recipient: 'ultron',
    description: 'Upgrade Encephalo-Ray to deal piercing damage and healing, without needing to reload, until the period ends. Cooldown applied.',
    enhanced: 'Imperative: Firewall now also fires a cluster of homing missiles from you and all active drones at enemies in range, each missile dealing splash damage.'
  },
  {
    id: 'sp//dr-sync',
    name: 'SP//dr Sync',
    heroes: ["peniparker","ultron"],
    provider: 'peniparker',
    recipient: 'ultron',
    description: 'Activate to apply weaker Imperative: Patch drones to all allies on the map briefly. Cooldown applied.',
    enhanced: 'Imperative: Firewall is now applied to all active Imperative: Patch drones.'
  },
  {
    id: 'blood-leech',
    name: 'Blood Leech',
    heroes: ["blade","venom"],
    provider: 'blade',
    recipient: 'venom',
    description: 'Cellular Corrosion now also deals damage over time with all of this damage returning to you as health. A portion of Cellular Corrosion’s explosion damage also heals you.',
    enhanced: 'Using other abilities also grants one-time healing.'
  },
  {
    id: 'abyssal-flames',
    name: 'Abyssal Flames',
    heroes: ["phoenix","venom"],
    provider: 'phoenix',
    recipient: 'venom',
    description: 'Activate to replace Dark Predation with a sweeping frontal melee attack for a period. Cooldown applied.',
    enhanced: 'Attacking during activation now applies Sparks on enemies which detonate upon reaching a set number of stacks.'
  },
  {
    id: 'lucky-loan',
    name: 'Lucky Loan',
    heroes: ["blackcat","whitefox"],
    provider: 'blackcat',
    recipient: 'whitefox',
    description: 'Activating recovers a Spirit Tail and summons an aura that heals and Speed Boosts allies, and deals damage over time and Slow to enemies for its duration. Cooldown applied.',
    enhanced: 'During activation, Spirit Tails aren’t consumed by uses of Spectral Surge and Fox Form. Duration is also increased.'
  },
  {
    id: 'psionic-fox',
    name: 'Psionic Fox',
    heroes: ["psylocke","whitefox"],
    provider: 'psylocke',
    recipient: 'whitefox',
    description: 'Fox Form Awakening is always at its maximum duration and becomes a traditional cooldown that no longer requires Spirit Tails.',
    enhanced: 'The cooldown for Fox Form Awakening is reduced.'
  },
  {
    id: 'timeless-veterans',
    name: 'Timeless Veterans',
    heroes: ["punisher","wintersoldier"],
    provider: 'punisher',
    recipient: 'wintersoldier',
    description: 'Fire electricity forward that deals damage and Knocks enemies back. Cooldown applied.',
    enhanced: 'The attack Knocks enemies back further and now Grounds them.'
  },
  {
    id: 'expert-instinct',
    name: 'Expert Instinct',
    heroes: ["elsabloodstone","wintersoldier"],
    provider: 'elsabloodstone',
    recipient: 'wintersoldier',
    description: 'Dealing enough damage, or participating in a KO, will grant a stack of Culling Instinct up to a set maximum. Each stack reduces the cooldowns of other abilities. A stack is lost on death.',
    enhanced: 'Bonus health granted by uses of Ceaseless Charge is also increased.'
  },
  {
    id: 'blast-slash',
    name: 'Blast Slash',
    heroes: ["cyclops","wolverine"],
    provider: 'cyclops',
    recipient: 'wolverine',
    description: 'Activate to increase range of Savage Claw and Berserk Claw Strike for a period. Vicious Rampage now deals a lunge that releases melee damage in all directions for a period. Cooldown applied.',
    enhanced: 'Blast Slash is always active.'
  },
  {
    id: 'pair-of-threes',
    name: 'Pair of Threes',
    heroes: ["gambit","wolverine"],
    provider: 'gambit',
    recipient: 'wolverine',
    description: 'Activate to gain a Speed Boost and bonus jump height for a period. Attacking enemies during the period also deals an additional instance of damage after a moment. Cooldown applied.',
    enhanced: 'Also receive healing over time during the ability. Authored by Craig Robinson Craig Robinson is an experienced gaming and esports writer with nearly a decade of coverage experience since 2015. With a background in software engineering, he combines his journalistic expertise with a strong understanding of technical SEO and web development fundamentals. He’s passionate about covering MMO games, competitive esports, and crafting guides that help players get the most out of their favorite titles. He\'s been writing about gaming and esports for over 10 years, which started as for fun project during university. He has since developed his skill set, contributing to newsrooms coverage of key games and event, and blending evergreen content strategy and a solid grasp of content marketing fundamentals. His work has appeared in Esports News UK, Gamer Guides, theEscpaist, and VideoGamer, and he now contributes to Gamehub\'s review team. When he’s not writing, Craig can usually be found running, at the gym, or tinkering with coding projects to keep his GitHub active. Full Bio Craig Robinson Related News Trending News Emergency Room Simulator brings high-pressure hospital shifts, just like you were starring in The Pitt 24 July 2026 PC Creative Assembly open sign ups for Total War: Warhammer 40,000 closed beta, with it starting ‘soon’ 24 July 2026 PC Creative Assembly show off ranged combat gameplay in Total War: Warhammer 40K 24 July 2026 PC If you’re looking for the Perspective Skull in Halo: Campaign Evolved, here’s its location 24 July 2026 PC Hell Let Loose: Vietnam open crossplay playtest begins this weekend 24 July 2026 PC All News Marvel Rivals – The Death of Gambit case guide 16 July 2026 PC Kazeta turns DRM-free PC games into SD card carts, as we look for physical game solutions, and fight back against a forced digital future 21 July 2026 PC Marvel Rivals – Death of Apocalypse full event walkthrough 16 July 2026 PC Marvel Rivals – The Death of Psylocke case guide 13 July 2026 PC Disney Dreamlight Valley: Honeyglow Woods review – A controversial release divides the Valley 21 July 2026 PC All News Categories PlayStation News Xbox News PC News Board Game News Latest News Emergency Room Simulator brings high-pressure hospital shifts, just like you were starring in The Pitt 24 July 2026 Article Emergency. Paging Dr Beat. So started the seminal 1980s pop record by the Miami Sound Machine. That has little relevance here other than it just popped into my weird brain… Creative Assembly show off ranged combat gameplay in Total War: Warhammer 40K 24 July 2026 News Hell Let Loose: Vietnam open crossplay playtest begins this weekend 24 July 2026 Guides Aliens: Fireteam Elite 2 release date confirmed, with 40th Anniversary and Alien: Romulus Editions too 23 July 2026 News WoW GM accused of cheating in M+ run, implicating streamer connections and title chasers 22 July 2026 News Marvel Rivals gets a new Thebes Convoy map as part of the Death of Apocalypse event 21 July 2026 News Latest Gaming News Game Reviews Pokémon: News & Guides Elden Ring: News & Guides International Guides About About Affiliate Disclosure Contact Us Disclaimer Editorial Policy How we rate Meet the Team Privacy Policy Responsible Gaming Terms & Conditions Gaming News PC News PlayStation News Xbox News Nintendo News Board Games News Culture News Game Development News Business News Gaming Stocks News Interviews News Gambling Guides Online Casinos Crypto Casinos Betting Sites Fast Withdrawal Casinos Online Pokies Casino Apps Betting Apps PayID Online Casinos Best Payout Online Casinos Inclave Casinos Popular Slots Le Bandit Wanted Dead or a Wild Gates Of Olympus Gate of Olympus Super Scatter Tome Of Madness Wild Bounty Showdown Fortune Mouse Sweet Bonanza Brute Force Mega Joker © 2026 Gameshub FZ-LLC, All rights reserved Gameshub FZ-LLC, Office 12, Floor 8, Emirates Pearl Tower, Sheikh Zayed Road, Al Quoz Industrial Area 3, Dubai, United Arab Emirates English English عربي Čeština Suomi Français Deutsch Ελληνικά Magyar 日本語 한국인 Italiano Nederlands Norsk Polski Português Español Svenska ↑'
  },
];
