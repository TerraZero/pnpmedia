<template lang="pug">
  .custom-form-description
    .custom-form-description__line(v-for="line in lines")
      | {{ line }}
</template>

<script>
export default {
  props: ['description'],
  computed: {
    lines() {
      if (!Array.isArray(this.description)) {
        return [this.description];
      }
      return this.description;
    },
  },
};
</script>

<style lang="sass">
.custom-form-description
  
  &__line
    font-size: .8em

</style>