import React, { Suspense, lazy } from "react";
import { useEvent } from "./contexts/useMouseEvent";

// Lazy load components
const SideBar = lazy(() => import("./components/sidebar/SideBar"));
const Main = lazy(() => import("./components/main/Main"));

function App() {
  const { handleMouseMove, handleMouseUp } = useEvent();

  return (
    <div
      className="grid grid-cols-4 h-screen"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Suspense fallback={<div className="h-screen">Loading Main...</div>}>
        <Main />
      </Suspense>
      <Suspense fallback={<div className="h-screen">Loading Sidebar...</div>}>
        <SideBar />
      </Suspense>
    </div>
  );
}

export default App;
