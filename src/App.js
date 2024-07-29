import { useEvent } from "./contexts/useMouseEvent";
import SideBar from "./components/sidebar/SideBar";
import Main from "./components/main/Main";

function App() {
  const { handleMouseMove, handleMouseUp } = useEvent();
  return (
    <div
      className="grid grid-cols-4 h-screen"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Main />
      <SideBar />
    </div>
  );
}

export default App;
