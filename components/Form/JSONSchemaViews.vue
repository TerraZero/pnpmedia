<template lang="pug">
  .form-json-schema-views
    el-switch.form-json-schema-views__switch(v-if="hasPreview", v-model="grid", active-text="Grid", inactive-text="Table", inactive-color="#409EFF")
    el-table(v-if="!grid", :data="items", :empty-text="empty || 'No items.'")
      el-table-column(v-for="label, prop in columns", :key="prop", :prop="prop", :label="label")
        template(v-if="prop === '{preview}'", v-slot="{ row, $index }")
          slot(name="preview", :row="row", :index="$index")
            component(:is="preview", :value="row", :schema="schema")
      el-table-column(align="right")
        template(#header)
          slot(name="operations-header")
            | Operations
        template(v-slot="{ row, $index }")
          slot(name="operations", :row="row", :index="$index")
            el-button(type="primary", @click="$emit('select', row)") Select
    .form-json-schema-views__grid(v-if="grid")
      .form-json-schema-views__item(v-for="item in items", :key="item.id", @click="$emit('select', item)")
        .form-json-schema-views__label [{{ item.id }}] {{ item.name }}
        component.form-json-schema-views__preview(:is="preview", :value="item", :schema="schema")
</template>

<script>
export default {
  props: ['items', 'empty', 'schema'],
  mounted() {
    // this.grid = this.hasPreview;
  },
  data() {
    return {
      grid: false,
    };
  },
  computed: {
    columns() {
      let columns = this.schema.getUI('columns');
      if (!columns) columns = {
        id: 'ID',
        label: 'Label',
      };
      return columns;
    },
    preview() {
      return this.schema.getUI('preview');
    },
    hasPreview() {
      return this.preview ? true : false;
    },
  },
};
</script>


<style lang="sass">
.form-json-schema-views
  text-align: right

  &__switch
    background: #84c8cf
    padding: .5em 1em

  &__switch .el-switch__core,
  &__switch .el-switch__core:after
    border-radius: 0

  &__grid
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
    background: white

  &__item
    padding: 1em
    box-sizing: border-box
    cursor: pointer
    position: relative
    overflow: hidden
    text-align: left

  &__item:after
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    opacity: 0
    background: black
    transition: opacity .2s ease-in-out

  &__item:hover:after
    opacity: .2

  &__label
    padding: .5em 0

</style>