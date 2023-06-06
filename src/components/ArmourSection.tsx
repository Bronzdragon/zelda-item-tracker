import { useState } from "react";
import { ArmourItem, isArmourItem } from "../types";
import ItemEdit from "./ItemEdit";
import Item from "./Item";

interface ArmourSectionProps {
  armourList: ArmourItem[];
  onUpdateItemList: (list: ArmourItem[]) => void;
}

function ArmourSection({ armourList, onUpdateItemList }: ArmourSectionProps) {
  return (
    <>
      {armourList.map((item, index) => (
        <EditableItem
          item={item}
          onItemUpdate={(newItem) => {
            onUpdateItemList(
              [
                ...armourList.slice(0, index),
                newItem,
                ...armourList.slice(index + 1),
              ].filter(isArmourItem) // To filter out possible 'null' values.
            );
          }}
        />
      ))}
      <hr />
      <ItemEdit
        editType="new"
        onSubmit={(item) => onUpdateItemList([...armourList, item])}
      />
      <hr />
    </>
  );
}

interface EditableItemProps {
  item: ArmourItem;
  onItemUpdate: (item: ArmourItem | null) => void;
}

function EditableItem({ item, onItemUpdate }: EditableItemProps) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <ItemEdit
        editType="edit"
        onSubmit={(newItem) => {
          setEditing(false);
          onItemUpdate(newItem);
        }}
        details={item}
      />
    );
  }

  return (
    <Item
      item={item}
      onEdit={() => setEditing(true)}
      onDelete={() => onItemUpdate(null)}
    />
  );
}

export default ArmourSection;
