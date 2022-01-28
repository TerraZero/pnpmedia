<template lang="pug">
  .page
    .page__clip(v-for="item, index in items", :key="index", :style="style(item)")
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: 'https://i.pinimg.com/originals/af/0b/c9/af0bc9e49387570a8e91699c45684db4.jpg',
        },
        {
          src: 'https://image.jimcdn.com/app/cms/image/transf/none/path/sa6549607c78f5c11/image/i4eeacaa2dbf12d6d/version/1490299332/most-beautiful-landscapes-in-europe-lofoten-european-best-destinations-copyright-iakov-kalinin.jpg',
        },
        {
          src: 'https://wallpaperaccess.com/full/4125371.jpg',
        },
        {
          src: 'https://www.designyourway.net/art/wp-content/uploads/2019/06/ferdinand-ladera-athlerrod.jpg',
        },
        {
          src: 'https://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/England/Lake%20District/lake-district-walk-ALAMY-TRAVEL%202.jpg',
        },
        {
          src: '/downloads/gifs/time.gif',
        },
      ],
    };
  },
  computed: {
    
  },
  methods: {
    style(item) {
      return {
        'background-image': 'url(' + item.src + ')',
      };
    },
  },
}
</script>

<style lang="sass">
.page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background: black

  &__clip
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    opacity: 1
    transition: opacity .3s ease-in-out

  &__clip:hover 
    opacity: 1

  &__clip:nth-child(1)
    background: green
    clip-path: polygon(60% 53%, 100% 43%, 100% 100%, 71% 100%)
    background-size: 41% 57%
    background-position: 31% 100%

  &__clip:nth-child(2)
    background: red
    clip-path: polygon(32% 39%, 60% 53%, 71% 100%, 37% 100%)
    background-size: 39% 61%
    background-position: 52% 100% 
  
  &__clip:nth-child(3)
    background: blue
    clip-path: polygon(0 56%, 32% 39%, 37% 100%, 0 100%)
    background-size: 37% 61%
    background-position: 0% 101%
  
  &__clip:nth-child(4)
    background: magenta
    clip-path: polygon(71% 0, 100% 0, 100% 43%, 60% 53%)
    background-size: 40% 53%
    background-position: 34% 0%

  &__clip:nth-child(5)
    background: yellow
    clip-path: polygon(24% 0, 71% 0, 60% 53%, 32% 39%)
    background-size: 47% 53%
    background-position: 45% 0%

  &__clip:nth-child(6)
    background: cyan
    clip-path: polygon(0 0, 24% 0, 32% 39%, 0 56%)
    background-size: 32% 56%

</style>