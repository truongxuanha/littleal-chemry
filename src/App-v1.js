import { useCallback, useEffect, useRef, useState } from "react";

import data from "./utils/data";
import { alphabet } from "./utils/alphabest";

const dataCombine = [
  ["air ", "water ", " rain"],
  ["water", "water", "sea"],
  ["water", "sea", "ocean"],
  ["water", "fire", "steam"],
  ["water", "earth", "mud"],
  ["water", "air", "rain"],
  ["fire", "earth", "lava"],
  ["fire", "air", "energy"],
  ["fire", "mud", "brick"],
  ["earth", "earth", "pressure"],
  ["earth", "air", "dust"],
  ["earth", "steam", "geyser"],
  ["earth", "rain", "plant"],
  ["earth", "plant", "grass"],
  ["earth", "lava", "volcano"],
  ["earth", "energy", "earthquake"],
  ["earth", "earthquake", "mountain"],
  ["fire", "dust", "gunpowder"],
  ["fire", "plant", "tobacco"],
  ["fire", "gunpowder", "explosion"],
  ["air", "air", "pressure"],
  ["air", "steam", "cloud"],
  ["air", "lava", "stone"],
  ["plant", "plant", "garden"],
  ["sea", "sea", "ocean"],
];

function App() {
  const [elementDuplicate, setElementDuplicate] = useState(null);
  const [elementIsSelect, setElementIsSelect] = useState(null);
  const [elementSelect, setElementSelect] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [isSelect, setIsSelect] = useState(false);
  const sidebarRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [elementsSideBar, setElementsSideBar] = useState(
    JSON.parse(localStorage.getItem("elementsSideBar")) ||
      data.filter((item) => item.id < 5)
  );
  const [elementsMain, setElementsMain] = useState(
    JSON.parse(localStorage.getItem("elementsMain")) || []
  );

  useEffect(() => {
    localStorage.setItem("elementsSideBar", JSON.stringify(elementsSideBar));
  }, [elementsSideBar]);

  useEffect(() => {
    localStorage.setItem("elementsMain", JSON.stringify(elementsMain));
  }, [elementsMain]);

  const checkRecipes = useCallback(() => {
    if (elementDuplicate && elementIsSelect) {
      const a = elementDuplicate.element.title;
      const b = elementIsSelect.element.title;
      const listNewItems = dataCombine.filter(
        (title) =>
          (title[0] === a && title[1] === b) ||
          (title[1] === a && title[0] === b)
      );

      if (listNewItems.length > 0) {
        const newDataMainSection = elementsMain.filter(
          (element) => element.idElement !== elementDuplicate.idElement
        );

        listNewItems.forEach((item) => {
          const createNewItem = data.find((it) => it.title === item[2]);
          if (createNewItem) {
            if (
              !elementsSideBar.find(
                (sbItem) => sbItem.title === createNewItem.title
              )
            ) {
              setElementsSideBar((prev) => [...prev, createNewItem]);
            }
            newDataMainSection.push({
              idElement: new Date().toISOString(),
              element: createNewItem,
              position: elementDuplicate.position,
            });
          }
        });

        setElementsMain(newDataMainSection);
        setElementDuplicate(null);
        setElementIsSelect(null);
      }
    }
  }, [elementDuplicate, elementIsSelect, elementsMain, elementsSideBar]);

  const handleClick = useCallback(() => {
    setElementsMain([]);
    setElementsSideBar(data.filter((item) => item.id < 5));
  }, []);

  const handleMouseDown = useCallback((item, e, type) => {
    e.preventDefault();
    setIsSelect(true);
    setElementSelect({ ...item, type });
    setDraggedElement(type === "main" ? item : null);
  }, []);

  const handleMouseMove = (e) => {
    if (!isSelect || !elementSelect) return;

    setPosition({ x: e.clientX, y: e.clientY });

    // Nếu kéo phần tử từ "main"
    if (elementSelect.type === "main" && draggedElement) {
      setElementsMain((prev) =>
        prev.map((el) =>
          el.idElement === draggedElement.idElement
            ? { ...el, position: { x: e.clientX, y: e.clientY } }
            : el
        )
      );
    }

    // Tìm các phần tử trong main gần với vị trí hiện tại
    const newData = elementsMain.filter(
      (element) =>
        Math.abs(element.position.x - e.clientX) <= 20 &&
        Math.abs(element.position.y - e.clientY) <= 20
    );

    setElementIsSelect({ element: elementSelect, position });
    setElementDuplicate(
      newData.length > 0 ? newData[newData.length - 1] : null
    );
  };

  const handleMouseUp = useCallback(
    (e) => {
      if (!isSelect) return;

      const rc = sidebarRef.current.getBoundingClientRect();
      const dropInsideSidebar =
        e.clientX >= rc.left &&
        e.clientX <= rc.right &&
        e.clientY >= rc.top &&
        e.clientY <= rc.bottom;

      if (dropInsideSidebar && draggedElement) {
        setElementsMain((prev) =>
          prev.filter((item) => item.idElement !== draggedElement.idElement)
        );
        setElementsSideBar((prev) => [...prev]);
      } else if (elementSelect && elementSelect.type === "sidebar") {
        // Nếu thả vào main, thêm phần tử vào main
        const newElementMain = {
          idElement: new Date().toISOString(),
          element: elementSelect,
          position: position,
        };
        setElementsMain((prev) => [...prev, newElementMain]);
      }
      console.log(elementsMain);
      // Kiểm tra và gộp các phần tử nếu có
      checkRecipes();
      setIsSelect(false);
      setElementSelect(null);
      setPosition({ x: 0, y: 0 });
      setDraggedElement(null);
    },
    [isSelect, elementSelect, draggedElement, position, checkRecipes]
  );

  return (
    <div
      className="grid grid-cols-4 h-screen"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div id="main" className="col-span-3 relative">
        {elementsMain.map((item) => (
          <div
            key={item.idElement}
            className="absolute z-50"
            style={{
              left: item.position.x,
              top: item.position.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src={item.element.url}
              alt={item.element.title}
              onMouseDown={(e) => handleMouseDown(item, e, "main")}
            />
          </div>
        ))}
        <div>
          <span onClick={handleClick}>Reset</span>
        </div>
      </div>
      <div
        id="sidebar"
        className="col-span-1 bg-[#f7f1e7] flex"
        ref={sidebarRef}
      >
        <ul>
          {alphabet.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div>
          {elementsSideBar.map((item) => (
            <div className="flex items-center" key={item.id}>
              <img
                src={item.url}
                alt={item.title}
                onMouseDown={(e) => handleMouseDown(item, e, "sidebar")}
              />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      {isSelect && elementSelect && elementSelect.type === "sidebar" && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 99,
          }}
        >
          <img src={elementSelect.url} alt={elementSelect.title} />
        </div>
      )}
    </div>
  );
}

export default App;
