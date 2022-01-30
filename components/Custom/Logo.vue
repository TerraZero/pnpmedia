<template lang="pug">
  .custom-logo(:class="classes")
    MediaSVGEmbed.custom-logo__svg(ref="logo", src="/images/logo/tz-logo.svg")
</template>

<script>
export default {
  props: ['animate'],
  data() {
    return {
      play: false,
      shockwave: false,
      hide: false,
      transparent: false,
    };
  },  
  computed: {
    classes() {
      return {
        'custom-logo--animate': this.animate,
        'custom-logo--play': this.play,
        'custom-logo--transparent': this.transparent,
        'custom-logo--shockwave': this.shockwave,
        'custom-logo--hide': this.hide,
      };
    },
  },
  methods: {
    start() {
      this.play = true;
      this.playLogo();
    },
    playLogo() {
      this.$refs.logo.$el.animate(
        [
          { 
            transform: 'rotate3d(1, 1, 1, 0deg) scale(1)',
            filter: 'drop-shadow(4vw 4vw 5px black)'
          },
          { 
            transform: 'rotate3d(1, 1, 1, 180deg) scale(3)',
            filter: 'drop-shadow(8vw 8vw 5px black)'
          },
          { 
            transform: 'rotate3d(1, 1, 1, 360deg) scale(.5)',
            filter: 'drop-shadow(0 0 5px black)'
          },
        ],
        { duration: 8500, easing: 'cubic-bezier(1,.6,.4,0)', fill: 'forwards' }
      ).onfinish = this.playShockwave.bind(this);
    },
    playShockwave() {
      this.shockwave = true;
      this.transparent = true;
      setTimeout(() => {
        this.hide = true;
      }, 2000);
    },
  },
};
</script>

<style lang="sass">
$custom_logo__animation_time: cubic-bezier(.97,.94,.82,.18)

.custom-logo
  width: 100%
  height: 100%
  position: relative
  transition: opacity 1s

  &--transparent
    opacity: .5

  &--hide
    opacity: 0

  //&--animate &__svg
  //  animation: custom-logo--rotate 20s 9s infinite

  &__svg
    filter: drop-shadow(4vw 4vw 5px black)

  &__svg:before
    content: ''
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    border-radius: 50%

  &--shockwave &__svg:before
    animation: custom-logo--shockwave .5s linear forwards

  &--animate
    .logo__t,
    .logo__z
      animation: custom-logo--rotate--character 10s linear infinite
      transform-origin: 50%

    .logo__top-left,
    .logo__bottom-right
      animation: custom-logo--rotate 20s 9s infinite
      transform-origin: 50%
    

@keyframes custom-logo--rotate
  0%
    transform: rotate(0deg)
  5%
    transform: rotate(360deg)
  100%
    transform: rotate(360deg)

@keyframes custom-logo--rotate--character
  0%
    transform: rotateY(0deg)
  45%
    transform: rotateY(0deg)
  55%
    transform: rotateY(360deg)
  100%
    transform: rotateY(360deg)

@keyframes custom-logo--action
  0%
    transform: rotate3d(1, 1, 1, 0deg) scale(1) translate(0px, 0px)
    filter: drop-shadow(4vw 4vw 5px black)
  50%
    transform: rotate3d(1, 1, 1, 180deg) scale(2) translate(0px, 0px)
    filter: drop-shadow(8vw 8vw 5px black)
  90%
    transform: rotate3d(1, 1, 1, 360deg) scale(.5) translate(0px, 0px)
    filter: drop-shadow(0 0 5px black)
  92%
    transform: rotate3d(1, 1, 1, 360deg) scale(.5) translate(-2px, 0px)
    filter: drop-shadow(0 0 5px black)
  94%
    transform: rotate3d(1, 1, 1, 360deg) scale(.5) translate(2px, 0px)
    filter: drop-shadow(0 0 5px black)
  96%
    transform: rotate3d(1, 1, 1, 360deg) scale(.5) translate(-2px, 0px)
    filter: drop-shadow(0 0 5px black)
  98%
    transform: rotate3d(1, 1, 1, 360deg) scale(.5) translate(2px, 0px)
    filter: drop-shadow(0 0 5px black)
  100%
    transform: rotate3d(1, 1, 1, 360deg) scale(.5) translate(0px, 0px)
    filter: drop-shadow(0 0 5px black)

@keyframes custom-logo--shockwave
  0%
    transform: scale(1)
    box-shadow: 0 0 2px rgba(255, 255, 255, .5), inset 0 0 1px rgba(255, 255, 255, .5)
  80%
    box-shadow: 0 0 50px transparent, inset 0 0 30px transparent
  100%
    transform: scale(3)

</style>