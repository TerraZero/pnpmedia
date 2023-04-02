<template lang="pug">
  .entity-browser-image
    el-tabs.entity-browser-image__tabs(type="border-card", :value="value ? 'edit' : 'list'", @tab-click="tabs")
      el-tab-pane.entity-browser-image__tab(v-if="value", name="edit")
        template(#label)
          i.el-icon-edit
          .entity-browser-image__label Edit
        .entity-browser-image__view
          EntityViewImage(:value="value", @entity="loadEntity")
          el-popconfirm.entity-browser-image__delete(title="Do you want to delete this image from system?", confirm-button-text="Delete", confirm-button-type="danger", cancel-button-text="Cancel", @confirm="deleteImage", :hide-icon="true")
            template(#reference)
              el-button(type="danger", icon="el-icon-delete")
        el-input.entity-browser-image__field(v-model="edit.id", disabled)
          template(#prepend)
            | ID
        el-input.entity-browser-image__field(v-model="edit.url", disabled)
          template(#prepend)
            | URL
        el-input.entity-browser-image__field(v-model="edit.name")
          template(#prepend)
            | Name
        el-input.entity-browser-image__field(v-model="edit.file", disabled)
          template(#prepend)
            | File
        el-input.entity-browser-image__field(v-model="edit.path", disabled)
          template(#prepend)
            | Path
        .entity-browser-image__actions
          el-button-group
            el-button(type="primary", icon="el-icon-edit", @click="save('update')") Update
            el-button(icon="el-icon-remove", @click="remove") Remove
            el-button(icon="el-icon-close", @click="close") Cancel
      el-tab-pane.entity-browser-image__tab(name="list")
        template(#label)
          i.el-icon-tickets
          .entity-browser-image__label List
        el-input.entity-browser-image__field(v-model="filters.search", @input="list(1)")
          template(#prepend)
            | Search
        .entity-browser-image__listing
          .entity-browser-image__item(v-for="item in getlisting", :key="item.id", @click="choose(item)")
            EntityViewImage.entity-browser-image__image-item(:path="item.path")
            .entity-browser-image__meta
              | {{ item.id }} | {{ item.name }}
            .entity-browser-image__meta
              | {{ item.path }}
        .entity-browser-image__pager(v-if="pager")
          el-pagination(:total="pager.total", :current-page.sync="current", :page-size="12", layout="prev, pager, next", background, @current-change="list")
      el-tab-pane.entity-browser-image__tab(name="new")
        template(#label)
          i.el-icon-plus
          .entity-browser-image__label New
        .entity-browser-image__view
          EntityViewImage(:path="url")
        el-input.entity-browser-image__field(v-model="url")
          template(#prepend)
            | URL
        el-input.entity-browser-image__field(v-model="name", @input="updateFileID")
          template(#prepend)
            | Name
        el-input.entity-browser-image__field(v-model="file", @input="file_updated = true")
          template(#prepend)
            | File
        .entity-browser-image__actions
          el-button-group
            el-button(type="primary", icon="el-icon-edit", @click="save('create')") Save (Download)
            el-button(icon="el-icon-close", @click="close") Cancel
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      edit: {
        id: '',
        url: '',
        name: '',
        file: '',
        path: '',
      },
      filters: {
        search: '',
      },
      url: '',
      name: '',
      file: '',
      file_updated: false,
      listing: null,
      pager: null,
      current: 1,
    };
  },
  computed: {
    getlisting() {
      if (this.listing === null) {
        this.list();
      }
      return this.listing || [];
    },
  },
  methods: {
    tabs() {
      this.listing = null;
    },
    close() {
      this.$emit('browser', {op: 'close'});
    },
    remove() {
      this.$emit('browser', {op: 'remove'});
    },
    async deleteImage() {
      await this.$request('image.delete', { id: this.edit.id }).get();
      this.remove();
      this.listing = null;
    },
    loadEntity({ entity }) {
      this.edit.id = entity.id;
      this.edit.url = entity.url;
      this.edit.name = entity.name;
      this.edit.file = entity.file;
      this.edit.path = entity.path;
    },
    updateFileID() {
      if (this.file_updated) return;
      this.file = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/(-+)/g, '-');
    },
    choose(entity) {
      this.$emit('browser', {
        op: 'choose',
        entity,
        id: entity.id,
      });
    },
    async list(page = 1) {
      const { list, pager } = (await this.$request('image.list').get({
        filters: JSON.stringify({
            name: this.filters.search,
            url: this.filters.search,
            path: this.filters.search,
          }),
          limit: 12,
          page: page - 1,
          and: false,
      })).data;
      this.listing = list;
      this.pager = pager;
      this.current = page;
    },
    async save(op) {
      let entity = {};
      if (op === 'update') {
        entity = (await this.$request('image.update', { id: this.edit.id }).post({
          name: this.edit.name,
        })).data.entity;
      } else if (op === 'create') {
        entity = (await this.$request('image.create').post({
          name: this.name,
          url: this.url,
          file: this.file,
        })).data.entity;
        this.url = '';
        this.name = '';
        this.file = '';
        this.file_updated = false;
      }
      this.$emit('browser', {
        op,
        entity,
        id: entity.id,
      });
    },
  },
}
</script>

<style lang="sass">
.entity-browser-image
  display: block

  &__tabs
    background: #27293d
    border-color: black

  &__tabs > .el-tabs__header .el-tabs__item.is-active
    background-color: #27293d
    border-right-color: black
    border-left-color: black

  &__tabs > .el-tabs__header
    background-color: #424245
    border-color: black

  &__field,
  &__actions
    margin-top: 1em

  &__field .el-input-group__prepend
    width: 70px
    text-align: center
  
  &__view
    display: flex
    justify-content: center
    position: relative

  &__delete
    position: absolute
    top: 0
    right: 0

  &__actions
    text-align: right

  &__label
    display: inline-block
    margin-left: .3em

  &__listing
    display: flex
    flex-wrap: wrap
    margin-top: 1em
    max-height: 65vh
    overflow: auto

  & &__item
    max-width: 33%
    padding: .5em 0
    box-sizing: border-box
    position: relative
    cursor: pointer
    height: fit-content
    margin-right: 2px
  
  & &__item:after
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(255, 255, 255, .3)
    opacity: 0
    transition: opacity .3s ease-in-out

  & &__item:hover:after
    opacity: 1

  &__pager
    margin-top: 1em
    text-align: center

  & &__image-item
    max-width: 100%
    box-sizing: border-box 
  
  &__meta
    background: rgba(0, 0, 0, .7)
    color: white
    padding: .3em

</style>