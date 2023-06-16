import { ArmourItem, Material, Requirement } from "../../../types";
import styles from "./Item.module.css";
import deleteButton from "./delete.svg";
import editButton from "./edit.svg";
import doneButton from "./done.svg";
import cs, { csType } from "cs";

interface props {
  item: ArmourItem;
  materials: Material[];
  done?: boolean;
  className?: csType;
  onDelete?: () => void;
  onEdit?: (item: ArmourItem) => void;
  onComplete?: (item: ArmourItem) => void;
  onClick?: () => void;
}

function Item({ item, done, materials, className, onDelete, onEdit, onComplete, onClick }: props) {
  return (
    <div className={cs(className, styles.container)} onClick={onClick}>
      <h1 className={cs(done && styles.done, styles.titleBox)}>{item.name}</h1>

      <section className={styles.buttonBox}>
        <button className={styles.editButton} aria-label="Delete" onClick={onDelete}>
          <img src={deleteButton} alt="delete item." />
        </button>
        <button className={styles.editButton} aria-label="Edit" onClick={() => onEdit?.(item)}>
          <img src={editButton} alt="edit item." />
        </button>
        <button className={styles.editButton} aria-label="Complete" onClick={() => onComplete?.(item)}>
          <img src={doneButton} alt="mark as done." />
        </button>
      </section>
      <table>
        <tbody>
          {item.requirements
            .filter((r) => r.name !== "")
            .map((r) => {
              const material = materials.find((material) => material.name === r.name);
              const isComplete = (material?.amountOwned ?? 0) >= r.amountRequired;
              console.log(
                `Material: ${JSON.stringify(material)}. Requirement: ${JSON.stringify(r)}. Status: ${isComplete}`
              );
              return <RequirementRow key={r.name} complete={isComplete} requirement={r} />;
            })}
        </tbody>
      </table>
    </div>
  );
}

interface rowProps {
  requirement: Requirement;
  complete?: boolean;
}
function RequirementRow({ requirement, complete }: rowProps) {
  return (
    <tr>
      <td className={styles.cell}>{requirement.name}</td>
      <td className={cs(styles.cell, styles.amount, complete && styles.done)}>{requirement.amountRequired}</td>
    </tr>
  );
}

export default Item;
