import { Button, Flex, Heading, Icon } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// import { useTranslation } from "Base/i18n";

interface GameHeaderProps {
  navigateToCreateGame: () => void;
}

const GameHeader = ({ navigateToCreateGame }: GameHeaderProps) => {
  const { t } = useTranslation(["Game", "appLayout"]);

  return (
    <Flex justify="space-between" align="center">
      <Heading>{t("Juego", { ns: "appLayout" })}</Heading>
      <Flex gap={4}>
        <Button
          leftIcon={<Icon as={PlusIcon} />}
          variant="outline"
          onClick={navigateToCreateGame}
        >
          {"Jugar!"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default GameHeader;
