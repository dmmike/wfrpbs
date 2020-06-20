<template>
    <tr @click="selectCombatant">
        <td class="center">{{formattedInitiative}}</td>
        <td>{{combatant.name}} <template v-if="showNo">{{combatant.no}}</template></td>
        <td class="center clickable" @click.stop="alterWounds">{{combatant.currentWounds}} / {{combatant.stats.w}}</td>
        <td class="center clickable" v-if="useMaxAdvantage">{{combatant.advantage}} / {{combatant.advantageMax}}</td>
        <td class="center" v-else>{{combatant.advantage}}</td>
        <td></td>
    </tr>
</template>

<script>
    export default {
        name: "CombatRow",
        props: {
            combatant: {},
            initiativeType: String,
            useMaxAdvantage: Boolean,
            showNo: Boolean,
        },
        computed: {
            formattedInitiative() {
                switch (this.initiativeType) {
                    default:
                        return Math.floor(this.combatant.initiative.valueOf());
                }
            },
        },
        methods: {
            selectCombatant(event) {
                if (event.ctrlKey || event.altKey) {
                    this.$emit('remove');
                }
                else {
                    this.$root.$emit('select-combatant', this.combatant);
                }
            },
            alterWounds(event) {

            },
        }
    }
</script>

<style scoped>

</style>