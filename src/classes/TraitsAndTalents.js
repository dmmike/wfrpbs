const TRAITS = [
    {
        name: 'Afraid',
        has: ['value'],
        description: "The creature gains Fear(0) to the Target."
    },
    {
        name: 'Amphibious',
        description: "The creature is at home in water. It can add its Agility Bonus to the SL of all Swim Tests and move at full Movement through water."
    },
    {
        name: 'Arboreal',
        description: "The creature is at home in the forests. In the woodlands, it adds its Agility Bonus to the SL of all Climb and Stealth Tests."
    },
    {
        name: 'Animosity',
        has: ['value'],
        description: "The creature is at home in water. It can add its Agility Bonus to the SL of all Swim Tests and move at full Movement through water."
    },
    {
        name: 'Armour',
        has: ['rating'],
        description: "The creature is protected by armour or thick hide. It has Rating Armour Points on all Hit Locations."
    },
    {
        name: 'Belligerent',
        description: "The creature loves to win a fight. As long as it has more Advantage than its opponent, it is Immune to Psychology."
    },
    {
        name: 'Bestial',
        description: "The creature has no rational thought or language. It shies away from fire and gains a <i>Broken</i> Condition if struck by it. In defence, it only uses the Dodge Skill. If it loses more than half its Wounds, it will attempt to Flee unless protecting its young or cornered, or unless it has the <i>Territorial</i> Trait. If so, it enters Frenzy. Bestial creatures have no Fellowship characteristic."
    },
    {
        name: 'Big',
        description: "The creature is a large example of its species. It receives +10 Strength and Toughness, and -5 Agility.",
        stats: (stats) => {
            stats.s.value += 10;
            stats.t.value += 10;
            stats.agi.value -= 5;
        }
    },
    {
        name: 'Bite',
        has: ['rating'],
        description: "On its turn, the creature may make a Free Attack by spending 1 Advantage. The Damage of the attack equals Rating and includes the creature's Strength Bonus already."
    },
    {
        name: 'Blessed',
        has: ['value'],
        values: ['Manann', 'Morr', 'Myrmidia', 'Ranald', 'Rhya', 'Shallya', 'Sigmar', 'Taal', 'Ulric', 'Verena'],
        description: "The creature loves to win a fight. As long as it has more Advantage than its opponent, it is Immune to Psychology."
    },
    {
        name: 'Bounce',
        description: "The creature can bounce high, perhaps with powerful limbs, magic, or stubby wings. When Charging or Running, it doubles its Movement Characteristic, and can ignore all intervening terrain and characters as it leap over them."
    },
    {
        name: 'Breath',
        has: ['rating', 'value'],
        values: [
            {
                value: 'Cold',
                description: "Targets gain a <i>Stunned</i> Condition for every full 5 Wounds suffered (minimum of 1)."
            },
            {
                value: 'Corrosion',
                description: 'All Armour and Weapons carried by affected targets suffer 1 Damage.'
            },
            {
                value: 'Fire',
                description: "Any Wounds caused ignore Armour Points. Targets gain an <i>Ablaze</i> Condition."
            },
            {
                value: 'Electricity',
                description: "Any Wounds caused ignore Armour Points. Targets gain a <i>Stunned</i> Condition."
            },
            {
                value: 'Poison',
                description: "Any Wounds caused ignore Armour Points. Target gains a <i>Poisoned</i> Condition."
            },
            {
                value: 'Smoke',
                description: 'The area fills with smoke, blocking Line of Sight for Toughness Bonus Rounds.'
            }
        ],
        description: "The creature's breath is a powerful weapon. On its turn, for the cost of 2 Advantage, it can activate its <i>Breath</i> as a Free Attack. Choose 1 target it can see within 20+Toughness Bonus yards. All characters within Strength Bonus yards of that target are struck, as are all characters between the creature and the target. Perform an <b>Opposed Ballistic Skill/Dodge</b> Test against all affected targets (the creature's single roll opposed by each individual target). All targets that fail take Damage equal to the attack's Rating. Further, if the Trait is marked with any of the following types in brackets, apply the associated rules."
    },
    {
        name: 'Brute',
        description: "The creature is heavy and brutish. It receives -1 Movement, -10 Agility, and +10 Strength and Toughness.",
        stats: (stats) => {
            stats.m -= 1;
            stats.s.value += 10;
            stats.t.value += 10;
            stats.agi.value -= 10;
        }
    },
    {
        name: 'Champion',
        description: "The creature is an extraordinarily skilled warrior. If it wins an Opposed Test when defending in melee combat, it can cause Damage just as if it was the attacker."
    },
    {
        name: 'Chill Grasp',
        description: "The creature's touch chills its enemy's souls. For the cost of 2 Advantage and its Action, it can attempt an <b>Opposed Weapon Skill/Melee or Dodge</b> Test. If it wins, its target loses 1d10 + SL Wounds with no modification for Toughness Bonus or Armour Points. This attack is <i>Magical</i>."
    },
    {
        name: 'Clever',
        description: "The creature is particularly sharp-minded. It receives +20 Intelligence and +10 Initiative.",
        stats: (stats) => {
            stats.i.value += 10;
            stats.int.value += 20;
        }
    },
    {
        name: 'Cold-blooded',
        description: "The creature is cold-blooded and slow to react. It can reverse all failed Willpower Tests."
    },
    {
        name: 'Constrictor',
        description: "The creature can squeeze and crush its prey. Any successful roll to hit gives the target an <i>Entangled</i> Condition. The creature may then enter a Grapple if it wishes. "
    },
    {
        name: 'Construct',
        description: "The creature is a construct of magic, quite mindless, bound together with magical sinews. It has no Intelligence, Willpower, or Fellowship Characteristics, and need never Test them. If it has no wizard controlling it, or does not possess the <i>Territorial</i> Trait, it meanders mindlessly, following flows of ambient magic.<br/><br/> For the purposes of calculating its Wounds, it uses its Strength Bonus whenever Willpower Bonus is required. All its attacks are <i></i>Magical."
    },
    {
        name: 'Corrosive Blood',
        description: "The creature’s blood is corrosive. Every time it is Wounded, blood splashes free, and all targets Engaged with it take 1d10 Wounds modified by Toughness Bonus and Armour Points, to a minimum of 1."
    },
    {
        name: 'Corruption',
        has: ['value'],
        values: [
            {value: 'Minor'},
            {value: 'Moderate'},
            {value: 'Major'},
        ],
        description: "The creature is tainted by Chaos, or perhaps suffused with Dark Magics."
    },
    {
        name: 'Cunning',
        description: "The creature is exceptionally cunning. It receives +10 Fellowship, Intelligence, and Initiative.",
        stats: (stats) => {
            stats.fel.value += 10;
            stats.int.value += 10;
            stats.i.value += 10;
        }
    },
    {
        name: 'Dark Vision',
        description: "The creature can see in the dark as daylight."
    },
    {
        name: 'Daemonic',
        has: ['value'],
        description: "The creature’s essence is raw magic, and unholy ichor pumps through what passes for its veins. Daemonic creatures do not require the normal prerequisites for life: food, water, air… <br/><br/>All its attacks are <i>Magical</i>. Roll 1d10 after any blow is received, if the creature rolls the Target number or higher, the blow is ignored, even if it is a critical. Should the creature be reduced to 0 Wounds, its soul returns to the Realms of Chaos immediately, removing it from play"
    },
    {
        name: 'Die Hard',
        description: "No matter how hard the creature is hit, it gets back up. All Critical Wounds not resulting in death can be healed; just attach the requisite body parts to the correct places, perhaps with staples or large spikes to hold them in place, and it’s good to go. Even ‘death’ may be ‘healed’ if the appropriate parts, such as a lost head, are attached to the body. If death occurs and all parts are in place, it may attempt a <b>Challenging (+0) Endurance</b> Test requiring an <b>SL of 6</b> at the start of every round for Toughness Bonus Rounds after death. If a Test is successful, the creature chokes back to life with 1 Wound."
    },
    {
        name: 'Disease',
        has: ['value'],
        values: [
            'The Black Plague',
            'Blood Rot',
            'The Bloody Flux',
            'Galloping Trots',
            'Itching Pox',
            'Packer\'s Pox',
            'Ratte Fever',
        ],
        description: "The creature carries the disease listed. Others will have to Test as appropriate for Contraction."
    },
    {
        name: 'Distracting',
        description: "The creature distracts or confuse foes, possibly exuding a soporific musk or nauseating reek, or maybe its appearance is bizarrely horrifying. All living targets within a number of yards equal to its Toughness Bonus suffer a penalty of –20 to all Tests. A target can only suffer this penalty once, no matter how many Distracting foes there are."
    },
    {
        name: 'Elite',
        description: "The creature is a hard-nosed veteran. It receives +20 to Weapon Skill, Ballistic Skill, and Willpower.",
        stats: (stats) => {
            stats.ws.value += 20;
            stats.bs.value += 20;
            stats.wp.value += 20;
        }
    },
    {
        name: 'Ethereal',
        description: "The creature's form is insubstantial, allowing it to pass through solid objects. It can only be harmed by Magical attacks."
    },
    {
        name: 'Fast',
        description: "The creature moves unexpectedly fast. It receives +1 Movement and +10 Agility.",
        stats: (stats) => {
            stats.m += 1;
            stats.agi.value += 10;
        }
    },
    {
        name: 'Fear',
        has: ['rating'],
        description: "The creature causes supernatural Fear in other creatures, with a rating equal to its Rating."
    },
    {
        name: 'Flight',
        has: ['rating'],
        description: "As the creature’s Move, it can fly up to Rating yards. When flying, it ignores all intervening terrain, obstacles, or characters. At the end of the move, it decides whether it has landed or is still flying. It can use this move to Charge. If it starts its turn flying, it must choose to Fly for its Move. If it cannot do this, the GM decides how far the creature falls.<br/><br/>When targeting it, measure horizontal distance as normal, then increase range by 1 step. So, a Long Range shot would become Extreme Range, and if it was at Extreme Range it could not be shot at all.<br/><br/>When flying, it suffers a penalty of –20 to all ranged combat attempts as it swoops and wheels in the sky."
    },
    {
        name: 'Frenzy',
        description: "The creature can <i>Frenzy</i>."
    },
    {
        name: 'Fury',
        description: "The creature can work itself into an all-consuming rage. It can spend all of its Advantage (minimum of 1) to become subject to <i>Hatred</i> to close combat opponents. If the creature has at least 3 Advantage, it may instead expend all of its Advantage to become subject to <i>Frenzy</i>."
    },
    {
        name: 'Ghostly Howl',
        description: "The creature can emit a chilling howl, capable of killing those who hear it. On its turn the creature can spend all its Advantage (minimum of 2), to unleash a hideous scream as a Free Attack.<br/><br/>All living targets within a number of yards equal to the creature’s Initiative immediately gain 3 <i>Deafened</i> Conditions and suffer 1d10 Wounds ignoring Toughness Bonus and Armour Points. Those affected must also pass a <b>Average (+20) Endurance</b> test or gain a <i>Broken</i> Condition."
    },
    {
        name: 'Hardy',
        description: "The creature can sustain more damage than most. Increase its Wounds by a number equal to its Toughness Bonus (applied before any <i>Size</i> modifiers).",
        multi: true
    },
];

export default Object.freeze({
        getTrait(name) {
            return TRAITS.find(trait => trait.name === name);
        },
        TRAITS: TRAITS,
    }
)