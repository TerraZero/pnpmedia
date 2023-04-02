<template lang="pug">
  ControlContentLayout.control-battle(:class="classes", ref="layout")
    template(#title)
      | Battle
    template
      .control-battle__page(@click="onClick")
        .control-battle__form
          .control-battle__item
            | Enemies
            el-input-number(v-model="number", :min="1",  :max="10")
          .control-battle__item
            | Level
            el-input-number(v-model="level", :min="1",  :max="4")
</template>

<script>
export default {
  props: ['screen'],
  data() {
    return {
      number: 1,
      level: 1,
    };
  },
  computed: {
    classes() {
      const classes = [];

      return classes;
    },
  },
  methods: {
    onClick() {
      this.screen.goGame('mutant-bandit');
    },
  },
};
</script>

<style lang="sass">
.control-battle

  &__form
    display: flex
    flex-wrap: wrap

  &__item
    width: 100%
</style>