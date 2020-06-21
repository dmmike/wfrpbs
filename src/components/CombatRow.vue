<template>
    <tr @click="combatantClicked">
        <td class="center">{{formattedInitiative}}</td>
        <td>{{combatant.name}} <template v-if="showNo">{{combatant.no}}</template></td>
        <td class="center clickable" @click.stop="alterWounds">{{combatant.currentWounds}} / {{combatant.stats.w}}</td>
        <td class="center clickable" v-if="useMaxAdvantage">{{combatant.advantage}} / {{combatant.advantageMax}}</td>
        <td class="center" v-else>{{combatant.advantage}}</td>
        <td></td>
    </tr>
</template>

<script>
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "CombatRow",
        props: {
            combatant: {},
            showNo: Boolean,
        },
        computed: {
            ...mapState(['initiativeType', 'useMaxAdvantage', 'combatStarted']),
            formattedInitiative() {
                if (!this.combatStarted) return '-';
                switch (this.initiativeType) {
                    default:
                        return Math.floor(this.combatant.initiative);
                }
            },
        },
        methods: {
            ...mapMutations(['selectCombatant', 'ejectCombatant']),
            combatantClicked(event) {
                if (event.ctrlKey || event.altKey) {
                    this.ejectCombatant(this.combatant);
                }
                else {
                    this.selectCombatant(this.combatant);
                }
            },
            alterWounds(event) {

            },
        }
    }
</script>

<style scoped>

</style>