import { useState } from "react";
import { ArmourItem, Material } from "../../types";
import styles from "./ArmourSection.module.css";

import ItemEdit from "./Item/ItemEdit";
import Item from "./Item/Item";
import cs, { csType } from "cs";

interface ArmourSectionProps {
  armours: ArmourItem[];
  items: Material[];
  onUpdateItem: (updateType: "new" | "edit" | "complete" | "delete", item: ArmourItem, oldItem?: ArmourItem) => void;
  onClick?: (item: ArmourItem) => void;
}

function ArmourSection({ armours: armourList, items, onUpdateItem, onClick }: ArmourSectionProps) {
  return (
    <>
      <section className={styles.armourSection}>
        {armourList.map((item) => (
          <EditableItem
            onClick={() => onClick?.(item)}
            materials={items}
            done={item.requirements.every((requirement) => {
              console.log(requirement);
              const amountOwned = items.find((item) => item.name === requirement.name)?.amountOwned ?? 0;
              console.log(amountOwned);
              return amountOwned >= requirement.amountRequired;
            })}
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
  materials: Material[];
  className: csType;
  done: boolean;
  onClick?: () => void;
  onItemUpdate: (updateType: "edit" | "complete" | "delete", item: ArmourItem) => void;
}

function EditableItem({ item, className, onItemUpdate, onClick, done, materials }: EditableItemProps) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <ItemEdit
        className={cs(className)}
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
      onClick={onClick}
      materials={materials}
      done={done}
      className={cs(className)}
      item={item}
      onEdit={() => setEditing(true)}
      onDelete={() => onItemUpdate("delete", item)}
      onComplete={() => onItemUpdate("complete", item)}
    />
  );
}

export default ArmourSection;
