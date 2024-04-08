<template>
    <app-dialog
      v-model="open"
      :saveButtonText="$t('app.general.btn.save')"
      :title="$t('app.file_system.title.rename_file')"
      max-width="450"
      @save="handleSubmit()"
    >
      <v-card-text>
        <v-text-field
          v-model="name"
          autofocus
          filled
          required
          class="mb-4"
          :rules="[
            $rules.required
          ]"
          hide-details="auto"
          :label="$t('app.file_system.label.file_name')"
        />
      </v-card-text>
    </app-dialog>
  </template>
  
  <script lang="ts">
  import { Component, Mixins, Prop, VModel } from 'vue-property-decorator'
  import StateMixin from '@/mixins/state'
  import ToolheadMixin from '@/mixins/toolhead'
  
  @Component({})
  export default class SaveShaperDialog extends Mixins(StateMixin, ToolheadMixin) {
    @VModel({ type: Boolean })
      open?: boolean
  
    @Prop({ type: String })
    readonly graph!: string
    
    @Prop({type: Boolean})
    readonly save!: boolean 

    mounted () {
      this.name = this.graph.split('/').pop()?.split('.')[0] ?? "shaper_graph"
      this.extension = '.' + this.graph.split('.').pop()
    }
    extension = ".png"
    name = "shaper_graph"
  
    handleSubmit () {
      this.$emit('confirm', this.graph, this.name + this.extension, this.save)
      this.open = false
    }
  }
  </script>
  