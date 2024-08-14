import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Image,
  VStack,
  Text,
  Spinner,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "Base/i18n";
import useAllLocationService from "Location/data/LocationRepository/hooks/useAllLocationService";
import useAllMapService from "Map/data/MapRepository/hooks/useAllMapService";

const GRID_SIZE = 128; // Tamaño de la celda en píxeles

const Game = () => {
  const { t } = useTranslation("game");
  const toast = useToast();
  const [randomLocation, setRandomLocation] = useState<any>(null);
  const [maps, setMaps] = useState<any[]>([]);
  const [showMaps, setShowMaps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    mapId: number;
    x: number;
    y: number;
  } | null>(null);

  // Servicios
  const { LocationList: locations, loading: loadingLocations } =
    useAllLocationService();
  const { MapList: allMaps, loading: loadingMaps } = useAllMapService();

  // Función para manejar la acción de inicio del juego
  const handleStartGame = useCallback(() => {
    if (locations && locations.length > 0) {
      const randomIndex = Math.floor(Math.random() * locations.length);
      setRandomLocation(locations[randomIndex]);
      setLoading(true);
      setGameStarted(true);

      // Mostrar la ubicación por 10 segundos
      const timer = setTimeout(() => {
        setLoading(false);
        setShowMaps(true);
        setMaps(allMaps || []);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      toast({
        status: "error",
        description: t("errors.noLocations"),
      });
    }
  }, [locations, allMaps, toast, t]);

  // Cargar estado inicial
  useEffect(() => {
    if (locations) {
      setMaps(allMaps || []);
    }
  }, [locations, allMaps]);

  // Mostrar un spinner si aún se están cargando los datos
  if (loadingLocations || loadingMaps) {
    return <Spinner />;
  }

  // Manejar clic en una celda de la cuadrícula
  const handleCellClick = (mapId: number, x: number, y: number) => {
    console.log("Celda seleccionada - mapa:", mapId, "x:", x, "y:", y);
    setSelectedCell({ mapId, x, y });
    if (randomLocation && randomLocation.mapId === mapId) {
      const cellX = Math.floor(randomLocation.coordX / GRID_SIZE);
      const cellY = Math.floor(randomLocation.coordY / GRID_SIZE);
      console.log(
        "Ubicación correcta - mapa:",
        mapId,
        "x:",
        cellX,
        "y:",
        cellY
      );
      const isMatch = cellX === x && cellY === y;
      if (isMatch) {
        toast({
          status: "success",
          description: t("success.correctLocation"),
        });
      } else {
        toast({
          status: "error",
          description: t("error.incorrectLocation"),
        });
      }
    } else {
      toast({
        status: "error",
        description: t("error.mapMismatch"),
      });
    }
  };

  return (
    <VStack spacing={4} align="center">
      {!gameStarted && (
        <VStack spacing={4} align="center">
          <Text>{"Cuantos conoces el Helbreath?!"}</Text>
          <Button onClick={handleStartGame}>{"Comenzar!"}</Button>
        </VStack>
      )}

      {loading && randomLocation && (
        <VStack spacing={4} align="center">
          <Text>{t("Descubre donde se encuentra! Tienes 10 segundos")}</Text>
          <Image
            src={randomLocation.imageUrl}
            alt={`Location ${randomLocation.id}`}
            boxSize="128px"
            objectFit="cover"
          />
        </VStack>
      )}

      {showMaps && (
        <Box display="flex" flexWrap="wrap" justifyContent="center" p={4}>
          <Text>{t("Selecciona el lugar en el mapa")}</Text>
          {maps.map((map) => (
            <Box key={map.id} position="relative">
              <Image
                src={map.imageUrl}
                alt={`Map ${map.id}`}
                boxSize="128px"
                objectFit="cover"
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                width="128px"
                height="128px"
                display="grid"
                gridTemplateColumns={`repeat(${Math.ceil(
                  map.width / GRID_SIZE
                )}, 1fr)`}
                gridTemplateRows={`repeat(${Math.ceil(
                  map.height / GRID_SIZE
                )}, 1fr)`}
                pointerEvents="auto"
                zIndex="10"
              >
                {Array.from({
                  length:
                    Math.ceil(map.width / GRID_SIZE) *
                    Math.ceil(map.height / GRID_SIZE),
                }).map((_, index) => {
                  const x = index % Math.ceil(map.width / GRID_SIZE);
                  const y = Math.floor(
                    index / Math.ceil(map.width / GRID_SIZE)
                  );
                  return (
                    <Box
                      key={index}
                      border="1px solid rgba(0, 0, 0, 0.3)"
                      onClick={() => handleCellClick(map.id, x, y)}
                      width="100%"
                      height="100%"
                      cursor="pointer"
                      zIndex="10"
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </VStack>
  );
};

export default Game;
