import styles from "./MaterialSection.module.css";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { ArmourItem, Material } from "../../types";
import MaterialRow, { DisplayState } from "./MaterialRow";
import MaterialHeader from "./MaterialHeader";
import usePersistentState from "../../usePersistentState";

interface MaterialSectionProps {
  armours: ArmourItem[];
  materials: Material[];
  onMaterialUpdate(materialName: string, newTotal: number, tags: string[]): void;
  // setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

export interface SortState {
  sortedBy: "name" | "have" | "need" | "tags" | "custom";
  direction: "asc" | "dec" | "other";
}
const defaultSortState = { sortedBy: "custom", direction: "other" } as const;

function MaterialSection({ armours, materials, onMaterialUpdate }: MaterialSectionProps) {
  const [materialSort, setMaterialSort] = usePersistentState<{ id: string }[]>("sort", []);
  const [sortState, setSortState] = useState<SortState>(defaultSortState);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const requiredByMaterial = getMaterialsFromArmours(armours);

  // Add missing materials to our sort.
  useEffect(() => {
    const existingMaterials = new Set(materialSort.map((mat) => mat.id));
    const newMaterials = materials.filter((material) => !existingMaterials.has(material.name));
    if (newMaterials.length <= 0) return;

    setMaterialSort([...materialSort, ...newMaterials.map(({ name: id }) => ({ id }))]);
  }, [materialSort, materials, setMaterialSort]);

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

  const [rowsWithActiveTags, rowsWithoutActiveTags] = divideArray(materialSort, (element) => {
    const material = materials.find((material) => material.name === element.id);
    const hasActiveMaterial = material?.tags.some((tag) => activeTags.includes(tag)) ?? false;
    const hasActiveArmour = armours
      .filter(({ name }) => activeTags.includes(name))
      .some(({ requirements }) => requirements.some((requirement) => requirement.name === element.id));
    return hasActiveMaterial || hasActiveArmour;
  });

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          <MaterialHeader name="name" sortInfo={{ state: sortState, onSortChanged }} />
          <MaterialHeader name="have" sortInfo={{ state: sortState, onSortChanged }} />
          <MaterialHeader name="need" sortInfo={{ state: sortState, onSortChanged }} />
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
        {[...rowsWithActiveTags, ...rowsWithoutActiveTags].map((mat) => {
          const material = materials.find((material) => material.name === mat.id);
          if (!material) return null;

          const relevantArmours = armours.filter(({ requirements }) =>
            requirements.some((requirement) => requirement.name === mat.id)
          );

          const displayState: DisplayState =
            rowsWithActiveTags.length === 0 ? "regular" : rowsWithActiveTags.includes(mat) ? "highlight" : "lowlight";

          return (
            <MaterialRow
              key={material.name}
              displayState={displayState}
              dragHandleClass={styles.dragHandle}
              material={material}
              numPossessed={material.amountOwned}
              numRequired={requiredByMaterial[material.name]}
              visible={material.name in requiredByMaterial}
              relevantArmours={relevantArmours}
              activeTags={activeTags}
              onAmountUpdate={(amount) => onMaterialUpdate(material.name, amount, material.tags)}
              onTagsUpdated={(tags) => onMaterialUpdate(material.name, material.amountOwned, tags)}
              onTagToggled={(tag, state) => {
                if (state) {
                  setActiveTags((prev) => [...prev, tag]);
                } else {
                  setActiveTags((prev) => prev.filter((t) => t !== tag));
                }
              }}
            />
          );
        })}
      </ReactSortable>
    </table>
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

function divideArray<T>(inputArray: T[], predicate: (element: T) => boolean): [T[], T[]] {
  const result = inputArray.reduce<{ hit: T[]; miss: T[] }>(
    (result, element) => {
      if (predicate(element)) {
        result.hit.push(element);
      } else {
        result.miss.push(element);
      }

      return result;
    },
    { hit: [], miss: [] }
  );

  return [result.hit, result.miss];
}
