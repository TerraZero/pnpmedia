<template lang="pug">
  .clipper
    .clipper__item(v-for="item, index in items", :key="index", :style="style(item, index)")
      video.clipper__content(ref="content", :class="['.clipper__content-' + index]", :style="itemStyle(item, index)", @mouseover="onHover(index)")
        source(:src="item.src", type="video/mp4")
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          clip: 'polygon(60% 53%, 100% 43%, 100% 100%, 71% 100%)',
          top: '43%',
          left: '59%',
          width: '41%',
          height: '57%',
          src: '/downloads/gifs/time.gif',
        },
        {
          clip: 'polygon(32% 39%, 60% 53%, 71% 100%, 37% 100%)',
          top: '39%',
          left: '32%',
          width: '39%',
          height: '61%',
          src: '/downloads/gifs/sirius.gif',
        },
        {
          clip: 'polygon(0 56%, 32% 39%, 37% 100%, 0 100%)',
          top: '39%',
          left: '0%',
          width: '37%',
          height: '61%',
          src: '/downloads/gifs/notnamed.mp4',
        },
        {
          clip: 'polygon(71% 0, 100% 0, 100% 43%, 60% 53%)',
          top: '0%',
          left: '60%',
          width: '40%',
          height: '53%',
          src: '/downloads/gifs/dementor.gif',
        },
        {
          clip: 'polygon(24% 0, 71% 0, 60% 53%, 32% 39%)',
          top: '0%',
          left: '24%',
          width: '47%',
          height: '53%',
          src: '/downloads/gifs/azkaban.gif',
        },
        {
          clip: 'polygon(0 0, 24% 0, 32% 39%, 0 56%)',
          top: '0%',
          left: '0%',
          width: '32%',
          height: '56%',
          src: '/downloads/gifs/gellert.gif',
        },
      ],
    };
  },
  methods: {
    style(item, index) {
      return {
        'clip-path': item.clip,
      };
    },
    itemStyle(item, index) {
      return {
        width: item.width,
        height: item.height,
        top: item.top,
        left: item.left,
      };
    },
    onHover(index) {
      this.$refs.content[index].play();
    },
  },
}
</script>

<style lang="sass">
.clipper
  position: relative
  width: 100%
  height: 100%
  background: black

  &__item
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  &__content
    background-size: cover
    position: absolute
    object-fit: cover

</style>
