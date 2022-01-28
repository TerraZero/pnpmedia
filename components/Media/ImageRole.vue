<template lang="pug">
  .media-image-role
    transition-group(name="fade")
      .media-image-role__image(v-for="image in images", :key="image.src", :style="styles(image)")
</template>

<script>
let timed = null;

export default {
  data() {
    return {
      images: [],
    };
  },
  computed: {
    
  },
  methods: {
    styles(image) {
      return {
        'background-image': 'url(' + image.src + ')',
      };
    },
    setMedia(media) {
      if (!this.images.find((v) => v.src === media.src)) {
        this.images.push(media);
      }
      if (this.images.length > 1) {
        setTimeout(() => {
          while (this.images.length > 1) {
            this.images.shift();
          }
        }, 600);
      }
    },
    clear() {
      this.images = [];
    },
  },
}
</script>

<style lang="sass">
.media-image-role
  width: 100%
  height: 100%

  &__image
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-size: cover
    background-position: center center

</style>
