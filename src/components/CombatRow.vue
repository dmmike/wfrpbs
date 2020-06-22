<template>
    <tr @click="combatantClicked">
        <td class="center">{{formattedInitiative}}</td>
        <td>{{combatant.name}} <template v-if="showNo">{{combatant.no}}</template></td>
        <v-menu offset-y offset-overflow :close-on-content-click="false" content-class="wounds-menu" :return-value="damage" v-model="wound">
            <template v-slot:activator="{on, attrs}">
                <td class="center clickable" @click="openDamage" v-bind="attrs" v-on="on">{{combatant.currentWounds}} / {{combatant.stats.w}}</td>
            </template>
            <div style="display:flex">
                <label>Apply wounds: <input ref="dmg" id="damage" type="number" v-model="damage" @keydown="damageCombatant"></label>
                <font-awesome-icon id="confirm" icon="check" @click="damageCombatant"/>
            </div>
        </v-menu>
        <td class="center clickable" v-if="useMaxAdvantage">{{combatant.advantage}} / {{combatant.advantageMax}}</td>
        <td class="center" v-else>{{combatant.advantage}}</td>
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
            ...mapActions(['dealDamage']),
            combatantClicked(event) {
                if (event.ctrlKey || event.altKey) {
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
        /*box-shadow: none !important;*/
        border-radius: 50px;
        border: 3px solid rgba(188, 202, 199, 1);
        background-color: rgba(255, 255, 255, 1);
        /*background-image: url('~@/assets/background-columns.png');*/
        /*background-size: 100% 100%;*/
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

    #damage {
        padding: 0 5px;
        text-align: center;
        width: 4em;
    }
</style>