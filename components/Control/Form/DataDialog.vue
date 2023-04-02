<template lang="pug">
  el-dialog.control-form-data-dialog(:visible.sync="show", :close-on-click-modal="false", :fullscreen="true", append-to-body, @close="onClose")
    ControlButtons.control-form-data-dialog__actions(:buttons="actions", @button="onButton")
    el-alert.control-form-data-dialog__alert(v-if="error", type="error", :title="error.title", :description="error.message", show-icon)
    CustomFormLabel.control-form-data-dialog__field(v-if="data && show", v-for="field in fields", :key="field", :label="getLabel(field)", :class="getFieldClasses(field)")
      textarea.control-form-data-dialog__textarea(v-if="getFieldData(field, 'type', 'text') === 'textarea'", v-model="data[field]")
      textarea.control-form-data-dialog__textarea(v-if="getFieldData(field, 'type', 'text') === 'json'", :value="getJSON(field)" @input="setJSON(field, $event)")
      input.control-form-data-dialog__input(v-if="getFieldData(field, 'type', 'text') === 'text'", type="text", v-model="data[field]")
      select.control-form-data-dialog__select(v-if="getFieldData(field, 'type', 'text') === 'select'", v-model="data[field]")
        option(v-for="value, key in getFieldData(field, 'options')", :key="key", :value="key") {{ value }}
      CustomFormDescription(v-if="getFieldData(field, 'description')", :description="getFieldData(field, 'description')")
      
</template>

<script>
export default {
  data() {
    return {
      data: null,
      original: null,
      schema: null,
      actions: null,
      show: false,
      error: null,
    };
  },
  computed: {
    fields() {
      if (this.schema) {
        return Object.keys(this.schema);
      } else if (this.data) {
        return Object.keys(this.data);
      } else {
        return [];
      }
    },
    classes() {
      const classes = [];

      return classes;
    },
  },
  methods: {
    getLabel(field) {
      return this.schema && this.schema[field] && this.schema[field].label || field;
    },
    getFieldData(field, prop, fallback = false) {
      return this.schema && this.schema[field] && this.schema[field][prop] || fallback;
    },
    doDialog(action, options) {
      switch (action) {
        case 'open':
          this.show = true;
          this.data = JSON.parse(JSON.stringify(options.data));
          this.original = JSON.parse(JSON.stringify(options.data));
          this.schema = options.schema || null;
          this.actions = options.actions || null;
          break;
        case 'close':
          this.show = false;
          this.error = null;
          break;
      }
    },
    onButton(button) {
      if (button.dialog && button.dialog.action) {
        if (Array.isArray(button.dialog.action)) {
          this.doDialog(...button.dialog.action);
        } else {
          this.doDialog(button.dialog.action);
        }
      }
      this.$emit('action', {
        action: button,
        data: this.data,
        schema: this.schema,
      });
    },
    showError({title, message, field}) {
      this.error = { title, message, field };
    },
    getFieldClasses(field) {
      if (this.error && this.error.field === field) {
        return ['control-form-data-dialog__field--error'];
      }
      return [];
    },
    onClose() {
      this.error = null;
    },
    getJSON(field) {
      try {
        return JSON.stringify(JSON.parse(this.original[field]), null, 2);
      } catch (e) {}
      return this.original[field];
    },
    setJSON(field, event) {
      try {
        if (event.target.value === '') {
          this.data[field] = '';
          this.original[field] = '';
        } else {
          const newValue = JSON.stringify(JSON.parse(event.target.value));
          this.data[field] = newValue;
          this.original[field] = newValue;
        }
        return;
      } catch (e) {}
      this.original[field] = event.target.value;
    },
  },
};
</script>

<style lang="sass">
.control-form-data-dialog
  margin: 5vw

  &__field
    display: block
    padding: .5em

  &__field--error
    background: #fef0f0
    outline: 2px solid red

  &__select,
  &__input,
  &__textarea
    max-width: 100%
    min-width: 100%
    width: 100%
    padding: .5em 1em
    box-sizing: border-box

  &__textarea
    min-height: 15vh

  &__actions
    display: flex
    justify-content: right
    text-align: center

  &__alert
    margin: 1em 0

</style>