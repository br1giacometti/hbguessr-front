import { CreateMapSchema } from "Map/schemas/createMapSchema";

export interface Map {
  locations?: Location[];
  name: string;
  id: number;
  imageUrl: string;
}

export interface MapRepository {
  createMap: (body: CreateMapSchema) => Promise<Map>;
  getAllMap: () => Promise<Map[]>;
  getMapById: (MapId: number) => Promise<Map>;
}
