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
      startSpeechRecognition: () => () => {
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

          // If the length of the content of the editor is less than the length of the recognized content, redefine the variable contentLength taking into account the length of the recognized content
          if(this.recognition.contentLength > this.editor.getText().length + 1) {
            this.recognition.contentLength = this.editor.getText().length + 1
          }

          this.recognition.currentResult = ""

          // Add to the currentResult variable the content of the last recognized sentence
          for (let i = event.resultIndex; i < event.results.length; i++) {
            this.recognition.currentResult += event.results[i][0].transcript
          }

          // Delete the last sentence displayed (currentResult) in the editor
          this.editor.commands.deleteRange({
            from: this.recognition.contentLength,
            to: this.editor.getText().length + 1,
          })

          // Add the last recognized sentence (currentResult) in the editor with a style
          this.editor.commands.insertContentAt(this.recognition.contentLength, `<code>${this.recognition.currentResult}</code>`)

          // If the last recognized sentence is final, delete the last recognized sentence (currentResult) in the editor and rewrite the last recognized sentence (currentResult) in the editor without style
          if (event.results[event.results.length - 1].isFinal) {
            this.editor.commands.deleteRange({
              from: this.recognition.contentLength,
              to: this.editor.getText().length + 1,
            })
            this.editor.commands.insertContentAt(this.recognition.contentLength, this.recognition.currentResult)
            
            // Redefine the variable contentLength taking into account the last recognized sentence
            this.recognition.contentLength += event.results[event.results.length - 1][0].transcript.length + 1
          }
        }

        return true
      },

      stopSpeechRecognition: () => () => {
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
