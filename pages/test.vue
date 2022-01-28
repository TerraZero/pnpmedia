<template lang="pug">
  .page
    BackgroundClipper
    h1.page__text 
      span.page__letter(v-for="letter, index in text.split('')", :key="index", :class="classes(letter)") {{ letter }}
    //- h1.page__text-2 QUELLE DES VITU$

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

  &__text
    font-family: WizardWorld
    color: white
    font-size: 50px
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    transform-origin: 50% 50%
    white-space: nowrap

    &:hover
      animation: test-intro-text 5s forwards

  &__letter
    display: inline-block
    
  &__text:hover &__letter
    animation: test-intro-letter 5s forwards

  &__letter-space
    width: .3em

  &__text-2
    font-family: AnimalesFantastic
    color: white
    font-size: 50px
    position: absolute
    top: 50%
    left: 50%
    filter: drop-shadow(0 0 10px black) drop-shadow(0 0 15px white)

@keyframes test-intro-text
  from
    opacity: 0
    letter-spacing: 3em
    transform: translate(-50%, -50%) scale(2)
    filter: drop-shadow(0 4px 40px white)
  to
    opacity: 1
    letter-spacing: 1px
    transform: translate(-50%, -50%) scale(1)
    filter: drop-shadow(0 4px 30px white)

@keyframes test-intro-letter
  from
    transform: rotateY(90deg)
  to
    transform: rotateY(0deg)

</style>