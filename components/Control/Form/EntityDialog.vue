<template lang="pug">
  el-dialog.control-form-entity-dialog(:visible.sync="show", :close-on-click-modal="false", :fullscreen="true", append-to-body, @close="onClose")
    ControlButtons.control-form-data-dialog__actions(:buttons="actions", @button="onAction")
    .control-form-entity-dialog__form(v-if="schema")
      CustomFormFieldset.control-form-entity-dialog__fieldset(label="Properties")
        CustomFormLabel.control-form-entity-dialog__field(label="Weight")
          input.control-form-entity-dialog__input(type="text", v-model="edit.weight")
        CustomFormLabel.control-form-entity-dialog__field(v-for="prop, pindex in entityProps", :key="pindex", :label="prop.ui.label")
          input.control-form-entity-dialog__input(v-if="!prop.ui || prop.ui.type !== 'select'", type="text", v-model="edit[prop.name]")
          select.control-form-entity-dialog__select(v-if="prop.ui && prop.ui.type === 'select'", v-model="edit[prop.name]")
            option(v-for="value, key in prop.ui.options", :key="key", :value="key") {{ value }}
          CustomFormDescription(v-if="prop.ui && prop.ui.description", :description="prop.ui.description")
      CustomFormFieldset.control-form-entity-dialog__fieldset(v-for="field, key in schema.fields", :key="key", :label="field.label")
        .control-form-entity-dialog__fielddelta(v-for="delta in (field.length || 1)", :key="delta")
          CustomFormLabel.control-form-entity-dialog__field(v-for="tfield, tkey in getTableFields(field, delta)", :key="tkey", :label="tfield.label + ' ' + tfield.delta")
            input.control-form-entity-dialog__input(v-if="field.type !== 'select'", type="text", :value="getFieldValue(field, key, delta, tkey)", @input="setFieldValue(field, key, delta, tkey, $event)")
            select.control-form-entity-dialog__select(v-if="field.type === 'select'", :value="getFieldValue(field, key, delta, tkey)", @input="setFieldValue(field, key, delta, tkey, $event)")
              option(v-for="value, key in field.options", :key="key", :value="key") {{ value }}
            CustomFormDescription(v-if="tfield.ui && tfield.ui.description", :description="tfield.ui.description")
</template>

<script>
export default {
  data() {
    return {
      control: null,
      show: false,
      schemas: null,
      schema: null,
      entity: null,
      edit: null,
      buttons: [
        {
          name: 'Save',
          key: 'save',
          icon: {
            icon: 'upload',
          },
        },
        {
          name: 'Delete',
          key: 'delete',
          icon: {
            icon: 'delete-solid',
          },
          danger: true,
        },
      ],
    };
  },
  computed: {
    entityProps() {
      return this.schemas.find(v => v.table === this.schema.table).fields;
    },
    actions() {
      return this.buttons.filter(v => this.control === 'edit' || v.key === 'save');
    },
  },
  methods: {
    close() {
      this.show = false;
    },
    async open(schema, entity = null) {
      if (this.schemas === null) {
        this.schemas = await this.$request('database.schemas', { type: 'table' }).fetchArray('data.schemas').get();
      }
      this.schema = schema;
      this.show = true;

      if (entity === null) {
        this.control = 'new';
        entity = {
          entity_type: this.schema.entity,
        }; 
      } else {
        this.control = 'edit';
      }
      this.entity = entity;
      this.edit = JSON.parse(JSON.stringify(entity));
    },
    async onAction(action) {
      let result = null;
      switch (action.key) {
        case 'save':
          result = await this.$request('database.save').post(this.edit);
          if (result.meta.error) {
            console.log(result);
            this.$notify.info({ message: 'Error WIP.', position: 'bottom-right' });
          } else {
            this.$notify.success({ message: 'Save entity success.', position: 'bottom-right' });
            this.$emit('action', {
              action: 'save',
              entity: this.edit,
              result: result,
              status: 'success',
            });
          }
          break;
        case 'delete':
          try {
            await this.$confirm('Are you sure to delete the entity.', 'Warning', {
              confirmButtonText: 'Delete',
              cancelButtonText: 'Cancel',
              confirmButtonClass: 'control-form-entity-dialog__confirm--danger',
              type: 'warning',
            });
            
            result = await this.$request('database.delete', { entity: this.edit.entity_type, id: this.edit.id }).get();
            if (result.meta.error) {
              console.log(result);
              this.$notify.info({ message: 'Error WIP.', position: 'bottom-right' });
            } else {
              this.$notify.success({ message: 'Delete entity success.', position: 'bottom-right' });
              this.$emit('action', {
                action: 'delete',
                entity: this.edit,
                result: result,
                status: 'success',
              });
            }
          } catch (e) {
            this.$notify.info({ message: 'Cancel deletion.', position: 'bottom-right' });
            return false;
          }
          break;
      }
    },
    onClose() {

    },
    getTableFields(field, delta) {
      const data = {};
      const table = this.schemas.find(v => v.table === field.table);

      for (const tfield of table.fields) {
        data[tfield.name] = {
          label: tfield && tfield.ui && tfield.ui.label || tfield.name,
          delta: delta,
        };
      }
      return data;
    },
    getFieldValue(field, key, delta, tkey) {
      if (!this.edit.fields) return null;
      if (!field.length || field.length === 1) {
        return this.edit.fields[key] && this.edit.fields[key][tkey] || null;
      } else {
        return this.edit.fields[key] && this.edit.fields[key][delta - 1] && this.edit.fields[key][delta - 1][tkey] || null;
      }
    },
    setFieldValue(field, key, delta, tkey, value) {
      if (!this.edit.fields) this.edit.fields = {};
      if (!field.length || field.length === 1) {
        this.edit.fields[key] = this.edit.fields[key] || {};
        this.edit.fields[key][tkey] = value.target.value;
      } else {
        if (!Array.isArray(this.edit.fields[key])) this.edit.fields[key] = [];
        if (!this.edit.fields[key][delta - 1]) {
          for (let i = this.edit.fields[key].length - 1; i < delta - 1; i++) {
            this.edit.fields[key].push({});
          }
        }
        this.edit.fields[key][delta - 1][tkey] = value.target.value;
      }
    },
  },
};
</script>

<style lang="sass">
.control-form-entity-dialog
  margin: 2vw

  &__fieldset + &__fieldset,
  &__fielddelta + &__fielddelta,
  &__field + &__field
    margin-top: .5em

  &__select,
  &__input
    width: 100%
    padding: .5em 1em
    box-sizing: border-box

  &__form
    margin-top: .5em

  .el-message-box &__confirm--danger
    background: #e76f51
    border-color: red

    &:hover
      background: #d62828
      border-color: red

</style>