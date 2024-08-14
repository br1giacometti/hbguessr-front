import { MapRepository } from "./types";
import createMap from "./services/createMap";
import getAllMap from "./services/getAllMap";
import MapClient from "./client";
import getMapById from "./services/getMapById";

const createMapRepository = (userToken: string): MapRepository => {
  MapClient.defaults.headers.common = {
    Authorization: `Bearer ${userToken}`,
  };

  return {
    createMap,
    getAllMap,
    getMapById,
  };
};

export default createMapRepository;
