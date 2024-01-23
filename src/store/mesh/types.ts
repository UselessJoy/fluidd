export interface MeshState {
  variance: number;
  wireframe: boolean;
  scale: number;
  boxScale: number;
  flatSurface: boolean;
  matrix: 'probed_matrix' | 'mesh_matrix';
}

export interface KlipperMesh {
  [index: string]: string | boolean | number[] | number[][] | undefined;
  profile_name: string;
  active: boolean;
  unsaved: boolean;
  mesh_max?: number[];
  mesh_min?: number[];
  mesh_matrix?: number[][];
  probed_matrix?: number[][];
}

export interface AppMeshes {
  [index: string]: ProcessedMesh;
}

export interface MeshProfiles {
  profiles: string[];
  unsaved_profiles: string[];
}

export interface ProcessedMesh {
  coordinates: MeshCoordinates[];
  variance: number;
  min: number;
  mid: number;
  max: number;
}

export interface MeshCoordinates {
  name: string;
  value: number[];
}
