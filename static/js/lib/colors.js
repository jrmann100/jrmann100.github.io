/**
 * @file Document properties manager; primarily, a color scheme manager.
 * @author Jordan Mann
 * This script must be run synchronously (not as a module) before CSS is loaded to prevent flashing.
 * todo redo comments
 */

/**
 * AI-generated color palettes created using Huemint: https://huemint.com/
 */
const palettes = {
  light: [
    ['#f5fcfb', '#292563', '#f91b59'],
    ['#f6f5f6', '#262a2a', '#d72a46'],
    ['#fafbfd', '#303838', '#c86450'],
    ['#feffff', '#0d3455', '#b62377'],
    ['#f6faf8', '#212457', '#9d6274'],
    ['#fffbfb', '#192d35', '#c12942'],
    ['#ebebe3', '#313336', '#454550'],
    ['#fdfcfa', '#432917', '#905731'],
    ['#e7ebf2', '#353334', '#5804c8'],
    ['#eaebe9', '#1c1713', '#5870e8'],
    ['#f9ffff', '#17191d', '#f53f3f'],
    ['#fbffff', '#151010', '#f8541e'],
    ['#fffffd', '#063867', '#bc4f36'],
    ['#feffff', '#0b0f10', '#c63c4b'],
    ['#ecf0ee', '#080b0d', '#794596'],
    ['#f0f1f3', '#000306', '#e41645'],
    ['#fefffe', '#150334', '#f9283c'],
    ['#fffefc', '#101514', '#d71616'],
    ['#f4ffff', '#14191b', '#ef5223'],
    ['#fffffd', '#0f1311', '#cd1b1b'],
    ['#f7f4eb', '#131211', '#c91811'],
    ['#f2ecef', '#060b15', '#1e50fd'],
    ['#e0dace', '#060807', '#90372c'],
    ['#fefefe', '#262120', '#ad2d31'],
    ['#fbfeff', '#262122', '#c31d61'],
    ['#fffafb', '#1b1b19', '#e51912'],
    ['#fff9fe', '#142625', '#ad5f01'],
    ['#fafdf9', '#080502', '#566cd2'],
    ['#fefefc', '#101112', '#d73230'],
    ['#edfaff', '#0d1633', '#d84c80'],
    ['#f4ede4', '#1a2236', '#b93556'],
    ['#ebf1ef', '#020709', '#d45749'],
    ['#eef1ef', '#080b08', '#f5141c'],
    ['#fefbf9', '#0f162e', '#1473ff'],
    ['#f9fefb', '#2a202c', '#fc1f55'],
    ['#f5f9fe', '#000207', '#006aff'],
    ['#fdfcff', '#380946', '#fe1976'],
    ['#fcfaf7', '#211e1e', '#ea2b54'],
    ['#fcfdfb', '#242121', '#3f61ba'],
    ['#f8f9ff', '#232123', '#fa610a'],
    ['#fcfcf9', '#1c1d1e', '#d74882'],
    ['#f7feff', '#1e1668', '#f61f26'],
    ['#fef9f6', '#0d1517', '#d1264c'],
    ['#f2f8f8', '#080502', '#cf0d1e'],
    ['#fcfffd', '#141514', '#745aef'],
    ['#fef8fb', '#141716', '#d21632'],
    ['#ebebec', '#212223', '#d3353d'],
    ['#e0e8e8', '#0a0003', '#236985'],
    ['#f8fcfd', '#041e40', '#eb0561'],
    ['#faf9fb', '#120d2d', '#cd6143']
  ],
  dark: [
    ['#012f32', '#f8f7f9', '#74c072'],
    ['#002a6c', '#eff5f4', '#b4a38e'],
    ['#233c4d', '#fbfdff', '#a7aea7'],
    ['#2c2a29', '#fbf7fb', '#fa7801'],
    ['#282927', '#d7d6d0', '#f39766'],
    ['#2e2a40', '#f0eeea', '#b1883d'],
    ['#35444a', '#fdfeff', '#16bac9'],
    ['#252d49', '#eef1f4', '#ea5d18'],
    ['#000100', '#f6f2ef', '#d85724'],
    ['#211b16', '#fffce1', '#b29f57'],
    ['#030606', '#e7e4e0', '#f35b2c'],
    ['#20140c', '#eff0f0', '#fc6300'],
    ['#221f1f', '#fafcfc', '#219b86'],
    ['#131616', '#fefefe', '#ee5b25'],
    ['#030000', '#e6e1de', '#d2383a'],
    ['#24201d', '#fbfeff', '#a1a19d'],
    ['#1a1b1a', '#d1ec8d', '#a6b169'],
    ['#0a0704', '#fcf4f7', '#c0924b'],
    ['#000100', '#e4e6dd', '#9f7d50'],
    ['#292630', '#fffffd', '#34b369'],
    ['#181306', '#fdf7f6', '#6fb92a'],
    ['#000703', '#e1e8e8', '#b5a191'],
    ['#0a0a0f', '#e5e7e7', '#cfa554'],
    ['#171617', '#f8fbfd', '#b375cc'],
    ['#181717', '#f7f7f7', '#f16b2b'],
    ['#192238', '#fcfafa', '#ff598e'],
    ['#072748', '#feffff', '#9facc1'],
    ['#1e2022', '#fcfbfb', '#ad8c23'],
    ['#142140', '#f4f7f4', '#66a183'],
    ['#06214b', '#fafdfd', '#45a8b5'],
    ['#062240', '#ece9e1', '#b0702c'],
    ['#1d2246', '#fdf6e5', '#75a7c4'],
    ['#2b204c', '#f7f6e2', '#f75a3f'],
    ['#000100', '#f0e9d4', '#e1bc1a'],
    ['#1e1c1c', '#fbf9fd', '#9fa099'],
    ['#00103b', '#e1effd', '#f94566'],
    ['#0d151c', '#fcfbff', '#1aa488'],
    ['#000100', '#e9eaec', '#3bb1e4'],
    ['#000202', '#f7fdfd', '#d82854'],
    ['#022450', '#e5ebf5', '#98acb5'],
    ['#171339', '#f5f7f8', '#898dff'],
    ['#0b133b', '#efefeb', '#ae9971'],
    ['#010201', '#f5faf9', '#80ab67'],
    ['#0e1011', '#f5f3f2', '#ed671f'],
    ['#1c1c1f', '#f8fafe', '#00a69f'],
    ['#171b21', '#e3e9ec', '#ee3652'],
    ['#241c1e', '#deebf0', '#eb3d3d'],
    ['#0a0000', '#f3f6f6', '#5aa7e7'],
    ['#060906', '#f2f3f0', '#d165cb'],
    ['#080300', '#cbdbf1', '#9562c0'],
    ['#070601', '#e9eaee', '#eb3126'],
    ['#080605', '#fdf8f4', '#ff4c39']
  ]
};

