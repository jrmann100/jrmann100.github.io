// Using Huemint: https://huemint.com/
const palettesDark = [
  ['#012f32', '#f8f7f9', '#74c072'],
  ['#002a6c', '#eff5f4', '#b4a38e'],
  ['#233c4d', '#fbfdff', '#a7aea7'],
  ['#0f092c', '#d7af3b', '#90a2b9'],
  ['#030002', '#deac79', '#9b7050'],
  ['#382800', '#f0dcc7', '#d6a537'],
  ['#2c2a29', '#fbf7fb', '#fa7801'],
  ['#282927', '#d7d6d0', '#f39766'],
  ['#2e2a40', '#f0eeea', '#b1883d'],
  ['#020200', '#d6ac27', '#e96c06'],
  ['#2b3654', '#edd083', '#a77d54'],
  ['#233033', '#f9f6f3', '#d76c23'],
  ['#35444a', '#fdfeff', '#16bac9'],
  ['#252d49', '#eef1f4', '#ea5d18'],
  ['#050200', '#f2f1ef', '#e90728'],
  ['#000100', '#f6f2ef', '#d85724'],
  ['#211b16', '#fffce1', '#b29f57'],
  ['#030606', '#e7e4e0', '#f35b2c'],
  ['#20140c', '#eff0f0', '#fc6300'],
  ['#221f1f', '#fafcfc', '#219b86'],
  ['#131616', '#fefefe', '#ee5b25'],
  ['#030000', '#e6e1de', '#d2383a'],
  ['#24201d', '#fbfeff', '#a1a19d'],
  ['#060503', '#f9f5f0', '#d92323'],
  ['#1a1b1a', '#d1ec8d', '#a6b169'],
  ['#0a0704', '#fcf4f7', '#c0924b'],
  ['#000100', '#e4e6dd', '#9f7d50'],
  ['#292630', '#fffffd', '#34b369'],
  ['#181306', '#fdf7f6', '#6fb92a'],
  ['#090b0a', '#fffafd', '#de2526'],
  ['#000703', '#e1e8e8', '#b5a191'],
  ['#101831', '#fcfbfb', '#9d702a'],
  ['#0a0a0f', '#e5e7e7', '#cfa554'],
  ['#171617', '#f8fbfd', '#b375cc'],
  ['#181717', '#f7f7f7', '#f16b2b'],
  ['#24052c', '#fcfdfd', '#f43757'],
  ['#192238', '#fcfafa', '#ff598e'],
  ['#072748', '#feffff', '#9facc1'],
  ['#1e2022', '#fcfbfb', '#ad8c23'],
  ['#142140', '#f4f7f4', '#66a183'],
  ['#221d1d', '#f3f6f9', '#2177f0'],
  ['#181c28', '#eae4d1', '#9c6d42'],
  ['#06214b', '#fafdfd', '#45a8b5'],
  ['#062240', '#ece9e1', '#b0702c'],
  ['#1d2246', '#fdf6e5', '#75a7c4'],
  ['#2b204c', '#f7f6e2', '#f75a3f'],
  ['#000100', '#f0e9d4', '#e1bc1a'],
  ['#132331', '#fffdf7', '#bb645c'],
  ['#1e1c1c', '#fbf9fd', '#9fa099'],
  ['#00103b', '#e1effd', '#f94566'],
  ['#0d151c', '#fcfbff', '#1aa488'],
  ['#020504', '#fef6f5', '#d5692c'],
  ['#000100', '#e9eaec', '#3bb1e4'],
  ['#000108', '#eeecee', '#168121'],
  ['#032233', '#f9f9fd', '#c22328'],
  ['#020000', '#fbf5f7', '#ef0000'],
  ['#000202', '#f7fdfd', '#d82854'],
  ['#022450', '#e5ebf5', '#98acb5'],
  ['#171339', '#f5f7f8', '#898dff'],
  ['#0b133b', '#efefeb', '#ae9971'],
  ['#07101c', '#f6f2f5', '#ac5353'],
  ['#010201', '#f5faf9', '#80ab67'],
  ['#0e1011', '#f5f3f2', '#ed671f'],
  ['#090000', '#f7daad', '#b39070'],
  ['#1c1c1f', '#f8fafe', '#00a69f'],
  ['#171b21', '#e3e9ec', '#ee3652'],
  ['#241c1e', '#deebf0', '#eb3d3d'],
  ['#0a0000', '#f3f6f6', '#5aa7e7'],
  ['#060906', '#f2f3f0', '#d165cb'],
  ['#080300', '#cbdbf1', '#9562c0'],
  ['#070601', '#e9eaee', '#eb3126'],
  ['#080605', '#fdf8f4', '#ff4c39']
];
const palettesLight = [
  ['#f5fcfb', '#292563', '#f91b59'],
  ['#d1cbbd', '#070000', '#bf281f'],
  ['#f6f5f6', '#262a2a', '#d72a46'],
  ['#fafbfd', '#303838', '#c86450'],
  ['#feffff', '#0d3455', '#b62377'],
  ['#f6faf8', '#212457', '#9d6274'],
  ['#fffbfb', '#192d35', '#c12942'],
  ['#ebebe3', '#313336', '#454550'],
  ['#fdfcfa', '#432917', '#905731'],
  ['#fffefd', '#0d2c3b', '#585a57'],
  ['#e7ebf2', '#353334', '#5804c8'],
  ['#f6d2bc', '#010a0b', '#c2323e'],
  ['#fffdfc', '#090202', '#6a5c58'],
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
  ['#f8f9f7', '#0f0c0c', '#63605d'],
  ['#fffafb', '#1b1b19', '#e51912'],
  ['#f0ebe4', '#000200', '#5e6061'],
  ['#fff9fe', '#142625', '#ad5f01'],
  ['#fafdf9', '#080502', '#566cd2'],
  ['#fefefc', '#101112', '#d73230'],
  ['#edfaff', '#0d1633', '#d84c80'],
  ['#e1e4e5', '#141926', '#c22829'],
  ['#f4ede4', '#1a2236', '#b93556'],
  ['#ebf1ef', '#020709', '#d45749'],
  ['#eef1ef', '#080b08', '#f5141c'],
  ['#fefbf9', '#0f162e', '#1473ff'],
  ['#f9fefb', '#2a202c', '#fc1f55'],
  ['#f5f9fe', '#000207', '#006aff'],
  ['#fdfcff', '#380946', '#fe1976'],
  ['#fcfaf7', '#211e1e', '#ea2b54'],
  ['#f2e9d0', '#080505', '#646261'],
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
];
const query = window.matchMedia('(prefers-color-scheme: light)');
let lastPreference = null;

