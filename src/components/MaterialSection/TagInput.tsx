import styles from "./TagInput.module.css";
import cs from "cs";

interface tagInfo {
  name: string;
  active: boolean;
}

interface TagInputProps {
  tags: tagInfo[];
  onTagClicked?: (tagName: string) => void;
}

function TagInput({ tags, onTagClicked }: TagInputProps) {
  return (
    <div>
      {tags.map((tag) => (
        <Tag tag={tag} onClick={onTagClicked} />
      ))}
    </div>
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
      {`${tag.name} ${tag.active ? '✓' : ''}`}
    </span>
  );
}

function cheapHashString(stringInput: string) {
  const offset = 51;
  return Math.abs([...stringInput].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc) + offset, 0));
}
