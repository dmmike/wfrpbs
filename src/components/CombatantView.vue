<template>
    <div id="combatant-view">
        <h3 class="combatant-name" :class="{editable: edit}">
            <input :disabled="!edit" type="text" v-model="combatant.name">
        </h3>
        <table class="stats-table">
            <tbody>
            <tr>
                <th>M</th>
                <th v-for="stat in stats">{{stat}}</th>
                <th>W</th>
            </tr>
            <tr>
                <td :class="{editable: edit}"><input :disabled="!edit" type="text" @keypress="isNumber($event)" v-model.number="st.m"></td>
                <td :class="{editable: edit}" v-for="stat in stats">
                    <input :disabled="!edit" type="text" @keypress="isNumber($event)"
                           v-model.number="st[stat.toLowerCase()].value">
                </td>
                <td>{{st.w}}</td>
            </tr>
            </tbody>
        </table>

        <div v-if="skills.length">
            <strong>Skills: </strong>
            <span :class="{editable: edit}" v-for="(skill, index) in skills" @click="skillClicked(skill.name, $event)">
                    <v-tooltip bottom open-delay="1000" max-width="800px">
                        <template v-slot:activator="{ onView, attrsView }">
                            <span v-on="onView" v-bind="attrsView">
                                <span>{{skill.name}}</span>
                                <span>&nbsp;(<input class="inline-input" :disabled="!edit" type="text"
                                                    @click="skillClicked(skill.name, $event)"
                                                    @keypress="isNumber($event)" v-model.number="skill.skill">)</span>
                                <span v-if="skills[index +1]">, </span>
                            </span>
                        </template>
                        <template v-slot:default>
                            CTRL + Click or ALT + Click to remove, or alter score directly
                        </template>
                    </v-tooltip>
                </span>
        </div>
        <div v-if="talents.length">
            <strong>Talents: </strong>
<!--            <span v-for="(talent, index) in talents" :key="index"></span>-->
        </div>
        <div v-if="traits.length">
            <strong>Traits: </strong>
            <trait-display v-for="(trait, index) in traits"
                           :key="trait.name"
                           :edit="edit"
                           :index="index"
                           :trait-data="trait"
                           :all-traits="traits"
                           @save="updateTrait"
                           @removeTrait="removeTrait"
                           @removeAll="removeAll"/>
        </div>

        <label v-if="edit && isNPC">Unique NPC: <input type="checkbox" v-model="combatant.is_unique"></label>
        <div id="edit-buttons" v-if="edit">
            <v-menu offset-y offset-overflow :close-on-content-click="false" attach="#edit-buttons"
                    content-class="drop-menu">
                <template v-slot:activator="{on, attrs}">
                    <button type="button" v-bind="attrs" v-on="on" class="npc-button">+skill</button>
                </template>
                <template>
                    <label><strong>Name:</strong><input type="text" v-model="skillName"></label>
                    <label><strong>Score:</strong><input type="text" @keypress="isNumber($event)" v-model="skillScore"></label>
                    <button style="width:100%" @click="addSkill" :disabled="invalidSkill">Save</button>
                </template>
            </v-menu>
            <v-menu offset-y offset-overflow nudge-left="270%" :close-on-content-click="false" content-class="drop-menu">
                <template v-slot:activator="{on, attrs}">
                    <button type="button" v-bind="attrs" v-on="on" class="npc-button" @click="traitFilter = ''">+trait</button>
                </template>
                <template>
                    <input type="search" v-model="traitFilter" class="trait-filter" placeholder="Type to filter by name and description">
                    <ul style="" class="trait-list">
                        <li :id="'trait' + trait.name" v-for="trait in filteredTraits" :key="trait.name">
                            <v-tooltip bottom open-delay="800" max-width="80%">
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" @click="addTrait(trait)">{{trait.name}}</span>
                                </template>
                                <span v-html="trait.description"></span>
                            </v-tooltip>
                        </li>
                    </ul>
                </template>
            </v-menu>
        </div>
    </div>
</template>

