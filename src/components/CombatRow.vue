<template>
    <tr @click="combatantClicked">
        <td class="center">{{formattedInitiative}}</td>
        <td>{{combatant.name}} <template v-if="showNo">{{combatant.no}}</template></td>
        <v-menu offset-y offset-overflow :close-on-content-click="false" content-class="wounds-menu" v-model="wound">
            <template v-slot:activator="{on, attrs}">
                <td class="center clickable" @click="openDamage" v-bind="attrs" v-on="on">{{combatant.currentWounds}} / {{combatant.stats.w}}</td>
            </template>
            <div style="display:flex">
                <label>Apply wounds: <input ref="dmg" id="damage" type="number" v-model="damage" @keydown="damageCombatant"></label>
                <font-awesome-icon id="confirm" icon="check" @click="damageCombatant"/>
            </div>
        </v-menu>
        <v-menu nudge-top="28%" nudge-left="5%" content-class="advantage-menu" v-model="advantage">
            <template v-slot:activator="{on, attrs}">
                <td class="center clickable" v-bind="attrs" v-on="on">{{combatant.advantage}}<template v-if="useMaxAdvantage"> / {{combatant.advantageMax}}</template></td>
            </template>
            <div style="display:flex">
                <font-awesome-icon class="adv minus" @click="adv(-1)" icon="minus"/>
                <span class="adv zero" @click="adv(0)">0</span>
                <font-awesome-icon class="adv plus" @click="adv(1)" icon="plus"/>
            </div>
        </v-menu>
        <td></td>
    </tr>
</template>

<script>
    import {mapActions, mapMutations, mapState} from "vuex";

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
            }
        },
        computed: {
            ...mapState(['initiativeType', 'useMaxAdvantage', 'combatStarted', 'selectedCombatant']),
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
                }
            })
        },
        methods: {
            ...mapMutations(['selectCombatant', 'ejectCombatant']),
            ...mapActions(['dealDamage', 'plusAdvantage', 'minusAdvantage', 'advantageToZero']),
            combatantClicked(event) {
                if (event.altKey) {
                    this.ejectCombatant(this.combatant);
                }
                else {
                    this.selectCombatant(this.combatant);
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
            }
        }
    }
</script>

<style scoped>
    #confirm {
        margin-left: 10px;
        cursor: pointer;
        height: 1.5em;
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
</style>