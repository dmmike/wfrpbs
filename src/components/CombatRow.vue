<template>
    <tr @click="combatantClicked">
<!--        Initiative-->
        <td class="center">{{formattedInitiative}}</td>

<!--        Combatant-->
        <td style="overflow: hidden">{{combatant.name}} <template v-if="showNo">{{combatant.no}}</template></td>

<!--        Wounds-->
        <v-menu offset-y offset-overflow :close-on-content-click="false" content-class="wounds-menu" v-model="wound">
            <template v-slot:activator="{on, attrs}">
                <td class="center clickable" @click="openDamage" v-bind="attrs" v-on="on">{{combatant.currentWounds}} / {{combatant.stats.w}}</td>
            </template>
            <div style="display:flex">
                <label>Apply wounds: <input ref="dmg" id="damage" type="number" v-model="damage" @keydown="damageCombatant"></label>
                <font-awesome-icon id="confirm" icon="check" @click="damageCombatant"/>
            </div>
        </v-menu>

<!--        Advantage-->
        <v-menu nudge-left="25px" nudge-top="25px" content-class="advantage-menu" v-model="advantage">
            <template v-slot:activator="{on}">
                <td class="center clickable" v-on="on">{{combatant.advantage}}<template v-if="useMaxAdvantage"> / {{combatant.advantageMax}}</template></td>
            </template>
            <div style="display:flex">
                <font-awesome-icon class="adv minus" @click="adv(-1)" icon="minus"/>
                <span class="adv zero" @click="adv(0)">0</span>
                <font-awesome-icon class="adv plus" @click="adv(1)" icon="plus"/>
            </div>
        </v-menu>

<!--        Conditions/Effects-->
        <td>
            <div id="conditions-effects-column">
                <ul id="effects">
                    <li class="condition-item" :key="condition" v-for="condition in sortedConditions" v-if="combatant.conditions[condition]">
                        <v-tooltip bottom max-width="350px">
                            <template v-slot:activator="{ on: onSummary}">
                                <span @click="conditionClick(condition, $event)" class="condition-name" v-on="{...onSummary}"><span v-if="combatant.conditions[condition].count > 1">{{combatant.conditions[condition].count}}× </span>{{condition | capitalize}}</span>
                            </template>
                            <template v-slot:default>
                                <div style="width:100%; text-align: center; margin-bottom: 5px">Click to remove 1.</div>
                                <div style="text-align: center;" v-html="allConditions[condition].summary(combatant.conditions[condition].count)"></div>
                            </template>
                        </v-tooltip>
                    </li>
                </ul>

<!--                Edit buttons-->
                <div id="buttons" v-if="selectedCombatant === combatant">
                    <v-menu left offset-y v-model="conditionMenu" :close-on-content-click="false" content-class="condition-menu">
                        <template v-slot:activator="{ on: onMenu }">
                            <v-tooltip top open-delay="200" v-model="conditionTooltip">
                                <template v-slot:activator="{ on: onTooltip }">
                                    <span id="condition-button" v-on="{...onMenu, ...onTooltip}"><font-awesome-icon class="clickable" icon="crutch"/></span>
                                </template>
                                <template v-slot:default>
                                    Add a condition
                                </template>
                            </v-tooltip>
                        </template>
                        <div slot="default" id="conditions" @mouseleave="conditionMenu = false">
                            <v-tooltip
                                    bottom
                                    open-delay="200"
                                    v-for="(data, condition) in allConditions"
                                    :key="condition"
                                    max-width="600px"
                            >
                                <template v-slot:activator="{ on: conditionTooltip }">
                                    <div @click="addCondition({combatant: combatant, condition: condition})" class="clickable" v-on="{ ...conditionTooltip }">
                                        <div :class="{unstackable: (data.stackable === false && combatant.conditions[condition])}">{{condition | capitalize}}</div>
                                    </div>
                                </template>
                                <template v-slot:default>
                                    <div style="margin-bottom: 5px" v-if="data.stackable === false && combatant.conditions[condition]">Condition not stackable</div>
                                    <div v-html="data.description"></div>
                                </template>
                            </v-tooltip>
                        </div>
                    </v-menu>
                </div>
            </div>
        </td>
    </tr>
</template>

