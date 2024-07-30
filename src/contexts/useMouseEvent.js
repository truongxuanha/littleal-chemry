import {
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

  const [elementSelect, setElementSelect] = useState({});
  const [draggedElement, setDraggedElement] = useState(null);
  const [isSelect, setIsSelect] = useState(false);
  const sidebarRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((item, e, type) => {
    e.preventDefault();

    setIsSelect(true);

    setElementSelect({ ...item, type, select: true });
    setDraggedElement(type === "main" ? item : null);
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isSelect || !elementSelect) return;

      setPosition({ x: e.clientX, y: e.clientY });

      if (elementSelect.type === "main" && draggedElement) {
        setElementsMain((prev) =>
          prev.map((el) =>
            el.idElement === draggedElement.idElement
              ? { ...el, position: { x: e.clientX, y: e.clientY } }
              : el
          )
        );
      }

      const newData = elementsMain.filter(
        (element) =>
          element.idElement !== draggedElement?.idElement &&
          element.position.x - 40 <= position.x &&
          position.x <= element.position.x + 40 &&
          element.position.y - 40 <= position.y &&
          position.y <= element.position.y + 40
      );
      setElementIsSelect({ element: elementSelect, position });
      setElementDuplicate(
        newData.length > 0 ? newData[newData.length - 1] : null
      );
    },
    [
      isSelect,
      elementSelect,
      draggedElement,
      position,
      elementsMain,
      setElementDuplicate,
      setElementIsSelect,
      setElementsMain,
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
      } else if (elementSelect && elementSelect.type === "sidebar") {
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

const useEvent = function () {
  const context = useContext(EventContext);
  if (context === undefined) throw new Error("Error EventContext");
  return context;
};

export { useEvent, EventProvider };
