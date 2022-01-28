<template lang="pug">
  .control-page
    | Control
    .button-waiting(@click="onClick('waiting')")
      | Waiting
    .button-image(@click="onClick('image')")
      | Image
    .button-music(@click="onClick('music')")
      | Music
</template>

<script>
import Socket from '~/plugins/socket';

export default Socket.create('/control', {
  socketError(error) {
    console.log(error);
  },
  async mounted() {
    this.screen = this.socket.proxy('/screen');
    this.screen.setState('waiting');
  },
  data() {
    return {
      text: '',
    };
  },
  computed: {
  },
  methods: {
    async onClick(mode) {
      switch (mode) {
        case 'waiting':
          await this.screen.setState('waiting');
          break;
        case 'image':
          await this.screen.setState('stage');
          await this.screen.setImage({
            src: 'https://www.nature.com/immersive/d41586-021-00095-y/assets/3TP4N718ac/2021-01-xx_jan-iom_tree-of-life_sh-1080x1440.jpeg',
          });
          break;
        case 'music':
          await this.screen.setState('stage');
          await this.screen.setMusic({
            url: 'https://youtu.be/cej2O-mem64',
          });
          break;
      }
    }
  },
});
</script>

<style lang="sass">
.control-page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh

</style>