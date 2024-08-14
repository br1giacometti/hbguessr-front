import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, Button, Text, VStack, Spinner, useToast } from "@chakra-ui/react";
import { useTranslation } from "Base/i18n";
import useAllLocationService from "Location/data/LocationRepository/hooks/useAllLocationService";
import useAllMapService from "Map/data/MapRepository/hooks/useAllMapService";
import { Map } from "Map/data/MapRepository";
import { Location } from "Location/data/LocationRepository";

const MAP_SIZE = 256; // Tamaño de cada mapa en píxeles (doble del original)
const MAPS_PER_ROW = 3; // Número de mapas por fila
const POINT_SIZE = 0; // Tamaño del punto en píxeles (doble del original)

const Game = () => {
  const { t } = useTranslation("game");
  const toast = useToast();
  const [randomLocation, setRandomLocation] = useState<Location | null>(null);
  const [maps, setMaps] = useState<Map[]>([]);
  const [showMaps, setShowMaps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [userClick, setUserClick] = useState<{ x: number; y: number } | null>(
    null
  );
  const [score, setScore] = useState<number | null>(null);

  const { LocationList: locations, loading: loadingLocations } =
    useAllLocationService();
  const { MapList: allMaps, loading: loadingMaps } = useAllMapService();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (allMaps.length > 0) {
      setMaps(allMaps);
    }
  }, [allMaps]);

  const handleStartGame = useCallback(() => {
    if (locations && locations.length > 0) {
      const randomIndex = Math.floor(Math.random() * locations.length);
      const location = locations[randomIndex];
      setRandomLocation(location);
      setLoading(true);
      setGameStarted(true);

      const timer = setTimeout(() => {
        setLoading(false);
        setShowMaps(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      toast({
        status: "error",
        description: t("errors.noLocations"),
      });
    }
  }, [locations, toast, t]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("User clicked at:", x, y);
    setUserClick({ x, y });
  };

  useEffect(() => {
    if (userClick && randomLocation && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const locationMap = maps.find((map) => map.id === randomLocation.mapId);

      if (locationMap && ctx) {
        const locationIndex = maps.indexOf(locationMap);
        const locationRow = Math.floor(locationIndex / MAPS_PER_ROW);
        const locationCol = locationIndex % MAPS_PER_ROW;
        const locationX =
          locationCol * MAP_SIZE + (randomLocation.coordX / 300) * MAP_SIZE;
        const locationY =
          locationRow * MAP_SIZE + (randomLocation.coordY / 300) * MAP_SIZE;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        ctx.beginPath();
        ctx.moveTo(userClick.x, userClick.y);
        ctx.lineTo(locationX, locationY);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Calcular la distancia euclidiana
        const distance = Math.sqrt(
          Math.pow(locationX - userClick.x, 2) +
            Math.pow(locationY - userClick.y, 2)
        );
        setScore(parseFloat(distance.toFixed(2)));
      }
    }
  }, [userClick, randomLocation, maps]);

  if (loadingLocations || loadingMaps) {
    return <Spinner />;
  }

  const totalRows = Math.ceil(maps.length / MAPS_PER_ROW);
  const totalHeight = totalRows * MAP_SIZE;

  return (
    <VStack spacing={4} align="center" position="relative">
      {!gameStarted && (
        <VStack spacing={4} align="center">
          <Text>{"Cuantos conoces el Helbreath?!"}</Text>
          <Button onClick={handleStartGame}>{"Comenzar!"}</Button>
        </VStack>
      )}

      {loading && randomLocation && (
        <VStack spacing={4} align="center">
          <Text>{t("Descubre donde se encuentra! Tienes 10 segundos")}</Text>
          <img
            src={randomLocation.imageUrl}
            alt={`Location ${randomLocation.id}`}
            style={{ width: "800px", height: "auto" }}
          />
        </VStack>
      )}

      {showMaps && maps.length > 0 && (
        <Box
          position="relative"
          width={MAP_SIZE * MAPS_PER_ROW}
          height={totalHeight}
          onClick={handleMapClick}
          style={{ border: "1px solid black" }}
        >
          <canvas
            ref={canvasRef}
            width={MAP_SIZE * MAPS_PER_ROW}
            height={totalHeight}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
          />
          {maps.map((map, index) => {
            const row = Math.floor(index / MAPS_PER_ROW);
            const col = index % MAPS_PER_ROW;
            const top = row * MAP_SIZE;
            const left = col * MAP_SIZE;

            return (
              <img
                key={map.id}
                src={map.imageUrl}
                alt={`Map ${map.id}`}
                style={{
                  position: "absolute",
                  top: top,
                  left: left,
                  width: MAP_SIZE,
                  height: MAP_SIZE,
                  border: "1px solid black",
                }}
              />
            );
          })}

          {userClick && randomLocation && (
            <Box
              position="absolute"
              top={
                Math.floor((randomLocation.coordY / 300) * MAP_SIZE) +
                Math.floor(
                  maps.findIndex((m) => m.id === randomLocation.mapId) /
                    MAPS_PER_ROW
                ) *
                  MAP_SIZE -
                POINT_SIZE / 2
              }
              left={
                Math.floor((randomLocation.coordX / 300) * MAP_SIZE) +
                (maps.findIndex((m) => m.id === randomLocation.mapId) %
                  MAPS_PER_ROW) *
                  MAP_SIZE -
                POINT_SIZE / 2
              }
              width={POINT_SIZE}
              height={POINT_SIZE}
              borderRadius="50%"
              backgroundColor="red"
              zIndex={3}
            />
          )}
        </Box>
      )}

      {score !== null && (
        <Text>
          {t("Puntuacion")}: {score}
        </Text>
      )}
    </VStack>
  );
};

export default Game;
