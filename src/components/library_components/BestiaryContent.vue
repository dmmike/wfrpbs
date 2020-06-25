<template>
    <div id="bestiary-content">
        <div id="list">
            <div id="filters">
                <div :style="'width:' + (npcs ? '80%' : '100%')">
                    <input id="search-bar" type="search" v-model="filter" placeholder="Type to filter by name">
                </div>
                <select id="unique-filter" v-if="npcs" v-model="uniqueFilter">
                    <option :value="null">All</option>
                    <option :value="true">Unique</option>
                    <option :value="false">Non-unique</option>
                </select>
            </div>
            <ul id="bestiary">
                <li :class="index%2 === 0 ? 'odd-row' : 'even-row'" v-for="(combatant, index) in filteredBestiary" :key="index">
                    <v-tooltip open-delay="500" right>
                        <template v-slot:activator="{ on, attrs }">
                            <span class="combatant-line" style="width:100%" v-bind="attrs" v-on="on" @mouseenter="hover = index" @click="addCombatant(combatant)">
                                <span>{{combatant.name}}</span>
                                <span v-if="hover === index" class="combatant-options">
                                    <font-awesome-icon icon="copy" @click.stop="edit(combatant.copy())"/>
                                    <font-awesome-icon icon="feather-alt" @click.stop="edit(combatant)"/>
                                </span>
                            </span>
                        </template>
                        <combatant-view style="color:black" :combatant="combatant.clone()" :edit="false"></combatant-view>
                    </v-tooltip>
                </li>
            </ul>
        </div>
        <div id="button-row">
            <button id="add-combatant" @click="newCharacter">+ Add New</button>
        </div>
    </div>
</template>

<script>
    import CombatantView from "@/components/CombatantView";
    import {mapMutations} from "vuex";

    export default {
        name: "BestiaryContent",
        components: {CombatantView},
        props: {
            bestiary: Object,
            npcs: Boolean,
        },
        data() {
            return {
                filter: '',
                hover: null,
                uniqueFilter: null,
            }
        },
        computed: {
            filteredBestiary() {
                return Object.values(this.bestiary)
                    //Filter based on string search
                    .filter(c => this.filter === '' || c.name.toLowerCase().includes(this.filter.toLowerCase()))
                    //Filter based on uniqueness
                    .filter(c => this.uniqueFilter === null || c.isUnique === this.uniqueFilter)
                    .sort((a, b) => {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
            }
        },
        methods: {
            ...mapMutations(['addCombatant']),
            isOddRow(id) {
                return Object.keys(this.filteredBestiary).findIndex(key => key === id )%2;
            },
            edit(combatant) {
                this.$root.$emit('edit-combatant', combatant);
            },
            newCharacter() {
                this.$root.$emit('new-combatant', this.npcs ? 'npc' : 'character');
            },
            addToCombat(combatant) {
                this.$root.$emit('add-to-combat', combatant);
            },
        }
    }
</script>

<style scoped>
    #bestiary-content {
        width: 100%;
        max-height: 100%;
    }

    #bestiary {
        margin-top: 1vh;
        display: block;
        list-style-type: disc;
        padding-inline-start: 0;
    }

    #bestiary li {
        border-top: 2px solid black;
        padding-left: 6px;
        height: 1.7em;
        list-style-type: none;
        display: flex;
        overflow-x: hidden;
    }

    #list {
        height: calc(100vh - 30px - 1vh - 5vh - 20vh);
    }

    #button-row {
        height: 30px;
    }

    #add-combatant {
        float: right;
    }

    .combatant-options {
        float:right;
        margin-right: 10px
    }

    .combatant-options * {
        margin-left: 10px;
    }

    #search-bar {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        border: solid black 1px;
    }

    #unique-filter {
        padding-left: 5px;
        width:20%;
        background-color: rgba(255, 255, 255, 0.8);
        border: solid black 1px;
        -webkit-appearance: menulist;
    }

    #filters {
        display:flex;
    }
</style>