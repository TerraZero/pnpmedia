<template lang="pug">
  ControlContentLayout.control-database(:class="classes", ref="layout")
    template(#title)
      | Database
    template
      .control-database__content
        ControlTabs.control-database__tabs(ref="tabsmaster", :tabs="masterTabs")
          template(#table)
            el-table(:data='schemas.table', key="master-table")
              el-table-column(prop="table", label="Name", key="master-name")
              el-table-column(prop="type", label="Type", key="master-type")
              el-table-column(label="Operations", key="master-op")
                template(v-slot="scope")
                  ControlButtons(:buttons="masterSelect", @button="onSelect($event, scope.row)")
          template(#entity)
            ControlTableEntitySchemas
      ControlFormDataDialog(ref="edit", @action="onEditAction")
    template(#dialog)
      ControlButtons.control-database__add-button(:buttons="[{name: 'Add', key: 'add'}]", @button="onShow")
      ControlTabs.control-database__tabs(v-if="activeSchema", :tabs="tabs")
        template(#structure)
          pre {{ activeSchema }}
        template(#content)
          el-table.control-database__table(v-if="showData", :data="showData", key="schema-table")
            el-table-column(v-for="label, column in showColumns", :key="'schema-' + column", :label="label", :prop="column")
            el-table-column(label="Operations", fixed="right", key="schema-op")
              template(v-slot="scope")
                ControlButtons(:buttons="showButtons", @button="onShow($event, scope.row)")
          ControlButtons.control-database__pager(:buttons="pagerButtons", @button="onPager")
      ControlTabs.control-database__tabs(v-if="activeEntitySchema", :tabs="tabs")
        template(#structure)
          pre {{ activeEntitySchema }}
        template(#content)
          el-table.control-database__table(v-if="showEntityData", :data="showEntityData._result", key="entity-schema-table")
            el-table-column(v-for="item, key in showEntityData.ui", :key="'entity-schema-' + key", :label="item.label", :prop="key")
            el-table-column(label="Operations", fixed="right", key="entity-schema-op")
              template(v-slot="scope")
                ControlButtons(:buttons="showButtons", @button="onShow($event, scope.row)")
</template>

<script>
export default {
  async mounted() {
    const table = await this.$request('database.schemas', { type: 'table' }).get(null, 'data.schemas');
    this.schemas.table = [];
    for (const i in table) {
      this.schemas.table.push(table[i]);
    }

    const entity = await this.$request('database.schemas', { type: 'entity' }).get(null, 'data.schemas');
    this.schemas.entity = [];
    for (const i in entity) {
      this.schemas.entity.push(entity[i]);
    }
  },
  data() {
    return {
      data: {
        cid: null,
        query: null,
        page: 0,
      },
      entityData: {
        cid: null,
        query: null,
        page: 0,
      },
      editSchema: {
        id: {
          label: 'ID',
        }
      },
      activeSchema: null,
      activeEntitySchema: null,
      schemas: {
        table: null,
        entity: null,
      },
      search: '',
      masterTabs: [
        {
          name: 'Table',
          key: 'table',
        },
        {
          name: 'Entity',
          key: 'entity',
        },
      ],
      masterSelect: [
        {
          name: 'Select',
          key: 'select',
        },
      ],
      showButtons: [
        {
          name: 'Edit',
          key: 'edit',
        },
        {
          name: 'Delete',
          key: 'delete',
          danger: true,
        },
      ],
      pagerButtons: [
        {
          icon: {
            icon: 'caret-left',
          },
          key: 'prev',
        },
        {
          icon: {
            icon: 'caret-right',
          },
          key: 'next',
        },
      ],
      tabs: [
        {
          icon: {
            icon: 's-data',
          },
          name: 'Content',
          key: 'content',
        },
        {
          icon: {
            icon: 's-grid',
          },
          name: 'Structure',
          key: 'structure',
        },
      ],
    };
  },
  computed: {
    schemaType() {
      return this.$refs.tabsmaster.active;
    },
    classes() {
      const classes = [];

      return classes;
    },
    showData() {
      this.updateData();
      return this.data.query && this.data.query.result || [];
    },
    showEntityData() {
      this.updateEntityData();
      return this.entityData.query || {};
    },
    showColumns() {
      const columns = {};

      const schema = this.editFieldSchema;
      for (const index in schema) {
        if (schema[index].nolist) continue;
        columns[index] = schema[index].label;
      }
      return columns;
    },
    editFieldSchema() {
      const schema = {};
      if (this.activeSchema.type === 'base') {
        schema.id = {
          label: 'ID (AUTO)',
        };

        schema.weight = {
          label: 'Weight',
        };
      } else if (this.activeSchema.type === 'field') {
        schema.refType = {
          label: 'Ref Type',
        };

        schema.refField = {
          label: 'Ref Field',
        };

        schema.ref = {
          label: 'Ref ID',
        };

        schema.refDelta = {
          label: 'Ref Delta',
        };
      }

      for (const field of this.activeSchema.fields) {
        schema[field.name] = field.ui || {};
        schema[field.name].label = schema[field.name].label || field.name;
      }
      return schema;
    },
  },
  methods: {
    test(log, value = null) {
      console.log(log);
      return value || 'test';
    },
    onSelect(button, row) {
      switch (button.key) {
        case 'select':
          this.activeSchema = row;
          this.$refs.layout.doDialog('open');
          break;
      }
    },
    onEntitySelect(button, row) {
      switch (button.key) {
        case 'select':
          this.activeEntitySchema = row;
          this.$refs.layout.doDialog('open');
          break;
      }
    },
    onShow(button, row) {
      switch (button.key) {
        case 'edit':
          this.$refs.edit.doDialog('open', { 
            data: row,
            schema: this.editFieldSchema,
            actions: [
              {
                name: 'Save',
                key: 'save',
                icon: {
                  icon: 'upload',
                },
              },
              {
                name: 'Delete',
                key: 'delete',
                icon: {
                  icon: 'delete-solid',
                },
                danger: true,
              },
            ],
          });
          break;
        case 'delete':
          this.doDeleteRow(row);
          break;
        case 'add':
          const data = {};

          for (const field of this.activeSchema.fields) {
            data[field.name] = '';
          }

          this.$refs.edit.doDialog('open', {
            data: data,
            schema: this.editFieldSchema,
            actions: [
              {
                name: 'Save',
                key: 'save',
                icon: {
                  icon: 'upload',
                },
              }
            ],
          });
          break;
      }
    },
    onPager(button) {
      const original = this.data.page;

      switch (button.key) {
        case 'prev':
          this.data.page--;
          break;
        case 'next': 
          this.data.page++;
          break;
      }

      if (this.data.page < 0 || this.data.page >= Math.ceil(this.data.query.pager.total / this.data.query.pager.limit)) {
        this.data.page = original;
      } else {
        this.updateData(true);
      }
    },
    async onEditAction({ action, data, schema }) {
      switch (action.key) {
        case 'save':
          const result = await this.$request('database.row.save', { table: this.activeSchema.table }).post(data);
          if (result.meta.error) {
            this.$refs.edit.showError(result.meta.error);
          } else {
            this.$notify.success({message: 'Save row success.', position: 'bottom-right'});
            this.updateData(true);
            this.$refs.edit.doDialog('close');
          }
          break;
        case 'delete':
          if (await this.doDeleteRow(data)) {
            this.$refs.edit.doDialog('close');
          }
          break;
      }
    },
    async doDeleteRow(row) {
      try {
        await this.$confirm('Are you sure to delete the row.', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          confirmButtonClass: 'control-database__confirm--danger',
          type: 'warning',
        });
        
        const result = await this.$request('database.row.delete', { table: this.activeSchema.table }).post(row);
        if (!result.meta.error) {
          this.$notify.success({message: 'Delete row success.', position: 'bottom-right'});
          this.updateData(true);
        }
      } catch (e) {
        this.$notify.info({message: 'Cancel deletion.', position: 'bottom-right'});
        return false;
      }
      return true;
    },
    async updateData(force = false) {
      const cid = 'data-' + this.schemaType + '-' + this.activeSchema.table;
      if (this.data.cid !== cid) {
        this.data.query = null;
        this.data.page = 0;
      }
      if (this.data.query === null || force) {
        this.data.cid = cid;
        this.data.query = await this.$request('database.query', { table: this.activeSchema.table }).get({ page: this.data.page, total: 1 }, 'data');
      }
    },
    async updateEntityData(force = false) {
      const cid = 'data-' + this.schemaType + '-' + this.activeEntitySchema.table;

      if (this.entityData.cid !== cid) {
        this.entityData.query = null;
        this.entityData.page = 0;
      }
      if (this.entityData.query === null || force) {
        this.entityData.cid = cid;
        this.entityData.query = await this.$request('database.entity.display', { entity: this.activeEntitySchema.entity }).get({ page: this.entityData.page }, 'data');
        if (this.entityData.query && this.entityData.query.result) {
          this.entityData.query._result = [];
          for (const item in this.entityData.query.result) {
            for (const key in this.entityData.query.result[item]) {
              if (Array.isArray(this.entityData.query.result[item][key])) {
                this.entityData.query.result[item][key] = this.entityData.query.result[item][key].join(', ');
              }
            }
            this.entityData.query._result.push(this.entityData.query.result[item]);
          }
        }
      }
    },
  },
};
</script>

<style lang="sass">
.control-database
  display: block

  &__tabs
    --control-tabs--header--background: #f1f1f1
    overflow-y: auto

  &__content
    height: 100%

  &__pager
    display: flex
    justify-content: center
    padding-top: 1em

  .el-message-box &__confirm--danger
    background: #e76f51
    border-color: red

    &:hover
      background: #d62828
      border-color: red
      
  &__add-button
    display: flex
    justify-content: right
    margin-bottom: 1em
    
</style>