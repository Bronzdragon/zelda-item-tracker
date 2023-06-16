import "./App.css";
import { ArmourItem, Material } from "./types";
import { useEffect } from "react";
import usePersistentState from "./usePersistentState";

import ArmourSection from "./components/AmourSection/ArmourSection";
import Collapsible from "./components/Collapsible";
import MaterialSection from "./components/MaterialSection/MaterialSection";

import swalWithReact from "./swalShim";
import { ConfirmMessage, UnmetRequirements } from "./components/AmourSection/SwalMessages";

function App() {
  const [armourList, setArmourList] = usePersistentState<ArmourItem[]>("armourList", []);
  const [materialList, setMaterialList] = usePersistentState<Material[]>("materialList", []);

  // Add any missing materials to the array.
  useEffect(() => {
    const allMaterials = armourList.flatMap((armour) => armour.requirements.map((requirement) => requirement.name));
    const existingMaterials = materialList.map((mat) => mat.name.toLocaleLowerCase());
    const missingMaterials = new Set(
      allMaterials.filter((material) => !existingMaterials.includes(material.toLocaleLowerCase()))
    );

    if (missingMaterials.size > 0) {
      setMaterialList([
        ...materialList,
        ...[...missingMaterials].map((material) => ({ id: material, name: material, amountOwned: 0, tags: [] })),
      ]);
    }
  }, [armourList, materialList, setMaterialList]);

  return (
    <div className="App">
      {armourList.length > 0 ? (
        <Collapsible>
          <MaterialSection
            armours={armourList}
            materials={materialList}
            onMaterialUpdate={(name, amountOwned, tags) =>
              setMaterialList(
                materialList.map((material) => (material.name === name ? { name, amountOwned, tags } : material))
              )
            }
          ></MaterialSection>
        </Collapsible>
      ) : null}
      <Collapsible>
        <ArmourSection
          items={materialList}
          armours={armourList}
          onUpdateItem={async (type, item, oldItem) => {
            if (type === "delete") {
              const result: true | null = await swalWithReact(<>Discard {item.name}?</>, {
                buttons: [true, "Yes"],
                icon: "error",
                dangerMode: true,
              });
              if (result) {
                setArmourList(armourList.filter((armour) => armour.name !== item.name));
              }
            }
            if (type === "edit")
              setArmourList(armourList.map((armour) => (armour.name === oldItem?.name ? item : armour)));
            if (type === "new") setArmourList([...armourList, item]);
            if (type === "complete") {
              const requirements = item.requirements.map((requirement) => ({
                name: requirement.name,
                needed: requirement.amountRequired,
                owned: materialList.find((material) => material.name === requirement.name)?.amountOwned ?? 0,
              }));

              const haveRequirements = requirements.every((requirement) => requirement.owned >= requirement.needed);
              if (!haveRequirements) {
                if (
                  !(await swalWithReact(
                    <UnmetRequirements
                      requirements={requirements.filter((requirement) => requirement.needed > requirement.owned)}
                    />,
                    {
                      buttons: [true, "Yes"],
                      icon: "error",
                      dangerMode: true,
                    }
                  ))
                )
                  return;
              }
              if (
                !(await swalWithReact(<ConfirmMessage requirements={requirements} />, {
                  buttons: [true, true],
                  icon: "success",
                }))
              )
                return;

              setArmourList(armourList.filter((armour) => armour.name !== item.name));
              setMaterialList(
                materialList.map((material) => {
                  const requirement = requirements.find((requirements) => requirements.name === material.name);
                  if (!requirement) return material;
                  return { ...material, amountOwned: Math.max(material.amountOwned - requirement.needed, 0) };
                })
              );
            }
          }}
        ></ArmourSection>
      </Collapsible>
    </div>
  );
}

export default App;
