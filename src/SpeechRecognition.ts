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
        this.recognition.interimResults = false
        this.recognition.maxAlternatives = 1
        this.recognition.continuous = true

        this.recognition.start()

        this.recognition.finalTranscript = ''

        let i = 0

        this.recognition.onresult = (event) => {
          var result = event.results[i][0].transcript
          this.editor.commands.insertContent(result)
          i++
        }

        return "RECOGNITION STARTED"
      },

      stopSpeechRecognition: () => ({ commands }) => {
        this.recognition.stop()
        this.recognition = null
        this.editor.commands.focus()
        return "RECOGNITION STOPPED"
      }
    }
  },
})

export { SpeechRecognition }

export default SpeechRecognition
