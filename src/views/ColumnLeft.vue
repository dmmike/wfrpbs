<template>
    <div id="column-left">
        <transition name="fade" mode="out-in">
            <library v-if="libraryOpen" @npc="$emit('new', 'npc')" @close="closeLibrary"></library>
            <active-combatant v-else></active-combatant>
        </transition>
    </div>
</template>

<script>
    import ActiveCombatant from "@/components/ActiveCombatant";
    import Library from "@/components/Library";
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "ColumnLeft",
        components: {
            ActiveCombatant,
            Library
        },
        computed: mapState([
            'libraryOpen',
        ]),
        methods: {
            ...mapMutations(['closeLibrary'])
        }
    }
</script>

<style scoped>
</style>