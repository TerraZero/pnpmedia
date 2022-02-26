<template lang="pug">
  component.screen-base(:is="compname", ref="comp")
</template>

<script>
export default {
  props: ['data'],
  computed: {
    comp() {
      return this.$refs.comp;
    },
    compname() {
      return this.data.comp;
    },
  },
};
</script>

<style lang="sass">

</style>