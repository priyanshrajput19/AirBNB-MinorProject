import { Box, Button } from "@mui/material";

const Header = () => {
  return (
    <>
      <Box component="header" className="header top-0 left-0 py-[25px] border-b border-gray-200 ">
        <Box className="header-inner flex justify-between items-center mx-auto max-w-7xl">
          <Box className="header-logo">Logo</Box>
          <Box className="header-menu relative">
            <ul className="flex  items-center gap-10">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">Features</a>
              </li>
              <li>
                <a href="#contact">About</a>
              </li>
            </ul>
          </Box>
          <Box className="headertheme-toggle">
            <Button>Button</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Header;
