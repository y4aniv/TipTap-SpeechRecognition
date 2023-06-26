# SpeechRecognition

This extension enables speech-to-text recognition on the TipTap text editor

## Options

### lang
The language set for voice recognition
<br>
Type: `string`<br>
Default: `fr-FR`

## Usage

### JavaScript

```js
import { Editor } from "@tiptap/core";
import SpeechRecognition from 'path/to/extension';

new Editor({
  extensions: [
    SpeechRecognition.configure({
      lang: 'fr-FR',
    }),
  ],
})
```

#### Start voice recognition
```js
editor.commands.startSpeechRecognition()
```

#### Stop voice recognition
```js
editor.commands.stopSpeechRecognition()
```

## Todo

- [x] Real-time transcription
- [ ] Add punctuation support
- [ ] Several alternatives for each result
- [ ] Activating the extension with a keyboard command
