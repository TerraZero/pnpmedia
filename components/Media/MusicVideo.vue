<template lang="pug">
  .media-music-video(:class="classes")
    .media-music-video__content
      MediaVideo.media-music-video__video(ref="video", @ready="onReady")
</template>

<script>
let timed = null;

export default {
  data() {
    return {
      show: false,
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.show) classes.push('media-music-video--show');
      return classes;
    },
    player() {
      return this.$refs.video;
    },
  },
  methods: {
    async setMedia(media) {
      await this.player.setMedia(media);
    },
    onReady() {
      if (!this.player.isPlay) {
        this.play();
      }
    },
    async play() {
      if (!this.player.isReady) return;

      if (this.player.media.show !== false) {
        this.show = true;
      }
      await this.player.play();
      if (this.player.media.show !== false) {
        if (timed !== null) clearTimeout(timed);
        timed = setTimeout(() => {
          timed = null;
          this.show = false;
        }, 5000);
      }
    },
    async stop() {
      await this.player.stop();
    },
    async clear() {
      await this.player.clear();
      this.show = false;
    },
  },
}
</script>

<style lang="sass">
.media-music-video
  position: absolute
  top: 15%
  right: 0
  width: 15vw
  z-index: 1000

  &__content
    position: absolute
    top: 0
    left: 100%
    width: 100%
    background: black
    overflow: hidden
    background: $blue
    transition: left .3s .3s $animations__smooth
    box-shadow: 5px 5px 10px black

  &--show &__content
    left: 0
    transition: left .3s $animations__smooth

  &__video
    position: absolute
    top: 0
    left: 100%
    border-left: 7px solid cyan
    transition: left .3s $animations__smooth

  &--show &__video
    left: 0
    transition: left .3s .3s $animations__smooth

</style>
