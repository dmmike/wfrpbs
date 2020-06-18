<template>
    <div id="column-left">
        <transition name="fade" mode="out-in">
            <library v-if="libraryOpen" :library="library" @npc="$emit('new', 'npc')" @close="$emit('close')"></library>
            <active-combatant v-else :active-combatant="selectedCombatant"></active-combatant>
        </transition>
    </div>
</template>

<script>
    import ActiveCombatant from "@/components/ActiveCombatant";
    import Library from "@/components/Library";
    import {Combatant} from "@/classes/Combatant";

    export default {
        name: "ColumnLeft",
        components: {
            ActiveCombatant,
            Library
        },
        props: {
            selectedCombatant: Combatant,
            libraryOpen: {
                type: Boolean,
                default: false,
            },
            library: Object,
        },
    }
</script>

<style scoped>
</style>