import styles from "./MaterialSection.module.css";
import NumberInput from "./NumberInput";
// import { DraggableContainer } from "./Draggable";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { ArmourItem, Material } from "../types";
import { useEffect, useState } from "react";

interface MaterialSortElement extends ItemInterface {
  id: string;
}

interface MaterialSectionProps {
  armours: ArmourItem[];
  materials: Material[];
  onMaterialUpdate(materialName: string, newTotal: number): void;
  // setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

type sortDirection = "asc" | "dec" | "other";
// type sortOptions =
interface SortState {
  sortedBy: "name" | "have" | "need" | "tags" | "custom";
  direction: sortDirection;
}
const defaultSortState = { sortedBy: "custom", direction: "other" } as const;

function MaterialSection({ armours, materials, onMaterialUpdate }: MaterialSectionProps) {
  const [materialSort, setMaterialSort] = useState<MaterialSortElement[]>([]);
  const [sortState, setSortState] = useState<SortState>(defaultSortState);
  const requiredByMaterial = getMaterialsFromArmours(armours);

  useEffect(() => {
    // Add missing materials to our sort.
    const existingMaterials = new Set(materialSort.map((mat) => mat.id));
    const newMaterials = materials.filter((material) => !existingMaterials.has(material.name));
    if (newMaterials.length <= 0) return;

    setMaterialSort([...materialSort, ...newMaterials.map((Material) => ({ id: Material.name }))]);
  }, [materialSort, materials]);

  const onSortChanged = (state: SortState) => {
    const newSort = [...materialSort];
    switch (state.sortedBy) {
      case "custom":
      case "tags":
        return;
      case "name":
        newSort.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "have":
        newSort.sort((a, b) => {
          const aFull = materials.find((mat) => mat.name === a.id);
          const bFull = materials.find((mat) => mat.name === b.id);
          if (!aFull || !bFull) return 0;

          return aFull.amountOwned - bFull.amountOwned;
        });
        break;
      case "need":
        newSort.sort((a, b) => {
          const aFull = materials.find((mat) => mat.name === a.id);
          const bFull = materials.find((mat) => mat.name === b.id);
          if (!aFull || !bFull) return 0;

          const aRequired = requiredByMaterial[aFull.name];
          const bRequired = requiredByMaterial[bFull.name];

          const aRemaining = aRequired - aFull.amountOwned;
          const bRemaining = bRequired - bFull.amountOwned;

          if (aRemaining !== bRemaining) {
            return aRemaining - bRemaining;
          }

          return bRequired - aRequired;
        });
    }

    if (sortState.sortedBy === state.sortedBy && state.direction === "dec") newSort.reverse();
    setMaterialSort(newSort);
    setSortState(state);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          <MaterialHeader name="name" sortInfo={{state: sortState, onSortChanged}} />
          <MaterialHeader name="have" sortInfo={{state: sortState, onSortChanged}}  />
          <MaterialHeader name="need" sortInfo={{state: sortState, onSortChanged}}  />
          <MaterialHeader name="tags" />
        </tr>
      </thead>
      <ReactSortable
        tag="tbody"
        animation={200}
        list={materialSort}
        setList={setMaterialSort}
        handle={`.${styles.dragHandle}`}
        onEnd={(event) => {
          if (event.oldIndex !== event.newIndex) setSortState({ direction: "other", sortedBy: "custom" });
        }}
      >
        {materialSort.map((mat) => {
          const material = materials.find((material) => material.name === mat.id);
          if (!material) return null;

          return (
            <MaterialRow
              dragHandleClass={styles.dragHandle}
              key={material.name}
              material={material}
              numPossessed={material.amountOwned}
              numRequired={requiredByMaterial[material.name]}
              onChange={(amount) => onMaterialUpdate(material.name, amount)}
            />
          );
        })}
      </ReactSortable>
    </table>
  );
}

type MaterialHeaderProps = {
  name: SortState["sortedBy"];
  sortInfo?: {state: SortState, onSortChanged?: (newState: SortState) => void };
}

function MaterialHeader({ name, sortInfo: sort }: MaterialHeaderProps) {
  return (
    <th
      className={styles.tableHeader}
      onClick={() => {
        if(!sort?.state) return;
        const direction = sort.state.sortedBy === name && sort.state.direction === "asc" ? "dec" : "asc";
        sort?.onSortChanged?.({ sortedBy: name, direction });
      }}
    >
      {name}
      {sort ? <img
        src={`/view-sort-${
          sort.state.sortedBy === name && sort.state.direction === "asc" ? "descending": "ascending"
        }-symbolic.svg`}
        alt="sort by name"
      /> : null}
    </th>
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

  return (
    <tr className={stillRequired <= 0 ? styles.done : ""}>
      <td className={dragHandleClass}>
        <img src="/dot-grid.svg" alt="handle" />
      </td>
      <td>{material.name}</td>
      {/*name*/}
      <td>
        <NumberInput min={0} step={1} onChange={onChange} value={numPossessed} className={styles.haveInput} />
        {/*have*/}
      </td>
      <td className={styles["number-cell"]}>{`${stillRequired} (${numRequired})`}</td>
      {/* need */}
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
