<template lang="pug">
  .custom-mutant-bandit-texts
    .custom-mutant-bandit-texts__text(v-for="item in texts", :key="item.text", :class="textClasses(item)", :style="textStyles(item)")
      | {{ item.text }}
</template>

<script>
export default {
  props: ['texts'],
  methods: {
    textClasses(text) {
      const base = 'custom-mutant-bandit-texts__';
      const classes = [];

      if (text.intro) {
        classes.push(base + 'default');
        setTimeout(function() {
          text.intro = false;
        }, 1000);
      } else if (text.type) {
        classes.push(base + text.type);
      } else {
        classes.push(base + 'default');
      }
      
      if (text.intro !== undefined) {
        classes.push(base + 'intro');
      }

      return classes;
    },
    textStyles(text) {
      const styles = {};

      if (text.size) styles['font-size'] = text.size;
      return styles;
    },
  },
}
</script>

<style lang="sass">
.custom-mutant-bandit-texts
  position: relative

  &__text
    position: absolute
    text-shadow: 2px 2px 2px rgba(0, 0, 0, .5)

  &__default
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    font-size: 10vw

  &__title
    top: 1vh
    left: 50%
    transform: translateX(-50%)
    font-size: 3vw

  &__intro
    transition: all .5s 2s ease-out

</style>
