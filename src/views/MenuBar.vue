<template>
    <div id="menu-bar">
        <div id="left-line"></div>
        <div id="menu"><h4 @click="openLibrary">Menu</h4></div>
        <div id="right-line"></div>
    </div>
</template>

<script>
    import linehalf from '@/assets/linehalf.png';
    import {mapMutations} from "vuex";

    export default {
        name: "MenuBar",
        data() {
            return {
                line: linehalf
            }
        },
        methods: {
            ...mapMutations(['openLibrary'])
        }
    }
</script>

<style scoped>
    #menu-bar {
        height: 5vh;
        display: flex;
        padding: 0 2%;
    }

    #left-line, #right-line {
        background-image: url('~@/assets/linehalf.png');
        width:100%;
    }

    #right-line {
        transform: scaleX(-1);
    }

    #menu {
        height: 100%;
        cursor: pointer;
    }

    #menu h4 {
        height: 100%;
        line-height: 5vh;
        display: inline-block;
        margin: auto 30px;
        text-align: center;
        text-transform: uppercase;
    }

</style>