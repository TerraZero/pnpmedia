<template lang="pug">
  .custom-mutant-bandit-stage-frame(:class="classes")
    .custom-mutant-bandit-stage-frame__screen.custom-mutant-bandit-stage-frame__image(v-if="frame.image", :style="imageStyles(frame.image)")
    CustomMutantBanditTexts.custom-mutant-bandit-stage-frame__screen(v-if="frame.texts", :texts="frame.texts")
</template>

<script>
export default {
  props: ['frame'],
  computed: {
    classes() {
      return {

      };
    },
  },
  methods: {
    imageStyles(image) {
      return {
        'background-image': 'url("' + image.src + '")',
      };
    },
  },
};
</script>

<style lang="sass">
.custom-mutant-bandit-stage-frame
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

  &__screen
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  &__image
    background-size: cover
    background-position: center
    
</style>