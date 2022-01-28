<template lang="pug">
  .page
    ScreenLogo

</template>

<script>
export default {
  data() {
    return {
      text: 'Hallo Textchen',
    }
  },
  methods: {
    classes(letter) {
      return 'page__letter-' + (letter === ' ' ? 'space' : letter);
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

</style>