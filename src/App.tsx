import "./App.css";
import { ArmourItem, Material } from "./types";
import { useEffect, useState } from "react";
import ArmourSection from "./components/ArmourSection";
import Collapsible from "./components/Collapsible";
import MaterialSection from "./components/MaterialSection";

function App() {
  const [armourList, setArmourList] = useState<ArmourItem[]>(defaultArmourList);
  const [materialList, setMaterialList] = useState<Material[]>([]);

  // Add any missing materials to the array.
  useEffect(() => {
    // console.log("Checking for duplicates....");
    const allMaterials = armourList.flatMap((armour) => armour.requirements.map((requirement) => requirement.name));
    const existingMaterials = materialList.map((mat) => mat.name.toLocaleLowerCase());
    const missingMaterials = new Set(
      allMaterials.filter((material) => !existingMaterials.includes(material.toLocaleLowerCase()))
    );
    // console.log("All materials so far: ", allMaterials);
    // console.log("Already Existing materials: ", existingMaterials);
    // console.log("Missing materials: ", missingMaterials);

    if (missingMaterials.size > 0) {
      setMaterialList([
        ...materialList,
        ...[...missingMaterials].map((material) => ({ id: material, name: material, amountOwned: 0, tags: [] })),
      ]);
    }
  }, [armourList, materialList]);

  return (
    <div className="App">
      <Collapsible>
        <ArmourSection armours={armourList} onUpdateItemList={setArmourList} />
      </Collapsible>
      <Collapsible>
        <MaterialSection armours={armourList} materials={materialList} setMaterials={setMaterialList} />
      </Collapsible>
    </div>
  );
}

export default App;

const defaultArmourList = [
  {
    name: "Hylian legs lvl 3",
    requirements: [
      { name: "Green Lizalfos Tail", amountRequired: 15 },
      { name: "Hinox Horn", amountRequired: 5 },
      { name: "Star Fragment", amountRequired: 2 },
    ],
  },
  {
    name: "Hylian legs lvl 4",
    requirements: [
      { name: "Blue Lizalfos Tail", amountRequired: 15 },
      { name: "Stalnox Guts", amountRequired: 5 },
      { name: "Star Fragment", amountRequired: 2 },
    ],
  },
];
