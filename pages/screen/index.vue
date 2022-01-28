<template lang="pug">
  .screen-page
    transition(name="fade")
      BackgroundStar.screen-page__background(v-if='state === "waiting"')
      .screen-page__waiting(v-if='state === "login"')
        BackgroundStar.screen-page__background
        .screen-page__wrapper
          .screen-page__text
            .screen-page__title
              | Connect control with:
            .screen-page__url
              | http://localhost:3000/control
          img.screen-page__qr(src="/qr/login.png")
      MediaStage.screen-page__stage(v-if='state === "stage"', ref="stage")

</template>

<script>
import Socket from '~/plugins/socket';

export default Socket.create('/screen', {
  mounted() {
    this.socket.on('socket_disconnect', ({clients}) => {
      if (!clients.find(v => v.point === '/control')) {
        this.setState('login');
      }
    });
  },
  data() {
    return {
      state: 'login',
    };
  },
  computed: {
    stage() {
      return this.$refs.stage;
    },
  },
  methods: {
    async setState(state) {
      if (this.state === 'stage') {
        await this.stage.stop();
      }
      this.state = state;
    },
    async setImage(media) {
      return await this.stage.setImage(media);
    },
    async setMusic(media) {
      return await this.stage.setMusic(media);
    },
    async stop() {
      return await this.stage.stop();
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

  &__waiting
    width: 100%
    height: 100%

  &__wrapper
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

  &__text
    position: relative
    padding: 1vw
    overflow: hidden
    border-radius: 1em
    color: white
    text-align: center
    margin-bottom: 1em
    
    &::before
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(255, 255, 255, 20%)
      filter: blur(10px)

  &__title
    font-size: 22px
    margin-bottom: .5em

  &__url
    background: #FFFFFFEE
    padding: .5em 1em
    color: black
    border-radius: 1em

</style>