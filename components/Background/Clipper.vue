<template lang="pug">
  .clipper(:class="classes")
    .clipper__item(v-if="items", v-for="item, index in items", :key="index", :style="style(item, index)")
      video.clipper__content(ref="content", :class="['.clipper__content-' + index]", :style="itemStyle(item, index)")
        source(:src="item.src", type="video/mp4")
    .clipper__video(v-if="video", :key="video")
      video.clipper__video-el(ref="video", muted)
        source(:src="video", type="video/mp4")
      .clipper__vignette
    .clipper__text
      p.clipper__line(v-for="line, index in getTexts(texts)", :key="line.text", :style="getTextStyle(line)")
        | {{ line.text }}
</template>

<script>
export default {
  data() {
    return {
      texts: [],
      showText: false,
      showClips: false,
      items: null,
      video: null,
      frames: [
        {
          time: 2000,
          texts: [
            'willkommen',
          ],
        },
        {
          time: 4500,
          texts: [
            'willkommen',
          ],
          video: '/video/clipper/wesen.mp4',
        },
        {
          time: 4350,
          texts: [
            {
              text: 'in deinem',
              size: '2.5vw',
            },
            'abenteuer',
          ],
          video: '/video/clipper/wesen.mp4',
        },
        {
          time: 4000,
          texts: [
            {
              text: 'voller',
              size: '2.5vw',
            },
            {
              text: 'phantastischer',
              size: '4vw',
            },
            'wesen',
          ],
          video: '/video/clipper/wesen.mp4',
        },
        {
          time: 3900,
          texts: [
            {
              text: 'schließe',
              size: '2.5vw',
            },
            'freundschaften',
          ],
          video: '/video/clipper/friend.mp4',
        },
        {
          time: 3900,
          texts: [
            {
              text: 'bekämpfe',
              size: '2.5vw',
            },
            {
              text: 'mächtige',
              size: '3vw',
            },
            'feinde',
          ],
          video: '/video/clipper/dragon.mp4',
        },
        {
          time: 3900,
          texts: [
            {
              text: 'und',
              size: '2.5vw',
            },
            'feinde',
            {
              text: 'der anderen art',
              size: '2.5vw',
            },
          ],
          video: '/video/clipper/prof.mp4',
        },
        {
          time: 3900,
          texts: [
            {
              text: 'beweise deine',
              size: '2.5vw',
            },
            'macht',
          ],
          video: '/video/clipper/dementor.mp4',
        },
        {
          time: 3900,
          texts: [
            {
              text: 'und bezwinge die',
              size: '2.5vw',
            },
            'dunklen',
            'mächte',
          ],
          video: '/video/clipper/duell-1-2.mp4',
        },
        {
          time: 16000,
          video: '/video/clipper/cuts.mp4',
        }
      ],
      definition: [
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
          src: 'https://cdn.business2community.com/wp-content/uploads/2015/04/The_Daily_Prophet_-_1991_Break_in_at_Gringotts.gif.gif',
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
  computed: {
    classes() {
      const classes = [];

      if (this.showText) classes.push('clipper--show-text');
      if (this.showClips) classes.push('clipper--show-clips');
      return classes;
    },
  },
  methods: {
    getTexts(texts) {
      const prepare = [];

      for (const item of texts) {
        if (typeof item === 'string') {
          prepare.push({text: item, size: '8vw'});
        } else {
          prepare.push(item);
        }
      }
      return prepare;
    },
    getTextStyle(line) {
      return {
        'font-size': line.size,
      };
    },
    play() {
      let time = 0;
      for (const frame of this.frames) {
        setTimeout(() => {
          this.texts = frame.texts || [];
          const items = null;
          for (const item of frame.items || []) {
            items = items || [];
            const nItem = this.definition[item.pos];
            for (const field in item) {
              nItem[field] = item[field];
            }
            items.push(nItem);
          }
          this.items = items;
          let play = this.video !== frame.video;
          this.video = frame.video || null;
          setTimeout(() => {
            this.showText = true;
            if (play && this.video) this.$refs.video.play();
          }, 1);
          setTimeout(() => {
            this.showClips = true;
            for (const index in this.$refs.content) {
              this.$refs.content[index].play();
            }
          }, frame.offset);
          setTimeout(() => {
            this.showText = false;
            this.showClips = false;
          }, frame.time - 400);
        }, time);
        time += frame.time;
      }
    },
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
    opacity: 0
    transition: opacity .3s ease-in-out

  &--show-clips &__item
    opacity: 1

  &__content
    background-size: cover
    position: absolute
    object-fit: cover

  &__text
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%) scale(1.25)
    color: white
    font-size: 5vw
    font-family: 'WizardWorld'
    opacity: 0
    text-align: center
    line-height: .3em
    filter: drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111) drop-shadow(0px 0px 10px #111)
    transition: opacity .2s ease-in-out, transform .2s linear

  &--show-text &__text
    opacity: 1
    transform: translate(-50%, -50%) scale(1)
    transition: opacity .3s ease-in-out, transform 4.5s linear

  &__video,
  &__video-el,
  &__vignette
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  &__vignette
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))

</style>
