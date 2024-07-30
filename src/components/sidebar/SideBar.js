import { useAppContext } from "../../contexts/useAppContext";
import { useEvent } from "../../contexts/useMouseEvent";
import { alphabet } from "../../utils/alphabest";

function SideBar() {
  const { sidebarRef, elementSelect, isSelect, position, handleMouseDown } =
    useEvent();
  const { elementsSideBar } = useAppContext();

  elementsSideBar.sort((a, b) =>
    a.title > b.title
      ? 1
      : a.title === b.title
      ? a.title > b.title
        ? 1
        : -1
      : -1
  );

  //Scroll
  const handleScroll = (item) => {
    let elementId = "";
    // console.log(item);
    for (let i = 0; i < elementsSideBar.length; i++) {
      const element = elementsSideBar[i];
      // console.log(element.title[0]);
      // console.log(element.title[0].toUpperCase());
      if (element.title[0].toUpperCase() == item) {
        console.log(element.title[0].toUpperCase() == item);
        elementId = element.title;
        break;
      }
    }
    if (elementId !== "") {
      console.log(elementId);
      const element = document.getElementById(elementId);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <div
        id="sidebar"
        className="col-span-1 bg-[#f7f1e7] flex h-screen"
        ref={sidebarRef}
      >
        <ul className="border-r border-white px-1 flex flex-col justify-around text-[13px] text-center text-gray-400 cursor-pointer">
          {alphabet.map((item) => (
            <li key={item} onClick={() => handleScroll(item)}>
              {item}
            </li>
          ))}
        </ul>
        <div className="h-screen overflow-auto flex-1">
          {elementsSideBar.map((item) => (
            <div className="flex items-center" id={item.title} key={item.id}>
              <img
                className="w-[56px]"
                src={item.url}
                alt=""
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
          <img src={elementSelect.url} alt="" />
        </div>
      )}
    </>
  );
}

export default SideBar;
