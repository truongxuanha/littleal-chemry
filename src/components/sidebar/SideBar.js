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
  const side = document.getElementById("sidebar");

  return (
    <>
      <div
        id="sidebar"
        className="col-span-1 bg-[#f7f1e7] flex"
        ref={sidebarRef}
      >
        <ul className="border-r border-white p-2 text-center text-gray-400">
          {alphabet.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div>
          {elementsSideBar.map((item) => (
            <div className="flex items-center" key={item.id}>
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
