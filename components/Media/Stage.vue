<template lang="pug">
  .media-stage(:class="classes")
    MediaVideo.media-stage__video(ref="video")
    MediaImageRole.media-stage__images(ref="image")
    MediaMusicVideo.media-stage__music(ref="music")
    .media-stage__blende(@transitionend="onBlendeEnd")
</template>

<script>
let blendeAction = null;
export default {
  data() {
    return {
      blende: true,
      current: null,
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.blende) classes.push('media-stage--blende');
      return classes;
    },
    music() {
      return this.$refs.music;
    },
    video() {
      return this.$refs.video;
    },
    image() {
      return this.$refs.image;
    },
  },
  methods: {
    setBlende(value) {
      if (this.blende === value) {
        return Promise.resolve();
      } else {
        return new Promise((res) => {
          this.blende = value;
          blendeAction = res;
        });
      }
    },
    onBlendeEnd() {
      if (typeof blendeAction === 'function') {
        blendeAction();
        blendeAction = null;
      } 
    },
    async setMusic(media) {
      await this.music.setMedia(media);
      await this.music.play();
    },
    async setVideo(media) {
      await this.clear('video');
      await this.setBlende(true);
      await this.video.setMedia(media);
      await this.video.play();
      await this.setBlende(false);
    },
    async setImage(media) {
      await this.clear('image');
      await this.image.setMedia(media);
      await this.setBlende(false);
    },
    async stop(medium) {
      switch (medium) {
        case 'music':
          this.music.clear();
          break;
        case 'video':
          this.video.clear();
          break;
        case 'image':
          this.image.clear();
          break;
        default:
          this.music.clear();
          this.video.clear();
          this.image.clear();
          break;
      }
    },
    async clear(id) {
      if (this.current !== id && this.current !== null) {
        await this.setBlende(true);
        await this[this.current].clear();
      }
      this.current = id;
    },
  },
}
</script>

<style lang="sass">
.media-stage
  position: relative
  width: 100%
  height: 100%

  &__blende
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: black
    opacity: 0
    transition: opacity .3s $animations__smooth

  &--blende &__blende
    opacity: 1

  &__images
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

</style>
