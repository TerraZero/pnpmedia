<template lang="pug">
  .form-json-schema-overview(v-if="loaded")
    .form-json-schema-overview__filter
      el-select(v-model="select", @input="getListing(true)")
        el-option(v-for="option in options", :key="option.key", :label="option.label", :value="option.key")
      el-input(v-if="select", v-model="search", @input="getListing()")
        template(#prepend) Search
      el-button(v-if="select", type="primary", @click="onAdd") Add
    .form-json-schema-overview__view(v-if="select")
      FormJSONSchemaViews(:items="list", :schema="schema", @select="onSelect")
        template(#operations="{ row }")
          el-button(type="primary", @click="onSelect(row)") Edit
      .form-json-schema-browser__pager(v-if="pager")
        el-pagination(:total="pager.total", :current-page.sync="current", :page-size="12", layout="prev, pager, next", background, @current-change="getListing")
    el-dialog.form-json-schema-overview__dialog(:visible.sync="show", :close-on-click-modal="false", :fullscreen="true", append-to-body, :show-close="false")
      FormJSONSchema(v-if="show", :type="select", :value="dialog", :mode="isAdd ? 'create' : 'edit'")
      template(#footer)
        el-button-group
          el-button(type="primary", @click="onBrowser('save')") Save
          el-button(@click="onBrowser('cancel')") Cancel
</template>

<script>
const handlers = {};

export default {
  async mounted() {
    await this.$entity.schemas();
    this.loaded = true;
  },
  data() {
    return {
      dialog: {},
      show: false,
      isAdd: false,

      loaded: false,
      select: null,

      search: '',
      listing: null,
      pager: null,
      current: 1,
    };
  },
  computed: {
    options() {
      const options = [];
      for (const schema of this.$entity.getSchemas()) {
        options.push({
          key: schema,
          label: this.$entity.getSchema(schema).getUI('label') || schema,
        });
      }
      return options;
    },
    list() {
      if (this.listing === null) {
        this.getListing();
      }
      return this.listing || [];
    },
    schema() {
      return this.$entity.getSchema(this.select);
    },
  },
  methods: {
    async getHandler() {
      if (handlers[this.select] === undefined) {
        const result = await this.$request('entity.storage.json.handlers').params({ type: this.select }).get(null, 'data');

        if (this.$request.remote(this, result)) return handlers[this.select];
        handlers[this.select] = result.handlers;
      }
      return handlers[this.select];
    },
    async getListing(page = 1) {
      if (page === true) {
        this.search = '';
        page = 1;
      }
      const result = await this.$request((await this.getHandler()).list).params({ type: this.select }).get({
          filters: {
            search: this.search,
          },
          limit: 12,
          page: page - 1,
          and: false,
      }, 'data');
      if (this.$request.remote(this, result)) return;
      this.listing = result.list;
      this.pager = result.pager;
      this.current = page;
    },
    onSelect(value) {
      this.dialog = {...value};
      this.show = true;
      this.isAdd = false;
    },
    onAdd() {
      this.dialog = {};
      this.show = true;
      this.isAdd = true;
    },
    async onBrowser(op) {
      switch (op) {
        case 'cancel':
          this.dialog = {};
          this.show = false;
          break;
        case 'save':
          let result = null;
          if (this.dialog.id) {
            result = await this.$request((await this.getHandler()).save).params({ type: this.select, id: this.dialog.id }).post(this.dialog, 'data');
          } else {
            result = await this.$request((await this.getHandler()).save).params({ type: this.select }).post(this.dialog, 'data');
          }
          if (this.$request.remote(this, result)) return;
          this.dialog = {};
          this.show = false;
          this.getListing(this.current);
          break;
      }
    },  
  },
};
</script>


<style lang="sass">
.form-json-schema-overview

  &__filter
    padding: 1em
    display: flex

  &__dialog
    margin: 5vw
</style>