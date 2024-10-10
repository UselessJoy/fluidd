<template>
    <collapsable-card
      :title="$t('app.general.title.shaper_controls')"
      :lazy="false"
      icon="$bedMesh"
    >
      <v-simple-table
        v-if="shaperGraphs.saved.length > 0"
        class="no-hover mb-4"
      >
        <thead class="font-weight-medium">
          <tr>
            <th style="font-size: 16px;"> {{ $t('app.shaper.label.saved_graphs') }} </th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="graph in shaperGraphs.saved"
            :key="graph"
          >
            <td class="">
              {{ graph.split('/').pop() }}
            </td>
            <td>
              <v-chip
                v-if="shaperGraphs.active === graph"
                small
                block
              >
                {{ $t('app.shaper.label.chosen') }}
              </v-chip>
            </td>
            <td
              class="text-right"
              nowrap
            >
              <v-tooltip
                v-if="!(shaperGraphs.active === graph)"
                bottom
              >
                <template #activator="{ on, attrs }">
                  <app-btn
                    v-bind="attrs"
                    x-small
                    color=""
                    fab
                    text
                    @click="loadShaper(graph)"
                    v-on="on"
                  >
                    <v-icon>$open</v-icon>
                  </app-btn>
                </template>
                <span>{{ $t('app.shaper.tooltip.load') }}</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <app-btn
                    v-bind="attrs"
                    color=""
                    class="ml-2"
                    fab
                    text
                    x-small
                    @click="renameShaper(graph)"
                    v-on="on"
                  >
                    <v-icon color="">
                      $rename_outline
                    </v-icon>
                  </app-btn>
                </template>
                <span>{{ $t('app.shaper.tooltip.rename') }}</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <app-btn
                    v-bind="attrs"
                    color=""
                    class="ml-2"
                    fab
                    text
                    x-small
                    @click="removeShaper(graph)"
                    v-on="on"
                  >
                    <v-icon color="">
                      $close
                    </v-icon>
                  </app-btn>
                </template>
                <span>{{ $t('app.shaper.tooltip.delete') }}</span>
              </v-tooltip>
  
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-simple-table
        v-if="shaperGraphs.tmp.length > 0"
        class="no-hover mt-4"
      >
        <thead class="font-weight-medium">
          <tr>
            <th style="font-size: 16px;">{{ $t('app.shaper.label.tmp_graphs') }}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="graph in shaperGraphs.tmp"
            :key="graph"
          >
            <td class="">
              {{ graph.split('/').pop() }}
            </td>
            <td>
              <v-chip
                v-if="shaperGraphs.active === graph"
                small
                block
              >
                {{ $t('app.shaper.label.chosen') }}
              </v-chip>
            </td>
            <td
              class="text-right"
              nowrap
            >
              <v-tooltip
                v-if="!(shaperGraphs.active === graph)"
                bottom
              >
                <template #activator="{ on, attrs }">
                  <app-btn
                    v-bind="attrs"
                    x-small
                    color=""
                    fab
                    text
                    @click="loadShaper(graph)"
                    v-on="on"
                  >
                    <v-icon>$open</v-icon>
                  </app-btn>
                </template>
                <span>{{ $t('app.shaper.tooltip.load') }}</span>
              </v-tooltip>
  
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <app-btn
                    v-bind="attrs"
                    color=""
                    class="ml-2"
                    fab
                    text
                    x-small
                    @click="saveShaper(graph)"
                    v-on="on"
                  >
                    <v-icon color="">
                      $save
                    </v-icon>
                  </app-btn>
                </template>
                <span>{{ $t('app.shaper.tooltip.save') }}</span>
              </v-tooltip>
  
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <app-btn
                    v-bind="attrs"
                    color=""
                    class="ml-2"
                    fab
                    text
                    x-small
                    @click="removeShaper(graph)"
                    v-on="on"
                  >
                    <v-icon color="">
                      $close
                    </v-icon>
                  </app-btn>
                </template>
                <span>{{ $t('app.shaper.tooltip.delete') }}</span>
              </v-tooltip>
  
            </td>
          </tr>
        </tbody>
      </v-simple-table>



      <v-card-text>
        <div
          v-if="shaperGraphs.saved.length === 0"
          class="mb-4"
        >
          {{ $t('app.shaper.msg.not_found') }}
        </div>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="6">
            <app-btn
              :disabled="shaperGraphs.active === ''"
              block
              class="mb-2"
              @click="clearShaper()"
            >
              {{ $t('app.shaper.btn.clear_shaper') }}
            </app-btn>
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="6">
            <v-menu
              left
              offset-y
              transition="slide-y-transition"
            >
              <template #activator="{ on, attrs, value }">
                <app-btn
                  v-bind="attrs"
                  class="mb-2"
                  :color="'primary'"
                  :disabled="!klippyReady || printerPrinting || printerBusy"
                  v-on="on"
                >
                    {{ $t('app.general.btn.shaper_calibrate') }}
                  <v-icon
                    small
                    class="ml-1"
                    :class="{ 'rotate-180': value }"
                  >
                    $chevronDown
                  </v-icon>
                </app-btn>
              </template>
              <v-list dense>
                <template v-for="axis of ['x', '-', 'y', '-', 'all']">
                  <v-list-item
                    v-if="axis != '-'"
                    :key="axis"
                    @click="sendGcode(`SHAPER_CALIBRATE AXIS=${axis}`, $waits.onShaperCalibrate)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t(`app.shaper.axis.${axis}`) }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider v-else/>
                </template>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>

      <save-shaper-dialog
        v-if="saveDialogState.open"
        v-model="saveDialogState.open"
        :graph="saveDialogState.graph"
        :save="saveDialogState.save"
        @confirm="handleShaperConfirm"
      />

    </collapsable-card>
  </template>
  
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import { SocketActions } from '@/api/socketActions'
import SaveShaperDialog from '@/components/widgets/bedmesh/SaveShaperDialog.vue'

type ShaperPaths = {
    saved: Array<string>;
    tmp: Array<string>;
    active: string;
}
@Component({
components: {
  SaveShaperDialog
}
})
export default class ShaperControls extends Mixins(StateMixin) {
    saveDialogState = {
        open: false,
        save: false,
        graph: ""
    }
    
    get shaperGraphs (): ShaperPaths {
        const graphs = this.$store.getters['printer/getShaperGraphs'] as ShaperPaths
        return graphs
    }

    async loadShaper(graph: string) {
      SocketActions.resonanceTesterAction("load", [graph])
    }

    saveShaper(graph: string) {
      this.handleOpenSaveShaperDialog(graph, true)
    }

    removeShaper(graph: string) {
      SocketActions.resonanceTesterAction("delete", [graph])
    }

    clearShaper() {
      SocketActions.resonanceTesterAction("unload", [])
    }

    renameShaper(graph: string) {
      this.handleOpenSaveShaperDialog(graph, false)
    }

    handleOpenSaveShaperDialog (graph: string, save: boolean) {
      this.saveDialogState = {
        open: true,
        save: save,
        graph: graph,
      }
    }

    handleShaperConfirm (graph: string, name: string, save: boolean) {
      SocketActions.resonanceTesterAction(save ? "save" : "rename", [graph, name])
    }

}
</script>

<style lang="scss" scoped>
    :deep(.v-input__slider .v-input__slot .v-label) {
        min-width: 82px;
    }
</style>
