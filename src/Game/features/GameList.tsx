import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { useTranslation } from "Base/i18n";
import DataTable, { BaseColumn } from "Base/components/DataTable";

import formatDate from "Base/utils/formatters/formatDate";

import formatPrice from "Base/utils/formatters/formatPrice";

import {
  Box,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import { Game } from "Game/data/GameRepository";
import useAllGameService from "Game/data/GameRepository/hooks/useAllGameService";

type DeleteState = {
  loading: boolean;
  selected: Game | null;
};

const GameList = () => {
  const { t } = useTranslation("game");
  const toast = useToast();

  const { error, loading, GameList } = useAllGameService();

  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    loading: false,
    selected: null,
  });

  const columns: BaseColumn<Game>[] = useMemo(
    () => [
      {
        label: t("Jugador"),
        selector: (row) => row.user?.firstName,
      },
      {
        label: t("Puntos"),
        selector: (row) => row.totalScore,
      },
    ],
    [deleteState.loading, deleteState.selected?.id, t]
  );

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between"></Flex>
      <Box pl={300} pr={300}>
        <DataTable columns={columns} data={GameList} loading={loading} />
      </Box>
    </>
  );
};

export default GameList;
