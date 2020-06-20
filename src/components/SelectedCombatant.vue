<template>
    <div id="active-combatant">

    </div>
</template>

<script>
    import {Combatant} from "@/classes/Combatant";
    import CombatantView from "@/components/CombatantView";

    export default {
        name: "SelectedCombatant",
        components: {
            CombatantView
        },
        props: {
            activeCombatant: Combatant,
            combatStarted: {
                type: Boolean,
                default: false,
            }
        }
    }
</script>

<style scoped>
</style>