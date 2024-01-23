<template>
  <app-dialog
    v-model="open"
    :saveButtonText="$t('app.general.btn.begin_calibrate')"
    :title="$t('app.general.btn.calibrate')"
    :max-width="450"
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
        :label="$t('app.bedmesh.label.profile_name')"
      />

      <v-checkbox
        v-model="savePermanently"
        :label="$t('app.bedmesh.label.save_permanently')"
        hide-details="auto"
        class="mb-4"
      />
    </v-card-text>
  </app-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Prop, VModel } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'

@Component({})
export default class SaveMeshDialog extends Mixins(StateMixin, ToolheadMixin) {
  @VModel({ type: Boolean, default: false })
    open!: boolean

  @Prop({ type: String })
  readonly profile!: string

  mounted () {
    this.name = this.profile
    this.savePermanently = false
  }

  name = 'default'
  savePermanently = false

  handleSubmit () {
    this.$emit('calibrate', { name: this.name, savePermanently: this.savePermanently })
    this.open = false
  }
}
</script>
