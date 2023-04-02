<template lang="pug">
  .v2-media-image(:class="classes")
    .v2-media-image__frame
      transition(name="fade", appear, :class="classes")
        .v2-media-image__image(:key="src", :style="styles")
</template>

<script>
export default {
  props: ['src', 'contain', 'rotate'],
  computed: {
    classes() {
      const classes = [];

      if (this.contain) classes.push('v2-media-image--contain');
      if (this.rotate) classes.push('v2-media-image--rotate');
      return classes;
    },
    styles() {
      const styles = {};

      if (this.src) {
        styles['background-image'] = 'url(' + this.src.replace(/\\/g, '/') + ')';
      }
      return styles;
    },
  },
}
</script>

<style lang="sass">
.v2-media-image
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  height: 100%

  &__image
    width: 100%
    height: 100%
    background-size: cover
    background-position: center

  &--contain &__image
    background-size: contain
    background-repeat: no-repeat

  &--rotate &__image
    transform: rotate(90deg)

  &__frame
    width: 100%
    height: 100%

  &--rotate &__frame
    width: 100vh
    height: 100vw

</style>
