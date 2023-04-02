<template lang="pug">
  .screen-mutant-bandit-page(:class="classes", @click="onTestClick")
    transition-group(name="group-fade-slow", appear)
      .screen-mutant-bandit-page__screen(v-if="state === 'stage'", key="stage")
        CustomMutantBanditStage(:stage="stage")
      .screen-mutant-bandit-page__screen(v-if="state === 'logo'", key="logo")
        CustomLogo.screen-mutant-bandit-page__logo(:animate="true")
</template>

<script>
import Socket from '~/plugins/socket';

let sync = null;

export default Socket.create({
  socket: {
    point: '/screen',
  },
  data() {
    return {
      state: 'stage',
      stage: {
        config: {
          time: 3000,
          frameInOrder: true,
        },
        /*
        video: {
          path: 'youtube/m9H4kmrrDa0',
          start: 100,
          end: 105,
        },
        //*/
        //*
        texts: [
          {
            text: 'Dungeon 1',
            type: 'title',
          }
        ],
        frames: [
          {
            image: {
              src: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
            },
            texts: [
              {
                text: 'Baum',
              }
            ],
          },
          {
            image: {
              src: 'https://thumbs.dreamstime.com/b/sch%C3%B6ner-regenwald-ang-kanaturlehrpfad-36703721.jpg',
            },
            texts: [
              {
                text: 'Regenwald',
              }
            ],
          },
          {
            image: {
              src: 'https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg',
            },
            texts: [
              {
                text: 'Meer',
              }
            ],
          },
          {
            image: {
              src: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80',
            },
            texts: [
              {
                text: 'Linse',
              }
            ],
          },
        ],
        //*/
      },
    };
  },
  computed: {
    classes() {
      const classes = [];
      
      classes.push('screen-mutant-bandit-page--state-' + this.state);
      return classes;
    },
  },
  methods: {
    async onTestClick() {

    },
    setState(state) {
      this.state = state;
      return new Promise((res) => {
        sync = res;
      });
    },
    setStage(stage) {
      this.stage = stage;
    },
    start(index = 0) {
      switch (this.state) {
        case 'stage':
          break;
        default:
          throw new Error('The state can not be started.');
      }
    },
  },
});
</script>

<style lang="sass">
.screen-mutant-bandit-page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  font-family: 'lato',sans-serif
  background: black
  font-size: 1.2vw
  color: white

  &__screen
    display: flex
    justify-content: center
    align-items: center
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  &__logo
    width: 50%
    height: auto

</style>