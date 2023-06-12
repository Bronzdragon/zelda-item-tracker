import { useEffect, useState } from "react";
import { ArmourItem, Requirement } from "../../../types";
import styles from "./ItemEdit.module.css";
import cs, { csType } from "cs";

type TypeOfEdit = "new" | "edit";

interface props {
  details?: ArmourItem;
  editType: TypeOfEdit;
  className?: csType;
  onSubmit?: (newItem: ArmourItem) => void;
}

function ItemEdit({ onSubmit, details, editType = "new", className }: props) {
  const [name, setName] = useState(details?.name ?? "");
  const [requirements, setRequirements] = useState<Requirement[]>(() => details?.requirements ?? []);

  useEffect(() => {
    if (requirements.length >= 4) return;
    setRequirements([...requirements, ...getDefaultRequirements()].slice(0, 4));
  }, [requirements, setRequirements]);

  return (
    <form
      className={cs(className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (name === "") return;

        onSubmit?.({ name, requirements: requirements.filter((req) => req.name !== "" && req.amountRequired > 0) });
        setName("");
        setRequirements(getDefaultRequirements());
      }}
    >
      <label htmlFor="name" className={styles.label}>
        Armour name
      </label>
      <br />
      <input
        type="text"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Armour piece..."
      ></input>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>count</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((requirement, index) => (
            <RequirementInput
              key={index}
              value={requirement}
              onChange={(newValue) => {
                if (!newValue.name) newValue.amountRequired = 0;
                setRequirements((oldRequirements) => [
                  ...oldRequirements.slice(0, index),
                  newValue,
                  ...oldRequirements.slice(index + 1),
                ]);
              }}
            />
          ))}
        </tbody>
      </table>

      <button className={styles.button} type="submit">
        {editType === "new" ? "Add" : "Update"}
      </button>
    </form>
  );
}

export default ItemEdit;

interface RequirementInputProps {
  value: Requirement;
  onChange: (newValue: Requirement) => void;
}

function RequirementInput({ value: { name, amountRequired: amount }, onChange }: RequirementInputProps) {
  return (
    <tr>
      <td>
        <input
          type="text"
          name={`item`}
          value={name}
          placeholder="Material..."
          onChange={(event) => onChange({ name: event.target.value, amountRequired: amount })}
        />
      </td>
      <td>
        <input
          type="number"
          min={0}
          step={1}
          name={`amount`}
          className={styles["number-input"]}
          value={amount}
          onChange={(event) => onChange({ name, amountRequired: Number(event.target.value) })}
        />
      </td>
    </tr>
  );
}

function getDefaultRequirements(count = 4, { name = "", amountRequired = 0 } = {}): Requirement[] {
  return Array.from({ length: count }, () => ({ name, amountRequired }));
}
