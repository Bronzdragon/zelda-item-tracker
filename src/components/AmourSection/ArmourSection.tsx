import { useState } from "react";
import { ArmourItem } from "../../types";
import styles from './ArmourSection.module.css'

import ItemEdit from "./Item/ItemEdit";
import Item from "./Item/Item";
import { csType } from "cs";

interface ArmourSectionProps {
  armours: ArmourItem[];
  onUpdateItem: (updateType: "new" | "edit" | "complete" | "delete", item: ArmourItem, oldItem?: ArmourItem) => void;
}

function ArmourSection({ armours: armourList, onUpdateItem }: ArmourSectionProps) {
  return (
    <>
    <section className={styles.armourSection}>
      {armourList.map((item, index) => (
        <EditableItem
          className={styles.armour}
          key={item.name}
          item={item}
          onItemUpdate={(type, newItem) => {
            onUpdateItem(type, newItem, item);
          }}
        />
      ))}
      </section>
      <hr />
      <ItemEdit editType="new" onSubmit={(item) => onUpdateItem("new", item)} />
      <hr />
    </>
  );
}

interface EditableItemProps {
  item: ArmourItem;
  className: csType
  onItemUpdate: (updateType: "edit" | "complete" | "delete", item: ArmourItem) => void;
}

function EditableItem({ item, className, onItemUpdate }: EditableItemProps) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <ItemEdit
        className={className}
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
      className={className}

      item={item}
      onEdit={() => setEditing(true)}
      onDelete={() => onItemUpdate("delete", item)}
      onComplete={() => onItemUpdate("complete", item)}
    />
  );
}

export default ArmourSection;