<script>
    import Dropdown from 'bp-vuejs-dropdown';
    import TraitsAndTalents from "@/classes/TraitsAndTalents";
    import TraitDisplay from "@/components/TraitDisplay";
    import {mapGetters} from "vuex";

    export default {
        name: "CombatantView",
        components: {
            TraitDisplay,
            Dropdown,
        },
        props: {
            combatant: Object,
            edit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                skillName: '',
                skillScore: 30,
                stats: ['WS', 'BS', 'S', 'T', 'I', 'Agi', 'Dex', 'Int', 'WP', 'Fel'],
                traitFilter: '',
                traitEdit: {},
            }
        },
        computed: {
            ...mapGetters(['allTraits']),
            st() {
                return this.combatant.stats;
            },
            skills() {
                return _.cloneDeep(this.combatant.skills).sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            },
            traits() {
                let traitsByName = {};
                _.cloneDeep(this.combatant.traits).forEach(trait => {
                    if (!traitsByName[trait.name]) {
                        trait.count = 1;
                        traitsByName[trait.name] = trait;
                    } else {
                        traitsByName[trait.name].count++
                    }
                });

                return Object.values(traitsByName).sort((a, b) => a.name.localeCompare(b.name));
            },
            talents() {
                return _.cloneDeep(this.combatant.talents).sort();
            },
            isNPC() {
                return this.combatant instanceof this.$NPC;
            },
            filteredTraits() {
                return _.cloneDeep(this.allTraits).filter(trait => {
                    let filter = this.traitFilter === '' || (trait.name.toLowerCase().includes(this.traitFilter.toLowerCase()) || trait.description.toLowerCase().includes(this.traitFilter.toLowerCase())),
                        available = trait.multi === true || !this.traits.some(tr => tr.name === trait.name);
                    return filter && available;

                });
            },
            invalidSkill() {
                return !this.skillName || !this.skillScore || this.combatant.skills.findIndex(sk => sk.name.toLowerCase() === this.skillName.toLowerCase()) !== -1
            }
        },
        methods: {
            isNumber(evt) {
                let charCode = (evt.which) ? evt.which : evt.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 45) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },
            addSkill() {
                if (this.invalidSkill) return;
                this.combatant.skills.push({name: this.skillName, skill: this.skillScore});
                this.resetSkill();
            },
            resetSkill() {
                this.skillName = '';
                this.skillScore = 30;
            },
            removeTrait(trait) {
                let raw = TraitsAndTalents.getTrait(trait);
                if (raw.stats) {
                    raw.stats(this.combatant.stats, true);
                }
                this.combatant.traits.splice(this.findTraitIndex(trait), 1);
            },
            removeAll(trait) {
                let count = this.traits.find(t => t.name.toLowerCase() === trait.toLowerCase()).count;
                let raw = TraitsAndTalents.getTrait(trait);
                if (raw.stats) {
                    while (count > 0) {
                        raw.stats(this.combatant.stats, true);
                        count--;
                    }
                }
                this.$set(this.combatant, 'traits', this.combatant.traits.filter(t => t.name.toLowerCase() !== trait.toLowerCase()));
            },
            addTrait(trait) {
                let raw = TraitsAndTalents.getTrait(trait.name);
                let index = this.findTraitIndex(trait.name);
                if (!raw.multi && index > -1) return;

                if (raw.stats) {
                    raw.stats(this.combatant.stats);
                }

                if (index !== -1 || !raw.has) {
                    this.combatant.traits.push({name: trait.name.valueOf()});
                } else {
                    this.combatant.traits.push({name: trait.name.valueOf(), is_create: true});
                }
            },
            updateTrait(newData) {
                this.$set(this.combatant.traits, this.findTraitIndex(newData.name), newData);
            },
            findTraitIndex(name) {
                return this.combatant.traits.findIndex(trait => trait.name.toLowerCase() === name.toLowerCase());
            },
            skillClicked(skill, event) {
                if (event.ctrlKey || event.altKey) {
                    this.combatant.skills.splice(this.combatant.skills.findIndex(sk => sk.name.toLowerCase() === skill.toLowerCase()), 1);
                }
            },
        }
    }
</script>

<style scoped>
    #combatant-view {
        max-width: 400px;
        padding: 15px;
        background-image: url('~@/assets/background-stats.png');
        background-size: 100% 100%;
        --webkit-filter: drop-shadow(12px 12px 25px rgba(0, 0, 0, 0.5));
    }

    .combatant-name {
        font-family: headerfont;
        font-weight: bold;
    }

    .combatant-name input {
        text-align: center;
        width: 100%;
    }

    .stats-table {
        text-align: center;
        margin-bottom: 0.5em;
        border-collapse: collapse;
    }

    tr:last-child {
        border-bottom: hidden;
    }

    td, th {
        border: solid 1px black;
        width: calc(100% / 12);
    }

    tr {
        border-left: hidden;
        border-right: hidden;
    }

    td:not(.editable), th, .combatant-name:not(.editable) {
        cursor: default;
    }

    td.editable {
        cursor: text;
    }

    span.editable {
        cursor: pointer;
    }

    .npc-button {
        width: 33%;
        display: inline-block;
        text-align: center;
    }

    .stats-table input {
        all: unset;
        width: 100%;
    }

    .inline-input {
        width: 1.1em;
        display: inline-block;
        text-align: center;
    }

    #edit-buttons {
        display:flex;
    }
</style>

<style>
    .drop-menu {
        overflow: hidden;
        box-shadow: none !important;
        background-color: transparent;
        background-image: url('~@/assets/background-columns.png');
        background-size: 100% 100%;
        padding: 15px;
        min-width: 300px;
        min-height: 240px;
    }

    .drop-menu label {
        display:block;
    }
    .drop-menu label input {
        margin-left: 10px;
        display:inline-block;
        width:auto;
    }

    .drop-menu .trait-list {
        columns: 5;
        -webkit-columns: 5;
        -moz-columns: 5;
        list-style-type: disc;
    }

    .drop-menu li {
        list-style-type: none;
        overflow-x: hidden;
    }

    .drop-menu .trait-filter {
        width:100%;
        margin-bottom: 10px;
    }

    .edit-tooltip {
        text-align: center;
        margin-bottom: 10px;
        text-transform: uppercase;
    }

    .editable {
        color: dodgerblue;
    }
</style>