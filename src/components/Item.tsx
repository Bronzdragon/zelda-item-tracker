import { ArmourItem, Requirement } from "../types";
import styles from "./Item.module.css";

interface props {
  item: ArmourItem;
  onDelete?: () => void;
  onEdit?: (item: ArmourItem) => void;
  onComplete?: (item: ArmourItem) => void;
}

function Item({ item, onDelete, onEdit, onComplete }: props) {
  return (
    <div>
      <h1>{item.name}</h1>
      <table>
        <tbody>
        {item.requirements
        .filter(r => r.name !== '')
        .map((r) => (
          <RequirementRow requirement={r} />
        ))}
        </tbody>
      </table>
      <button className={styles.editButton} aria-label="Delete" onClick={onDelete}>❌</button>
      <button className={styles.editButton} aria-label="Edit" onClick={() => onEdit?.(item)}>📝</button>
      <button className={styles.editButton} aria-label="Complete" onClick={() => onComplete?.(item)}>✅</button>
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
      <td className={styles.cell}>{requirement.amount}</td>
    </tr>
  );
}

export default Item;
