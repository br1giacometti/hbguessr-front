import { useEffect, useState } from "react";
import { CreateGameSchema } from "Game/schemas/createGameSchema";
import createGameService from "../services/createGame";

const useCreateGameService = (
  body: CreateGameSchema | null,
  callback: (error?: string) => void
) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (body !== null) {
      setLoading(true);
      createGameService(body)
        .then(() => callback())
        .catch((error) => callback(error.message))
        .finally(() => setLoading(false));
    }
  }, [body, callback]);

  return {
    loading,
  };
};

export default useCreateGameService;
