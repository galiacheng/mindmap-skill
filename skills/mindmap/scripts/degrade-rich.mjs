#!/usr/bin/env node
// degrade-rich.mjs — degrade markmap "rich" nodes (tables, code blocks,
// checkboxes) into plain bullets so the vertical-poster parser (parse-md.mjs,
// which reads only `##` headings and `-` bullets) renders them instead of
// silently dropping them. Standard markmap output keeps the rich formats; run
// this ONLY for the poster path.
//
// Usage: node degrade-rich.mjs <in.md> [out.md]   (out defaults to stdout)
// Exit: 0 ok | 2 file not found | 5 empty input.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FENCE = /^(\s*)```/;
const TABLE_ROW = /^\s*\|(.+)\|\s*$/;
const TABLE_SEP = /^\s*\|?[\s:|-]+\|?\s*$/; // e.g. | --- | :--: |
const CHECKBOX = /^(\s*)-\s+\[[ xX]\]\s+(.*)$/;

function degradeRich(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  let inFence = false;
  let fenceIndent = '';

  while (i < lines.length) {
    const line = lines[i];

    // 1. fenced code block -> one inline-code bullet per non-empty line
    const fm = line.match(FENCE);
    if (fm && !inFence) { inFence = true; fenceIndent = fm[1]; i++; continue; }
    if (inFence) {
      if (FENCE.test(line)) { inFence = false; i++; continue; } // closing fence
      if (line.trim()) out.push(`${fenceIndent}- \`${line.trim()}\``);
      i++;
      continue;
    }

    // 2. table -> one bullet per data row (skip header + separator)
    if (TABLE_ROW.test(line)) {
      const block = [];
      while (i < lines.length && TABLE_ROW.test(lines[i])) { block.push(lines[i]); i++; }
      const indent = (block[0].match(/^(\s*)/) || ['', ''])[1];
      const rows = block.filter(r => !TABLE_SEP.test(r));
      for (const r of rows.slice(1)) { // slice(1) drops the header row
        const cells = r.trim().replace(/^\|/, '').replace(/\|$/, '')
          .split('|').map(c => c.trim()).filter(Boolean);
        out.push(`${indent}- ${cells.join(' · ')}`);
      }
      continue;
    }

    // 3. checkbox -> plain bullet
    const cb = line.match(CHECKBOX);
    if (cb) { out.push(`${cb[1]}- ${cb[2]}`); i++; continue; }

    out.push(line);
    i++;
  }
  return out.join('\n');
}

export { degradeRich };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [inPath, outPath] = process.argv.slice(2);
  let src;
  try { src = readFileSync(inPath, 'utf8'); }
  catch { process.stderr.write(`error: file not found: ${inPath}\n`); process.exit(2); }
  if (!src.trim()) { process.stderr.write('error: empty input\n'); process.exit(5); }
  const result = degradeRich(src);
  if (outPath) { writeFileSync(outPath, result, 'utf8'); process.stdout.write(outPath); }
  else process.stdout.write(result);
}
