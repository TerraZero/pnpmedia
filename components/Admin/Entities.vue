<template lang="pug">
  .admin-image
    FormJSONSchemaOverview
</template>

<script>
export default {
  mounted() {
    this.$emit('admin', {method: 'menu', params: {items: [
      { name: 'Admin', component: 'Admin/Root' },
      { name: 'Entities', component: 'Admin/Entities' },
    ]}});
  },
  data() {
    return {
      value: {},
    };
  },
  methods: {
    
  },
}
</script>

<style lang="sass">
.admin-image
  font-family: 'Open Sans', sans-serif

</style>