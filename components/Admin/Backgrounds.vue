<template lang="pug">
  .admin-page
    FormBase.admin-page__form
      template(#title)
        h1.admin-page__title Background Edit
      template(#fields)
        el-input(v-model="name")
          template(#prepend)
            | Name
        el-input(v-model="name")
          template(#prepend)
            | Image
        EntityInputImage(v-model="image")
      template(#actions)
        | Submit
</template>

<script>
export default {
  mounted() {
    this.$emit('admin', {method: 'menu', params: {items: [
      { name: 'Admin', component: 'Admin/Root' },
      { name: 'Backgrounds', component: 'Admin/Backgrounds' },
    ]}});
  },
  data() {
    return {
      name: '',
      image: 6,
    };
  },
  methods: {
    click({ item }) {
      this.$emit('admin', {method: 'goto', params: {component: item.goto}});
    },
  },
}
</script>

<style lang="sass">
.admin-page
  font-family: 'Open Sans', sans-serif

  &__wall
    margin: 0 20px

  &__menu-item
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%

  &__form
    margin: 1em
</style>