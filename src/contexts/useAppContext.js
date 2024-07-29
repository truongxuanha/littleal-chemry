import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import data from "../utils/data";
import recipes from "../utils/recipes";

const AppContext = createContext();
const dataStart = data.filter((data) => data.id < 5);
function AppProvider({ children }) {
  const [elementDuplicate, setElementDuplicate] = useState([]);
  const [elementIsSelect, setElementIsSelect] = useState({});
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
      // console.log(elementIsSelect);
      // console.log(elementDuplicate);
      const duplicate = elementDuplicate?.element?.title;
      const select = elementIsSelect.element.title
        ? elementIsSelect.element.title
        : elementIsSelect.element.element.title;
      // console.log("duplicate", duplicate);
      // console.log("select", select);
      const listNewItems = recipes.filter(
        (title) =>
          (title[0] === duplicate && title[1] === select) ||
          (title[1] === duplicate && title[0] === select)
      );

      console.log(listNewItems);
      if (listNewItems.length > 0) {
        const newDataMainSection = elementsMain.filter(
          (element) =>
            element.idElement !== elementDuplicate.idElement &&
            element.idElement !== elementIsSelect.element.idElement
        );

        listNewItems.forEach((item) => {
          const createNewItem = data.find((el) => el.title === item[2]);
          if (createNewItem) {
            if (
              !elementsSideBar.find(
                (item) => item.title === createNewItem.title
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

  function handleClick() {
    setElementsMain([]);
    setElementsSideBar(dataStart);
  }

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

const useAppContext = function () {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("Not found");
  return context;
};

export { useAppContext, AppProvider };
