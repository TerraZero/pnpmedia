<template lang="pug">
  .form-json-schema-order
    el-input-number(v-model="value", :min="0", :max="(items.length || 1) - 1")
    el-button.form-json-schema-order__submit(icon="el-icon-arrow-right", @click="onClick")
</template>

<script>
export default {
  props: ['items', 'index'],
  data() {
    return {
      value: this.index,
    };
  },
  methods: {
    log(value) {
      return console.log(value) || value;
    },
    onClick() {
      if (this.index != this.value) {
        this.$emit('input', {from: this.index, to: this.value});
        this.value = this.index;
      }
    },
  }
};
</script>


<style lang="sass">
.form-json-schema-order

  &__submit
    border-radius: 0 4px 4px 0
    padding: 12px .5em
  
</style>