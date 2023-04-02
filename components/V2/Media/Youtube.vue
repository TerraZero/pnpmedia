<template lang="pug">
  .v2-media-youtube
    .v2-media-youtube__frame
      youtube.v2-media-youtube__video(ref="youtube", @ready="onReady", @cued="onCued", @ended="onEnded")
</template>

<script>
export default {
  data() {
    return {
      video: null,
      isPlay: false,
      isReady: false,
      isCued: false,
      master: {
        volume: 1,
      },
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
  },
  methods: {
    player() {
      return this.youtube.player;
    },
    setMaster(attr, value) {
      this.master[attr] = value;
      if (this.isPlay) this.updateVideo(this.video);
    },
    async setVideo(video) {
      this.video = video;
    },
    async doClear() {
      await this.doStop();
      this.video = null;
    },
    async updateVideo(video) {
      // set volume
      let volume = this.master.volume;
      if (typeof video.volume === 'number') {
        this.video.volume = video.volume;
        volume = video.volume * volume;
      }
      await this.player().setVolume(volume * 100);

      if (typeof this.video.seek === 'number') {
        this.player().seekTo(this.video.seek);
      }
    },
    async doPlay() {
      this.isPlay = true;
      if (!this.isReady) return;

      if (this.player().getPlayerState() === 1) await this.doStop();

      await this.player().cueVideoById({
        videoId: this.id,
        startSeconds: this.video.start,
        endSeconds: this.video.end,
      });      
    },
    async doStop() {
      if (this.isPlay) {
        this.isPlay = false;
        await this.player().stopVideo();
      }
    },
    onReady() {
      this.isReady = true;
      if (this.isPlay) {
        this.doPlay();
      }
    },
    async onCued() {
      if (this.isPlay) {
        await this.updateVideo(this.video);
        await this.player().playVideo();
      }
    },
    onEnded() {
      if (this.isPlay && this.video.loop) {
        this.player().seekTo(this.video.start);
        this.player().playVideo();
      }
    },
  },
}
</script>

<style lang="sass">
.v2-media-youtube
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
