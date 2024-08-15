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
import ConfirmDeleteModal from "Map/components/ConfirmDeleteDialog";
import { Map } from "Map/data/MapRepository";
import useAllMapService from "Map/data/MapRepository/hooks/useAllMapService";

type DeleteState = {
  loading: boolean;
  selected: Map | null;
};

const MapList = () => {
  const { t } = useTranslation("map");
  const toast = useToast();

  const { error, loading, MapList } = useAllMapService();

  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    loading: false,
    selected: null,
  });

  const columns: BaseColumn<Map>[] = useMemo(
    () => [
      {
        label: t("datatable.label.description"),
        selector: (row) => row.name,
      },
      {
        label: t("datatable.label.description"),
        selector: (row) => row.sizeX,
      },
      {
        label: t("datatable.label.description"),
        selector: (row) => row.sizeY,
      },
    ],
    [deleteState.loading, deleteState.selected?.id, t]
  );

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <InputGroup>
            <InputRightElement>
              <Icon as={MagnifyingGlassIcon} />
            </InputRightElement>
          </InputGroup>
        </Box>
      </Flex>
      <DataTable columns={columns} data={MapList} loading={loading} />
    </>
  );
};

export default MapList;
