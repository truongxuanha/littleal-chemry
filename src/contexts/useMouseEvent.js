import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useAppContext } from "./useAppContext";

const EventContext = createContext();

function EventProvider({ children }) {
  const {
    setElementsMain,
    elementsMain,
    setElementDuplicate,
    setElementIsSelect,
    checkRecipes,
  } = useAppContext();

  const [elementSelect, setElementSelect] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [isSelect, setIsSelect] = useState(false);
  const sidebarRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (item, e, type) => {
      e.preventDefault();

      setIsSelect(true);
      setElementSelect({ ...item, type });
      setDraggedElement(type === "main" ? item : null);
      setPosition({ x: e.clientX, y: e.clientY });
    },
    [setElementSelect, setDraggedElement]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isSelect || !elementSelect) return;

      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);

      if (elementSelect.type === "main" && draggedElement) {
        setElementsMain((prev) =>
          prev.map((el) =>
            el.idElement === draggedElement.idElement
              ? { ...el, position: newPosition }
              : el
          )
        );
      }

      const nearbyElements = elementsMain.filter(
        (element) =>
          element.idElement !== draggedElement?.idElement &&
          Math.abs(element.position.x - newPosition.x) <= 40 &&
          Math.abs(element.position.y - newPosition.y) <= 40
      );

      setElementIsSelect({ element: elementSelect, position: newPosition });
      setElementDuplicate(
        nearbyElements.length > 0
          ? nearbyElements[nearbyElements.length - 1]
          : null
      );
    },
    [
      isSelect,
      elementSelect,
      draggedElement,
      elementsMain,
      setElementsMain,
      setElementIsSelect,
      setElementDuplicate,
    ]
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (!isSelect) return;

      const rc = sidebarRef.current.getBoundingClientRect();

      if (
        e.clientX >= rc.left &&
        e.clientX <= rc.right &&
        e.clientY >= rc.top &&
        e.clientY <= rc.bottom
      ) {
        setElementsMain((prev) =>
          prev.filter((item) => item.idElement !== draggedElement?.idElement)
        );
      } else if (elementSelect?.type === "sidebar") {
        const newElementMain = {
          idElement: new Date().toISOString(),
          element: elementSelect,
          position: position,
        };
        setElementsMain((prev) => [...prev, newElementMain]);
      }
      checkRecipes();

      setIsSelect(false);
      setElementDuplicate(null);
      setElementSelect(null);
      setPosition({ x: 0, y: 0 });
      setDraggedElement(null);
    },
    [
      isSelect,
      elementSelect,
      draggedElement,
      position,
      checkRecipes,
      setElementDuplicate,
      setElementsMain,
    ]
  );

  const value = {
    elementSelect,
    sidebarRef,
    position,
    isSelect,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    setPosition,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) throw new Error("EventProvider Error");
  return context;
};

export { useEvent, EventProvider };
