<template lang="pug">
  .page(:style="styles")
    FilterEdgeFire(ref="edgefire", efDur="100s")
    .test-filter__filter
</template>

<script>
export default {
  mounted() {
    this.filter = this.$refs.edgefire.filterID;
  },
  data() {
    return {
      filter: null,
    };
  },
  computed: {
    styles() {
      const styles = {};

      styles['--filter'] = 'url(#' + this.filter + ')';
      return styles;
    },
  },
};
</script>

<style lang="sass">
.page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background: black

.test-filter

  &__svg
    display: none

  &__frame
    border: 2px solid black

  &__filter
    margin: 1em
    width: calc(100% - 2em)
    height: calc(100% - 2em)
    background-image: url('/ani/maps/feibios.jpg')
    background-size: cover
    background-position: center
    filter: var(--filter) drop-shadow(0 0 3px yellow) drop-shadow(0 0 4px orange) drop-shadow(0 0 5px red)

</style>