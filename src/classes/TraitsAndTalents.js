const DEITIES = ['Manann', 'Morr', 'Myrmidia', 'Ranald', 'Rhya', 'Shallya', 'Sigmar', 'Taal', 'Ulric', 'Verena'];
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
        stats: (stats, revert = false) => {
            stats.s.value += 10 * (revert ? -1 : 1);
            stats.t.value += 10 * (revert ? -1 : 1);
            stats.agi.value -= 5 * (revert ? -1 : 1);
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
        values: DEITIES,
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
        stats: (stats, revert = false) => {
            stats.m -= 1 * (revert ? -1 : 1);
            stats.s.value += 10 * (revert ? -1 : 1);
            stats.t.value += 10 * (revert ? -1 : 1);
            stats.agi.value -= 10 * (revert ? -1 : 1);
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
        stats: (stats, revert = false) => {
            stats.i.value += 10 * (revert ? -1 : 1);
            stats.int.value += 20 * (revert ? -1 : 1);
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
        stats: (stats, revert = false) => {
            stats.fel.value += 10 * (revert ? -1 : 1);
            stats.int.value += 10 * (revert ? -1 : 1);
            stats.i.value += 10 * (revert ? -1 : 1);
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
        stats: (stats, revert = false) => {
            stats.ws.value += 20 * (revert ? -1 : 1);
            stats.bs.value += 20 * (revert ? -1 : 1);
            stats.wp.value += 20 * (revert ? -1 : 1);
        }
    },
    {
        name: 'Ethereal',
        description: "The creature's form is insubstantial, allowing it to pass through solid objects. It can only be harmed by Magical attacks."
    },
    {
        name: 'Fast',
        description: "The creature moves unexpectedly fast. It receives +1 Movement and +10 Agility.",
        stats: (stats, revert = false) => {
            stats.m += 1 * (revert ? -1 : 1);
            stats.agi.value += 10 * (revert ? -1 : 1);
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
    {
        name: 'Hatred',
        has: ['value'],
        description: "The creature really hates the Target. See Hatred on page 190 of WFRP."
    },
    {
        name: 'Horns',
        has: ['rating', 'value'],
        description: "The creature has horns or some other sharp appendage (if its <i>Horns</i> Trait represents a different feature it will be noted in brackets). When the creature gains an Advantage for Charging, it may make a Free Attack with its Horns, performed as normal, using Rating to calculate Damage (its Strength Bonus is already included)."
    },
    {
        name: 'Hungry',
        description: "The creature is always hungry for fresh meat. If it kills or incapacitates a living opponent (or encounters a fresh body), it must pass a <b>Average (+20) Willpower</b> Test or feast, losing its next Action and Move.",
    },
    {
        name: 'Immunity',
        has: ['value'],
        description: "The creature is completely immune to a certain type of Damage, such as poison, magic, or electricity. All Damage of that type, including from a Critical Wound, is ignored.",
    },
    {
        name: 'Immunity to Psychology',
        description: "Whether brave, exceedingly stupid, or just caught up in the moment, the creature is utterly fearless. It ignores the Psychology rules.",
    },
    {
        name: 'Infected',
        description: "The creature, or its weapon, carries a nasty infection. If it causes a living opponent to lose Wounds, it must pass an <b>Easy (+40) Endurance</b> Test or contract a Festering Wound (see page 187 of WFRP).",
    },
    {
        name: 'Infestation',
        description: "The creature’s hide is infested with biting fleas or similar. All opponents suffer a penalty of –10 to hit it in melee combat as the parasites distract and overwhelm them.",
    },
    {
        name: 'Leader',
        description: "The creature is a practiced leader. It receives a bonus of +10 to Fellowship and Willpower. <b>Note:</b> this Trait cannot be taken by creatures with the <i>Bestial</i> Trait.",
        stats: (stats, revert = false) => {
            stats.fel.value += 10 * (revert ? -1 : 1);
            stats.wp.value += 10 * (revert ? -1 : 1);
        }
    },
    {
        name: 'Magical',
        description: "The creature is wreather in magic. All its attacks count as Magical, meaning it can harm creatures only susceptible to magical attacks.",
    },
    {
        name: 'Magic Resistance',
        has: ['rating'],
        description: "Magic has a reduced effect on the creature. The SL of any spell affecting it is reduced by the Rating given. So, <i>Magic Resistance 2</i> would reduce the SL by 2.",
    },
    {
        name: 'Mental Corruption',
        has: ['value'],
        description: "The creature has Chaos on the mind. Roll on the Mental Corruption table found on page 185 of WFRP.",
    },
    {
        name: 'Miracles',
        has: ['value'],
        values: DEITIES,
        description: "The creature is wreathed in magic. All its attacks count as Magical, meaning it can harm creatures only susceptible to magical attacks.",
    },
    {
        name: 'Mutation',
        has: ['value'],
        description: "The creature is 'blessed' with a Mutation. Roll on the Physical Corruption table found on page 184 of WFRP.",
    },
    {
        name: 'Night Vision',
        description: "The creature has the <i>Night Vision</i> Talent. See page 141 of WFRP.",
    },
    {
        name: 'Painless',
        description: "The creature feels no pain or can ignore it. All non-amputation penalties suffered from Critical Wounds are ignored, although Conditions are suffered as normal.",
    },
    {
        name: 'Petrifying Gaze',
        description: "The creature’s gaze can turn flesh to stone. For its Action, it can spend all its Advantage to unleash its gaze (minimum of 1). The creature performs an <b>Opposed Ballistic Skill/Initiative</b> test, adding 1 SL per Advantage spent. Its opponent gains 1 Stunned status per 2 SL by which it wins. If it wins by at least 6 SL, its target is permanently turned to stone.<br/><br/>If the target is a spellcaster, the test can be Opposed with Language (Magick) instead of Initiative as counter spells are cast.",
    },
    {
        name: 'Prejudice',
        has: ['value'],
        description: "The creature just doesn't like the Target. See page 190 of WFRP for rules on Prejudice.",
    },
    {
        name: 'Ranged',
        has: ['rating', 'value'],
        description: "The creature has a ranged weapon. The weapon does Damage equal to the Rating and the range in yards is marked in brackets",
    },
    {
        name: 'Rear',
        description: "For its Move, the creature may make a Stomp attack if its larger than its opponent (see <i>Size</i>).",
    },
    {
        name: 'Regenerate',
        description: "The creature is capable of healing at an extraordinary rate, even regrowing severed parts. At the start of each round, if it has more than 0 Wounds remaining, it will automatically regenerate 1d10 Wounds. If it has 0 Wounds remaining, it will regenerate a single Wound on a 1d10 roll of 8+. If it ever rolls a 10 for regenerating, it also fully regenerates a Critical Wound, losing all penalties and Conditions associated with it. Any Critical Wounds or Wounds caused by Fire may not be regenerated and should be recorded separately.",
    },
    {
        name: 'Size',
        has: ['value'],
        values: [
            {
                value: 'Tiny',
                description: "Butterfly, Mouse, Pigeon"
            },
            {
                value: 'Little',
                description: "Cat, Hawk, Human Baby"
            },
            {
                value: 'Small',
                description: "Giant Rat, Halfling, Human Child"
            },
            {
                value: 'Average',
                description: "Dwarf, Elf, Human"
            },
            {
                value: 'Large',
                description: "Horse, Ogre, Troll"
            },
            {
                value: 'Enormous',
                description: "Griffon, Wyvern, Manticore"
            },
            {
                value: 'Monstrous',
                description: "Dragon, Giant, Greater Daemon"
            },
        ],
        description: "" +
            "This trait represents creatures whose size differ from the game standard (i.e. roughly human sized). There are seven steps of <i>Size</i>, ranging from Tiny to Monstrous." +
            "<br/><br/>" +
            "<b>Size Combat Modifiers</b><br/>" +
            "If larger:" +
            "<ul>" +
            "<li>Its weapons gain the Damaging Quality if the creature is one step larger, and Impact if two steps or more larger.</li>" +
            "<li>It multiplies any Damage caused by the number of steps larger it is (so, 2 steps=×2, 3 steps=×3, and so on); this multiplication is calculated after all modifiers are applied.</li>" +
            "<li>All successful strikes against smaller targets activate the Deathblow rule, even if the target survives (see page 160 of WFRP).</li>" +
            "</ul>" +
            "If smaller:" +
            "<ul><li>It gains a bonus of +10 to hit.</li></ul>" +
            "<b>Defending Against Big Creatures</b><br/>" +
            "You suffer a penalty of -2 SL for each step larger your opponent is when using Melee to defend an Opposed Test. It is recommended to dodge a Giant swinging a tree, not parry it!" +
            "<br/><br/>" +
            "<b>Fear and Terror</b><br/>" +
            "If the creature is perceived to be aggressive, it causes Fear in any creature smaller than it, and Terror in any creature two or more steps smaller. The rating of the Fear or Terror equals the Size step difference. So, if the creature is Large, and its opponent is Small, it will cause Terror 2. See page 191 of WFRP." +
            "<br/><br/>" +
            "<b>Moving in Combat</b><br/>" +
            "A creature that is larger ignores the need to Disengage if it wishes to leave melee combat; instead, it brushes smaller combatants out of the way, moving where it wishes." +
            "<br/><br/>" +
            "<b>Opposed Strength</b><br/>" +
            "During <b>Opposed Strength</b> Tests (and similar), if one creature is 2 or more size steps larger, it wins automatically. If one creature is 1 size step larger, the smaller creature must roll a Critical to contest the roll. If it does, SL are compared as normal. All other results mean the larger creature wins." +
            "<br/><br/>" +
            "<b>Stomp</b><br/>" +
            "Creatures that are larger than their opponents may make one Stomp as a Free Attack, by spending 1 Advantage, as they kick downwards or otherwise bash smaller opponents out of the way. This attack has a Damage equal to their Strength Bonus +0, and uses Melee (Brawling)." +
            "<br/><br/><b>Wounds</b><br/>" +
            "Larger creatures have more Wounds.",
    },
    {
        name: 'Skittish',
        description: "The creature is easily scared by magic or loud noises. If such occurs, it receives +3 <i>Broken</i> Conditions.",
    },
    {
        name: 'Spellcaster',
        has: ['values'],
        values: [
            'Beasts',
            'Death',
            'Fire',
            'Heavens',
            'Metal',
            'Life',
            'Light',
            'Shadows',
            'Hedge',
            'Witch',
            'Daemonology',
            'Necromancy',
            'Nurgle',
            'Slaanesh',
            'Tzeentch',
        ],
        description: "The creature can cast spells; the specific Lore of Magic will be indicated in the brackets.",
    },
    {
        name: 'Stealth',
        description: "The creature is especially stealthy. It adds a number equal to its Agility Bonus to the SL of all Stealth Tests.",
    },
    {
        name: 'Stride',
        description: "The creature has a long stride, perhaps because it is a quadruped or has especially long legs. Multiply Run Movement by 1.5 when Running.",
    },
    {
        name: 'Stupid',
        description: "While not entirely devoid of self-awareness (and so lacking the Bestial trait), the creature is stupid. If it is near any allies without the <i>Stupid</i> Trait, they guide it and nothing happens. Otherwise, it must pass an <b>Easy (+40) Intelligence</b> Test at the start of each round, or become very confused. Should this occur it will drool, perhaps sitting down or picking its nose, doing little of use, losing both its Move and Action for that Turn.",
    },
    {
        name: 'Swamp-strider',
        description: "The creature is at home in a swamp. It suffers no Movement penalties for moving through boggy ground.",
    },
    {
        name: 'Swarm',
        description: "Swarms are large numbers of the same creature acting as one. The swarm counts as a single Creature that ignores the Psychology rules (see page 190 of WFRP), and can ignore the Engaged rules when using its Move. If the Swarm successfully strikes an opponent it activates the Deathblow rule (even if it has not killed its opponent — see page 160 of WFRP). All opponents Engaged with a Swarm automatically lose 1 Wound at the end of every Round as the Swarm overwhelms anything close. The Swarm has five times the Wounds of a normal example of the creature and gains +10 Weapon Skill. Any attempts to shoot the Swarm gain a bonus of +40 to hit. Swarms ignore all the <i>Size</i> Creature Trait rules.",
    },
    {
        name: 'Tail Attack',
        has: ['rating'],
        description: "The creature’s tail is capable of sweeping foes from their feet. On its turn, it may make a Free Attack by spending 1 Advantage. The Tail does Rating Damage, <i>which includes its Strength Bonus already</i>. Opponents with a smaller <i>Size</i> than the creature, that suffer any Wounds from the attack, also gain the <i>Prone</i> Condition.",
    },
    {
        name: 'Tentacles',
        has: ['#', 'rating'],
        description: "The creature has a number of tentacles equal to #. It gains one Free Attack Action per tentacle. Each tentacle’s attack does Rating Damage, <i>which includes its Strength Bonus already</i>. If it causes Damage, it can also give its opponent an <i>Entangled</i> Condition, which will initiate a Grapple between the target and that tentacle. If a tentacle is Grappling, use the tentacle’s Free Attack Action to resolve that Grapple, not the creature’s Action (see page 338 of WFRP).",
    },
    {
        name: 'Territorial',
        description: "This creature is protective of a particular area or location. It will fight to the death to protect it and will not normally pursue enemies if they flee this area.",
    },
    {
        name: 'Terror',
        has: ['rating'],
        description: "The creature supernaturally causes bone-chilling <i>Terror</i> in other creatures, at the Rating given. See page 191 of WFRP.",
    },
    {
        name: 'Trained',
        has: ['value'],
        values: [
            {
                value: 'Broken',
                description: 'The animal is trained to ignore its Bestial trait. It receives 2d10 Fellowship.',
            },
            {
                value: 'Drive',
                description: 'The animal is trained to pull a coach, cart, plough, buggy, or similar.',
            },
            {
                value: 'Entertain',
                description: 'The animal is trained to entertain others. It adds a +10 bonus to appropriate Entertain, Perform, or Play Tests.',
            },
            {
                value: 'Fetch',
                description: 'The animal is trained to fetch. This is normally reserved for Dogs and similar.',
            },
            {
                value: 'Guard',
                description: 'The animal is trained to stay in one place or prowel around as a guard, granting it the Territorial Trait.',
            },
            {
                value: 'Home',
                description: 'The animal is trained to return home if it is released or lost.',
            },
            {
                value: 'Magic',
                description: 'The animal is trained to ignore <i>Skittish</i> when it comes to magic, which is required for most horses used by Wizards.',
            },
            {
                value: 'Mount',
                description: 'The animal will accept a rider. Some creatures are especially belligerent, and will not accept a rider without the correct skill. So, to ride a Griffon, you need the Ride (Griffon) skill.',
            },
            {
                value: 'War',
                description: 'The animal is trained for war, gainin +10 Weapon Skill. It can also ignore <i>Skittish</i> for loud noises.',
            },
        ],
        description: "This trait represents animals that have been trained through the Animal Training Skill. The skills the animal knows is marked in the brackets. Feel free to create your own trained skills.",
    },
    {
        name: 'Tongue Attack',
        has: ['rating', 'value'],
        description: "The creature’s prehensile tongue can wrap itself around prey, dragging it to a grisly end. On its turn, it may make a Free Attack by spending 1 Advantage. This is a ranged attack that does Damage equal to its Rating (the range is in brackets). If the attack hits, the target receives 1 <i>Entangled</i> Condition and, if a smaller <i>Size</i>, is dragged towards the creature, and is Engaged in melee combat. The creature can then choose whether to release the target, perform a Free Attack using its <i>Weapon</i> Trait, or to keep the target wrapped in its tongue, initiating a Grapple (see page 163 of WFRP).",
    },
    {
        name: 'Tough',
        description: "The creature is more resistant to damage than normal, and unlikely to back down. It receives +10 Toughness and Willpower.",
        stats: (stats, revert = false) => {
            stats.t.value += 10 * (revert ? -1 : 1);
            stats.wp.value += 10 * (revert ? -1 : 1);
        }
    },
    {
        name: 'Tracker',
        description: "Trackers are adept at following their prey, generally through scent or hearing. They add SL equal to their Initiative Bonus to all Track Tests.",
    },
    {
        name: 'Undead',
        description: "The Undead are neither living, nor dead, meaning they are not reliant on the usual prerequisites for life: air, food, water… This Trait most commonly come into use when spells, miracles, or other abilities affect Undead only.",
    },
    {
        name: 'Unstable',
        description: "The creature’s corpus is maintained by foul magics that are inherently unstable in the material realm. Whenever it ends a Round engaged with any opponents with higher Advantage, the creature is driven back, and the magics holding it together weaken. It loses as many Wounds as the difference between its Advantage, and the highest Advantage engaged with it. So, if the creature had 1 Advantage, and its opponent had 3, the creature would lose 2 Wounds. If the creature ever reach 0 Wounds, the magics holding it in place collapse, and it ‘dies’.",
    },
    {
        name: 'Vampiric',
        description: "The creature feeds on blood and draws great physical strength from this act. Whenever it performs a successful Bite attack against an appropriate opponent, it heals as many Wounds as its opponent loses. Drinking blood in this way is the <i>only</i> way it can heal.",
    },
    {
        name: 'Venom',
        has: ['value'],
        description: "The creature’s attacks are poisoned or envenomed. When it causes Wounds, its opponent gains a <i>Poisoned</i> Condition. If no Difficulty is marked to resist the Venom, it is assumed to be Challenging. See page 169 of WFRP.",
    },
    {
        name: 'Vomit',
        description: "The creature can spew a stream of corrosive corruption, dowsing its opponents in foul, semi-digested filth. On its turn, by spending 3 Advantage, the creature can activate its Vomit as a Free Attack. The creature chooses 1 target it can see within Toughness Bonus yards and lets loose; all targets within two yards are also hit.<br/><br/>" +
            "The creature performs an <b>Opposed Ballistic Skill/Dodge</b> Test against all affected targets (its single roll opposed by each individual target). The Test is typically <b>Easy (+40)</b> for the vomiting creature, due to the close range, and <b>Challenging (+0)</b> for opponents. All losing targets suffer a hit with a Weapon Damage of the creature’s Toughness Bonus +4 and receive a <i>Stunned</i> condition.<br/><br/>" +
            "All Armour and Weapons carried by affected targets suffer 1 Damage as the acidic vomit corrodes it away",
    },
    {
        name: 'Ward',
        has: ['rating'],
        description: "Perhaps because they are magical, wear a special talisman, or are just plain lucky, some blows just seem to miss. Roll 1d10 after any blow is received, if the creature rolls Rating or higher, the blow is ignored, even if it is a critical.",
    },
    {
        name: 'Wallcrawler',
        description: "The creature can effortlessly scale vertical surfaces and even traverse ceilings, ready to drop on unwary prey. It moves at full Movement across any appropriate surface and automatically passes all Climb tests.",
    },
    {
        name: 'Weapon',
        has: ['rating', 'value'],
        description: "The creature carries a melee weapon, or uses teeth, claws, or similar in combat.<br/><br/>" +
            "The weapon causes Damage equal to its Rating which <i>already includes the creature’s Strength Bonus</i>. Typically it will be 4 + its Strength Bonus (representing a Hand Weapon).",
    },
    {
        name: 'Web',
        has: ['rating'],
        description: "The creature can create webbing to trap unwary foes. Whenever it successfully hits, opponents gain 1 <i>Entangled</i> status, with a Strength of the Rating given. See page 168 of WFRP.",
    },
];

export default Object.freeze({
        getTrait(name) {
            return TRAITS.find(trait => trait.name === name);
        },
        TRAITS: TRAITS,
    }
)