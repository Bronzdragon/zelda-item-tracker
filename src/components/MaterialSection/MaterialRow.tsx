import styles from "./MaterialRow.module.css";
import NumberInput from "./NumberInput";
import { Material } from "../../types";
import dotGrid from "./dot-grid.svg";
import cs from "cs";
import TagInput from "./TagInput";

export type DisplayState = "lowlight" | "regular" | "highlight";

interface MaterialRowProps {
  material: Material;
  numPossessed: number;
  numRequired: number;
  activeTags: string[];
  dragHandleClass?: string;
  visible?: boolean;
  displayState?: DisplayState;
  onAmountUpdate?: (num: number) => void;
  onTagToggled?: (tag: string, state: boolean) => void;
}

function MaterialRow({
  material,
  numPossessed,
  numRequired,
  activeTags,
  dragHandleClass,
  visible = true,
  displayState = 'regular',
  onAmountUpdate,
  onTagToggled,
}: MaterialRowProps) {
  const stillRequired = Math.max(numRequired - numPossessed, 0);

  if (!visible) return null;

  return (
    <tr className={cs(stillRequired <= 0 && styles.done, styles.row, styles[displayState])}>
      <td className={dragHandleClass}>
        <img src={dotGrid} alt="handle" />
      </td>
      <td>{material.name}</td>
      {/*name*/}
      <td>
        <NumberInput min={0} step={1} onChange={onAmountUpdate} value={numPossessed} className={styles.haveInput} />
        {/*have*/}
      </td>
      <td className={styles["number-cell"]}>{`${stillRequired} (${numRequired})`}</td>
      {/* need */}
      <td>
        <TagInput
          tags={material.tags.map((name) => ({ name, active: activeTags.includes(name) }))}
          onTagClicked={(tag) => {
            onTagToggled?.(tag, !activeTags.includes(tag));
          }}
        />
      </td>
    </tr>
  );
}

export default MaterialRow;
