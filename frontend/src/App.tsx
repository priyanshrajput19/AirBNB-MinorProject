import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import buttonTheme from "./theme/buttonTheme";

function App() {
  return (
    <ThemeProvider theme={buttonTheme}>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

export default App;
