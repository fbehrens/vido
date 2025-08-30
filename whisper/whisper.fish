function extract_audio
    set video $argv
    set codec (ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 $video)
    echo codec $codec
    set container ""
    if string match --quiet vorbis $codec
        set container ogg
    end
    echo container $container
    set audio (path change-extension .$container $video)
    set fish_trace 1
    ffmpeg -i "$video" -c:a copy -vn "$audio"
    set -e fish_trace
end

function whisper_transcribe
    set audio $argv
    set outdir (dirname $audio)
    set fish_trace 1
    uv run whisper $audio --model turbo --language en --word_timestamps True --output_format json --output_dir $outdir
    set -e fish_trace
end

function my_piper --description "gets the last line from stdin as arg1"
    set -l arg1 $argv
    if not isatty stdin
        while read -l line
            set arg1 $line
        end
    end
    echo arg1 = $arg1
end
