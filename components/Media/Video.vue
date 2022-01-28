<template lang="pug">
  .media-video(:class='classes')
    youtube.media-video__video(:video-id='playerId', :player-vars='playerVars', ref='youtube', :fitParent='true', @cued="onCued")
</template>

<script>
export default {
  data() {
    return {
      media: null,
      isPlay: false,
      isReady: false,
    };
  },
  computed: {
    classes() {
      const classes = [];

      return classes;
    },
    youtube() {
      return this.$refs.youtube;
    },
    player() {
      return this.youtube.player;
    },
    playerId() {
      if (this.media) {
        if (this.media.id) return this.media.id;
        if (this.media.url) return this.$youtube.getIdFromUrl(this.media.url);
      }
      return null;
    },
    playerVars() {
      if (this.media) {
        const data = this.media.vars || {};

        data.showinfo = 0;
        data.rel = 0;
        data.modestbranding = 1;
        data.iv_load_policy = 3;
        data.fs = 0;
        data.disablekb = 1;
        data.controls = 0;
        return data;
      }
      return null;
    },
  },
  methods: {
    async setMedia(media) {
      if (this.isPlay) {
        await this.stop();
      }
      this.media = media;
      this.isPlay = false;
    },
    onCued() {
      this.isReady = true;
      if (this.isPlay) {
        this.play();
      }
      this.$emit('ready');
    },
    async play() {
      this.isPlay = true;
      if (!this.isReady) return;

      await this.player.playVideo();
    },
    async stop() {
      if (this.isPlay) {
        await this.player.stopVideo();
        this.isPlay = false;
      }
    },
    async clear() {
      await this.stop();
      this.media = null;
    },
  },
}
</script>

<style lang="sass">
.media-video
  position: relative
  padding-bottom: 56.25%
  padding-top: 0
  height: 0
  overflow: hidden
  pointer-events: none

  &__video
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

</style>
