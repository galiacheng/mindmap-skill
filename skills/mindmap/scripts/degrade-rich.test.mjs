import { test } from 'node:test';
import assert from 'node:assert/strict';
import { degradeRich } from './degrade-rich.mjs';

test('table -> one bullet per data row, header + separator dropped', () => {
  const md = [
    '## Results',
    '| Benchmark | Before | After |',
    '| --- | --- | --- |',
    '| SWE Pro | 46.0 | 51.5 |',
    '| SWE-QA | n/a | -60% |',
  ].join('\n');
  assert.equal(degradeRich(md), [
    '## Results',
    '- SWE Pro · 46.0 · 51.5',
    '- SWE-QA · n/a · -60%',
  ].join('\n'));
});

test('fenced code block -> inline-code bullets at fence indent', () => {
  const md = [
    '- Stage 1 SFT',
    '  ```',
    '  reward = F1(file) + F1(line)',
    '  ```',
  ].join('\n');
  assert.equal(degradeRich(md), [
    '- Stage 1 SFT',
    '  - `reward = F1(file) + F1(line)`',
  ].join('\n'));
});

test('checkbox -> plain bullet, indentation preserved', () => {
  const md = [
    '- Tasks',
    '  - [ ] open-source recipe',
    '  - [x] SFT + RL',
  ].join('\n');
  assert.equal(degradeRich(md), [
    '- Tasks',
    '  - open-source recipe',
    '  - SFT + RL',
  ].join('\n'));
});

test('core formats (bold, link, inline code, headings) pass through unchanged', () => {
  const md = [
    '## Meta',
    '- **headline** metric',
    '- [arXiv](https://arxiv.org/abs/2606.14066)',
    '- plain `inline code` stays',
  ].join('\n');
  assert.equal(degradeRich(md), md);
});

test('CRLF input: rich constructs degrade and output is normalized to LF', () => {
  const md = [
    '## Tasks',
    '- [ ] open-source recipe',
    '| Metric | Val |',
    '| --- | --- |',
    '| tokens | -60% |',
  ].join('\r\n');
  assert.equal(degradeRich(md), [
    '## Tasks',
    '- open-source recipe',
    '- tokens · -60%',
  ].join('\n'));
});
