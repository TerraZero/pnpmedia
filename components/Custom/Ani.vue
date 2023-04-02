<template lang="pug">
  .custom-ani(:class="classes")
    MediaSVGEmbed.custom-ani__svg(ref="logo", src="/images/logo/ani.svg")
</template>

<script>
export default {
  data() {
    return {
    };
  },  
  computed: {
    classes() {
      return {
      };
    },
  },
  methods: {

  },
};
</script>

<style lang="sass">
.custom-ani
  display: block

</style>