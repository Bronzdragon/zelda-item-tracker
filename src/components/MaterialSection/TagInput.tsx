import { useState } from "react";
import cs from "cs";
import styles from "./TagInput.module.css";
import editSrc from "./edit.svg";
import confirmSrc from "./confirm.svg";

interface tagInfo {
  name: string;
  active: boolean;
}

interface TagInputProps {
  tags: tagInfo[];
  onTagClicked?: (tagName: string) => void;
  onUpdateTags?: (newTags: string[]) => void;
}

function TagInput({ tags, onTagClicked, onUpdateTags }: TagInputProps) {
  const [editing, setEditing] = useState(false);

  const lowlightOthers = tags.some((tag) => tag.active);
  const innerElement = editing ? (
    <input name="tags" defaultValue={tags.map((tag) => tag.name).join(", ")} />
  ) : (
    <>
      {tags.map((tag) => (
        <Tag key={tag.name} tag={tag} lowlight={!tag.active && lowlightOthers} onClick={onTagClicked} />
      ))}
    </>
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setEditing((prev) => !prev);

        const tagString = new FormData(event.currentTarget).get("tags");
        if (tagString === null) return;
        if (typeof tagString !== "string") throw new TypeError("Expected a string out of this form.");
        const tags = tagString
          .split(",")
          .map((str) => str.trim().toLocaleLowerCase())
          .filter((str) => str !== "");

        onUpdateTags?.(tags);
      }}
    >
      <button className={styles.editButton} type="submit">
        <img src={editing ? confirmSrc : editSrc} alt="Edit tags" />
      </button>
      {innerElement}
    </form>
  );
}

export default TagInput;

interface TagPros {
  tag: tagInfo;
  lowlight?: boolean;
  onClick?: (name: string) => void;
}

function Tag({ tag, lowlight, onClick }: TagPros) {
  return (
    <span
      className={cs(styles.tag, tag.active && styles.highlight, lowlight && styles.lowlight)}
      style={{
        "--tag-color": cheapHashString(tag.name) % 360,
      }}
      onClick={() => onClick?.(tag.name)}
      title={tag.name}
    >
      {tag.name}
    </span>
  );
}

function cheapHashString(stringInput: string) {
  const offset = 51;
  return Math.abs([...stringInput].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc) + offset, 0));
}
