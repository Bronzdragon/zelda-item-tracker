import { ItemInterface } from "react-sortablejs";

export type ArmourItem = {
  name: string;
  requirements: Requirement[];
};

export function isArmourItem(item: unknown): item is ArmourItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "name" in item &&
    typeof item.name === "string" &&
    "requirements" in item &&
    Array.isArray(item.requirements) &&
    item.requirements.every(isRequirement)
  );
}

export interface Requirement {
  name: string;
  amountRequired: number;
}

export interface Material {
  name: string;
  tags: string[];
  amountOwned: number;
}

export function isRequirement(requirement: unknown): requirement is Requirement {
  return (
    typeof requirement === "object" &&
    requirement !== null &&
    "name" in requirement &&
    typeof requirement.name === "string" &&
    "amount" in requirement &&
    typeof requirement.amount === "number"
  );
}
