import { useAppContext } from "../../contexts/useAppContext";
import { useEvent } from "../../contexts/useMouseEvent";
import data from "../../utils/data";
import { useState, useEffect } from "react";
import "./main.css"; // Đảm bảo bạn đã import tệp CSS

function Main() {
  const { handleMouseDown } = useEvent();
  const { elementsMain, elementsSideBar, handleClick } = useAppContext();
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems(elementsMain.map((_, index) => index));
    }, 100); // Thay đổi thời gian trễ nếu cần

    return () => clearTimeout(timer);
  }, [elementsMain]);

  return (
    <div id="main" className="col-span-3 relative h-screen overflow-hidden">
      {elementsMain.map((item, index) => (
        <div
          key={index}
          className={`absolute z-50 fade-in ${
            visibleItems.includes(index) ? "visible" : ""
          }`}
          style={{
            left: item.position.x,
            top: item.position.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            className="block w-[74px]"
            src={item.element.url}
            alt=""
            onMouseDown={(e) => handleMouseDown(item, e, "main")}
          />
        </div>
      ))}
      <div className="absolute left-0 bottom-0 font-semibold text-2xl text-gray-400 p-3">
        {elementsSideBar.length}/{data.length}
      </div>
      <div className="absolute right-0 bottom-0 font-semibold text-2xl p-3 text-gray-400 cursor-pointer">
        <span onClick={handleClick}>Reset</span>
      </div>
    </div>
  );
}

export default Main;
