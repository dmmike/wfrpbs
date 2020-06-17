<template>
    <span>
        <v-tooltip bottom open-delay="500" max-width="500px">
            <template :id="traitData.name" v-slot:activator="{ on, attrs }">
                <span :class="{editable: edit}" v-on="on" v-bind="attrs" @click="modal=true">
                    <span v-if="traitData.count > 1">{{traitData.count}}×</span>
                    <span>{{traitData.name}}</span>
                    <span v-if="traitData.value"> ({{traitData.value}})</span>
                    <span v-if="traitData.rating"> {{traitData.rating > 0 ? '+' + traitData.rating : traitData.rating}}</span>
                    <span v-if="allTraits[index +1]">, </span>
                </span>
            </template>
            <div slot="default">
                <div class="edit-tooltip" v-if="edit">
                    Click to edit
                </div>
                <span v-html="raw.description"></span>
            </div>
        </v-tooltip>

        <edit-modal :active="modal" @close="modal=false">
            <template slot="title">{{traitData.name}}</template>
            <template slot="default">
                <div id="fields" v-if="raw.has !== undefined">
                    <div v-for="type in raw.has" :key="type">
                        <label class="edit-field">
                            <strong>{{type}}: </strong>
                            <input v-if="type !== 'value' || !raw.values" type="text" v-model="trait[type]">
                            <select v-model="trait[type]" v-else>
                                <option disabled :value="undefined" v-if="trait[type] === undefined">
                                    Choose a valid option
                                </option>
                                <v-tooltip right v-for="option in raw.values" :key="typeof option === 'string' ? option : option.value">
                                    <template v-slot:activator="{ on, attrs }">
                                        <option :value="typeof option === 'string' ? option : option.value"
                                                v-on="on"
                                                v-bind="attrs"
                                                :selected="trait[type] !== undefined && option.value.toLowerCase() === trait[type].toLowerCase()">
                                            {{typeof option === 'string' ? option : option.value}}
                                        </option>
                                    </template>
                                    <div slot="default">
                                        <span v-html="option.description"></span>
                                    </div>
                                </v-tooltip>
                            </select>
                        </label>
                    </div>
                </div>
            </template>
            <template slot="buttons">
                <button type="button" @click="save">Save</button>
            </template>
        </edit-modal>
    </span>
</template>

<script>
    import TraitsAndTalents from "@/classes/TraitsAndTalents";
    import EditModal from "@/components/EditModal";

    export default {
        name: "TraitDisplay",
        components: {EditModal},
        props: {
            index: Number,
            allTraits: Array,
            traitData: Object,
            edit: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            modal() {
                if (!this.modal) {
                    this.trait = _.clone(this.traitData);
                }
            }
        },
        data() {
            return {
                trait: _.clone(this.traitData),
                raw: TraitsAndTalents.getTrait(this.traitData.name),
                tooltip: false,
                modal: false,
                modalData: {}
            }
        },
        methods: {
            save() {
                this.$emit('save', this.trait);
                this.modal = false;
            }
        }
    }
</script>

<style scoped>
    .editable {
        cursor: pointer;
    }

    .edit-field {
        text-transform: capitalize;
    }

    .edit-field>select {
        -webkit-appearance: menulist;
    }
</style>