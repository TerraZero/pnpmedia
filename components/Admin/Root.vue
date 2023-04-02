<template lang="pug">
  .admin-root
    h1.admin-root__title Admin
    LayoutTileWall.admin-root__wall(:items="items", v-slot="{ item }", @click="click")
      .admin-root__menu-item
        h2 {{ item.name }}
</template>

<script>
export default {
  mounted() {
    this.$emit('admin', {method: 'menu', params: {items: [
      { name: 'Admin', component: 'Admin/Root' },
    ]}});
  },
  data() {
    return {
      items: [
        {
          name: 'Backgrounds',
          goto: 'Admin/Backgrounds',
        },
        {
          name: 'Debug',
          goto: 'Admin/Debug',
        }, 
        {
          name: 'Entities',
          goto: 'Admin/Entities',
        }
      ],
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
.admin-root

  &__wall
    margin: 0 20px

  &__menu-item
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
</style>