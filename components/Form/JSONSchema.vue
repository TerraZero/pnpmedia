<template lang="pug">
  .form-json-schema(v-if="loaded")
    .form-json-schema__field(v-for="field of fields")
      component(v-if="field.definition.wrapper", :is="field.definition.wrapper", v-bind="props(field, 'wrapper')")
        component(:is="field.definition.comp", v-bind="props(field, 'comp')", @input="onInput($event, field)")
      component(v-else, :is="field.definition.comp", v-bind="props(field, 'comp')", @input="onInput($event, field)")
</template>

<script>
export default {
  props: ['type', 'value', 'mode'],
  async mounted() {
    await this.$entity.schemas();
    this.loaded = true;
  },
  data() {
    return {
      loaded: false,
    };
  },
  computed: {
    fields() {
      const schema = this.$entity.getSchema(this.type);
      const definitions = this.definitions;
      const fields = [];
      for (const prop in schema.props) {
        fields.push({
          prop,
          mode: this.mode,
          schema: schema.getProp(prop),
          definition: definitions.find(v => {
            if (v.contains) return schema.props[prop][v.contains];
            if (typeof v.matcher === 'function') {
              return v.matcher(prop, schema.props[prop]);
            } else if (typeof v.matcher === 'object') {
              for (const item in v.matcher) {
                if (schema.props[prop][item] !== v.matcher[item]) return false;
              }
              return true;
            }
          }),
        });
      }
      return fields;
    },
    definitions() {
      return [
        {
          comp: 'FormJSONSchemaRef',
          contains: '$ref',
          wrapper: 'FormJSONSchemaWrapper',
          props: (type, field) => ({
            field: field,
          }),
        },
        {
          comp: 'FormJSONSchemaRef',
          matcher: { type: 'array' },
          wrapper: 'FormJSONSchemaWrapper',
          props: (type, field) => ({
            field: field,
          }),
        },
        {
          comp: 'FormJSONSchemaInput',
          matcher: { type: 'string' },
          wrapper: 'FormJSONSchemaWrapper',
          props: (type, field) => ({
            field: field,
          }),
        },
        {
          comp: 'FormJSONSchemaInput',
          matcher: { type: 'number' },
          wrapper: 'FormJSONSchemaWrapper',
          props: (type, field) => ({
            field: field,
          }),
        },
      ];
    },
  },
  methods: {
    log(value) {
      return console.log('[LOG - FormJSONSchema]:', value) || value;
    },
    props(field, type) {
      let props = {};
      if (typeof field.definition.props === 'function') {
        props = field.definition.props(type, field);
      } else if (field.definition.props) {
        props = field.definition.props;
      }
      props.value = this.value[field.prop] || '';
      return props;
    },
    onInput(event, field) {
      this.value[field.prop] = event;
      this.$emit('input', this.value);
      this.$forceUpdate();
    },
  },
};
</script>


<style lang="sass">
.form-json-schema
  border: 2px solid black
  padding: 1em
  box-sizing: border-box

  &__field + &__field
    margin-top: .5em
</style>