<template lang="pug">
  .custom-mutant-bandit-video
    .custom-mutant-bandit-video__frame(v-show="driver === 'youtube'")
      youtube.custom-mutant-bandit-video__video(ref="youtube", :video-id="id", :player-vars="playerVars", :fitParent='true', @cued="onCued")
</template>

<script>
let sync = null;
export default {
  data() {
    return {
      video: null,
      isPlay: false,
      isReady: false,
    };
  },
  computed: {
    youtube() {
      return this.$refs.youtube;
    },
    driver() {
      return this.video && this.video.path.split('/')[0] || null;
    },
    id() {
      return this.video && this.video.path.split('/')[1] || null;
    },
    player() {
      if (this.driver === 'youtube') {
        return this.youtube.player;
      }
      return null;
    },
    playerVars() {
      const data = this.video && this.video.vars || {};
      data.showinfo = 0;
      data.rel = 0;
      data.modestbranding = 1;
      data.iv_load_policy = 3;
      data.cc_load_policy = 3;
      data.fs = 0;
      data.disablekb = 1;
      data.controls = 0;
      return data;
    },
  },
  methods: {
    async doVideo(video) {
      if (this.isPlay) await this.doStop();
      this.video = video;
      if (sync !== null) {
        clearTimeout(sync);
        sync = null;
      }
    },
    async doClear() {
      await this.doStop();
      this.video = null;
    },
    async doPlay() {
      this.isPlay = true;
      if (!this.isReady) return;

      if (typeof this.video.volume === 'number') this.player.setVolume(this.video.volume);
      if (typeof this.video.start === 'number') this.player.seekTo(this.video.start);
      if (typeof this.video.end === 'number') sync = setTimeout(() => this.doStop(), (this.video.end - this.video.start) * 1000);

      await this.player.playVideo();
    },
    async doStop() {
      if (this.isPlay) {
        await this.player.stopVideo();
        this.isPlay = false;
      }
    },
    onCued() {
      this.isReady = true;
      if (this.isPlay) {
        this.doPlay();
      }
      this.$emit('ready');
    },
  },
}
</script>

<style lang="sass">
.custom-mutant-bandit-video
  position: absolute
  top: 50%
  left: 50%
  width: 100%
  height: 100%

  &__frame
    position: relative
    max-height: 100%
    max-width: 100%
    aspect-ratio: 16 / 9
    transform: translate(-50%, -50%)

  &__video
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

</style>
