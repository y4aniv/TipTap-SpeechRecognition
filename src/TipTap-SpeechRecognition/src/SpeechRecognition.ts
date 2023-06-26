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

const SpeechRecognition = Node.create<SpeechRecognitionOptions>({
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

        this.recognition.start()

        this.recognition.contentLength = this.editor.getText().length + 1

        this.recognition.onresult = (event) => {

          this.recognition.currentResult = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            this.recognition.currentResult += event.results[i][0].transcript
          }
          this.editor.commands.deleteRange({
            from: this.recognition.contentLength,
            to: this.editor.getText().length + 1,
          })
          this.editor.commands.insertContentAt(this.recognition.contentLength, this.recognition.currentResult)
          if (event.results[event.results.length - 1].isFinal) {
            this.recognition.contentLength += event.results[event.results.length - 1][0].transcript.length + 1
          }
        }

        return "RECOGNITION STARTED"
      },

      stopSpeechRecognition: () => ({ commands }) => {
        console.log(this.recognition.results)
        this.recognition.stop()
        this.editor.commands.focus()
        this.recognition.lastResult = ''
        return "RECOGNITION STOPPED"
      }
    }
  },
})

export { SpeechRecognition }

export default SpeechRecognition
