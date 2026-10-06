# Phonetic Workbench

Try it - https://phonetic-translation.vercel.app/

Pick a sound for each letter of a word and export a respelling, Arpabet, and an ElevenLabs
`<phoneme>` tag. Words come from a pasted list or an imported .xlsx / .csv / .txt (uses a "Word"
column, or a sheet with "word" in its name, else the first column). Runs entirely in the browser.

## Run it locally (needs Node 18+, nothing to install)
    npm start            # http://localhost:3000   (PORT=3001 npm start to change the port)

## Files
- `index.html`, `styles.css`, `app.js`: the page
- `phonetic-translator.js`: the reusable `<phonetic-translator word="LAMB">` web component (no dependencies)
- `vendor/xlsx.full.min.js`: SheetJS 0.18.5 (Apache-2.0), loaded only when an Excel file is chosen
- `server.js`: tiny local server used by `npm start`