query.addEventListener('change', () => {
  updatePalette();
});

function getStoredPreference() {
  return localStorage.getItem('color-scheme') ?? 'auto';
}

function getPreference() {
  const storedPreference = getStoredPreference();
  if (storedPreference === 'auto') {
    return query.matches ? 'light' : 'dark';
  } else {
    return storedPreference;
  }
}

function updatePalette(dirty = false) {
  const preference = getPreference();
  if (preference === lastPreference && !dirty) {
    return;
  }
  lastPreference = preference;
  const palette = (preference === 'dark' ? palettesDark : palettesLight)[
    Math.floor(Math.random() * (preference === 'dark' ? palettesDark : palettesLight).length)
  ];
  document.documentElement.style.setProperty('--p-white', palette[0]);
  document.documentElement.style.setProperty('--p-black', palette[1]);
  document.documentElement.style.setProperty('--p-accent', palette[2]); // todo rename accent in CSS
  document.documentElement.setAttribute('data-color-scheme', preference);
}

updatePalette();

// document.documentElement.addEventListener("navigate", () => {
//     updatePalette(true);
// });

document.addEventListener('DOMContentLoaded', () => {
  const storedPreference = getStoredPreference();
  document
    .querySelector('.colors-switcher')
    .querySelectorAll('input')
    .forEach((el) => {
      el.addEventListener('change', () => {
        localStorage.setItem('color-scheme', el.value);
        updatePalette();
      });
      if (el.classList.contains(storedPreference)) {
        el.checked = true;
      }
    });
});

document.documentElement.setAttribute('data-js-enabled', '');
