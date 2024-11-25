import type { GetterTree } from 'vuex'
import type { MeshState, KlipperMesh, AppMeshes } from './types'
import type { RootState } from '../types'
import { transformMesh } from '@/util/transform-mesh'

export const getters: GetterTree<MeshState, RootState> = {

  /**
   * Has this printer been configured for bed meshes?
   */
  getSupportsBedMesh: (state, getters, rootState, rootGetters) => {
    return rootGetters['printer/getPrinterSettings']('bed_mesh') !== undefined
  },

  /**
   * Returns all available bed meshes, including those only in memory / currently loaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBedMeshes: (state, getters, rootState, rootGetters): KlipperMesh[] => {
    const meshes: KlipperMesh[] = []
    const klipperMeshes = rootState.printer.printer.bed_mesh
    if (!klipperMeshes.profiles || !klipperMeshes.unsaved_profiles || !klipperMeshes) {
      return meshes
    }
    const profiles:string[] = Object.keys(klipperMeshes.profiles)
    const unsaved_profiles:string[] = klipperMeshes.unsaved_profiles
    // alert(klipperMeshes.unsaved_profiles)
    const currentProfile = rootState.printer.printer.bed_mesh.profile_name || ''
    for (const profile of profiles) {
      if (currentProfile === profile) {
        meshes.push({
          ...rootState.printer.printer.bed_mesh,
          active: true,
          unsaved: unsaved_profiles.includes(profile)
        })
      } else {
        meshes.push({
          profile_name: profile,
          active: false,
          unsaved: unsaved_profiles.includes(profile)
        })
      }
    }
    return meshes.sort((a, b) =>
      a.profile_name === 'default'
        ? -1
        : (
            b.profile_name === 'default'
              ? 1
              : a.profile_name.localeCompare(b.profile_name)
          )
    )
  },

  /**
   * Returns the current mesh, in a usable format for echarts.
   */
  getCurrentMeshData: (state, getters, rootState): AppMeshes => {
    return {
      mesh_matrix: transformMesh(rootState.printer.printer.bed_mesh, 'mesh_matrix'),
      probed_matrix: transformMesh(rootState.printer.printer.bed_mesh, 'probed_matrix'),
      mesh_matrix_flat: transformMesh(rootState.printer.printer.bed_mesh, 'mesh_matrix', true),
      probed_matrix_flat: transformMesh(rootState.printer.printer.bed_mesh, 'probed_matrix', true)
    }
  }
}
