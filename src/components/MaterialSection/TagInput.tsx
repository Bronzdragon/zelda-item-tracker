import { useState } from "react";
import cs from "cs";
import styles from "./TagInput.module.css";
import editSrc from "./edit.svg";

interface tagInfo {
  name: string;
  active: boolean;
}

interface TagInputProps {
  tags: tagInfo[];
  onTagClicked?: (tagName: string) => void;
  onUpdateTags?: (newTags: string[]) => void;
}

function TagInput({ tags, onTagClicked }: TagInputProps) {
  const [editing, setEditing] = useState(false);

  if (editing)
    return (
      <form onSubmit={(event) => setEditing(false)}>
        <input value={tags.map((tag) => tag.name).join(", ")} />
      </form>
    );

  return (
    <>
      <button className={styles.editButton} onClick={() => setEditing(true)}>
        <img src={editSrc} alt="Edit tags" />
      </button>
      {tags.map((tag) => (
        <Tag tag={tag} onClick={onTagClicked} />
      ))}
    </>
  );
}

export default TagInput;

interface TagPros {
  tag: tagInfo;
  onClick?: (name: string) => void;
}

function Tag({ tag, onClick }: TagPros) {
  return (
    <span
      className={cs(styles.tag, tag.active && styles.highlight)}
      style={{
        // '--color': 'red',
        backgroundColor: `hsl(${cheapHashString(tag.name) % 360}, 60%, ${tag.active ? 40 : 40}%)`,
      }}
      onClick={() => onClick?.(tag.name)}
      title={tag.name}
    >
      {`${tag.name} ${tag.active ? "✓" : ""}`}
    </span>
  );
}

function cheapHashString(stringInput: string) {
  const offset = 51;
  return Math.abs([...stringInput].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc) + offset, 0));
}

interface TagEditProps {}
function TagEdit({}: TagEditProps) {
  // TODO:
}
