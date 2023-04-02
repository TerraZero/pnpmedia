<template lang="pug">
  .entity-form
    FormJSONSchema(:type="type", :value="value", @input="$emit('input', log($event))")
</template>

<script>
export default {
  props: ['type', 'value'],
  methods: {
    log(value) {
      return console.log(value) || value;
    }
  },
};
</script>


<style lang="sass">
.entity-form
  border: 1px solid black
</style>