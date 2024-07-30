import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import data from "../utils/data";
import recipes from "../utils/recipes";

const AppContext = createContext();

const dataStart = data.filter((item) => item.id < 5);

function AppProvider({ children }) {
  const [elementDuplicate, setElementDuplicate] = useState(null);
  const [elementIsSelect, setElementIsSelect] = useState(null);
  const [elementsSideBar, setElementsSideBar] = useState(
    JSON.parse(localStorage.getItem("elementsSideBar")) || dataStart
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
      const duplicateTitle = elementDuplicate.element?.title;
      const selectTitle =
        elementIsSelect.element?.title ||
        elementIsSelect.element?.element?.title;

      const listNewItems = recipes.filter(
        ([firstTitle, secondTitle]) =>
          (firstTitle === duplicateTitle && secondTitle === selectTitle) ||
          (secondTitle === duplicateTitle && firstTitle === selectTitle)
      );

      if (listNewItems.length > 0) {
        const newDataMainSection = elementsMain.filter(
          (element) =>
            element.idElement !== elementDuplicate.idElement &&
            element.idElement !== elementIsSelect.element.idElement
        );

        listNewItems.forEach(([_, __, newTitle]) => {
          const newItem = data.find((item) => item.title === newTitle);
          if (newItem) {
            if (!elementsSideBar.some((item) => item.title === newItem.title)) {
              setElementsSideBar((prev) => [...prev, newItem]);
            }
            newDataMainSection.push({
              idElement: new Date().toISOString(),
              element: newItem,
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

  const handleClick = () => {
    setElementsMain([]);
    setElementsSideBar(dataStart);
  };

  const value = {
    elementsMain,
    elementsSideBar,
    setElementsMain,
    setElementsSideBar,
    setElementIsSelect,
    setElementDuplicate,
    handleClick,
    checkRecipes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("AppProvider Error");
  return context;
};

export { useAppContext, AppProvider };
