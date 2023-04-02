<template lang="pug">
  .control-table-entity-schemas
    el-table(v-if="schemas", :data='schemas')
      el-table-column(prop="label", label="Name")
      el-table-column(prop="entity", label="Key")
      el-table-column(label="Operations")
        template(v-slot="scope")
          ControlButtons(:buttons="schemaOP", @button="onSchemaOP($event, scope.row)")
    el-dialog.control-table-entity-schemas__dialog(:visible.sync="dialog.show", :close-on-click-modal="false", :fullscreen="true", append-to-body, @close="onClose")
      ControlButtons.control-table-entity-schemas__controls(:buttons="controlButtons", @button="onControls")
      ControlTabs.control-table-entity-schemas__tabs(v-if="active && action === 'select'", :tabs="tabs")
        template(#structure)
          pre {{ active }}
        template(#content)
          el-table.control-table-entity-schemas__table(v-if="result", :data="result.data")
            el-table-column(v-for="item, key in result.ui", :key="key", :label="item.label", :prop="key")
            el-table-column(label="Operations", fixed="right")
              template(v-slot="scope")
                ControlButtons(:buttons="entityOP", @button="onEntityOP($event, scope.row)")
          ControlButtons.control-table-entity-schemas__pager(:buttons="pagerButtons", @button="onPager")
    ControlFormEntityDialog(ref="edit", @action="onDialogAction")
</template>

<script>
export default {
  props: ['ops'],
  async mounted() {
    this.schemas = await this.$request('database.schemas', { type: 'entity' }).fetchArray('data.schemas').get();
  },
  data() {
    return {
      dialog: {
        show: false,
      },
      schemas: null,
      active: null,
      action: null,
      schemaOP: [
        {
          name: 'Select',
          key: 'select',
        },
      ],
      controlButtons: [
        {
          name: 'Add',
          key: 'add',
          iconPos: 'right',
          icon: {
            icon: 'circle-plus',
          },
        },
      ],
      entityOP: [
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
      query: {
        cid: null,
        page: 0,
        pager: {
          total: null,
        },
        result: null,
      },
    };
  },
  computed: {
    result() {
      this.update();
      return this.query.result || {};
    },
  },
  methods: {
    onSchemaOP(button, schema) {
      this.active = schema;
      this.action = button.key; 
      this.dialog.show = true;
    },
    async update(force = false) {
      const cid = 'data-' + this.active.entity;

      if (this.query.cid !== cid) {
        this.query.result = null;
        this.query.page = 0;
      }
      if (this.query.result === null || force) {
        this.query.cid = cid;
        this.query.result = await this.$request('database.entity.display', { entity: this.active.entity })
          .mount('data')
          .fetch({ select: { name: 'data', field: 'data.result' }, method: (result) => {
            return this.$request.fetchArray(result).map(v => {
              for (const index in v) {
                if (Array.isArray(v[index])) v[index] = v[index].join(', ');
              }
              return v;
            });
          }})
          .get({ page: this.query.page });
      }
    },
    async onEntityOP(button, entity) {
      let result = null;
      switch (button.key) {
        case 'edit':
          result = await this.$request('database.load', { entity: this.active.entity, id: entity.id }).get({ deep: 1 }, 'data.result.data.entity');
          
          this.$refs.edit.open(this.active, result);
          break;
        case 'delete':
          try {
            await this.$confirm('Are you sure to delete the entity.', 'Warning', {
              confirmButtonText: 'Delete',
              cancelButtonText: 'Cancel',
              confirmButtonClass: 'control-table-entity-schemas__confirm--danger',
              type: 'warning',
            });
            
            result = await this.$request('database.delete', { entity: this.active.entity, id: entity.id }).get();
            if (result.meta.error) {
              console.log(result);
              this.$notify.info({message: 'Error WIP.', position: 'bottom-right'});
            } else {
              this.$notify.success({ message: 'Delete entity success.', position: 'bottom-right' });
            }
            this.update(true);
          } catch (e) {
            this.$notify.info({ message: 'Cancel deletion.', position: 'bottom-right' });
            return false;
          }
          break;
      }
    },
    onClose() {

    },
    onPager(button) {
      const original = this.query.page;

      switch (button.key) {
        case 'prev':
          this.query.page--;
          break;
        case 'next': 
          this.query.page++;
          break;
      }

      if (this.query.page < 0 || this.query.page >= Math.ceil(this.query.pager.total / 10)) {
        this.query.page = original;
      } else {
        this.update(true);
      }
    },
    onDialogAction({ action, status }) {
      switch (action) {
        case 'delete':
        case 'save':
          this.$refs.edit.close();
          this.update(true);
          break;
      }
    },
    onControls(button) {
      if (button.key === 'add') {
        this.$refs.edit.open(this.active);
      }
    },
  },
};
</script>

<style lang="sass">
.control-table-entity-schemas
  display: block

  &__dialog
    margin: 2vw

  &__controls
    display: flex
    justify-content: right
    margin-bottom: .5em
  
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

</style>