<script>
    import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

    export default {
        name: "CombatRow",
        props: {
            combatant: {},
            showNo: Boolean,
        },
        data() {
            return {
                damage: 0,
                wound: false,
                advantage: false,
                conditionTooltip: false,
                conditionMenu: false,
            }
        },
        computed: {
            ...mapState(['initiativeType', 'useMaxAdvantage', 'combatStarted', 'selectedCombatant']),
            ...mapGetters(['allConditions', 'sortedConditions']),
            formattedInitiative() {
                if (!this.combatStarted) return '-';
                switch (this.initiativeType) {
                    default:
                        return Math.floor(this.combatant.initiative);
                }
            },
        },
        mounted() {
            window.addEventListener("keydown", (event) => {
                if (event.target !== document.body) return;
                switch (event.code) {
                    case 'KeyD':
                        if (this.selectedCombatant === this.combatant) {
                            this.wound = true;
                            this.openDamage();
                        }
                        break;
                    case 'KeyA':
                        if (this.selectedCombatant === this.combatant) {
                            this.advantage = true;
                        }
                        break;
                    case 'KeyC':
                        if (this.selectedCombatant === this.combatant) {
                            this.conditionMenu = true;
                        }
                }
            })
        },
        methods: {
            ...mapMutations(['selectCombatant', 'ejectCombatant', 'addCondition', 'removeCondition']),
            ...mapActions(['dealDamage', 'plusAdvantage', 'minusAdvantage', 'advantageToZero',]),
            combatantClicked() {
                this.selectCombatant(this.combatant);
            },
            conditionClick(condition, event) {
                event.stopPropagation();
                if (event.altKey) {
                    this.removeCondition({combatant: this.combatant, condition: condition, all: true});
                }
                else {
                    this.removeCondition({combatant: this.combatant, condition: condition});
                }
            },
            damageCombatant(event) {
                if (event.type === 'keydown' && event.keyCode !== 13) return;
                this.dealDamage({combatant: this.combatant, damage: this.damage});
                this.wound = false;
            },
            openDamage() {
                this.damage = 0;
                setTimeout(() => this.$refs.dmg.select(), 50);
            },
            adv(action) {
                switch(action) {
                    case 1:
                        this.plusAdvantage(this.combatant);
                        break;
                    case -1:
                        this.minusAdvantage(this.combatant);
                        break;
                    case 0:
                        this.advantageToZero(this.combatant);
                        break;
                }
                this.advantage = false;
            },
        }
    }
</script>

<style scoped>
    #confirm {
        margin-left: 10px;
        cursor: pointer;
        height: 1.5em;
    }

    .condition-menu {
        border-radius: 50px;
        border: 3px solid rgba(188, 202, 199, 1);
        background-color: rgba(255, 255, 255, 1);
        width: 366px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
    }

    .condition-menu .clickable {
        display: inline-flex;
        width: 100px;
        margin: 10px;
        height: 2em;
    }

    .condition-menu .clickable div {
        position: relative;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        width: 100%;
        line-height: 2em;
    }

    .wounds-menu {
        overflow: hidden;
        border-radius: 50px;
        border: 3px solid rgba(188, 202, 199, 1);
        background-color: rgba(255, 255, 255, 1);
        padding: 5px 10px;
    }

    .wounds-menu label {
        display:block;
        margin-bottom: unset;
    }
    .wounds-menu label input {
        margin-left: 10px;
        display:inline-block;
        width:auto;
    }

    .advantage-menu {
        position: absolute;
        width: 90px;
        padding:0;
        height: 60px;
        border: none;
        background-color: transparent;
        box-shadow: none !important;
        display:flex;
    }

    .adv {
        position:relative;
        display: inline-block;
        text-align: center;
        width: 26px;
        height:26px;
        border-radius: 15px;
        border: 2px solid black;
        color:white;
        font-weight: bold;
        cursor:pointer;
    }

    .minus, .plus {
        top: 30px;
        padding: 0 4px;
    }

    .minus {
        background-color: darkred;
    }

    .plus {
        background-color: forestgreen;
    }

    .zero {
        margin: 0 calc((90px - 3*26px)/2);
        vertical-align: middle;
        line-height: 26px;
        font-size: larger;
        background-color:#0c5460;
    }

    #damage {
        padding: 0 5px;
        text-align: center;
        width: 4em;
    }

    #conditions-effects-column {
        display:flex;
        flex-flow: row wrap;
        justify-content: flex-end;
        height: 100%;
        position: relative;
        width: 100%;
    }

    #effects {
        display:flex;
        flex-flow: row wrap;
        list-style: none;
        margin: 0;
        padding: 0;
        min-height: 1.5em;
        height: 100%;
    }

    #effects li {
        line-height: 1.5em;
    }

    #buttons {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
        margin-left: 5px;
    }

    #buttons .clickable {
        line-height: 25px;
        vertical-align: middle;
        height:25px;
        width:25px;
        padding: 3px;
        display: inline-flex;
        border-radius:50%;
    }

    #buttons .clickable:hover {
        background-color: rgba(139, 0, 0, 0.2);
        -webkit-transition: background-color 500ms linear;
        -ms-transition: background-color 500ms linear;
        transition: background-color 500ms linear;
    }

    .condition-item:after {
        content: ',\00a0';
    }

    .condition-item:last-of-type:after {
        content: none;
    }

    .condition-name {
        border: 1px solid transparent;
    }

    .condition-name:hover {
        border: 1px solid rgba(139, 0, 0, 0.94);
    }

    .unstackable {
        font-style: italic;
        cursor: default;
    }
</style>