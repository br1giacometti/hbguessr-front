import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Center,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import ContextMenuItem from "../types/ContextMenuItem";

interface ProfileMenuProps {
  menu: ContextMenuItem[];
  profileImageUrl?: string;
  username?: string;
  logout: () => void; // Añadimos la propiedad logout
}

const ProfileMenu = ({
  menu,
  profileImageUrl,
  username,
  logout, // Recibimos la función logout
}: ProfileMenuProps): JSX.Element => (
  <Center bg="neutral.200" gap={4} height="100%" px={2}>
    <Avatar
      borderColor="black"
      borderWidth="3px"
      h={9}
      src={profileImageUrl}
      w={9}
    />
    <Menu>
      <MenuButton
        as={Button}
        display="flex"
        rightIcon={<ChevronDownIcon />}
        variant="unstyled"
      >
        {username}
      </MenuButton>
      <MenuList>
        {menu.map((menuItem) => (
          <MenuItem key={menuItem.label?.toString()} onClick={menuItem.onClick}>
            {menuItem.label}
          </MenuItem>
        ))}
        <MenuItem onClick={logout}>Logout</MenuItem>{" "}
      </MenuList>
    </Menu>
  </Center>
);

export default ProfileMenu;
