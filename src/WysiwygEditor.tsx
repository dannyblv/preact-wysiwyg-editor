import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

type CommandStates = {
  [key: string]: boolean;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

const WysiwygEditor = ({onChange}: ({onChange: (htmlValue: string) => void;})) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeCommands, setActiveCommands] = useState<{ [key: string]: boolean }>({ bold: false, italic: false, underline: false });

  const executeCommand = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    updateActiveCommands();
  };

  const updateActiveCommands = () => {
    const commands: CommandStates = { bold: false, italic: false, underline: false };
    Object.keys(commands).forEach(command => {
      commands[command] = document.queryCommandState(command);
    });
    setActiveCommands(commands);
    onChange(editorRef.current?.innerHTML || '');
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveCommands();
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className={activeCommands.bold ? 'active' : ''}
        ><b>B</b></button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className={activeCommands.italic ? 'active' : ''}
        ><i>I</i></button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className={activeCommands.underline ? 'active' : ''}
        ><u>U</u></button>
      </div>
      <div
        className="editor"
        contentEditable
        ref={editorRef}
        onChange={updateActiveCommands}
      />
    </div>
  );
};

export default WysiwygEditor;