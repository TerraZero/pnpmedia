<template lang="pug">
  .control-page
    .control-page__wrapper
      .control-page__item(v-for="item, index in items", :key="index", @click="onClick(item)")
        .control-page__title {{ item.title }}
</template>

<script>
import Socket from '~/plugins/socket';
import Info from '~/static/info/screen.json';

export default Socket.create({
  socket: {
    point: '/control',
  },
  async mounted() {
    this.screen = this.socket.proxy('/screen');
    this.screen.setState('waiting');
  },
  data() {
    return {
      items: Info,
    };
  },
  methods: {
    async onClick(item) {
      this.screen.doAction(item);
    },
  },
});
</script>

<style lang="sass">
.control-page
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh

  &__wrapper
    display: flex
    flex-wrap: wrap

  &__item
    width: 100%
    padding: 1em
    font-size: 6vw


</style>