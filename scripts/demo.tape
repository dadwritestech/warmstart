# warmstart demo tape — renders docs/demo.gif with vhs (https://github.com/charmbracelet/vhs)
#
# Requires: vhs + ttyd + ffmpeg on PATH.
#   macOS:   brew install vhs
#   Linux:   sudo apt install ttyd ffmpeg && go install github.com/charmbracelet/vhs@latest
#   Windows: vhs's headless-Chrome capture is unreliable natively — run this under WSL,
#            or use a real interactive terminal. (winget install charmbracelet.vhs tsl0922.ttyd Gyan.FFmpeg)
#
# Setup (one time, from the repo root):
#   npm run build
#   mkdir -p /tmp/ws-demo && cd /tmp/ws-demo
#   printf '{"scripts":{"test":"echo \"  ✓ 12 tests passed\"","build":"echo \"  ✓ built in 0.3s\"","lint":"echo \"  ✓ no problems\""}}' > package.json
#   touch package-lock.json
#   cp /path/to/repo/scripts/demo.tape .
#
# Render:
#   vhs demo.tape          # writes demo.gif here; copy it to the repo as docs/demo.gif

Output demo.gif

Set Shell "bash"
Set FontSize 18
Set Width 1100
Set Height 640
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 55ms

Type "# a repo your agent has never seen…"
Enter
Sleep 900ms

Type "npx warmstart init --yes"
Enter
Sleep 4s

Type "cat AGENTS.md"
Enter
Sleep 4s
