import { Node } from '@tiptap/core'

export interface SpeechRecognitionOptions {
  lang: string,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    SpeechRecognition: {
      startSpeechRecognition: () => ReturnType,
      stopSpeechRecognition: () => ReturnType,
    }
  }
}

class SR_Node<O = any, S = any> extends Node<O, S> {
  recognition: SpeechRecognition;
  static create<O = any, S = any>(config?: any) {
    return Node.create(config) as SR_Node<O, S>;
  }
};

const SpeechRecognition = SR_Node.create<SpeechRecognitionOptions>({
  name: 'SpeechRecognition',

  addOptions() {
    return {
      lang: 'fr-FR',
    }
  },

  addCommands() {
    return {
      startSpeechRecognition: () => ({ commands }) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()

        this.recognition.lang = this.options.lang
        this.recognition.interimResults = true
        this.recognition.maxAlternatives = 1
        this.recognition.continuous = true

        this.recognition.start();

        this.recognition.contentLength = this.editor.getText().length + 1
        this.recognition.quoicoubeh = null

        this.recognition.onresult = (event) => {

          this.recognition.currentResult = ""

          // Ajouter à la variable currentResult le contenu de la dernière phrase reconnue
          for (let i = event.resultIndex; i < event.results.length; i++) {
            this.recognition.currentResult += event.results[i][0].transcript
          }

          // Supprimer la dernière phrase afficher (currentResult) dans l'éditeur
          this.editor.commands.deleteRange({
            from: this.recognition.contentLength,
            to: this.editor.getText().length + 1,
          })

          // Ajouter la dernière phrase reconnue (currentResult) dans l'éditeur avec un style
          this.editor.commands.insertContentAt(this.recognition.contentLength, `<code>${this.recognition.currentResult}</code>`)

          // Si la dernière phrase reconnue est finale, supprimer la dernière phrase reconnue (currentResult) dans l'éditeur et réecrir la dernière phrase reconnue (currentResult) dans l'éditeur sans style
          if (event.results[event.results.length - 1].isFinal) {
            this.editor.commands.deleteRange({
              from: this.recognition.contentLength,
              to: this.editor.getText().length + 1,
            })
            this.editor.commands.insertContentAt(this.recognition.contentLength, this.recognition.currentResult)
            
            // Redéfinir la variable contentLength en prenant en compte la dernière phrase reconnue
            this.recognition.contentLength += event.results[event.results.length - 1][0].transcript.length + 1
          }
        }

        return true
      },

      stopSpeechRecognition: () => ({ commands }) => {
        this.recognition.stop()
        this.editor.commands.focus()
        this.recognition.lastResult = ''
        return true
      }
    }
  },
})

export { SpeechRecognition }

export default SpeechRecognition
