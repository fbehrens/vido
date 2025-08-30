# whisper

```bash
uv init
uv add openai-whisper

#deactivate
source .venv/bin/activate.fish

set vid ../packages/web/static/test/opening.mkv

source ./whisper.fish
extract_audio $vid

whisper_transcribe ../packages/web/static/test/opening.ogg


ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 $vid

echo "some string
from pipe" | my_piper
my_piper "as arg"

```
