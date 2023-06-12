import { ArmourItem, Requirement } from "../../../types";
import styles from "./Item.module.css";
import deleteButton from "./delete.svg";
import editButton from "./edit.svg";
import doneButton from "./done.svg";
import cs, { csType } from "cs";

interface props {
  item: ArmourItem;
  className?: csType
  onDelete?: () => void;
  onEdit?: (item: ArmourItem) => void;
  onComplete?: (item: ArmourItem) => void;
}

function Item({ item, className, onDelete, onEdit, onComplete }: props) {
  return (
    <div className={cs(className)}>
      <h1>
      <section className={styles.buttonBox}><button className={styles.editButton} aria-label="Delete" onClick={onDelete}>
        <img src={deleteButton} alt="delete item." />
      </button>
      <button className={styles.editButton} aria-label="Edit" onClick={() => onEdit?.(item)}>
        <img src={editButton} alt="edit item."/>
      </button>
      <button className={styles.editButton} aria-label="Complete" onClick={() => onComplete?.(item)}>
        <img src={doneButton} alt="mark as done."/>
      </button>
      
      </section>
      {item.name}
      </h1>
      <table>
        <tbody>
          {item.requirements
            .filter((r) => r.name !== "")
            .map((r) => (
              <RequirementRow key={r.name} requirement={r} />
            ))}
        </tbody>
      </table>
      
    </div>
  );
}

interface rowProps {
  requirement: Requirement;
}
function RequirementRow({ requirement }: rowProps) {
  return (
    <tr>
      <td className={styles.cell}>{requirement.name}</td>
      <td className={styles.cell}>{requirement.amountRequired}</td>
    </tr>
  );
}

export default Item;
