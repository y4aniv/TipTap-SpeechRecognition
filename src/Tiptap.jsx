import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SpeechRecognition from './TipTap-SpeechRecognition/src/index.ts';

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      SpeechRecognition.configure({
        lang: 'fr-FR',
        realtime: false,
      })
    ],
    content: "",
  });

  const startSpeechRecognition = () => {
    if (editor) {
      editor.commands.startSpeechRecognition()
    }
  };

  const stopSpeechRecognition = () => {
    if (editor) {
      editor.commands.stopSpeechRecognition()
    }
  }

  return (
    <>
      <button onClick={startSpeechRecognition}>Lancer la reconnaissance vocale</button>
      <button onClick={stopSpeechRecognition}>Arrêter la reconnaissance vocale</button>
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
