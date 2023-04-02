<template lang="pug">
  img.v2-media-video-image(:src="url")
</template>

<script>
export default {
  props: ['src'],
  data() {
    return {
      video: null,
      isPlay: false,
      isReady: false,
      master: {},
    };
  },
  computed: {
    driver() {
      return this.src.split('/')[0] || null;
    },
    id() {
      return this.src.split('/')[1] || null;
    },
    url() {
      return 'https://img.youtube.com/vi/' + this.id + '/0.jpg';
    },
  },
}
</script>

<style lang="sass">
.v2-media-video-image
  aspect-ratio: 4/3
</style>
