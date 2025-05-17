# youtube-transcript

this is cloned from <https://github.com/Kakulukian/youtube-transcript> and published on [JSRegistry](http://jsr.io)

## Installation

```bash
deno add @fbehrens/youtube-transcript
```

## Usage

```typescript
import { YoutubeTranscript } from '@fbehrens/youtube-transcript';
const transcript = await YoutubeTranscript.fetchTranscript('dQw4w9WgXcQ');
console.log(transcript);
```

## License

[MIT](https://de.wikipedia.org/wiki/MIT-Lizenz)
