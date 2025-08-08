/**
 * @file Document properties manager; primarily, a color scheme manager.
 * @author Jordan Mann
 * This script must be run synchronously (not as a module) before CSS is loaded to prevent flashing.
 */

/**
 * AI-generated color palettes created using Huemint: https://huemint.com/
 */
const palettes = {
  /**
   * Arrays of light colors - background, foreground, accent.
   */
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
  /**
   * Arrays of dark colors - background, foreground, accent.
   */
  dark: [
    ['#012f32', '#f8f7f9', '#74c072'],
    ['#233c4d', '#fbfdff', '#a7aea7'],
    ['#2c2a29', '#fbf7fb', '#fa7801'],
    ['#282927', '#d7d6d0', '#f39766'],
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
    ['#1d2246', '#fdf6e5', '#75a7c4'],
    ['#2b204c', '#f7f6e2', '#f75a3f'],
    ['#000100', '#f0e9d4', '#e1bc1a'],
    ['#1e1c1c', '#fbf9fd', '#9fa099'],
    ['#0d151c', '#fcfbff', '#1aa488'],
    ['#000100', '#e9eaec', '#3bb1e4'],
    ['#000202', '#f7fdfd', '#d82854'],
    ['#022450', '#e5ebf5', '#98acb5'],
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
 * Retrieve the current color scheme configuration from localStorage.
 */
function load() {
  const raw = localStorage.getItem('colorScheme');
  /**
   * The color scheme configuration saved in localStorage.
   */
  const saved =
    raw !== null
      ? JSON.parse(raw)
      : {
          pref: 'auto',
          set: null,
          colors: []
        };
  current.pref = saved.pref;
  if (saved.pref === 'lock') {
    current.colors = saved.colors;
    current.set = saved.set;
  }
}

/**
 * Store the current color scheme configuration in localStorage.
 */
function save() {
  localStorage.setItem('colorScheme', JSON.stringify(current));
}

// fixme why doesn't media expect a comment

const media = window.matchMedia('(prefers-color-scheme: light)');

/**
 * Select new colors from the current set.
 */
function newColors() {
  if (current.set === null) {
    throw new Error('No current.set was given to draw from when picking palette');
  }
  const setL = palettes[current.set];
  current.colors = setL[Math.floor(Math.random() * setL.length)];
}

/** @type {ColorScheme} */
let current = new Proxy(
  {
    pref: null,
    set: null,
    colors: []
  },
  {
    /**
     * Setter.
     * @type {CurrentProxySetter}
     */
    set(target, prop, newValue, receiver) {
      if (prop === 'set' && newValue !== target.set) {
        Reflect.set(target, prop, newValue, receiver);
        if (target.pref !== 'lock') {
          newColors();
        }
        if (newValue === null) {
          throw new Error('Should not try to unset current.set back to null!');
        }
        document.documentElement.setAttribute('data-color-scheme', newValue);
      } else if (prop === 'pref') {
        // if (target.pref === 'lock') {
        //   newColors();
        // }
        Reflect.set(target, prop, newValue, receiver);
        document.querySelector('.colors-shuffle')?.toggleAttribute('disabled', newValue === 'lock');
        /** @type {ColorScheme['set']} */
        let targetSet = null;
        if (newValue === 'auto') {
          targetSet = media.matches ? 'light' : 'dark';
        } else if (newValue === 'light' || newValue === 'dark') {
          targetSet = newValue;
        }
        if (targetSet !== null && current.set !== targetSet) {
          current.set = targetSet;
        }
      } else if (prop === 'colors') {
        Reflect.set(target, prop, newValue, receiver);
        document.documentElement.style.setProperty('--p-white', newValue[0]);
        document.documentElement.style.setProperty('--p-black', newValue[1]);
        document.documentElement.style.setProperty('--p-accent', newValue[2]);
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', current.colors[0]);
      }
      save();
      return true;
    }
  }
);

document.layoutAddEventListener('DOMContentLoaded', () => {
  load();
  /** @type {SwitcherComponent | null} */
  const switcher = document.querySelector("switcher-component[data-name='colors-switcher']");
  if (switcher === null) {
    throw new Error('Could not find colors-switcher. Is the nav there?');
  }
  setTimeout(() => {
    // fixme race condition; needs to be called after component's setup() is finished
    if (current.pref === null) {
      // this shouldn't happen since load() is called immediately above
      throw new Error('Current color preference was unexpectedly cleared.');
    }
    switcher.value = current.pref;
    switcher.layoutAddEventListener(
      'switch',
      // checkme https://github.com/Microsoft/TypeScript/issues/28357
      (/** @type {any} */ { detail: { value } }) => (current.pref = value)
    );
  }, 100);
  document.querySelector('.colors-shuffle')?.layoutAddEventListener('click', () => newColors());
  media.layoutAddEventListener('change', () => (current.set = media.matches ? 'light' : 'dark'));
  setTimeout(() => document.body.style.setProperty('transition', 'background-color 0.3s'), 0);
});
