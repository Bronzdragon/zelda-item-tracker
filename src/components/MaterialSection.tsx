import { Requirement } from "../types";
import styles from "./MaterialSection.module.css";

interface MaterialSectionProps {
  materials: Requirement[];
}

function MaterialSection({ materials }: MaterialSectionProps) {
  return (
    <table>
      <thead>
        <th>Name</th>
        <th>Need (total)</th>
        <th>Have</th>
        <th>Tags</th>
      </thead>
      <tbody>
        {materials.map((mat) => (
          <tr>
            <td>{mat.name}</td>
            <td>{mat.amount}</td>
            <td>
              <input
                type="number"
                min={0}
                step={1}
                className={styles.haveInput}
              />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MaterialSection;
