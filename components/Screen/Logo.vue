<template lang="pug">
  .screen-logo
    CustomLogo.screen-logo__logo(:animate="animate")
    
</template>

<script>
export default {
  data() {
    return {
      animate: true,
    }
  },
};
</script>

<style lang="sass">
.screen-logo
  width: 100%
  height: 100%
  background: black
  overflow: hidden
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/images/background/blacklight.jpg')
  background-size: cover
  position: relative

  &__logo
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 33%
    height: auto

</style>