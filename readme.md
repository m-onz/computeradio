
# compute.radio

TODO write a readme

# Notes

Make a file smaller to fit within 100MB size limit:

```
ffmpeg -i everysongiown-feb_2.mp3 -map 0:a:0 -codec:a libmp3lame -b:a 128k ./everysongiown-feb.mp3
```

Add neocities API key to ~/.profile or environment variables

```
export NEOCITIES_API_KEY=xxxx
```

Adding pages

```
hugo new blog/new-website.md
hugo new archive/11-01-2025-new-archive.md
```
