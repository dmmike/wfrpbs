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
                <td :class="{editable: edit}"><input :disabled="!edit" type="text" @keypress="isNumber($event)"
                                                     v-model="st.m"></td>
                <td :class="{editable: edit}" v-for="stat in stats">
                    <input :disabled="!edit" type="text" @keypress="isNumber($event)"
                           v-model="st[stat.toLowerCase()].value">
                </td>
                <td>{{st.w}}</td>
            </tr>
            </tbody>
        </table>

        <div v-if="isCharacter">
            <div v-if="talents.length">
                <strong>Talents: </strong>
                <span v-for="(talent, index) in talents" :key="index">
                    <span :class="{editable: edit}" :contenteditable="edit">{{talent}} </span>
                    <span v-if="edit" @click="removeTalent(index)">x</span>
                    <span v-if="talents[index +1]">, </span>
                </span>
            </div>
        </div>

        <div class="block" v-else>
            <div v-if="skills.length">
                <strong>Skills: </strong>
                <span v-for="(skill, index) in skills" :key="index">
                </span>
            </div>
            <div v-if="talents.length">
                <strong>Talents: </strong>
                <span v-for="(talent, index) in talents" :key="index"></span>
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
                />
            </div>

            <div id="npc-buttons" v-if="edit" style="display:flex">
                <dropdown class="npc-button" :class-name="'npc-button'" @click="resetSkill">
                    <template slot="btn" style="text-align:center">+skill</template>
                    <template slot="body">
                        <label>Name: <input type="text" v-model="skillName"></label>
                        <label>Score: <input type="text" @keypress="isNumber($event)" v-model="skillScore"></label>
                        <button style="width:100%" @click="addSkill">opslaan</button>
                    </template>
                </dropdown>
                <dropdown class="npc-button" :class-name="'npc-button'">
                    <template slot="btn">+talent</template>
                    <template slot="body">

                    </template>
                </dropdown>
                <dropdown class="npc-button" :class-name="'npc-button'" :x="-200">
                    <template slot="btn">+trait</template>
                    <template slot="body">
                        <input type="search" v-model="traitFilter" style="width:100%;">
                        <ul style="columns:4;-webkit-columns: 4;-moz-columns: 4;">
                            <li :id="'trait' + trait.name" v-for="trait in filteredTraits" :key="trait.name"
                                @click="addTrait(trait)">
                                <v-tooltip bottom open-delay="500" max-width="500px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs"
                                              v-on="on"
                                        >{{trait.name}}</span>
                                    </template>
                                    <span v-html="trait.description"></span>
                                </v-tooltip>
                            </li>
                        </ul>
                    </template>
                </dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import {Character, Combatant} from "@/classes/Combatant";
    import Dropdown from 'bp-vuejs-dropdown';
    import TraitsAndTalents from "@/classes/TraitsAndTalents";
    import TraitDisplay from "@/components/TraitDisplay";

    export default {
        name: "CombatantView",
        components: {
            TraitDisplay,
            Dropdown,
        },
        props: {
            combatant: Combatant,
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
                traitOptions: TraitsAndTalents.TRAITS,
                traitFilter: '',
                traitEdit: {},
            }
        },
        computed: {
            st() {
                return this.combatant.stats;
            },
            skills() {
                if (this.isCharacter) return [];
                return this.combatant.skills.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            },
            traits() {
                if (this.isCharacter) return [];
                let traitsByName = {};
                _.clone(this.combatant.traits).forEach(trait => {
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
                if (this.isCharacter) return [];
                return this.combatant.talents.sort();
            },
            isCharacter() {
                return this.combatant instanceof Character;
            },
            filteredTraits() {
                return this.traitOptions.filter(trait => {
                    let filter = this.traitFilter === '' || (trait.name.toLowerCase().includes(this.traitFilter.toLowerCase()) || trait.description.toLowerCase().includes(this.traitFilter.toLowerCase())),
                        available = trait.multi === true || !this.traits.some(tr => tr.name === trait.name);
                    return filter && available;

                });
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
                this.combatant.skills.push({name: this.skillName, skill: this.skillScore});
                this.resetSkill();
            },
            resetSkill() {
                this.skillName = '';
                this.skillScore = 30;
            },
            removeTrait(index) {
                this.combatant.traits.splice(index, 1);
            },
            addTrait(trait, value, rating) {
                this.combatant.traits.push({name: trait.name, value: value, rating: rating});
            },
            updateTrait(newData) {
                let index = this.combatant.traits.findIndex(trait => trait.name === newData.name);
                this.$set(this.combatant.traits, index, newData);
            }
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
        text-align: center;
        font-family: headerfont;
        font-weight: bold;
    }

    .stats-table {
        text-align: center;
        margin-bottom: 0.5em;
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
    }

    input {
        all: unset;
        width: 100%;
    }

</style>

<style>
    .npc-button-bp__btn {
        display: inline-block;
        width: 100%;
        text-align: center;
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