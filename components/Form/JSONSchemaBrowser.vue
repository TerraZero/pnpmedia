<template lang="pug">
  el-dialog.form-json-schema-browser(:visible.sync="show", :close-on-click-modal="false", :fullscreen="true", append-to-body, :show-close="false")
    el-tabs(v-model="tab")
      el-tab-pane(v-if="editValue", label="Edit", name="edit")
        component(v-if="preview", :is="preview.component", :value="editValue", :field="field")
        FormJSONSchema(v-model="editValue", :type="field.schema.getRefType()", mode="edit")
        el-button-group
          el-button(type="primary", @click="browser('save')") Save
          el-button(@click="browser('cancel')") Cancel
      el-tab-pane(label="Create", name="create")
        component(v-if="preview", :is="preview.component", :key="createValue.path", :value="createValue", :field="field")
        FormJSONSchema(:value="createValue", :type="field.schema.getRefType()", mode="create", @input="createValue = JSON.parse(JSON.stringify($event))")
      el-tab-pane(label="List", name="list")
        el-input.form-json-schema-browser__filter(v-model="search", @input="getListing(1)")
          template(#prepend)
            | Search
        FormJSONSchemaViews.form-json-schema-browser__views(v-if="tab === 'list'", :items="list", :schema="field.schema", @select="onSelect")
        .form-json-schema-browser__pager(v-if="pager")
          el-pagination(:total="pager.total", :current-page.sync="current", :page-size="12", layout="prev, pager, next", background, @current-change="getListing")
    template(#footer)
      el-button-group
        el-button(type="primary", @click="browser('save')") Save
        el-button(@click="browser('cancel')") Cancel
</template>

<script>
export default {
  props: ['field', 'value'],
  data() {
    return {
      show: false,
      tab: 'create',
      createValue: {},
      editValue: null,
      handlers: {},

      search: '',
      listing: null,
      pager: null,
      current: 1,
    };
  },
  async fetch() {
    const result = await this.$request('entity.storage.json.handlers').params({ type: this.field.schema.getRefType() }).get(null, 'data');

    this.handlers = result.handlers;
  },
  computed: {
    preview() {
      let preview = this.field.schema.getUI('preview');
      if (preview === null) return null;
      if (typeof preview === 'string') {
        preview = {
          component: preview,
        };
      }
      return preview;
    },
    list() {
      if (this.listing === null) {
        this.getListing();
      }
      return this.listing || [];
    },  
  },
  methods: {
    onSelect(item) {
      this.$emit('browser', { op: 'select', selected: item });
    },
    close() {
      this.show = false;
      this.createValue = {};
    },
    log(value) {
      return console.log(value) || value;
    },
    setCreate() {
      this.tab = 'create';
      this.editValue = null;
      this.show = true;
    },
    setEdit(value) {
      this.tab = 'edit';
      this.editValue = value;
      this.show = true;
    },
    async browser(op) {
      if (op === 'cancel') {
        this.$emit('browser', { op: 'cancel' });
        return;
      }
      let result = null;
      if (this.tab === 'create') {
        result = await this.$request(this.handlers[op]).params({ type: this.field.schema.getRefType() }).post(this.createValue, 'data');
      } else if (this.tab === 'edit') {
        result = await this.$request(this.handlers[op]).params({ type: this.field.schema.getRefType(), id: this.editValue.id }).post(this.editValue, 'data');
      }
      this.doResult(result, op);
    },
    doResult(result, op) {
      if (this.$request.remote(this, result)) return;
      this.$emit('browser', {
        tab: this.tab,
        op: op,
        result: result,
      });
    },
    async getListing(page = 1) {
      const result = await this.$request(this.handlers.list).params({ type: this.field.schema.getRefType() }).get({
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
  },
};
</script>


<style lang="sass">
.form-json-schema-browser
  margin: 5vw

  &__filter,
  &__views
    margin-bottom: 1em

  &__pager
    text-align: center
  
</style>