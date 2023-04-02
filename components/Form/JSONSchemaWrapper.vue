<template lang="pug">
  .form-json-schema-wrapper
    label.form-json-schema-wrapper__label(v-if="label") {{ label }}
    slot
    .form-json-schema-wrapper__description(v-if="description")
      | {{ description }}
</template>

<script>
export default {
  props: ['field'],
  computed: {
    label() {
      const value = this.field.schema.getUI('label');
      if (value === false) return false;
      return value || this.field.prop;
    },
    description() {
      return this.field.schema.getUI('description');
    },
  },
};
</script>


<style lang="sass">
.form-json-schema-wrapper
  box-sizing: border-box
  
  & &__label
    display: inline-block
    padding: 2px 1em
    background: #84c8cf
    margin: 0

  &__description
    font-size: .8em
    color: #958473
</style>