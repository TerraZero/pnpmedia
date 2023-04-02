<template lang="pug">
  .page
    V2MediaSideChannel(ref="music", :channels="musicChannels")
    V2MediaImage(v-if="image", :src="image.path", :contain="image.contain", :rotate="image.rotate")
</template>

<script>
import Socket from '~/plugins/socket';

export default Socket.create({
  socket: {
    point: '/v2/screen',
  },
  data() {
    return {
      musicChannels: ['music', 'ambiant', 'sound'],
      image: null,
    };
  },
  computed: {
    channels() {
      return this.$refs.music;
    },
  },
  methods: {
    sendUpdateAction({ item, config }) {
      switch (item.type) {
        case 'image':
          this.image = item;
          break;
        case 'video':
          for (const setting in config) {
            item[setting] = config[setting];
          }
          this.channels.setVideo(item.channel, item);
          break;
      }
    },
    sendMaster(config) {
      for (const attr in config) {
        this.channels.setMaster(attr, config[attr]);
      }
    },
    sendClear(channel = null) {
      if (typeof channel !== 'string') channel = null;
      this.channels.doStop(channel);
    },
    sendGetInfo() {
      return {
        image: this.image,
        music: this.channels.getVideo(),
      };
    },
  },
});
</script>

<style lang="sass">
.page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background: black

</style>