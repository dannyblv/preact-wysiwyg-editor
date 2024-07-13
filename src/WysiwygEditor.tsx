import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

const EDITOR_BUTTONS = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
];

type CommandStates = {
  [keyof: string]: boolean;
};

const WysiwygEditor = ({
  value,
  onChange,
}: {
  onChange: (htmlValue: string) => void;
  value: string;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const [activeCommands, setActiveCommands] = useState<CommandStates>(
    EDITOR_BUTTONS.reduce(
      (all, { command }) => ({ ...all, [command]: false }),
      {}
    )
  );

  const executeCommand = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    updateActiveCommands();
  };

  const updateActiveCommands = () => {
    const commands: CommandStates = {
      bold: false,
      italic: false,
      underline: false,
    };

    Object.keys(commands).forEach((command) => {
      commands[command] = document.queryCommandState(command);
    });

    setActiveCommands(commands);

    // Ensure onChange is called with the latest content
    onChange(editorRef.current?.innerHTML || "");
  };

  useEffect(() => {
    // Initialize the editor with the value prop
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  useEffect(() => {
    // Update the editor content when value changes
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = document.getSelection();
      if (
        editorRef.current &&
        selection &&
        editorRef.current.contains(selection.anchorNode)
      ) {
        updateActiveCommands();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <div className="editor-container">
      <div
        className="editor-surface"
        contentEditable
        ref={editorRef}
        onInput={updateActiveCommands}
        tabIndex={0}
      />
      <div className="toolbar-container">
        {EDITOR_BUTTONS.map(({ label, command }) => (
          <button
            key={label}
            type="button"
            onClick={() => executeCommand(command)}
            className={activeCommands[command] ? "toolbar-option-active" : ""}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WysiwygEditor;
