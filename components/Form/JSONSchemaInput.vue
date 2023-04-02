<template lang="pug">
  .form-json-schema-input
    el-input.form-json-schema-input__input(:value="value", @input="$emit('input', $event)", :disabled="disabled")
</template>

<script>
export default {
  props: ['value', 'field', 'mode'],
  computed: {
    disabled() {
      if (this.field.mode === 'edit' && this.field.schema.getUI('editable') === false) return true;
      return this.field.schema.getUI('disabled') || false;
    },
  },
  methods: {
    log(value) {
      return console.log(value) || value;
    }
  }
};
</script>


<style lang="sass">
.form-json-schema-input
  box-sizing: border-box

  & &__label
    display: inline-block
    padding: 2px 1em
    background: #84c8cf
    margin: 0

  &__input .el-input__inner
    margin: 0 !important
    border-radius: 0 !important
</style>