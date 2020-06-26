// import Roller from "@/classes/Roller";

// WHEN SKILL, FOLLOWING RESULT
// result(combatant, modifier) {
//     let skill = combatant.skills.find(skill => skill.name.lowerCase() === 'heal');
//     let target = skill ? skill.skill : combatant.stats.int.value;
//     let result = Roller.dramaticTest(target, modifier);
//     return result.success ? result.successLevels + 1 : 0;
// }

export default {
    ablaze: {
        description: "<p>You are on fire! This Condition is normally only applied if you are flammable — for example: wearing clothes that can be set alight — but some magical and divine effects can set you alight even if you are not normally combustible!</p>" +
            "<p>At the end of every Round, you suffer 1d10 Wounds, modified by Toughness Bonus and the Armour Points on the least protected Hit Location, with a minimum of 1 Wound suffered. Each extra <i>Ablaze</i> Condition you have adds +1 to the Damage suffered; so, three <i>Ablaze</i> Conditions result in 1d10+2 Damage suffered.</p>" +
            "<p>One <i>Ablaze</i> Condition can be removed with a successful Athletics Test, with each SL removing an extra <i>Ablaze</i> Condition. The Difficulty for this Test is modified by circumstances: it’s much easier to put out a fire rolling around on sand than it is in the middle of an oil-soaked kitchen.</p>",
        summary: count => '1d10' + (count>1 ? '+' + count : '') + ' damage at end of round',
        // duringTurn(combatant, count) {
        //     return {
        //         remove: [
        //             {
        //                 type: 'skill',
        //                 skill: {name: 'athletics', stat: 'ag'},
        //                 modifier: '?'
        //             }
        //         ]
        //     }
        // },
        // endOfRound(combatant, count) {
        //     let damage = Roller.d10() + count -1;
        //     return {
        //         type: 'effect',
        //         text: 'Suffer ' + damage + ' damage, reduced by ' + combatant.stats.t.b + ' (TB) and Armour Points of the least protected hit location (minimum 1 damage).',
        //         damage: damage,
        //     }
        // },
    },
    bleeding: {
        description: "<p>You are bleeding badly. Lose 1 Wound at the end of every Round, ignoring all modifiers. Further, suffer a penalty of –10 to any Tests to resist Festering Wounds, Minor Infection, or Blood Rot (see page 186 of WFRP). If you reach 0 Wounds, you no longer lose Wounds and instead fall immediately unconscious (gain the <i>Unconscious</i> Condition). At the end of Round, you have a 10% chance of dying per <i>Bleeding</i> Condition you have; so, if you had 3 <i>Bleeding</i> Conditions, you would die from blood loss on a roll of 0–30. If a double is scored on this roll, your wound clots a little: lose 1 <i>Bleeding</i> Condition. You cannot regain consciousness until all <i>Bleeding</i> Conditions are removed (see <strong>Injury</strong> on page 172 WFRP).</p>" +
            "<p>A <i>Bleeding</i> Condition can be removed with: a successful Heal Test, with each SL removing an extra <i>Bleeding</i> Condition; or with any spell or prayer that heals Wounds, with one Condition removed per Wound healed.</p>" +
            "<p>Once all <i>Bleeding</i> Conditions are removed, gain one <i>Fatigued</i> Condition.</p>",
        summary: count => count + ' damage at end of round ignoring modifiers, -' + count*10 +' penalty to Tests to resist Festering Wounds, Minor Infection, or Blood Rot. <i>Unconscious</i> when reduced to 0, ' + count*10 + '% to die when unconscious.',
        penalties: count => {return {infest: -count*10}},
        // endOfRound(combatant, count) {
        //     if (combatant.currentWounds > 0) {
        //         return {
        //             type: 'effect',
        //             text: 'Suffer ' + count + ' damage',
        //             damage: count,
        //         }
        //     } else {
        //         return {
        //             type: 'effect',
        //             text: 'There is a ' + count * 10 + '% chance you die from blood loss.',
        //             die: Roller.d100() <= count * 10,
        //         }
        //     }
        // },
        // always: {
        //     remove: [
        //         {
        //             type: 'skill',
        //             skill: {name: 'heal', stat: 'int'},
        //             modifier: '?'
        //         },
        //         {
        //             type: 'static',
        //             text: 'Remove one <i>Bleeding</i> Condition per Wound healed by any spell or prayer.',
        //         },
        //     ],
        // },
        // fatigueOnRemove: true,
    },
    blinded: {
        description: "<p>Perhaps because of a flash of light, or because of liquid sprayed in your face, you are unable to see properly. You suffer a –10 penalty to all Tests involving sight, and any opponent attacking you in close combat gains a bonus of +10 to hit you.</p>" +
            "<p>One <i>Blinded</i> Condition is removed at the end of every other Round.</p>",
        summary: count =>  -10*count + ' to all Tests involving sight, melee attacks against you have ' + count*10 + ' bonus.',
        penalties: count => {return{sight: -10*count, melee: 10*count}},
        // endOfRound(combatant, count) {
        //     return {
        //         type: 'remove',
        //         remove: {type: 'automatic', result(){return 0.5}},
        //     }
        // },
    },
    broken: {
        description: "<p>You are terrified, defeated, panicked, or otherwise convinced you are going to die. On your turn, your Move and Action must be used to run away as fast as possible until you are in a good hiding place beyond the sight of any enemy; then you can use your Action on a Skill that allows you to hide more effectively. You also receive a penalty of –10 to all Tests not involving running and hiding.</p>" +
            "<p>You cannot Test to rally from being Broken if you are Engaged with an enemy (see page 159). If you are unengaged, at the end of each Round, you may attempt a Cool Test to remove a <i>Broken</i> Condition, with each SL removing an extra <i>Broken</i> Condition, and the Difficulty determined by the circumstances you currently find yourself: it is much easier to rally when hiding behind a barrel down an alleyway far from danger (Average +20) than it is when three steps from a slavering Daemon screaming for your blood (Very Hard –30).</p>" +
            "<p>If you spend a full Round in hiding out of line-of-sight of any enemy, you remove 1 <i>Broken</i> Condition.</p>" +
            "<p>Once all <i>Broken</i> Conditions are removed, gain 1 <i>Fatigued</i> Condition</p>",
        summary: 'Must flee, ' + -10*count + ' penalty to all Tests not running/hiding.',
        penalties: count => {return{flee: -10*count}},
        // endOfRound(combatant, count) {
        //     return {
        //         type: 'remove',
        //         remove: {
        //             type: 'skill',
        //             text: 'Can only attempt this check if you are unengaged',
        //             skill: {name: 'cool', stat: 'wp'},
        //             modifier: '?'
        //         }
        //     }
        // },
        // fatigueOnRemove: true,
    },
    deafened: {
        description: "<p>Whether caused by a loud noise or a blow to the head, you are unable to hear properly. You suffer a –10 penalty to all Tests involving hearing, and any opponent attacking you in close combat from the flank or rear gains an extra bonus of +10 to hit you (this bonus does not increase with multiple <i>Deafened</i> Conditions). One <i>Deafened</i> condition is removed at the end of every other Round and is often replaced with tinnitus.</p>",
        summary: -10*count + ' to all Tests involving hearing, melee attacks against you from flank or rear have ' + count*10 + 'bonus.',
        penalties: count => {return{hearing: -10*count, flank: 10*count}}
        // endOfRound(combatant, count) {
        //     return {
        //         type: 'remove',
        //         remove: {type: 'automatic', result(){return 0.5}},
        //     }
        // },
    },
    entangled: {
        description: "<p>You are wrapped in something restricting your movement; it could be ropes, spider’s webbing, or an opponent’s bulging biceps. On your turn, you may not Move, and all your actions involving movement of any kind suffer a penalty of –10 (including Grappling; see page 163 WFRP). For your Action, you can remove an <i>Entangled</i> Condition if you win an <strong>Opposed Strength</strong> Test against the source of the entanglement, with each SL removing an extra <i>Entangled</i> Condition.</p>",
        summary: count =>  'May not Move, actions involving movement at ' + -10*count + '.',
        penalties: count => {return{movement: -10*count}},
        // duringTurn(combatant, count) {
        //     return {
        //         remove: [
        //             {
        //                 type: 'opposed',
        //                 skill: 's',
        //                 modifier: '?'
        //             }
        //         ]
        //     }
        // },
    },
    fatigued: {
        description: "<p>You are exhausted or stressed, and certainly in need of rest. You suffer a –10 penalty to all Tests. Removing a <i>Fatigued</i> Condition normally requires rest, a spell, or a divine effect, though in some instances, such as when a <i>Fatigued</i> Condition is caused by carrying too much (see <strong>Encumbrance</strong> on page 293 WFRP), simply changing your circumstances (carrying fewer trappings, for example) can remove a Condition.</p>",
        summary: count => -10*count + ' to all Tests.',
        penalties: count => {return {all: -10*count}},
    },
    poisoned: {
        description: "<p>You have been poisoned or injected with venom. All Tests to remove poison have their difficulty determined by the poison or venom suffered. At the end of each Round, lose 1 Wound, ignoring all modifiers. Also, suffer a penalty of –10 to all Tests.</p>" +
            "<p>If you reach 0 Wounds when <i>Poisoned</i>, you cannot heal any Wounds until all <i>Poisoned</i> conditions are removed. If you fall Unconscious when <i>Poisoned</i>, make an <strong>Endurance</strong> Test after a number of Rounds equal to your Toughness Bonus or die horribly. See Injury on page 172 WFRP for more on this.</p>" +
            "<p>At the end of each Round, you may attempt an <strong>Endurance</strong> Test. If successful, remove a <i>Poisoned</i> Condition, with each SL removing an extra <i>Poisoned</i> Condition. A <strong>Heal</strong> Test provides the same results. Once all <i>Poisoned</i> Conditions are removed, gain 1 <i>Fatigued</i> Condition.</p>",
        summary: count =>  count + ' damage ignoring wounds, ' + -10*count + ' to all Tests. When at 0 Wounds, cannot heal. When unconscious, possible death.',
        penalties: count => {return {all: -10*count}},
        // fatigueOnRemove: true,
    },
    prone: {
        description: "<p>You have fallen to the ground, possibly because you have run out of Wounds, you’ve tripped, or because you’ve been hit by something rather large. On your turn, your Move can only be used to stand up or crawl at half your Movement in yards (note: if you have 0 Wounds remaining, you can only crawl). You suffer a –20 penalty to all Tests involving movement of any kind, and any opponent trying to strike you in Melee Combat gains +20 to hit you.</p>" +
            "<p>Unlike most other conditions, <i>Prone</i> does not stack — you are either <i>Prone</i>, or you are not. You lose the <i>Prone</i> Condition when you stand up.</p>",
        summary: count =>  "Can crawl or stand up. -20 penalty to all movement. Melee attacks gain +20 to hit you.",
        penalties: count => {return {movement: -20, melee: 20}},
        stackable: false
    },
    stunned: {
        description: "<p>You have been struck about the head or otherwise disorientated or confused; your ears are likely ringing, and little makes sense.</p>" +
            "<p>You are incapable of taking an Action on your turn but are capable of half your normal movement. You can defend yourself in opposed Tests — but not with Language (Magick). You also suffer a –10 penalty to all Tests. If you have any <i>Stunned</i> Conditions, any opponent trying to strike you in Melee Combat gains +1 Advantage before rolling the attack.</p>" +
            "<p>At the end of each Round, you may attempt a <strong>Challenging (+0) Endurance</strong> Test. If successful, remove a <i>Stunned</i> Condition, with each SL removing an extra <i>Stunned</i> Condition.</p>",
        summary: count =>  'No Action, half movement. ' + -10*count + ' to all Tests. Melee attacks gain +1 Advantage before rolling.',
        penalties: count => {return {all: -10*count}},
    },
    surprised: {
        description: "<p>You have been caught unawares and you aren’t at all ready for what’s about to hit you. You can take no Action or Move on your turn and cannot defend yourself in opposed Tests. Any opponent trying to strike you in Melee Combat gains a bonus of +20 to hit.</p>" +
            "<p>The <i>Surprised</i> Condition does not stack, so you do not collect multiple <i>Surprised</i> Conditions, even should you be technically surprised multiple times in a Round.</p>" +
            "<p>At the end of each Round, or after the first attempt to attack you, you lose the <i>Surprised</i> Condition.</p>",
        summary: count =>  "Cannot take Action or Move, cannot defend in opposed Tests. Melee attacks get +20 bonus. Attacks gain +1 advantage before rolling.",
        penalties: count => {return{melee: 20}},
        stackable: false
    },
    unconscious: {
        description: "<p>You are knocked out, asleep, or otherwise insensible. You can do nothing on your turn and are completely unaware of your surroundings. An attacker targeting you gains the benefit of the I Will Not Fail rule on page 171 WFRP without having to spend a Resilience point. Or, if the GM prefers, any close combat hit simply kills you. Any ranged combat hit automatically does the same if the shooter is at Point Blank range.</p>" +
            "<p>The <i>Unconscious</i> Condition does not stack — you are either <i>Unconscious</i>, or you are not — so you do not collect multiple <i>Unconscious</i> Conditions.</p>" +
            "<p>Recovering from unconsciousness requires different circumstances depending upon why you fell unconscious. Refer to Injury on page 172 WFRP for more on this. If you spend a Resolve point to remove an <i>Unconscious</i> condition, but have not resolved the cause of the incapacitation, you gain another <i>Unconscious</i> Condition at the end of the round. When you lose the <i>Unconscious</i> Condition, you gain the <i>Prone</i> and <i>Fatigued</i> Conditions.</p>",
        summary: count => 'No Action or Movement, attacks automatically hit you.',
        penalties: count => {},
    },
}