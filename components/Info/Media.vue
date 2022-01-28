<template lang="pug">
  .info-media(:class='classes')
    .info-media__content
      .info-media__video
        youtube.info-media__youtube(:video-id='playerId', :player-vars='playerVars', ref='youtube', :fitParent='true', @cued="onCued")
</template>

<script>
let timed = null;

export default {
  data() {
    return {
      show: false,
      media: null,
      isPlay: false,
      isReady: false,
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.show) classes.push('info-media--show');
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
      this.show = false;
      this.media = media;
      this.isPlay = false;
    },
    onCued() {
      this.isReady = true;
      if (this.isPlay) {
        this.play();
      }
    },
    async play() {
      this.isPlay = true;
      if (!this.isReady) return;

      if (this.media.show !== false) {
        this.show = true;
      }
      await this.player.playVideo();
      if (this.media.show !== false) {
        if (timed !== null) clearTimeout(timed);
        timed = setTimeout(() => {
          timed = null;
          this.show = false;
        }, 5000);
      }
    },
    async stop() {
      if (this.isPlay) {
        await this.player.stopVideo();
        this.isPlay = false;
      }
    },
  },
}
</script>

<style lang="sass">
.info-media
  position: absolute
  top: 15%
  right: 0
  height: 10%
  min-height: 120px
  width: 211px

  &__content
    position: absolute
    top: 0
    left: 100%
    width: 100%
    height: 100%
    background: black
    overflow: hidden
    background: cyan
    transition: left .3s .3s $animations__smooth
    box-shadow: 5px 5px 10px black

  &--show &__content
    left: 0
    transition: left .3s $animations__smooth

  &__video
    position: absolute
    top: 0
    left: 100%
    width: 211px
    border-left: 7px solid cyan
    transition: left .3s $animations__smooth

  &--show &__video
    left: 0
    transition: left .3s .3s $animations__smooth

</style>
