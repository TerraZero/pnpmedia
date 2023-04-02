<template lang="pug">
  .admin-debug
    el-table(:data="data")
      el-table-column(prop="id", label="ID")
      el-table-column(prop="route", label="Route")
      el-table-column(label="Actions")
        template(slot-scope="scope")
          el-button-group
            el-button GET
            el-button POST
</template>

<script>
export default {
  mounted() {
    this.$emit('admin', {method: 'menu', params: {items: [
      { name: 'Admin', component: 'Admin/Root' },
      { name: 'Debug', component: 'Admin/Debug' },
    ]}});
  },
  data() {
    return {
      routes: null,
    };
  },
  computed: {
    data() {
      if (this.routes === null) {
        this.getRoutes();
      }
      const data = [];
      const routes = (this.routes || {});
      for (const id in routes) {
        data.push({ id, route: routes[id] });
      }
      return data;
    },
  },
  methods: {
    async getRoutes() {
      if (this.routes === null) {
        this.routes = await this.$request().constructor.routes();
      }
      return this.routes;
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