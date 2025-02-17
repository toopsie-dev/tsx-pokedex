import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./Routes";
import { ToggleTheme } from "./components/ToggleTheme";

function App() {
  return (
    <Router>
      <ToggleTheme />
      <AppRoutes />
    </Router>
  );
}

export default App;
