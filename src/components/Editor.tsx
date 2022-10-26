import React from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import { Note } from "../App";

export default function Editor({
  currentNote,
  updateNote,
}: {
  currentNote: Note;
  updateNote: (value: string) => void;
}) {
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">(
    "write"
  );

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <section className='pane editor'>
      <ReactMde
        value={currentNote.body}
        onChange={updateNote}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        minEditorHeight={80}
        heightUnits='vh'
      />
    </section>
  );
}
