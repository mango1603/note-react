import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";

export default function App() {
  const [notes, setNotes] = React.useState<Note[]>(getLocalStorage() || []);
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function getLocalStorage(): Note[] | null {
    const strStorage = localStorage.getItem("notes");
    if (strStorage) {
      return JSON.parse(strStorage);
    } else {
      return null;
    }
  }

  function deleteNote(event: Event, noteId: number) {
    event.stopPropagation();
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== noteId);
    });
  }

  function createNewNote(): void {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text: string) {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        return note.id === currentNoteId ? { ...note, body: text } : note;
      })
    );

    setNotes((prevNotes) => {
      prevNotes.forEach((note, index) => {
        if (note.id === currentNoteId) {
          prevNotes.splice(index, 1);
          prevNotes.unshift(note);
        }
      });

      return prevNotes;
    });
  }

  function findCurrentNote(): Note {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split
          sizes={[30, 70]}
          direction='horizontal'
          className='split'
        >
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor
              currentNote={findCurrentNote()}
              updateNote={updateNote}
            />
          )}
        </Split>
      ) : (
        <div className='no-notes'>
          <h1>You have no notes</h1>
          <button
            className='first-note'
            onClick={createNewNote}
          >
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export interface Note {
  id: number;
  body: string;
}
