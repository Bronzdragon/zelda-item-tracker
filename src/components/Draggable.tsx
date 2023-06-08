import { useState } from "react";
import { ItemInterface, ReactSortable } from "react-sortablejs";

const items: ItemInterface[] = [
  { id: 1, text: "one" },
  { id: 2, text: "two" },
  { id: 3, text: "three" },
  { id: 4, text: "four" },
  { id: 5, text: "five" },
];

export function DraggableContainer() {
  const [list, setList] = useState(items);

  return (
    <ReactSortable list={list} setList={setList} animation={100} handle="span.handle">
      {list.map((item) => (
        <div key={item.id} style={{ border: "red 2px solid" }} onTouchStart={(event) => event.preventDefault()}>
          <img src="/dot-grid.svg" className="handle" alt="handle" />
          {item.text}
        </div>
      ))}
    </ReactSortable>
  );
}
