import Roller from "@/classes/Roller";
import Stats from "@/classes/Stats";

function getId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export class Combatant {
    constructor(name, stats, traits = [], talents = [], skills = []) {
        this.id = getId();
        this.name = name;

        this.stats = stats;
        Object.defineProperty(this.stats, 'w', {get: () => {return this.determineWounds(this.traits, this.talents)}});

        this.initiativeBonus = initiativeBonus;
        this.conditions = [];
        this.criticalWounds = [];
        this.currentWounds = this.stats.w;
        this.advantage = 0;
        this.advantageMax = this.stats.i.b;
        this.extendedTests = [];
        this.traits = traits;
        this.skills = skills;
        this.talents = talents;
    }

    get size() {
        let size = this.traits.find(trait => {
            return trait.name = 'Size';
        });

        switch(size) {
            case 'Tiny':
                return 0;
            case 'Little':
                return 1;
            case 'Small':
                return 2;
            case 'Large':
                return 4;
            case 'Enormous':
                return 5;
            case 'Monstrous':
                return 6;
            default:
                return 3;
        }
    }

    determineWounds(traits, talents) {
        let s = this.stats.s.b,
            t = this.stats.t.b,
            wp = this.stats.wp.b,
            size = this.size,
            hardy = 0,
            swarmMod = 1;

        if (traits !== undefined) {
            if (traits.find(trait => trait.name.toLowerCase() === 'construct')) {
                // Constructs use Strength Bonus instead of Willpower Bonus
                wp = s;
            }

            if (traits.find(trait => trait.name.toLowerCase() === 'swarm')) {
                swarmMod = 5;
            }

            hardy += traits.filter(trait => trait.name.toLowerCase() === 'hardy').length;
        }
        if (talents !== undefined) {
            let hardyTalent = talents.find(talent => talent.name.toLowerCase() === 'hardy');
            if (hardyTalent) {
                hardy += hardyTalent.count;
            }
        }

        return ((hardy * t) +
            (Math.floor(size / 3) >= 1 ? 1 : 0) * s +
            Math.min(size, 2) * t +
            (Math.floor(size / 2) >= 1 ? 1 : 0) * wp
        ) * Math.pow(2, Math.max(size - 3, 0)) * swarmMod;
    }

    getInitiative(type) {
        switch (type) {
            case 'test':
                // Returns an object
                return this.stats.i.dramaticTest(this.initiativeBonus);
            case 'init':
                // Returns a number
                return Roller.d10() + (this.stats.i + this.initiativeBonus);
            case 'bonus':
                // Returns a number
                return Roller.d10() + this.stats.i.b + this.stats.agi.b + Math.floor(this.initiativeBonus / 10);
            default:
                // Returns a number
                return this.initiativeBonus + this.stats.i.value + this.stats.agi.value/100;
        }
    }
}

export class Character extends Combatant {
    constructor(
        name = 'New character',
        stats = new Stats(),
        armour = {},
        initiativeBonus = 0
    ) {
        super(name, stats, initiativeBonus);
        this.armour = armour;
    }
}

export class NPC extends Combatant {
    constructor(
        name = 'New creature',
        stats = new Stats(),
        skills = [],
        traits = [],
        talents = [],
        is_unique = false
    ) {
        super(name, stats, traits, talents, skills);
        this.is_unique = is_unique;
    }

    get armour() {
        let trait = this.traits.find(trait => trait.toLowerCase().includes('armour'));
        if (trait) {
            return Number.parseInt(trait.match(/\((\d+)\)/)[1]);
        } else {
            return 0;
        }
    }

    static revive(data) {
        let npc = new NPC(
            data.name,
            Stats.revive(data.stats),
            data.skills,
            data.traits,
            data.talents,
            data.is_unique
        );

        npc.id = data.id;
        return npc;
    }
}