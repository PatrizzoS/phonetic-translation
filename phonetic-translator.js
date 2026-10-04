/* <phonetic-translator word="LAMB"></phonetic-translator>
   Zero-dependency web component (Shadow DOM, no storage, no globals).
   Layer 1: pick a sound for each letter (or join letters like PH / KN into one unit).
   Layer 2: each choice maps to a list of English sound variants, each with American example words you can click to hear.
   Events:  'phonetic-change' -> detail {word, phonetic, units}
   API:     el.setWord(word, savedUnits?)  el.state  el.phonetic
   Extend:  customElements.get('phonetic-translator').add('TION','Sh|ʃ|shun|nation station')   (fam|ipa|respelling|examples)
   Theme:   --pt-bg --pt-fg --pt-mid --pt-accent --pt-ok --pt-border --pt-surface --pt-font --pt-frame --pt-radius                      */
(() => {
'use strict';
const LN = {A:'ay',B:'bee',C:'see',D:'dee',E:'ee',F:'eff',G:'jee',H:'aitch',I:'eye',J:'jay',K:'kay',L:'ell',M:'em',N:'en',O:'oh',P:'pee',Q:'cue',R:'ar',S:'ess',T:'tee',U:'you',V:'vee',W:'double-you',X:'ex',Y:'why',Z:'zee'};
const RAW = {
A:'Short|æ|a|cat apple hat black;Long|eɪ|ay|cake name table paper;Broad|ɑ|ah|father spa palm taco;Schwa|ə|uh|about sofa banana pizza;Aw|ɔ|aw|ball walk call small;Short E|ɛ|eh|many any;Short I|ɪ|ih|village cabbage message',
B:'Normal|b|b|bat baby job rabbit;Silent|none||lamb comb debt thumb',
C:'Hard|k|k|cat cold cup class music;Soft|s|s|city cent face cycle;Ch|tʃ|ch|cello concerto;Sh|ʃ|sh|ocean special social delicious;Silent|none||scene muscle scissors indict',
D:'Normal|d|d|dog ladder bad window;J|dʒ|j|education graduate soldier individual;T|t|t|walked jumped asked helped;Silent|none||wednesday handsome handkerchief',
E:'Short|ɛ|eh|bed egg red pen;Long|i|ee|be me these equal;Schwa|ə|uh|taken open problem;Ay|eɪ|ay|cafe fiance;Short I|ɪ|ih|pretty english begin;Silent|none||cake like name hope',
F:'Normal|f|f|fun off life leaf;V|v|v|of',
G:'Hard|g|g|go game bag again get give girl gear;Soft|dʒ|j|giant gym page gentle;Zh|ʒ|zh|garage mirage genre beige;Silent|none||sign gnat reign design',
H:'Normal|h|h|hat happy behind ahead;Silent|none||hour honest heir honor',
I:'Short|ɪ|ih|sit fish pin big;Long|aɪ|eye|bike time ice find;Ee|i|ee|machine police ski pizza;Schwa|ə|uh|pencil devil april;Y-glide|j|y|onion million senior',
J:'Normal|dʒ|j|jump major job enjoy;Y|j|y|hallelujah fjord;H|h|h|jalapeno',
K:'Normal|k|k|kite make sky ask;Silent|none||knife knee know knight',
L:'Normal|l|l|leg hello leaf blue;Dark|ɫ|l|full ball feel milk;Syllabic|əl|ul|apple bottle middle table;Silent|none||walk talk half calm could',
M:'Normal|m|m|man summer time swim;Silent|none||mnemonic',
N:'Normal|n|n|no sun dinner snow;Ng|ŋ|ng|think finger anchor uncle;Silent|none||autumn column hymn condemn',
O:'Short|ɑ|ah|hot box top lock;Long|oʊ|oh|go home open note;Oo|u|oo|do move lose prove;Short U|ʌ|uh|love some son money;Short oo|ʊ|uu|wolf woman;Aw|ɔ|aw|off long song cost;Schwa|ə|uh|lemon button second;Wu|wʌ|wuh|one once;Short I|ɪ|ih|women',
P:'Normal|p|p|pen happy top spin;Silent|none||psalm pneumonia receipt cupboard',
Q:'Kw|kw|kw|queen quick;K|k|k|iraq qatar',
R:'Normal|r|r|red run carry bring;Dropped|none||february library surprise governor',
S:'Normal|s|s|sun miss bus yes;Z|z|z|is dogs music easy reason;Sh|ʃ|sh|sugar sure issue mansion;Zh|ʒ|zh|measure vision usual treasure;Silent|none||island aisle corps debris',
T:'Normal|t|t|top cat stop tent;Ch|tʃ|ch|nature picture actual question;Sh|ʃ|sh|nation station patient initial;Flap|ɾ|d|water butter better city;Glottal|ʔ|\'|button mountain;Silent|none||castle listen often whistle christmas',
U:'Short|ʌ|uh|cup sun bus up;Long|ju|yoo|cute music unit use;Oo|u|oo|rule june flute;Short oo|ʊ|uu|put push full pull;Schwa|ə|uh|support focus circus;Short I|ɪ|ih|busy business;Silent|none||guess build guard tongue',
V:'Normal|v|v|van love river very',
W:'Normal|w|w|we want swim away;H|h|h|who whole whose whom;Silent|none||write wrap answer sword two',
X:'Ks|ks|ks|box fox six taxi;Gz|gz|gz|exam example exact hexagon;Z|z|z|xylophone xenon xerox;Ksh|kʃ|ksh|anxious luxury;Silent|none||faux',
Y:'Consonant|j|y|yes yellow beyond canyon;Long I|aɪ|eye|my sky try type;Long E|i|ee|happy baby city very;Short I|ɪ|ih|gym myth symbol system',
Z:'Normal|z|z|zoo zip lazy buzz;Ts|ts|ts|pizza pretzel;Zh|ʒ|zh|azure seizure;Silent|none||rendezvous',
/* joined units */
TH:'Voiceless|θ|th|think math bath thumb;Voiced|ð|th|this that mother the;Hard T|t|t|thomas thyme thai',
SH:'Sh|ʃ|sh|ship fish wish dish',
CH:'Soft|tʃ|ch|chair much teach cheese;Hard|k|k|school chorus chemistry echo;Sh|ʃ|sh|chef chute brochure machine',
PH:'F|f|f|phone photo phrase graph;P|p|p|shepherd;V|v|v|stephen',
GH:'Hard G|g|g|ghost ghetto spaghetti ghoul;F|f|f|laugh cough rough tough;Silent|none||night though through daughter',
NG:'Ng|ŋ|ng|sing long ring song;Ng+g|ŋg|ngg|finger anger hungry single;Nj|ndʒ|nj|change strange danger',
CK:'K|k|k|back duck neck clock',
WH:'W|w|w|what when white why;H|h|h|who whole whose whom',
QU:'Kw|kw|kw|queen quick quiet square;K|k|k|unique antique plaque mosque',
KN:'Silent K|n|n|knee knife know knight',
WR:'Silent W|r|r|write wrap wrong wrist',
GN:'Silent G|n|n|gnat gnaw sign foreign',
MB:'Silent B|m|m|lamb comb thumb climb',
MN:'Silent N|m|m|autumn column hymn condemn',
PS:'Silent P|s|s|psalm psychology psychic',
RH:'Silent H|r|r|rhyme rhino rhythm',
PN:'Silent P|n|n|pneumonia pneumatic',
PT:'Silent P|t|t|pterodactyl ptarmigan',
EA:'Long E|i|ee|eat sea teach beach;Short E|ɛ|eh|bread head dead heavy;Long A|eɪ|ay|great break steak;Ear|ɪr|eer|ear hear near year;Er|ɜr|er|earth learn early heard;Air|ɛr|air|bear wear pear swear',
EE:'Long E|i|ee|see tree feet green',
OO:'Long|u|oo|moon food room spoon;Short|ʊ|uu|book foot good wood;Uh|ʌ|uh|blood flood;Or|ɔr|or|door floor',
OU:'Ow|aʊ|ow|out house cloud mouth;Oo|u|oo|soup group you route;Uh|ʌ|uh|country young touch double;Long O|oʊ|oh|soul shoulder;Short oo|ʊ|uu|could would should;Aw|ɔ|aw|thought bought fought sought;Or|ɔr|or|four course court your',
OW:'Ow|aʊ|ow|cow now brown down;Long O|oʊ|oh|snow grow show blow',
AI:'Long A|eɪ|ay|rain train pain mail;Short E|ɛ|eh|said again;Air|ɛr|air|air hair chair pair',
AY:'Long A|eɪ|ay|day play stay say;Short E|ɛ|eh|says',
OA:'Long O|oʊ|oh|boat coat road soap;Aw|ɔ|aw|broad abroad',
OI:'Oy|ɔɪ|oy|coin join soil oil',
OY:'Oy|ɔɪ|oy|boy toy joy enjoy',
AU:'Aw|ɔ|aw|sauce because author laundry;Short A|æ|a|laugh aunt',
AW:'Aw|ɔ|aw|saw draw lawn claw',
IE:'Long E|i|ee|field chief thief piece;Long I|aɪ|eye|pie tie die lie;Short E|ɛ|eh|friend',
EI:'Long A|eɪ|ay|eight weigh vein sleigh;Long E|i|ee|receive ceiling seize either;Long I|aɪ|eye|height',
EW:'Oo|u|oo|new grew chew flew;Yoo|ju|yoo|few pew nephew;Long O|oʊ|oh|sew',
UE:'Oo|u|oo|blue true clue glue;Yoo|ju|yoo|cue argue value rescue;Silent|none||league tongue vague',
AR:'Ar|ɑr|ar|car star park farm;Air|ɛr|air|care share dare;Or|ɔr|or|war warm warn quart;Er|ɚ|er|dollar sugar collar',
ER:'Er|ɚ|er|her fern teacher river;Air|ɛr|air|very berry cherry;Eer|ɪr|eer|here sphere period;Ar|ɑr|ar|clerk sergeant',
IR:'Er|ɜr|er|bird girl shirt first;Eyer|aɪr|eyer|fire tire hire;Eer|ɪr|eer|spirit mirror',
OR:'Or|ɔr|or|for horse corn short;Er|ɚ|er|doctor actor color',
UR:'Er|ɜr|er|burn turn hurt nurse;Yoor|jʊr|yoor|pure cure secure',
TION:'Shun|ʃən|shun|nation station action lotion;Chun|tʃən|chun|question suggestion digestion',
SION:'Zhun|ʒən|zhun|vision decision television;Shun|ʃən|shun|mansion tension pension'
};
const AR = Object.fromEntries(('aɪr=AY ER0,dʒ=JH,tʃ=CH,eɪ=EY,aɪ=AY,oʊ=OW,aʊ=AW,ɔɪ=OY,jʊr=Y UH R,ɑr=AA R,ɔr=AO R,ɛr=EH R,ɪr=IH R,ɜr=ER,ɚ=ER0,əl=AH0 L,ʃən=SH AH0 N,tʃən=CH AH0 N,ʒən=ZH AH0 N,ndʒ=N JH,ks=K S,gz=G Z,kʃ=K SH,kw=K W,ts=T S,ŋg=NG G,wʌ=W AH,æ=AE,ɑ=AA,ə=AH0,ɔ=AO,ɛ=EH,i=IY,ɪ=IH,u=UW,ʊ=UH,ʌ=AH,b=B,d=D,f=F,g=G,h=HH,k=K,l=L,ɫ=L,m=M,n=N,ŋ=NG,p=P,r=R,s=S,t=T,v=V,w=W,j=Y,z=Z,ʃ=SH,ʒ=ZH,θ=TH,ð=DH,ɾ=D,ʔ=').split(',').map(x => x.split('=')));
const KEYS = Object.keys(AR).sort((a, b) => b.length - a.length);
const toArpa = ipa => { const o = []; for (let i = 0; i < ipa.length;) { const k = KEYS.find(k => ipa.startsWith(k, i)); if (!k) { i++; continue; } if (AR[k]) o.push(AR[k]); i += k.length; } return o.join(' '); };
const LA = Object.fromEntries('A=EY,B=B IY,C=S IY,D=D IY,E=IY,F=EH F,G=JH IY,H=EY CH,I=AY,J=JH EY,K=K EY,L=EH L,M=EH M,N=EH N,O=OW,P=P IY,Q=K Y UW,R=AA R,S=EH S,T=T IY,U=Y UW,V=V IY,W=D AH B AH L Y UW,X=EH K S,Y=W AY,Z=Z IY'.split(',').map(x => x.split('=')));
const S = {};
const add = (k, s) => { S[k] = (S[k] || []).concat(s.split(';').map(x => { const [fam, ipa, resp, ex] = x.split('|'); return {fam, ipa, resp, arpa: ipa === 'none' ? '' : toArpa(ipa), ex: ex ? ex.split(' ') : []}; })); };
for (const k in RAW) add(k, RAW[k]);

const CSS = `
:host{display:block;--ptx-bg:var(--pt-bg,#14161f);--ptx-sf:var(--pt-surface,#1b1e2b);--ptx-fg:var(--pt-fg,#e8eaf2);--ptx-mid:var(--pt-mid,#8b90a7);--ptx-ac:var(--pt-accent,#7c8cff);--ptx-ok:var(--pt-ok,#4fd1a5);--ptx-bd:var(--pt-border,#2a2e42);font:13px/1.45 var(--pt-font,system-ui,-apple-system,"Segoe UI",sans-serif);color:var(--ptx-fg)}
@media(prefers-color-scheme:light){:host{--ptx-bg:var(--pt-bg,#fff);--ptx-sf:var(--pt-surface,#f4f5fb);--ptx-fg:var(--pt-fg,#1c1f2e);--ptx-mid:var(--pt-mid,#6b7088);--ptx-ac:var(--pt-accent,#4f5bd5);--ptx-ok:var(--pt-ok,#0f9d74);--ptx-bd:var(--pt-border,#dcdfec)}}
*{box-sizing:border-box}
.box{background:var(--ptx-bg);border:var(--pt-frame,1px solid var(--ptx-bd));border-radius:var(--pt-radius,14px);overflow:hidden}
button{font:inherit;color:inherit;cursor:pointer;background:var(--ptx-sf);border:1px solid var(--ptx-bd);border-radius:8px;padding:3px 9px;transition:.15s}
button:hover{border-color:var(--ptx-ac)}
.on{border-color:var(--ptx-ac)!important;background:color-mix(in srgb,var(--ptx-ac) 16%,transparent)!important}
.chips{display:flex;flex-wrap:wrap;gap:4px;align-items:center;justify-content:center;padding:12px 12px 10px}
.chip{display:flex;flex-direction:column;align-items:center;min-width:42px;padding:4px 7px;border-radius:10px}
.chip b{font-size:19px;line-height:1.15}.chip i{font:11px ui-monospace,monospace;font-style:normal;color:var(--ptx-ok);min-height:1.2em}
.j{border:none;background:none;padding:0 1px;font-size:12px;color:var(--ptx-mid)}
details{border-top:1px solid var(--ptx-bd)}
summary{list-style:none;cursor:pointer;padding:7px 14px;display:flex;align-items:center;gap:8px;font-weight:600;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--ptx-mid)}
summary::-webkit-details-marker{display:none}
summary::before{content:'▸';transition:transform .15s}details[open]>summary::before{transform:rotate(90deg)}
.sec{padding:0 14px 10px}
.fams{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}.fams button{font-size:11px;padding:0 9px;border-radius:99px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;max-height:clamp(140px,28vh,250px);overflow:auto;padding-right:2px}
.card{border:1px solid var(--ptx-bd);background:var(--ptx-sf);border-radius:8px;padding:4px 8px;cursor:pointer}.card:hover{border-color:var(--ptx-ac)}
.top{display:flex;gap:6px;align-items:baseline}.fam{font-weight:600;font-size:12px}.star{color:var(--ptx-ok);font-size:11px}
code{font:12px ui-monospace,monospace;color:var(--ptx-ok);margin-left:auto}
.ipa{color:var(--ptx-mid);font-size:11px}
.ex{display:flex;flex-wrap:wrap;gap:0 1px;margin-top:1px}
.w{border:none;background:none;padding:0 3px;font-size:11px;color:var(--ptx-mid);border-radius:4px}.w:hover{color:var(--ptx-fg);background:var(--ptx-bd)}.w u{text-decoration:none;color:var(--ptx-ac);font-weight:700}
.fine{display:grid;grid-template-columns:1fr 1fr;gap:8px}
label{display:flex;flex-direction:column;gap:2px;color:var(--ptx-mid);font-size:11px}
input{min-width:0;font:12px ui-monospace,monospace;color:var(--ptx-fg);background:var(--ptx-sf);border:1px solid var(--ptx-bd);border-radius:8px;padding:5px 8px}input:focus{outline:none;border-color:var(--ptx-ac)}
.row{display:flex;gap:6px;align-items:center;margin-bottom:6px}.row code{margin:0;flex:1;font-size:11px;word-break:break-all}
#ph{font:600 16px ui-monospace,monospace;color:var(--ptx-ok);flex:1;word-break:break-all}
small{color:var(--ptx-mid);font-size:11px}`;

class PhoneticTranslator extends HTMLElement {
  static sounds = S;
  static add = add;
  static get observedAttributes() { return ['word']; }
  constructor() { super(); this.attachShadow({mode: 'open'}); this.u = []; this.sel = 0; this.fam = 'All'; this.word = ''; this.shut = new Set(['f']); }
  attributeChangedCallback(n, o, v) { if (n === 'word' && v !== o) this.setWord(v); }
  connectedCallback() {
    if (!this._ready) {
      this._ready = 1;
      const R = this.shadowRoot;
      R.innerHTML = `<style>${CSS}</style><div class="box" id="app"></div>`;
      R.addEventListener('click', e => this.onClick(e));
      R.addEventListener('input', e => this.onInput(e));
      R.addEventListener('toggle', e => { const id = e.target.dataset && e.target.dataset.s; if (id) e.target.open ? this.shut.delete(id) : this.shut.add(id); }, true);
    }
    this.draw();
  }
  get phonetic() { return this.u.map(x => x.resp).join(''); }
  get arpabet() { return this.u.map(x => x.ar).filter(Boolean).join(' '); }
  get tag() { return `<phoneme alphabet="cmu-arpabet" ph="${this.arpabet}">${this.word.toLowerCase()}</phoneme>`; }
  outs() { const R = this.shadowRoot; R.getElementById('ph').textContent = this.phonetic || '∅'; R.getElementById('tag').textContent = this.tag; }
  get state() { return {word: this.word, phonetic: this.phonetic, arpabet: this.arpabet, tag: this.tag, units: this.u.map(({t, pick, resp, ar}) => ({t, pick, resp, ar}))}; }
  opts(c) { const o = S[c.t] || []; return c.t.length === 1 ? [...o, {fam: 'Letter name', ipa: 'name', resp: LN[c.t], arpa: LA[c.t], ex: [LN[c.t]]}] : o; }
  mk(t) { const o = this.opts({t}); return {t, pick: o.length ? 0 : -1, resp: o.length ? o[0].resp : t.toLowerCase(), ar: o.length ? o[0].arpa : ''}; }
  span(i) { let t = this.u[i].t; for (let n = 1; n < 4 && this.u[i + n]; n++) { t += this.u[i + n].t; if (S[t]) return n + 1; } return 0; }
  predict(i) {
    const c = this.u[i]; if (c.t.length !== 1) return '';
    const p = (this.u[i - 1] || {t: ''}).t.slice(-1), n = (this.u[i + 1] || {t: ''}).t[0] || '', V = 'AEIOUY';
    switch (c.t) {
      case 'C': case 'G': return n && 'EIY'.includes(n) ? 'Soft' : 'Hard';
      case 'S': return p && n && V.includes(p) && V.includes(n) ? 'Z' : 'Normal';
      case 'B': return p === 'M' ? 'Silent' : 'Normal';
      case 'K': return n === 'N' ? 'Silent' : 'Normal';
      case 'W': return n === 'R' ? 'Silent' : 'Normal';
      case 'P': return n && 'SNT'.includes(n) ? 'Silent' : 'Normal';
    }
    return '';
  }
  setWord(word, saved) {
    const w = String(word || '').toUpperCase().replace(/[^A-Z]/g, '');
    this.word = w;
    this.u = saved && saved.map(x => x.t).join('') === w ? saved.map(x => ({...x, ar: x.ar ?? (x.pick >= 0 ? (this.opts(x)[x.pick] || {}).arpa || '' : '')})) : [...w].map(c => this.mk(c));
    this.sel = 0; this.fam = 'All'; this.draw();
  }
  say(text) {
    if (!('speechSynthesis' in window) || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85; speechSynthesis.speak(u);
  }
  emit() { this.dispatchEvent(new CustomEvent('phonetic-change', {detail: this.state, bubbles: true, composed: true})); }
  commit() { this.draw(); this.emit(); }
  join(i) { const n = this.span(i), t = this.u.slice(i, i + n).map(x => x.t).join(''); this.u.splice(i, n, this.mk(t)); this.sel = i; this.fam = 'All'; this.commit(); }
  split() { const c = this.u[this.sel]; if (c && c.t.length > 1) { this.u.splice(this.sel, 1, ...[...c.t].map(ch => this.mk(ch))); this.fam = 'All'; this.commit(); } }
  draw() {
    const A = this.shadowRoot.getElementById('app'); if (!A) return;
    if (!this.u.length) { A.innerHTML = '<div class="sec" style="padding:16px"><small>Set a word with the “word” attribute or setWord().</small></div>'; return; }
    const cur = this.u[this.sel], o = this.opts(cur), fams = ['All', ...new Set(o.map(s => s.fam))], pf = this.predict(this.sel);
    const hl = (w, t) => w.replace(new RegExp(t, 'gi'), m => `<u>${m}</u>`);
    const sec = (id, title, body) => `<details data-s="${id}"${this.shut.has(id) ? '' : ' open'}><summary>${title}</summary><div class="sec">${body}</div></details>`;
    let chips = '<div class="chips">';
    this.u.forEach((x, i) => {
      if (i && this.span(i - 1)) chips += `<button class="j" data-j="${i - 1}" title="Join these letters into one sound unit">⌒</button>`;
      chips += `<button class="chip${i === this.sel ? ' on' : ''}" data-u="${i}"><b>${x.t}</b><i>${x.resp || '∅'}</i></button>`;
    });
    chips += '</div>';
    let cards = '<div class="fams">' + fams.map(f => `<button class="${f === this.fam ? 'on' : ''}" data-f="${f}">${f}</button>`).join('') + (cur.t.length > 1 ? '<button data-split>Split letters</button>' : '') + '</div><div class="cards">';
    o.forEach((s, i) => {
      if (this.fam !== 'All' && s.fam !== this.fam) return;
      const ipa = (s.ipa === 'name' ? 'letter name' : s.ipa === 'none' ? 'no sound' : '/' + s.ipa + '/') + (s.arpa ? ' · ' + s.arpa : '');
      cards += `<div class="card${cur.pick === i ? ' on' : ''}" data-p="${i}"><div class="top"><span class="fam">${s.fam}</span>${s.fam === pf ? '<span class="star" title="What standard spelling rules usually predict here">★</span>' : ''}<code>${s.resp || '∅'}</code></div><div class="ipa">${ipa}</div><div class="ex">${s.ex.map(w => `<button class="w" data-w="${w}">${hl(w, cur.t)}</button>`).join('')}</div></div>`;
    });
    cards += '</div>';
    const fine = '<div class="fine"><label>Respelling<input data-c placeholder="type your own"></label><label>Arpabet<input data-a placeholder="e.g. L AE M"></label></div>';
    const out = '<div class="row"><span id="ph"></span><button data-hear>▶ Hear</button><button data-copy>Copy</button></div><div class="row"><code id="tag"></code><button data-copytag>Copy tag</button></div><small>Hear uses your browser’s voice, so it only approximates your final text-to-speech.</small>';
    A.innerHTML = chips + sec('s', `Sounds for “${cur.t}”`, cards) + sec('f', 'Fine-tune', fine) + sec('o', 'Output', out);
    A.querySelector('[data-c]').value = cur.resp;
    A.querySelector('[data-a]').value = cur.ar || '';
    this.outs();
  }
  onClick(e) {
    const q = s => e.target.closest(s); let el;
    if ((el = q('[data-w]'))) return this.say(el.dataset.w);
    if ((el = q('[data-p]'))) { const c = this.u[this.sel]; c.pick = +el.dataset.p; c.resp = this.opts(c)[c.pick].resp; c.ar = this.opts(c)[c.pick].arpa; return this.commit(); }
    if ((el = q('[data-u]'))) { this.sel = +el.dataset.u; this.fam = 'All'; return this.draw(); }
    if ((el = q('[data-j]'))) return this.join(+el.dataset.j);
    if ((el = q('[data-f]'))) { this.fam = el.dataset.f; return this.draw(); }
    if (q('[data-split]')) return this.split();
    if (q('[data-hear]')) return this.say(this.phonetic);
    if (q('[data-copytag]')) { try { navigator.clipboard.writeText(this.tag); } catch (_) {} return; }
    if (q('[data-copy]')) { try { navigator.clipboard.writeText(this.phonetic); } catch (_) {} }
  }
  onInput(e) {
    const t = e.target, c = this.u[this.sel], R = this.shadowRoot;
    if (t.matches('[data-c]')) { c.resp = t.value.trim(); R.querySelector('.chip.on i').textContent = c.resp || '∅'; }
    else if (t.matches('[data-a]')) c.ar = t.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    else return;
    c.pick = -1; this.outs();
    R.querySelectorAll('.card.on').forEach(x => x.classList.remove('on'));
    this.emit();
  }
}
if (!customElements.get('phonetic-translator')) customElements.define('phonetic-translator', PhoneticTranslator);
})();
