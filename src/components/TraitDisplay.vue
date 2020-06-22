<template>
    <span>
        <v-tooltip bottom open-delay="500" max-width="800px">
            <template :id="traitData.name" v-slot:activator="{ on, attrs }">
                <span :class="{editable: edit}" v-on="on" v-bind="attrs" @click="traitClicked">
                    <span v-if="traitData.count > 1">{{traitData.count}}×</span>
                    <span>{{traitData.name}}</span>
                    <span v-if="traitData.value"> ({{traitData.value}})</span>
                    <span v-if="traitData.rating"> {{traitData.rating > 0 ? '+' + traitData.rating : traitData.rating}}</span>
                    <span v-if="allTraits[index +1]">, </span>
                </span>
            </template>
            <div slot="default">
                <div class="edit-tooltip" v-if="edit">
                    <template v-if="raw.has">
                        Click to edit
                    </template>
                    <template v-else>
                        Click to remove
                    </template>
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
                            <input v-if="type !== '#' && (type !== 'value' || !raw.values)" type="text" v-model="trait[type]">
                            <select v-model="trait[type]" v-else>
                                <option :value="undefined">
                                </option>
                                <v-tooltip right v-for="option in raw.values" :key="typeof option === 'string' ? option : option.value">
                                    <template v-slot:activator="{ onTraitModal, attrsTraitModal }">
                                        <option :value="typeof option === 'string' ? option : option.value"
                                                v-on="onTraitModal"
                                                v-bind="attrsTraitModal"
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
                <button type="button" @click="removeTrait" style="float:right">Remove</button>
                <button type="button" @click="removeAll" style="float:right" v-if="traitData.count > 1">
                    Remove All
                </button>
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
                    this.trait = _.cloneDeep(this.traitData);
                }
            }
        },
        data() {
            return {
                trait: _.cloneDeep(this.traitData),
                raw: TraitsAndTalents.getTrait(this.traitData.name),
                tooltip: false,
                modal: false,
                modalData: {}
            }
        },
        created() {
            if (this.trait.is_create) {
                if (this.raw.has) {
                    this.modal = true;
                }
                this.$delete(this.trait, 'is_create');
            }
        },
        methods: {
            save() {
                this.$emit('save', this.trait);
                this.modal = false;
            },
            removeTrait() {
                this.$emit('removeTrait', this.trait.name);
            },
            removeAll() {
                this.$emit('removeAll', this.trait.name);
            },
            traitClicked(event) {
                if (!this.edit) return;
                if (event.ctrlKey) {
                    this.removeTrait();
                }
                else if(event.altKey) {
                    this.removeAll();
                }
                else if (this.raw.has) {
                    this.modal = true;
                }
                else {
                    this.removeTrait();
                }
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