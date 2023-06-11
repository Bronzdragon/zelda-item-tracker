import { useState } from "react";
import { ArmourItem } from "../../types";
import ItemEdit from "./Item/ItemEdit";
import Item from "./Item/Item";

interface ArmourSectionProps {
  armours: ArmourItem[];
  onUpdateItem: (updateType: "new" | "edit" | "complete" | "delete", item: ArmourItem, oldItem?: ArmourItem) => void;
}

function ArmourSection({ armours: armourList, onUpdateItem }: ArmourSectionProps) {
  return (
    <>
      {armourList.map((item, index) => (
        <EditableItem
          key={item.name}
          item={item}
          onItemUpdate={(type, newItem) => {
            onUpdateItem(type, newItem, item);
          }}
        />
      ))}
      <hr />
      <ItemEdit editType="new" onSubmit={(item) => onUpdateItem("new", item)} />
      <hr />
    </>
  );
}

interface EditableItemProps {
  item: ArmourItem;
  onItemUpdate: (updateType: "edit" | "complete" | "delete", item: ArmourItem) => void;
}

function EditableItem({ item, onItemUpdate }: EditableItemProps) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <ItemEdit
        editType="edit"
        onSubmit={(newItem) => {
          setEditing(false);
          onItemUpdate("edit", newItem);
        }}
        details={item}
      />
    );
  }

  return (
    <Item
      item={item}
      onEdit={() => setEditing(true)}
      onDelete={() => onItemUpdate("delete", item)}
      onComplete={() => onItemUpdate("complete", item)}
    />
  );
}

export default ArmourSection;