/**
 * @type {'light' | 'dark'}
 */
let currentSetName;

/**
 * @type {string[] | undefined}
 */
let currentColors = undefined;

const media = window.matchMedia('(prefers-color-scheme: light)');

/**
 *
 * @param {'light' | 'dark'} setName
 * @param refresh
 */
function selectPalette(setName, refresh = false) {
  if (setName === currentSetName && !refresh) {
    return false;
  }
  currentSetName = setName;
  const set = palettes[setName];
  currentColors = set[Math.floor(Math.random() * set.length)]; // checkme
  return true;
}

/**
 *
 */
function applyColors() {
  if (currentColors === undefined) {
    return;
  }
  document.documentElement.style.setProperty('--p-white', currentColors[0]);
  document.documentElement.style.setProperty('--p-black', currentColors[1]);
  document.documentElement.style.setProperty('--p-accent', currentColors[2]);
  document.documentElement.setAttribute('data-color-scheme', currentSetName);
  document.querySelector(`meta[name="theme-color"]`)?.setAttribute('content', currentColors[0]);
  localStorage.setItem('colors', JSON.stringify(currentColors));
}

/**
 * @param {'light' | 'dark' | 'auto' | 'lock'} pref
 */
function setPref(pref) {
  localStorage.setItem('colors-pref', pref);
  if (pref === 'light' || pref === 'dark') {
    selectPalette(pref);
  } else if (pref === 'auto') {
    selectPalette(media.matches ? 'light' : 'dark');
  } else if (pref === 'lock') {
    currentColors = JSON.parse(localStorage.getItem('colors')); // checkme
  }
  document.querySelector('.colors-shuffle')?.toggleAttribute('disabled', pref === 'lock');
  applyColors();
}

document.addEventListener('DOMContentLoaded', () => {
  storedPref = localStorage.getItem('colors-pref') ?? 'auto';
  setPref(storedPref);
  document.querySelectorAll('.colors-switcher input').forEach((el) => {
    el.addEventListener('change', () => setPref(el.value));
    if (el.value === storedPref) {
      el.checked = true;
    }
  });
  document
    .querySelector('.colors-shuffle')
    ?.addEventListener('click', () => selectPalette(currentSetName, true) && applyColors());
  setTimeout(() => document.body.style.setProperty('transition', 'background-color 0.5s'), 0);
});
