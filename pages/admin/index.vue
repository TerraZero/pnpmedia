<template lang="pug">
  .page-admin
    .page-admin__breadcrumb(v-if="menuitems")
      MenuBreadcrumb(:items="menuitems", @admin="admin")
    .page-admin__content(v-if="component && comp")
      component(:is="comp", :key="component", @admin="admin", ref="content")
</template>

<script>
export default {
  mounted() {
    this.goto({ component: 'Admin/Root' });
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.component) {
        this.goto({ component: event.state.component }, false);
      }
    });
  },
  data() {
    return {
      menuitems: null,
      component: null,
      comp: null,
    };
  },
  computed: {
    content() {
      return this.$refs.content;
    },
  },
  methods: {
    admin(action) {
      if (action.method) {
        console.log(action);
        this[action.method](action.params || {});
      }
    },
    goto({ component }, push = true) {
      if (this.component !== component) {
        this.component = component;
        this.comp = () => import(`@/components/${this.component}.vue`);
        if (push) history.pushState({ component }, document.title);
        setTimeout(() => { 
          if (typeof this.content.adminInit === 'function') {
            this.content.adminInit();
          }
        }, 1);
      }
    },
    menu({ items }) {
      this.menuitems = items;
    },
  },
};
</script>

<style lang="sass">
body
  margin: 0
  background: #27293d
  font-family: 'Open Sans', sans-serif

.page-admin
  width: 100vw
  height: 100vh
  overflow: auto
  display: flex
  flex-direction: column

  &__content
    height: 100%

.el-input

  &__inner
    background: #d6edef

  &.is-disabled &__inner
    color: #6e7176

  &.is-disabled .el-input-group__prepend
    background: #999c9d

.el-input-group

  &__prepend
    background: #84c8cf
    color: black

.el-loading-mask
  background: #747d8c
  
</style>