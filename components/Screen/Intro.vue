<template lang="pug">
  .screen-intro(@click="click", :class="classes")
    .screen-intro__background
    BackgroundClipper.screen-intro__clipper(ref="clipper")
    MediaStage.screen-intro__stage(ref="stage")
    CustomLogo.screen-intro__logo(:animate="true", :shadow="true", ref="logo")
    .screen-intro__title
      .screen-intro__headline HARRY POTTER
      .screen-intro__con UND DIE
    .screen-intro__title
      .screen-intro__line QUELLE DES VITU$
    
</template>

<script>
import { Howl } from 'howler';
const video = {
  url: 'https://www.youtube-nocookie.com/watch?v=1O6Qstncpnc',
  volume: 0,
  start: 9,
};

const Intro = new Howl({
  src: "/music/Intro.mp3",
  onload: () => {
    console.log('load');
  },
  onend: () => {
    console.log('end');
  },
});

export default {
  data() {
    return {
      intro: false,
      stage: false,
      title: false,
      clipper: false,
    }
  },
  computed: {
    classes() {
      const classes = [];

      if (this.intro) classes.push('screen-intro--intro');
      if (this.title) classes.push('screen-intro--title');
      if (this.stage) classes.push('screen-intro--stage');
      if (this.clipper) classes.push('screen-intro--clipper');
      return classes;
    },
  },
  methods: {
    click() {
      
      this.$refs.stage.setVideo(video, false);
      Intro.play();
      this.$refs.logo.start();
      this.intro = true;
      setTimeout(() => {
        this.clipper = true;
      }, 8000);
      setTimeout(() => {
        this.$refs.clipper.play();
      }, 6500);
      setTimeout(() => {
        this.$refs.stage.video.play();
        this.$refs.stage.setBlende(false);
      }, 43500)
      setTimeout(() => {
        this.stage = true;
      }, 49000);
      setTimeout(() => {
        this.clipper = false;
      }, 50000);
      setTimeout(() => {
        this.title = true;
      }, 57500);
      setTimeout(() => {
        this.stage = false;
      }, 80000);
      setTimeout(() => {
        this.$refs.stage.video.stop();
      }, 85000);
    },
  },
};
</script>

<style lang="sass">
.screen-intro
  width: 100%
  height: 100%
  overflow: hidden
  position: relative
  background: black

  &__background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/images/background/blacklight.jpg')
    background-size: cover
    opacity: 1
    transition: opacity 1s 7.5s

  &--intro &__background
    opacity: 0

  &__stage
    opacity: 0
    transition: opacity .2s

  &--stage &__stage
    opacity: 1
    transition: opacity 1s 3s

  &__logo
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 33%
    height: auto

  &__clipper
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    opacity: 0
    transition: opacity 1s 3s

  &--clipper &__clipper
    opacity: 1

  &__title
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    font-family: AnimalesFantastic
    color: white
    font-size: 5vw
    text-align: center
    filter: drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111)
    line-height: 2em

  &__headline
    opacity: 0

  &--title &__headline
    animation: screen-intro--flagger 4s linear

  &__con
    opacity: 0
    font-size: 3vw

  &--title &__con
    animation: screen-intro--flagger 2s 2s linear

  &__line
    white-space: nowrap
    font-size: 7vw
    opacity: 0
    transform: scale(6)

  &--title &__line
    transform: scale(1)
    opacity: 1
    transition: opacity 1s 4.5s, transform 3s 4.5s linear

@keyframes screen-intro--flagger
  0% 
    opacity: 0
    transform: scale(1)
  25%
    opacity: 1
    transform: scale(1.05)
  75%
    opacity: 1
    transform: scale(1.15)
  100%
    opacity: 0
    transform: scale(1.20)

</style>