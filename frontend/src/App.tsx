import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import buttonTheme from "./theme/buttonTheme";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import TryNow from "./pages/TryNow/TryNow";

function App() {
  return (
    <ThemeProvider theme={buttonTheme}>
      <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/try-now" element={<TryNow />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
