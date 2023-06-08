import { Requirement } from "../types";
import styles from "./MaterialSection.module.css";
import NumberInput from "./NumberInput";
// import { DraggableContainer } from "./Draggable";
import { ReactSortable } from "react-sortablejs";
import { ArmourItem, Material } from "../types";
import { useState } from "react";

interface MaterialSectionProps {
  armours: ArmourItem[];
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

interface SortState {
  sortedBy: "name"|"have"|"need"|"tags"|"custom";
  direction: "asc"|"dec"|"other";
}
const defaultSortState = {sortedBy: 'custom', direction: 'other'} as const;

function MaterialSection({ armours, materials, setMaterials }: MaterialSectionProps) {
  const [sortState, setSortState ] = useState<SortState>(defaultSortState);
  const requiredByMaterial = getMaterialsFromArmours(armours);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          <th onClick={() => console.log("Sort!")}>Name</th>
          <th>Have</th>
          <th>Need</th>
          <th>Tags</th>
        </tr>
      </thead>
      <ReactSortable
        tag="tbody"
        animation={200}
        list={materials}
        setList={setMaterials}
        handle={`.${styles.dragHandle}`}
      >
        {materials.map((mat) => {
          return (
            <MaterialRow
              dragHandleClass={styles.dragHandle}
              key={mat.name}
              material={mat}
              numPossessed={mat.amountOwned}
              numRequired={requiredByMaterial[mat.name]}
              onChange={(value) =>
                setMaterials(
                  materials.map((material) => (material.name === mat.name ? { ...mat, amountOwned: value } : material))
                )
              }
            />
          );
        })}
      </ReactSortable>
    </table>
  );
}

interface MaterialRowProps {
  material: Material;
  numPossessed: number;
  numRequired: number;
  onChange?: (num: number) => void;
  dragHandleClass?: string;
}

function MaterialRow({ material, numPossessed, numRequired, onChange, dragHandleClass }: MaterialRowProps) {
  const stillRequired = Math.max(numRequired - numPossessed, 0);
  console.log(`Total: ${numRequired} / Have: ${numPossessed} - toGet: ${stillRequired}`);

  return (
    <tr className={stillRequired <= 0 ? styles.done : ""}>
      <td className={dragHandleClass}>
        <img src="/dot-grid.svg" alt="handle" />
      </td>
      <td>{material.name}</td> {/*name*/}
      <td>
        <NumberInput min={0} step={1} onChange={onChange} value={numPossessed} className={styles.haveInput} />
        {/*have*/}
      </td>
      <td className={styles["number-cell"]}>{`${stillRequired} (${numRequired})`}</td> {/* need */}
      <td>
        <input type="text" />
        {/* tags */}
      </td>
    </tr>
  );
}

export default MaterialSection;

function getMaterialsFromArmours(armours: ArmourItem[]) {
  const obj = armours
    .flatMap((armour) => armour.requirements.map<[string, number]>((req) => [req.name, req.amountRequired]))
    .filter(([name]) => Boolean(name))
    .reduce<Record<string, number>>((acc, [name, amount]) => {
      acc[name] ??= 0;
      acc[name] += amount;

      return acc;
    }, {});

  return obj;
}
