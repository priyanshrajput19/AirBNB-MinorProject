import { Box, Typography } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  return (
    <>
      <Box className=" border-10 border-red-500 flex flex-col items-center justify-center h-screen">
        <Header />
        <Footer />
      </Box>
    </>
  );
}

export default App;
