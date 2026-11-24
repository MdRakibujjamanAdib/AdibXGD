import test from 'node:test';
import assert from 'node:assert/strict';
import type { Project } from '../src/data/projects';
import {
  damerauLevenshtein,
  isKeyboardAdjacent,
  buildCorpusVocabulary,
  correctSingleWord,
  correctSearchQuery,
  matchesProject,
} from '../src/utils/fuzzySearch';

const mockProjects: Project[] = [
  {
    id: 'green-d-web',
    title: 'Green D – AI Carbon Footprint Tracker',
    shortTitle: 'Green D Home',
    category: 'Web & Automation',
    summary: 'A full-stack sustainability platform combining IoT energy monitoring, carbon tracking, smart home optimization, receipt-based emission analysis, and AI-powered eco insights.',
    description: '<p>Smart home and IoT telemetry architecture.</p>',
    thumbnail: '/images/projects/green-d-carbon-tracker-home.webp',
    tags: ['IoT', 'IoT Telemetry', 'Smart Home Integration', 'React', 'Full Stack Development', 'Carbon Footprint Tracker'],
    date: '2024-02-23',
  },
  {
    id: 'walton-3d-monitor-design',
    title: 'Walton 3D Monitor Design',
    shortTitle: 'Walton Monitor',
    category: '3D',
    summary: 'Realistic measured prototype 3D monitor modeling and cinematic lighting in 3ds Max.',
    description: '<p>Millimeter-accurate 3D monitor design.</p>',
    thumbnail: '/images/projects/walton-monitor.webp',
    tags: ['3ds Max', 'V-Ray', 'Product Modeling', '3D Monitor', 'Hard Surface Modeling'],
    date: '2023-09-15',
  },
  {
    id: 'vray-shoe-commercial-animation',
    title: 'Nike Shoe Commercial Animation',
    shortTitle: 'Shoe Animation',
    category: 'Animation & Motion',
    summary: '3D product lighting, camera choreography, and turntable animation for athletic footwear.',
    description: '<p>High-end footwear rendering.</p>',
    thumbnail: '/images/projects/shoe-thumb.webp',
    tags: ['3ds Max', 'V-Ray', 'Product Animation', 'Lighting', 'Commercial'],
    date: '2023-11-20',
  },
  {
    id: 'evergreen-token-ui-ux',
    title: 'EverGreen Token – Gamified Sustainability UI/UX',
    shortTitle: 'EverGreen Token',
    category: 'UI/UX Design',
    summary: 'Gamified mobile app and design system for plastic recycling rewards in Figma.',
    description: '<p>Figma UI/UX design.</p>',
    thumbnail: '/images/projects/evergreen.webp',
    tags: ['Figma', 'UI/UX Design', 'Design System', 'Mobile App', 'Sustainability'],
    date: '2024-01-10',
  },
];

test('Fuzzy Search & Typo Tolerance Unit Tests', async (t) => {
  await t.test('damerauLevenshtein calculates correct distances with transpositions', () => {
    assert.equal(damerauLevenshtein('iot', 'iot'), 0);
    assert.equal(damerauLevenshtein('uot', 'iot'), 1); // 1 substitution
    assert.equal(damerauLevenshtein('ito', 'iot'), 1); // 1 transposition
    assert.equal(damerauLevenshtein('moniter', 'monitor'), 1);
    assert.equal(damerauLevenshtein('blander', 'blender'), 1);
    assert.equal(damerauLevenshtein('shue', 'shoe'), 1);
  });

  await t.test('isKeyboardAdjacent detects QWERTY key slips', () => {
    assert.equal(isKeyboardAdjacent('u', 'i'), true);
    assert.equal(isKeyboardAdjacent('i', 'u'), true);
    assert.equal(isKeyboardAdjacent('a', 's'), true);
    assert.equal(isKeyboardAdjacent('z', 'p'), false);
  });

  const vocabulary = buildCorpusVocabulary(mockProjects);

  await t.test('buildCorpusVocabulary indexes words from projects and seeds', () => {
    assert.ok(vocabulary.has('iot'), 'Should contain iot');
    assert.ok(vocabulary.has('monitor'), 'Should contain monitor');
    assert.ok(vocabulary.has('shoe'), 'Should contain shoe');
    assert.ok(vocabulary.has('blender'), 'Should contain seeded blender');
    assert.ok(vocabulary.has('figma'), 'Should contain figma');
  });

  await t.test('correctSingleWord correctly fixes "uot" to "iot"', () => {
    const res = correctSingleWord('uot', vocabulary);
    assert.equal(res.wasCorrected, true);
    assert.equal(res.corrected, 'iot');
  });

  await t.test('correctSingleWord correctly fixes "moniter" to "monitor"', () => {
    const res = correctSingleWord('moniter', vocabulary);
    assert.equal(res.wasCorrected, true);
    assert.equal(res.corrected, 'monitor');
  });

  await t.test('correctSingleWord correctly fixes "shue" to "shoe"', () => {
    const res = correctSingleWord('shue', vocabulary);
    assert.equal(res.wasCorrected, true);
    assert.equal(res.corrected, 'shoe');
  });

  await t.test('correctSingleWord leaves valid words alone', () => {
    const res = correctSingleWord('figma', vocabulary);
    assert.equal(res.wasCorrected, false);
    assert.equal(res.corrected, 'figma');
  });

  await t.test('correctSearchQuery fixes multi-word query "uot project"', () => {
    const res = correctSearchQuery('uot project', vocabulary);
    assert.equal(res.hasCorrection, true);
    assert.equal(res.correctedQuery, 'iot project');
  });

  await t.test('matchesProject matches Green D when searching for "iot"', () => {
    const greenD = mockProjects.find((p) => p.id === 'green-d-web')!;
    const matchRes = matchesProject(greenD, ['iot'], 'All');
    assert.equal(matchRes.matches, true, 'Green D should match iot');
  });

  await t.test('matchesProject matches Green D with fuzzy typo "uot"', () => {
    const greenD = mockProjects.find((p) => p.id === 'green-d-web')!;
    const matchRes = matchesProject(greenD, ['uot'], 'All');
    assert.equal(matchRes.matches, true, 'Green D should match uot via typo tolerance');
  });

  await t.test('matchesProject matches Walton Monitor when searching for "moniter"', () => {
    const walton = mockProjects.find((p) => p.id === 'walton-3d-monitor-design')!;
    const matchRes = matchesProject(walton, ['moniter'], 'All');
    assert.equal(matchRes.matches, true, 'Walton Monitor should match moniter via typo tolerance');
  });
});
