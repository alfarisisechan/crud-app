import Home from "./components/Home";
import Update from "./components/Update";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route path="/update/:id" Component={Update} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
