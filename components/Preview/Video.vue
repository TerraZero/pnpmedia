<template lang="pug">
  LayoutFrameVideo.preview-video
    youtube.preview-video__video(v-if="value && playerId", :video-id="playerId", :player-vars="playerVars", ref='youtube', :fitParent='true')
</template>

<script>
export default {
  props: ['value', 'schema', 'field'],
  data() {
    return {
      filepath: '',
    };
  },
  computed: {
    imagepath() {
      return this.path || this.value.path || this.value.url || '';
    },
    playerId() {
      if (this.value.url) {
        return this.$youtube.getIdFromUrl(this.value.url);
      } else if (this.value.id) {
        return this.value.id;
      }
      return null;
    },
    playerVars() {
      const data = {};
      return data;
    },
  },
};
</script>

<style lang="sass">
.preview-video

  &__video
    width: 100%
    height: 100%

</style>