<template lang="pug">
  .screen-ani(:class="classes")
    .screen-ani__animation
      FilterSmoke.screen-ani__turb(ref="smoke", @click.native="$refs.smoke.toggle()", end-time=".6s", start-state="out")
        .screen-ani__logo
          CustomAni.screen-ani__svg
    
</template>

<script>
export default {
  data() {
    return {
      animate: false,
      blend: false,
    };
  },
  computed: {
    classes() {
      return {
        'screen-ani--blend': this.blend,
      };
    },
  },
};
</script>

<style lang="sass">
.screen-ani
  width: 100%
  height: 100%
  background: black
  overflow: hidden
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/images/background/blacklight.jpg')
  background: black
  background-size: cover
  position: relative

  &__animation
    display: flex
    width: 100%
    height: 100%
    justify-content: center
    align-items: center

  &__turb
    width: 25%
    height: auto

  &__svg
    filter: drop-shadow(0 0 20px #fff)
 
</style>