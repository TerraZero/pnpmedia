<template lang="pug">
  .screen-page(:class="classes")
    BackgroundStar.screen-page__background
    .screen-page__waiting
      .screen-page__wrapper
        img.screen-page__qr(v-if="image", :src="image")
        .screen-page__text
          .screen-page__title
            | Connect control with:
          .screen-page__url
            | {{ url }}
    CustomLogo.screen-page__logo(:animate="true")
</template>

<script>
import Socket from '~/plugins/socket';
import QRCode from 'qrcode';

export default Socket.create({
  socket: {
    point: '/screen',
    on: {
      socket_disconnect({ clients }) {
        if (!clients.find(v => v.point === '/control')) {
          this.setState('login');
        }
      },
      socket_info({ clients }) {
        if (clients.find(v => v.point === '/control')) {
          this.setState('waiting');
        }
      },
    },
  },
  mounted() {
    QRCode.toDataURL(this.url, {width: 600}, (err, url) => {
      this.image = url;
    });
  },
  data() {
    return {
      url: window.location.origin + '/control',
      image: null,
      state: 'login',
    };
  },
  computed: {
    classes() {
      const classes = [];

      classes.push('screen-page--' + this.state);
      return classes;
    },
    stage() {
      return this.$refs.stage;
    },
  },
  methods: {
    async setState(state, force = false) {
      if (!this.locked || force) this.state = state;
    },
    gotoScreen(name) {
      this.$router.push('/screen/' + name);
    },
  },
});
</script>

<style lang="sass">
.screen-page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  font-family: 'lato',sans-serif
  background: black
  font-size: 1.2vw

  &__waiting
    width: 100%
    height: 100%
    opacity: 0
  
  &--login &__waiting
    transition: opacity .3s $animations__smooth
    opacity: 1

  &__wrapper
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%) scale(0)
    border-radius: 1em
    padding: 1.5em
    background: rgba(255, 255, 255, 20%)
    text-align: center
    transition: transform .5s $animations__smooth

  &--login &__wrapper
    transform: translate(-50%, -50%) scale(1)

  &__text
    position: relative
    padding: 1vw
    overflow: hidden
    border-radius: 1em
    color: white
    text-align: center

  &__title
    margin-bottom: .5em

  &__url
    background: #FFFFFFEE
    padding: .5em 1em
    color: black
    border-radius: 1em
    font-size: 1vw

  &__qr
    width: 16vw
    border-radius: 1em

  &__logo
    position: absolute
    top: 11vh
    left: 94vw
    transform: translate(-50%, -50%)
    width: 6vw
    height: 6vw
    filter: drop-shadow(.5vw .5vw 5px black)
    transition: all .5s $animations__smooth

  &--waiting &__logo
    width: 15vw
    height: 15vw
    top: 50%
    left: 50%
    transition: all .5s .3s $animations__smooth

</style>