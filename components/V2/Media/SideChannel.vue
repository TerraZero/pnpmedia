<template lang="pug">
  .v2-media-side-channel
    V2MediaYoutube.v2-media-side-channel__video(ref="videos", v-for="channel of channels", :key="channel")
</template>

<script>
export default {
  props: ['channels'],
  methods: {
    setMaster(attr, value) {
      for (const player of this.$refs.videos) {
        player.setMaster(attr, value);
      }
    },
    getChannelPlayer(channel) {
      return this.$refs.videos[this.channels.indexOf(channel)];
    },
    getVideo(channel = null) {
      if (channel === null) {
        const videos = {};
        for (const name of this.channels) {
          const player = this.getChannelPlayer(name);

          videos[name] = player && player.isPlay ? player.video : null;
        }
        return videos
      } else {
        const player = this.getChannelPlayer(channel);
        if (player.isPlay) return player.video;
        return null;
      }
    },
    async setVideo(channel, video = null) {
      const player = this.getChannelPlayer(channel);

      if (video === null) {
        
      } else {
        player.setVideo(video);
        player.doPlay();
      }
    },
    doStop(channel = null) {
      if (channel === null) {
        for (const name of this.channels) {
          const player = this.getChannelPlayer(name);

          if (player) player.doStop();
        }
      } else {
        const player = this.getChannelPlayer(channel);
          
        if (player) player.doStop();
      } 
    },
  },
}
</script>

<style lang="sass">
.v2-media-side-channel
  position: absolute
  top: 5vh
  right: 0
  width: 500px
  height: 500px
  opacity: 0

  &__video
    position: relative !important

</style>
