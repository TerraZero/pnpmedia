<template lang="pug">
  .form-json-schema-ref
    .form-json-schema-ref__view
      el-table(:data="table", :empty-text="'No items.'")
        el-table-column(v-for="label, prop in columns", :key="prop", :prop="prop", :label="label")
          template(v-if="prop === '{preview}'", v-slot="{ row, $index }")
            component(:is="preview.component", :key="preview.component + $index", v-bind="preview.props($index)")
        el-table-column(align="right")
          template(#header)
            | Operations
            el-button.form-json-schema-ref__add-op(v-if="showAdd", type="primary", @click="create()") Add
          template(v-slot="{ row, $index }")
            el-button-group.form-json-schema-ref__actions
              el-button(type="primary", @click="edit($index)") Edit
              el-button(@click="remove($index)") Remove
            FormJSONSchemaOrder.form-json-schema-ref__order(v-if="showOrder", :items="table", :index="$index", @input="onOrderInput(row, $event)")
    FormJSONSchemaBrowser(ref="browser", :field="field", :value="value", @browser="onBrowser")
</template>

<script>
export default {
  props: ['value', 'field'],
  data() {
    return {
      
    };
  },
  computed: {
    browser() {
      return this.$refs.browser;
    },
    preview() {
      let preview = this.field.schema.getUI('preview');
      if (preview === null) return null;
      if (typeof preview === 'string') {
        preview = {
          component: preview,
        };
      }
      preview.props = (index) => ({
        value: Array.isArray(this.value) ? this.value[index] : this.value,
        field: this.field,
      });
      return preview;
    },
    columns() {
      let columns = this.field.schema.getUI('columns');
      if (!columns) columns = {
        id: 'ID',
        label: 'Label',
      };
      return columns;
    },
    table() {
      if (!this.value) return [];
      return (Array.isArray(this.value) ? this.value : [this.value]).map(v => {
        if (!v.id) v.id = '[new]';
        return v;
      });
    },
    showAdd() {
      if (this.field.schema.isArray) {
        return (this.value && this.value.length || 0) <= (this.field.schema.schema.maxItems || Infinity);
      }
      return !this.value;
    },
    showOrder() {
      return this.field.schema.isArray && this.value && this.value.length > 1;
    },
  },
  methods: {
    onBrowser({ tab, op, result, selected }) {
      this.browser.close();
      if (op === 'save') {
        this.$emit('input', result.entity);
      } else if (op === 'select') {
        this.$emit('input', selected);
      }
    },
    onOrderInput(row, { from, to }) {
      const item = this.value[from];
      this.value[from] = this.value[to];
      this.value[to] = item;
      this.$emit('input', [...this.value]);
    },
    create() {
      this.browser.setCreate();
    },
    edit(index) {
      this.browser.setEdit(this.value);
    },
  },
};
</script>


<style lang="sass">
.form-json-schema-ref
  box-sizing: border-box

  &__add-op
    margin-left: 1em

  &__actions
    margin-bottom: 1em

  &__browser
    margin: 5vw

  &__browser > .el-dialog
    display: flex
    flex-direction: column

  &__browser > .el-dialog > .el-dialog__body
    overflow: auto

  &__browser > .el-dialog > .el-dialog__footer
    margin-top: auto

  &__browser-actions
    display: flex
    justify-content: right
</style>