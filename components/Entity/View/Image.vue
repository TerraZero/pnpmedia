<template lang="pug">
  .entity-view-image
    el-image.entity-view-image__image(:src="imagepath", fit="fill")
      template(#error)
        i.el-icon-picture-outline
      template(#placeholder)
        i.el-icon-picture-outline
</template>

<script>
export default {
  props: ['path', 'value'],
  data() {
    return {
      filepath: '',
    };
  },
  watch: {
    value: {
      async handler() {
        return;
        let entity = null;

        if (this.value) entity = (await Request.get(this.$axios, 'image.load', {id: this.value})).data.entity;

        if (entity) {
          this.filepath = entity.path;
          this.$emit('entity', { entity });
        } else {
          this.filepath = '';
        }
      },
      immediate: true,
    },
  },
  computed: {
    imagepath() {
      return this.path || this.value.path || this.value.url || '';
    },
  },
};
</script>

<style lang="sass">
.entity-view-image
  display: flex
  width: 100%
  height: 100%
  min-width: 20vw
  min-height: 30vh
  max-width: 40%
  justify-content: center
  align-items: center
  font-size: 3vw
  border: 2px dashed black
  color: black

</style>