(function () {
  'use strict';

  var htmlLang = document.documentElement.getAttribute('lang') || 'en';
  var langPrefix = htmlLang === 'zh-cn' ? '/zh-cn' : (htmlLang === 'ja' ? '/ja' : '');

  /* conversation state for multi-turn input-file flow */
  var chatState = { mode: 'normal' };

  /* global store for copy-to-clipboard */
  window._alpsCodeStore = [];
  window.alpsCodeCopy = function (idx, btn) {
    var code = window._alpsCodeStore[idx] || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
    }
  };

  /* ================================================================
   * KNOWLEDGE BASE (general Q&A)
   * ================================================================ */
  var KB = [
    {
      keywords: ['what is alps', 'about alps', 'alps software', 'alps package',
                 'alps simulation', 'quantum lattice', 'many body', 'open source',
                 'alps collaboration', 'alps project'],
      response:
        '<strong>ALPS</strong> (Algorithms and Libraries for Physics Simulations) is an open-source ' +
        'project for simulating quantum lattice models — spin systems, electron systems, and more.<br><br>' +
        '&#8594; <a href="{lang}/about">About ALPS</a>'
    },
    {
      keywords: ['install', 'installation', 'set up', 'setup', 'download alps',
                 'get alps', 'how to install', 'requirements', 'prerequisites',
                 'linux', 'mac', 'macos'],
      response:
        'ALPS can be installed in three ways:<ul>' +
        '<li><a href="{lang}/documentation/install/binary">Binary packages</a> — easiest, pre-compiled</li>' +
        '<li><a href="{lang}/documentation/install/source">From source</a> — full control, requires compilation</li>' +
        '<li><a href="{lang}/documentation/install/spack">Via Spack</a> — ideal for HPC clusters</li>' +
        '</ul>' +
        '&#8594; Full <a href="{lang}/documentation/install">Installation guide</a>'
    },
    {
      keywords: ['binary', 'prebuilt', 'pre-built', 'binary package', 'conda', 'pip',
                 'package manager', 'easiest install', 'no compile'],
      response:
        'The <strong>binary installation</strong> is the easiest way — no compilation required.<br><br>' +
        '&#8594; <a href="{lang}/documentation/install/binary">Binary installation guide</a>'
    },
    {
      keywords: ['build from source', 'compile', 'cmake', 'git clone', 'source code',
                 'build alps', 'compile alps', 'from source'],
      response:
        'You can <strong>build ALPS from source</strong> for full customization and development access.<br><br>' +
        '&#8594; <a href="{lang}/documentation/install/source">Build from source guide</a>'
    },
    {
      keywords: ['spack', 'hpc', 'supercomputer', 'cluster', 'module', 'lmod',
                 'high performance computing'],
      response:
        '<strong>Spack</strong> is the recommended method for HPC clusters and supercomputers.<br><br>' +
        '&#8594; <a href="{lang}/documentation/install/spack">Spack installation guide</a>'
    },
    {
      keywords: ['windows', 'win10', 'win11', 'microsoft', 'wsl', 'windows support'],
      response:
        'ALPS officially supports <strong>Linux and macOS</strong> only — Windows is not supported.<br>' +
        'WSL (Windows Subsystem for Linux) may work as an unofficial workaround.<br><br>' +
        '&#8594; <a href="{lang}/faqs">FAQs</a>'
    },
    {
      keywords: ['documentation', 'docs', 'manual', 'reference guide', 'how to use alps',
                 'alps guide'],
      response:
        'The ALPS documentation covers methods, models, API, and code development.<br><br>' +
        '&#8594; <a href="{lang}/documentation">Documentation home</a>'
    },
    {
      keywords: ['getting started', 'beginner', 'introduction', 'intro', 'first steps',
                 'new user', 'quickstart', 'quick start', 'basics', 'how do i start'],
      response:
        'New to ALPS? The <strong>Introduction</strong> section covers:<ul>' +
        '<li>Defining models &amp; lattices</li>' +
        '<li>Setting measurements and parameters</li>' +
        '<li>Running your first simulation</li>' +
        '</ul>' +
        '&#8594; <a href="{lang}/documentation/intro">Getting Started guide</a>'
    },
    {
      keywords: ['dmft', 'dynamical mean field', 'dynamical mean-field theory',
                 'mott transition', 'hubbard dmft', 'bethe lattice', 'self-consistent field',
                 'impurity solver'],
      response:
        '<strong>DMFT</strong> (Dynamical Mean-Field Theory) maps a lattice problem onto an impurity ' +
        'model solved self-consistently — great for correlated electron systems.<br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/dmft">DMFT documentation</a><br>' +
        '&#8594; <a href="{lang}/tutorials/dmft">DMFT tutorials</a>'
    },
    {
      keywords: ['dmrg', 'density matrix renormalization', 'density matrix renormalization group',
                 'tensor network', 'mps', 'matrix product state', '1d chain',
                 'one dimensional chain'],
      response:
        '<strong>DMRG</strong> (Density Matrix Renormalization Group) is highly accurate for ' +
        '1D quantum systems using matrix product states (MPS).<br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/dmrg">DMRG documentation</a><br>' +
        '&#8594; <a href="{lang}/tutorials/dmrg">DMRG tutorials</a>'
    },
    {
      keywords: ['exact diagonalization', 'exact diag', 'ed method', 'full diagonalization',
                 'lanczos', 'hamiltonian matrix', 'small system diag'],
      response:
        '<strong>Exact Diagonalization (ED)</strong> directly diagonalizes the Hamiltonian for ' +
        'small quantum systems — exact results, limited to small sizes.<br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/ed">ED documentation</a><br>' +
        '&#8594; <a href="{lang}/tutorials/ed">ED tutorials</a>'
    },
    {
      keywords: ['qmc', 'quantum monte carlo', 'loop algorithm', 'worm algorithm',
                 'stochastic series expansion', 'sse', 'path integral monte carlo'],
      response:
        '<strong>QMC</strong> (Quantum Monte Carlo) uses stochastic sampling to solve quantum ' +
        'many-body problems — highly scalable, sign-problem-free for many models.<br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/qmc">QMC documentation</a>'
    },
    {
      keywords: ['spinmc', 'spin mc', 'classical monte carlo', 'classical spin',
                 'ising monte carlo', 'metropolis', 'wolff', 'cluster algorithm'],
      response:
        '<strong>SpinMC</strong> provides classical Monte Carlo for spin models (Ising, Heisenberg, etc.) ' +
        'using Metropolis and cluster algorithms.<br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/spinmc">SpinMC documentation</a>'
    },
    {
      keywords: ['tebd', 'time-evolving block decimation', 'time evolution', 'real time evolution',
                 'quantum quench', 'imaginary time', 'trotterization', 'suzuki-trotter'],
      response:
        '<strong>TEBD</strong> (Time-Evolving Block Decimation) simulates real- or imaginary-time ' +
        'evolution of 1D quantum systems using MPS and Trotter decomposition.<br><br>' +
        '&#8594; <a href="{lang}/tutorials/tebd">TEBD tutorial</a>'
    },
    {
      keywords: ['hubbard model', 'hubbard', 'fermi hubbard', 'on-site interaction',
                 'hopping term', 'mott insulator', 'strongly correlated electron'],
      response:
        'The <strong>Hubbard model</strong> describes electrons on a lattice with hopping t and ' +
        'on-site repulsion U — a paradigmatic model for strong correlations.<br><br>' +
        '&#8594; <a href="{lang}/documentation/models/hubbard">Hubbard model docs</a>'
    },
    {
      keywords: ['heisenberg model', 'heisenberg', 'spin chain', 'spin half', 'xxz model',
                 'antiferromagnet', 'ferromagnet', 'exchange interaction', 'j coupling'],
      response:
        'The <strong>Heisenberg model</strong> describes quantum spins coupled via exchange interactions — ' +
        'the workhorse model for quantum magnetism.<br><br>' +
        '&#8594; <a href="{lang}/documentation/models/heisenberg">Heisenberg model docs</a>'
    },
    {
      keywords: ['ising model', 'ising', 'transverse field ising', 'classical ising',
                 'phase transition', 'ferromagnetic', 'z2 symmetry'],
      response:
        'The <strong>Ising model</strong> is the canonical model for magnetic phase transitions, ' +
        'available in classical and transverse-field (quantum) variants.<br><br>' +
        '&#8594; <a href="{lang}/documentation/models/ising">Ising model docs</a>'
    },
    {
      keywords: ['bose-hubbard', 'bose hubbard', 'bhm', 'bosonic model', 'superfluid',
                 'mott lobe', 'optical lattice', 'bose einstein condensate'],
      response:
        'The <strong>Bose-Hubbard model</strong> describes interacting bosons on a lattice, ' +
        'exhibiting superfluid–Mott insulator quantum phase transitions.<br><br>' +
        '&#8594; <a href="{lang}/documentation/models/bhm">Bose-Hubbard model docs</a>'
    },
    {
      keywords: ['ladder lattice', 'two-leg ladder', 'two leg ladder', 'spin ladder',
                 'coupled ladders', 'open ladder', 'ladder model', 'what is ladder',
                 'ladder geometry', 'ladder boundary', 'j0 j1 ladder', 'j0 and j1',
                 'what is j0', 'what is j1', 'leg coupling', 'rung coupling'],
      response:
        'ALPS supports three ladder lattice geometries:<br><br>' +
        /* --- ladder diagram --- */
        '<div style="margin:.45rem 0;border-radius:.45rem;overflow:hidden;border:1px solid rgba(0,0,0,.12)">' +
        '<div style="display:block;background:rgba(0,0,0,.06);padding:.2rem .5rem;font-size:.72rem;font-weight:600;color:#555">Lattice diagram: ladder (W=2, L=4 shown)</div>' +
        '<pre style="display:block;margin:0;padding:.55rem .75rem;background:#fafaf5;color:#1a1a1a;font-size:.75rem;line-height:1.65;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre;overflow-x:auto">' +
        'o -J0- o -J0- o -J0- o  ← leg 1\n' +
        '|      |      |      |\n' +
        'J1     J1     J1     J1\n' +
        '|      |      |      |\n' +
        'o -J0- o -J0- o -J0- o  ← leg 2\n\n' +
        'J0 = leg bonds  (along each chain)\n' +
        'J1 = rung bonds (across the two legs)\n' +
        'L  = number of rungs,  W = number of legs' +
        '</pre></div><br>' +
        /* --- coupled ladders diagram --- */
        '<div style="margin:.45rem 0;border-radius:.45rem;overflow:hidden;border:1px solid rgba(0,0,0,.12)">' +
        '<div style="display:block;background:rgba(0,0,0,.06);padding:.2rem .5rem;font-size:.72rem;font-weight:600;color:#555">Lattice diagram: coupled ladders (2 ladders shown)</div>' +
        '<pre style="display:block;margin:0;padding:.55rem .75rem;background:#fafaf5;color:#1a1a1a;font-size:.75rem;line-height:1.65;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre;overflow-x:auto">' +
        'o -J0- o -J0- o -J0- o  } ladder A\n' +
        '|      |      |      |  }\n' +
        'J1     J1     J1     J1 } rungs\n' +
        '|      |      |      |  }\n' +
        'o -J0- o -J0- o -J0- o  }\n' +
        '|      |      |      |\n' +
        'J2     J2     J2     J2   ← inter-ladder\n' +
        '|      |      |      |\n' +
        'o -J0- o -J0- o -J0- o  } ladder B\n' +
        '|      |      |      |  }\n' +
        'J1     J1     J1     J1 }\n' +
        '|      |      |      |  }\n' +
        'o -J0- o -J0- o -J0- o  }\n\n' +
        'J0=legs  J1=rungs  J2=inter-ladder' +
        '</pre></div><br>' +
        '<ul>' +
        '<li><strong><code>ladder</code></strong> — W-leg ladder; periodic along legs, open across rungs.</li>' +
        '<li><strong><code>open ladder</code></strong> — open BCs in both directions. Use for DMRG.</li>' +
        '<li><strong><code>coupled ladders</code></strong> — 2D periodic; J2 couples adjacent ladders.</li>' +
        '</ul>' +
        'Try: <em>"create a ladder QMC input"</em>, <em>"ladder DMRG input L=40"</em>, or <em>"coupled ladders input J2=0.3"</em>.'
    },
    {
      keywords: ['tutorial', 'tutorials', 'example', 'examples', 'jupyter notebook',
                 'notebook', 'hands on', 'hands-on', 'exercise', 'learn alps'],
      response:
        'ALPS offers Jupyter-notebook tutorials for all major methods:<ul>' +
        '<li><a href="{lang}/tutorials/dmft">DMFT tutorials</a></li>' +
        '<li><a href="{lang}/tutorials/dmrg">DMRG tutorials</a></li>' +
        '<li><a href="{lang}/tutorials/ed">ED tutorials</a></li>' +
        '<li><a href="{lang}/tutorials/tebd">TEBD tutorial</a></li>' +
        '<li><a href="{lang}/tutorials/mcs">Monte Carlo tutorials</a></li>' +
        '</ul>' +
        '&#8594; <a href="{lang}/tutorials">Browse all tutorials</a>'
    },
    {
      keywords: ['event', 'events', 'workshop', 'conference', 'school', 'seminar',
                 'upcoming event', 'schedule', 'calendar', 'meeting', 'alps school'],
      response:
        'Upcoming ALPS workshops, schools, and conferences are listed on the Events page.<br><br>' +
        '&#8594; <a href="{lang}/events">Events page</a>'
    },
    {
      keywords: ['job', 'jobs', 'position', 'postdoc', 'phd position', 'graduate student',
                 'internship', 'hiring', 'career', 'opportunity', 'opportunities'],
      response:
        'Open positions within the ALPS collaboration are posted here:<br><br>' +
        '&#8594; <a href="{lang}/opportunities">Opportunities page</a>'
    },
    {
      keywords: ['governance', 'govern', 'leadership', 'steering committee', 'who leads alps',
                 'contact team', 'developers', 'alps team', 'collaboration members'],
      response:
        'Meet the ALPS leadership and community governance structure:<br><br>' +
        '&#8594; <a href="{lang}/govern">Governance page</a>'
    },
    {
      keywords: ['cite', 'citation', 'how to cite alps', 'citing alps', 'publication',
                 'paper', 'bibtex', 'doi', 'acknowledgement', 'reference alps'],
      response:
        'To cite ALPS in a publication:<ul>' +
        '<li><a href="{lang}/documentation/pubs/citations">Citation requirements</a></li>' +
        '<li><a href="{lang}/documentation/pubs/papers">Software release papers</a></li>' +
        '<li><a href="{lang}/documentation/pubs/refs">Method-specific references</a></li>' +
        '</ul>'
    },
    {
      keywords: ['bug', 'error', 'issue', 'crash', 'report bug', 'report an issue',
                 'not working', 'broken', 'wrong result', 'segfault'],
      response:
        'Found a bug? Report it on GitHub — developers investigate promptly.<br><br>' +
        '&#8594; <a href="https://github.com/ALPSim/ALPS/issues" target="_blank" rel="noopener">Open a GitHub issue</a><br>' +
        '&#8594; <a href="{lang}/faqs">FAQs</a>'
    },
    {
      keywords: ['contribute', 'contributing', 'pull request', 'code contribution',
                 'development', 'codedev', 'how to contribute'],
      response:
        'Interested in contributing to ALPS?<br><br>' +
        '&#8594; <a href="{lang}/govern">Contact the leadership team</a><br>' +
        '&#8594; <a href="{lang}/documentation/codedev">Code development docs</a><br>' +
        '&#8594; <a href="{lang}/govern/onboard">Onboarding statement</a>'
    },
    {
      keywords: ['discord', 'chat', 'community', 'discuss', 'discussion', 'ask a question',
                 'get help', 'forum', 'github discussions', 'community support'],
      response:
        'Join the ALPS community for questions and discussion:<ul>' +
        '<li><a href="https://discord.gg/JRNWnnva9g" target="_blank" rel="noopener">ALPS Discord server</a></li>' +
        '<li><a href="https://github.com/ALPSim/ALPS/discussions/categories/q-a" target="_blank" rel="noopener">GitHub Q&amp;A Discussions</a></li>' +
        '</ul>'
    },
    {
      keywords: ['faq', 'faqs', 'frequently asked questions', 'common questions'],
      response: '&#8594; <a href="{lang}/faqs">Frequently Asked Questions</a>'
    },
    {
      keywords: ['model', 'models', 'what models', 'supported models', 'which models',
                 'lattice model', 'spin model'],
      response:
        'ALPS supports a variety of quantum lattice models:<ul>' +
        '<li><a href="{lang}/documentation/models/hubbard">Hubbard model</a></li>' +
        '<li><a href="{lang}/documentation/models/heisenberg">Heisenberg model</a></li>' +
        '<li><a href="{lang}/documentation/models/ising">Ising model</a></li>' +
        '<li><a href="{lang}/documentation/models/bhm">Bose-Hubbard model</a></li>' +
        '</ul>' +
        '&#8594; <a href="{lang}/documentation">Documentation home</a>'
    },
    {
      keywords: ['method', 'methods', 'which method', 'supported methods', 'algorithms',
                 'numerical method', 'simulation method'],
      response:
        'ALPS implements several quantum simulation methods:<ul>' +
        '<li><a href="{lang}/documentation/methods/dmft">DMFT</a></li>' +
        '<li><a href="{lang}/documentation/methods/dmrg">DMRG</a></li>' +
        '<li><a href="{lang}/documentation/methods/ed">Exact Diagonalization</a></li>' +
        '<li><a href="{lang}/documentation/methods/qmc">Quantum Monte Carlo</a></li>' +
        '<li><a href="{lang}/documentation/methods/spinmc">Classical SpinMC</a></li>' +
        '</ul>'
    }
  ];

  /* ================================================================
   * KB SCORING
   * ================================================================ */
  function scoreEntry(query, entry) {
    var q = query.toLowerCase().trim();
    var s = 0;
    for (var i = 0; i < entry.keywords.length; i++) {
      var kw = entry.keywords[i];
      if (q === kw) { s += 10; continue; }
      if (q.indexOf(kw) !== -1) { s += 4; continue; }
      var kwW = kw.split(/\s+/);
      var qW  = q.split(/\s+/);
      for (var j = 0; j < qW.length; j++) {
        if (qW[j].length > 2 && kwW.indexOf(qW[j]) !== -1) s += 1;
      }
    }
    return s;
  }

  function findBestKB(query) {
    var best = null, bestS = 0;
    for (var i = 0; i < KB.length; i++) {
      var s = scoreEntry(query, KB[i]);
      if (s > bestS) { bestS = s; best = KB[i]; }
    }
    return best;
  }

  /* ================================================================
   * INPUT FILE — detection helpers
   * ================================================================ */
  var INPUT_TRIGGERS = [
    'create input', 'generate input', 'make input', 'write input', 'prepare input',
    'build input', 'input file', 'parameter file', 'parm file', 'create parm',
    'generate parm', 'new parm', 'setup simulation', 'set up simulation',
    'create simulation file', 'generate simulation'
  ];

  function isInputRequest(q) {
    for (var i = 0; i < INPUT_TRIGGERS.length; i++) {
      if (q.indexOf(INPUT_TRIGGERS[i]) !== -1) return true;
    }
    return false;
  }

  var METHOD_MAP = {
    spinmc:          ['spinmc', 'spin mc', 'classical monte carlo', 'classical ising',
                      'classical heisenberg', 'classical spin'],
    looper:          ['looper', 'quantum monte carlo spin', 'quantum spin mc',
                      'loop algorithm', 'loop qmc'],
    qmc:             ['qmc'],
    dwa:             ['dwa', 'directed worm', 'boson qmc', 'bosonic qmc', 'bose-hubbard qmc',
                      'boson hubbard qmc'],
    bhm:             ['boson hubbard', 'bose hubbard', 'bose-hubbard mc', 'bhm'],
    ed:              ['sparsediag', 'sparse diag', 'exact diagonalization', 'exact diag',
                      'ground state ed', ' ed '],
    fulldiag:        ['fulldiag', 'full diagonalization', 'full ed',
                      'finite temperature ed', 'thermodynamic ed'],
    dmrg:            ['dmrg', 'density matrix renormalization'],
    mps:             ['mps_optim', 'mps optim', 'mps optimization', 'matrix product state optim'],
    tebd:            ['tebd', 'time-evolving block decimation', 'time evolving block',
                      'real time evolution', 'time evolution mps'],
    dmft:            ['dmft', 'dynamical mean field', 'dynamical mean-field'],
    /* --- ladder variants (checked before generic ladder) --- */
    ladder_dmrg:     ['ladder dmrg', 'two-leg ladder dmrg', 'two leg ladder dmrg',
                      'spin ladder dmrg', 'open ladder dmrg', 'dmrg ladder',
                      'dmrg two-leg', 'dmrg two leg'],
    ladder_ed:       ['ladder ed', 'ladder exact diag', 'two-leg ladder ed',
                      'two leg ladder ed', 'ladder sparsediag', 'ladder diagonalization',
                      'ladder exact diagonalization', 'ed ladder', 'ed two-leg'],
    ladder_fulldiag: ['ladder fulldiag', 'ladder full diag', 'ladder full diagonalization',
                      'ladder thermodynamics', 'two-leg ladder fulldiag'],
    coupled_ladders: ['coupled ladders', 'coupled ladder', '2d ladders', '2d ladder',
                      'quantum phase transition ladder', 'coupled-ladders'],
    ladder:          ['two-leg ladder', 'two leg ladder', 'spin ladder', 'ladder qmc',
                      'ladder looper', 'ladder mc', 'open ladder qmc', 'ladder lattice qmc']
  };

  function detectMethod(q) {
    /* Check longer / more-specific keys first to avoid false partial matches */
    var order = ['ladder_dmrg', 'ladder_ed', 'ladder_fulldiag', 'coupled_ladders', 'ladder',
                 'spinmc', 'looper', 'qmc', 'dwa', 'bhm', 'ed', 'fulldiag',
                 'dmrg', 'mps', 'tebd', 'dmft'];
    for (var oi = 0; oi < order.length; oi++) {
      var m = order[oi];
      var kws = METHOD_MAP[m];
      for (var i = 0; i < kws.length; i++) {
        if (q.indexOf(kws[i]) !== -1) return m;
      }
    }
    /* fallback heuristics */
    if (/\bbeta\b|\bnmatsubara\b|\bimpurity\b|\bhybridization solver\b/i.test(q)) return 'dmft';
    if (/\btebd\b|\bquench\b|\breal.?time\b/i.test(q))                             return 'tebd';
    if (/\bdmrg\b|\bmaxstates\b/i.test(q))                                         return 'dmrg';
    if (/\bboson\b|\bbose\b/i.test(q))                                              return 'dwa';
    /* ladder heuristics — check after other methods so "ladder dmrg" etc. already matched above */
    if (/\bladder\b/i.test(q) && /\bdmrg\b|\bmps\b/i.test(q))                      return 'ladder_dmrg';
    if (/\bladder\b/i.test(q) && /\b(?:exact\s*diag|sparsediag|\bed\b)/i.test(q)) return 'ladder_ed';
    if (/coupled\s+ladders?\b/i.test(q))                                            return 'coupled_ladders';
    if (/\bladder\b/i.test(q))                                                      return 'ladder';
    if (/\bdiagonal/i.test(q))                                                      return 'ed';
    return null;
  }

  /* ================================================================
   * INPUT FILE — parameter extraction from natural language
   * ================================================================ */
  function extractParams(q) {
    var p = {}, m;

    /* System size L */
    if ((m = q.match(/\bL\s*=\s*(\d+)/i))                           ||
        (m = q.match(/(\d+)\s*(?:site|spin|rung)s?\b/i))            ||
        (m = q.match(/(?:length|size)\s*(?:[=:]\s*|\s+)(\d+)/i)))   p.L = +m[1];

    /* MAXSTATES / bond dimension */
    if ((m = q.match(/MAXSTATES\s*=\s*(\d+)/i))              ||
        (m = q.match(/(?:max[_\s]?states?|bond[_\s]?dim(?:ension)?|\bchi\b)\s*[=:]\s*(\d+)/i)) ||
        (m = q.match(/keep\s+(\d+)\s+states?/i)))            p.MAXSTATES = +m[1];

    /* SWEEPS */
    if ((m = q.match(/SWEEPS\s*=\s*(\d+)/i))                 ||
        (m = q.match(/(\d+)\s*sweeps?\b/i)))                  p.SWEEPS = +m[1];

    /* THERMALIZATION */
    if ((m = q.match(/THERMALIZATION\s*=\s*(\d+)/i))         ||
        (m = q.match(/thermali[sz]\w*\s+(\d+)/i)))           p.THERMALIZATION = +m[1];

    /* Temperature T */
    if ((m = q.match(/\bT\s*=\s*([\d.]+)/))                  ||
        (m = q.match(/temp(?:erature)?\s*[=:]\s*([\d.]+)/i))) p.T = +m[1];

    /* BETA */
    if ((m = q.match(/\bBETA\s*=\s*([\d.]+)/i))              ||
        (m = q.match(/\bbeta\s*[=:]\s*([\d.]+)/i)))          p.BETA = +m[1];

    /* Ladder width W */
    if ((m = q.match(/\bW\s*=\s*(\d+)/i))                    ||
        (m = q.match(/(\d+)[- ]leg\b/i))                     ||
        (m = q.match(/width\s*[=:]\s*(\d+)/i)))              p.W = +m[1];

    /* J0 leg coupling (ladder) */
    if ((m = q.match(/\bJ0\s*=\s*([-\d.]+)/i))               ||
        (m = q.match(/leg\s+coupling\s*[=:]\s*([-\d.]+)/i))) p.J0 = +m[1];

    /* J1 rung coupling (ladder) */
    if ((m = q.match(/\bJ1\s*=\s*([-\d.]+)/i))               ||
        (m = q.match(/rung\s+coupling\s*[=:]\s*([-\d.]+)/i))) p.J1 = +m[1];

    /* J2 inter-ladder coupling (coupled ladders) */
    if ((m = q.match(/\bJ2\s*=\s*([-\d.]+)/i))               ||
        (m = q.match(/inter.?ladder\s+coupling\s*[=:]\s*([-\d.]+)/i))) p.J2 = +m[1];

    /* J coupling (generic — only if J0/J1 not already set) */
    if (p.J0 === undefined && p.J1 === undefined) {
      if ((m = q.match(/\bJ\s*=\s*([-\d.]+)/))               ||
          (m = q.match(/(?:coupling|exchange)\s*[=:]?\s*([-\d.]+)/i))) p.J = +m[1];
    }

    /* U interaction */
    if ((m = q.match(/\bU\s*=\s*([\d.]+)/))                  ||
        (m = q.match(/hubbard\s*[Uu]\s*[=:]\s*([\d.]+)/i)))  p.U = +m[1];

    /* t hopping */
    if ((m = q.match(/\bt\s*=\s*([\d.]+)/))                  ||
        (m = q.match(/hopping\s*[=:]?\s*([\d.]+)/i)))        p.t_hop = +m[1];

    /* mu chemical potential */
    if ((m = q.match(/\bmu\s*=\s*([-\d.]+)/i))               ||
        (m = q.match(/chemical\s+potential\s*[=:]?\s*([-\d.]+)/i))) p.mu = +m[1];

    /* Spin value */
    if      (/spin[- ]?1\/2|[Ss]\s*=\s*0\.5|half[- ]spin/i.test(q))  p.local_S = 0.5;
    else if (/spin[- ]?1\b(?!\/)|[Ss]\s*=\s*1(?:\.0)?\b/i.test(q))   p.local_S = 1;
    else if (/spin[- ]?3\/2|[Ss]\s*=\s*1\.5/i.test(q))                p.local_S = 1.5;
    else if (/spin[- ]?2\b|[Ss]\s*=\s*2\b/i.test(q))                  p.local_S = 2;

    /* Sz_total */
    if ((m = q.match(/Sz_total\s*=\s*([-\d]+)/i))            ||
        (m = q.match(/total\s*Sz\s*[=:]\s*([-\d]+)/i)))      p.Sz_total = +m[1];

    /* NUMBER_EIGENVALUES */
    if ((m = q.match(/NUMBER_EIGENVALUES\s*=\s*(\d+)/i))     ||
        (m = q.match(/(\d+)\s*eigenvalues?\b/i)))             p.NUMBER_EIGENVALUES = +m[1];

    /* Nmax */
    if ((m = q.match(/Nmax\s*=\s*(\d+)/i))                   ||
        (m = q.match(/max\s*(?:occup\w+|bosons?\s*per\s*site)\s*[=:]\s*(\d+)/i))) p.Nmax = +m[1];

    /* N_total */
    if ((m = q.match(/N_total\s*=\s*(\d+)/i))                ||
        (m = q.match(/(\d+)\s*(?:particles?|bosons?)\b/i)))  p.N_total = +m[1];

    /* Lattice — check specific before general */
    if      (/open\s+chain|obc\b/i.test(q))        p.LATTICE = 'open chain lattice';
    else if (/\bchain\b/i.test(q))                  p.LATTICE = 'chain lattice';
    if      (/\bsquare\b/i.test(q))                 p.LATTICE = 'square lattice';
    if      (/\bcubic\b/i.test(q))                  p.LATTICE = 'cubic lattice';
    if      (/\btriangular\b/i.test(q))             p.LATTICE = 'triangular lattice';
    if      (/\bhoneycomb\b/i.test(q))              p.LATTICE = 'honeycomb';
    /* Ladder lattices — most specific first */
    if      (/coupled\s+ladders?\b/i.test(q))       p.LATTICE = 'coupled ladders';
    else if (/open\s+ladder\b/i.test(q))            p.LATTICE = 'open ladder';
    else if (/\bladder\b/i.test(q))                 p.LATTICE = 'ladder';

    /* SpinMC model name */
    if      (/\bising\b/i.test(q))                 p.spinMCmodel = 'Ising';
    else if (/\bheisenberg\b/i.test(q))            p.spinMCmodel = 'Heisenberg';
    else if (/\bxy\b/i.test(q))                    p.spinMCmodel = 'XY';

    /* Antiferromagnet hint */
    if (/\bantiferro|\bafm\b/i.test(q) && p.J === undefined) p.J = -1;

    /* Magnetic field h */
    if ((m = q.match(/\bh\s*=\s*([\d.]+)/i))                 ||
        (m = q.match(/\bfield\s*[=:]\s*([\d.]+)/i)))         p.h = +m[1];

    return p;
  }

  /* ================================================================
   * INPUT FILE — rendering helpers
   * ================================================================ */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function codeBlock(rawCode, label) {
    var idx = window._alpsCodeStore.length;
    window._alpsCodeStore.push(rawCode);
    return '<div class="alps-code-wrap">' +
      '<div class="alps-code-bar">' + esc(label) +
      '<button class="alps-copy-btn" onclick="alpsCodeCopy(' + idx + ',this)">Copy</button>' +
      '</div>' +
      '<pre class="alps-pre"><code>' + esc(rawCode) + '</code></pre>' +
      '</div>';
  }

  var _DWRAP = 'margin:.45rem 0;border-radius:.45rem;overflow:hidden;border:1px solid rgba(0,0,0,.12)';
  var _DBAR  = 'display:block;background:rgba(0,0,0,.06);padding:.2rem .5rem;font-size:.72rem;font-weight:600;color:#555';
  var _DPRE  = 'display:block;margin:0;padding:.55rem .75rem;background:#fafaf5;color:#1a1a1a;' +
               'font-size:.75rem;line-height:1.65;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;' +
               'white-space:pre;overflow-x:auto;max-height:300px';

  function diagramBlock(art, label) {
    return '<div class="alps-diagram-wrap" style="' + _DWRAP + '">' +
      '<div class="alps-diagram-bar" style="' + _DBAR + '">' + esc(label) + '</div>' +
      '<pre class="alps-diagram" style="' + _DPRE + '">' + esc(art) + '</pre>' +
      '</div>';
  }

  /* Returns a lattice diagram string for a given ALPS lattice name */
  function latticeDiagram(lattice) {
    switch (lattice) {
      case 'chain lattice':
        return diagramBlock(
          'o --J-- o --J-- o --J-- o --J-- o\n' +
          '\n' +
          'Periodic boundary conditions along the chain.\n' +
          'J = nearest-neighbour coupling.',
          'Lattice: chain lattice'
        );

      case 'open chain lattice':
        return diagramBlock(
          'o --J-- o --J-- o --J-- o --J-- o\n' +
          '\n' +
          'Open boundary conditions at both ends.\n' +
          'J = nearest-neighbour coupling.',
          'Lattice: open chain lattice'
        );

      case 'square lattice':
        return diagramBlock(
          'o --J-- o --J-- o\n' +
          '|       |       |\n' +
          'J       J       J\n' +
          '|       |       |\n' +
          'o --J-- o --J-- o\n' +
          '|       |       |\n' +
          'J       J       J\n' +
          '|       |       |\n' +
          'o --J-- o --J-- o\n' +
          '\n' +
          'Periodic BCs in both directions (3×3 shown).\n' +
          'J = nearest-neighbour coupling.',
          'Lattice: square lattice (3×3 shown)'
        );

      case 'ladder':
        return diagramBlock(
          'o -J0- o -J0- o -J0- o  ← leg 1\n' +
          '|      |      |      |\n' +
          'J1     J1     J1     J1\n' +
          '|      |      |      |\n' +
          'o -J0- o -J0- o -J0- o  ← leg 2\n' +
          '\n' +
          'J0 = leg bonds  (along each chain)\n' +
          'J1 = rung bonds (across the two legs)\n' +
          'L  = number of rungs,  W = number of legs\n' +
          'Periodic BCs along legs; open across rungs.',
          'Lattice: ladder (W=2, L=4 shown)'
        );

      case 'open ladder':
        return diagramBlock(
          'o -J0- o -J0- o -J0- o  ← leg 1\n' +
          '|      |      |      |\n' +
          'J1     J1     J1     J1\n' +
          '|      |      |      |\n' +
          'o -J0- o -J0- o -J0- o  ← leg 2\n' +
          '\n' +
          'J0 = leg bonds  (along each chain)\n' +
          'J1 = rung bonds (across the two legs)\n' +
          'L  = number of rungs,  W = number of legs\n' +
          'Open BCs in BOTH directions (required for DMRG).',
          'Lattice: open ladder (W=2, L=4 shown)'
        );

      case 'coupled ladders':
        return diagramBlock(
          'o -J0- o -J0- o -J0- o  ┐\n' +
          '|      |      |      |  │ ladder A\n' +
          'J1     J1     J1     J1 │ (rungs)\n' +
          '|      |      |      |  │\n' +
          'o -J0- o -J0- o -J0- o  ┘\n' +
          '|      |      |      |\n' +
          'J2     J2     J2     J2   ← inter-ladder\n' +
          '|      |      |      |\n' +
          'o -J0- o -J0- o -J0- o  ┐\n' +
          '|      |      |      |  │ ladder B\n' +
          'J1     J1     J1     J1 │ (rungs)\n' +
          '|      |      |      |  │\n' +
          'o -J0- o -J0- o -J0- o  ┘\n' +
          '\n' +
          'J0 = leg bonds     (along each chain)\n' +
          'J1 = rung bonds    (within each ladder)\n' +
          'J2 = inter-ladder  (between ladders)\n' +
          'L×W lattice; periodic BCs in both directions.',
          'Lattice: coupled ladders (2 ladders, L=4 shown)'
        );

      default:
        return '';
    }
  }

  /* ================================================================
   * INPUT FILE — generators (one per method)
   * ================================================================ */

  function genSpinMC(p) {
    var lattice = p.LATTICE || 'square lattice';
    var L       = p.L       || 8;
    var model   = p.spinMCmodel || 'Ising';
    var J       = (p.J   !== undefined) ? p.J   : 1;
    var therm   = p.THERMALIZATION || 1000;
    var sweeps  = p.SWEEPS || 50000;
    var temps   = p.T !== undefined ? [p.T] : [1.5, 2.0, 2.5];

    var parmLines = [
      'LATTICE="' + lattice + '"',
      'L=' + L,
      'MODEL="' + model + '"',
      'J=' + J,
      'THERMALIZATION=' + therm,
      'SWEEPS=' + sweeps,
      'UPDATE="cluster"'
    ];
    temps.forEach(function(t) { parmLines.push('{T=' + t + ';}'); });
    var parm = parmLines.join('\n');

    var tempStr = temps.length === 1
      ? '[' + temps[0] + ']'
      : '[' + temps.join(', ') + ']';
    var py = [
      'import pyalps',
      '',
      'parms = []',
      'for t in ' + tempStr + ':',
      '    parms.append({',
      '        \'LATTICE\'        : "' + lattice + '",',
      '        \'L\'              : ' + L + ',',
      '        \'MODEL\'          : "' + model + '",',
      '        \'J\'              : ' + J + ',',
      '        \'THERMALIZATION\' : ' + therm + ',',
      '        \'SWEEPS\'         : ' + sweeps + ',',
      '        \'UPDATE\'         : "cluster",',
      '        \'T\'              : t',
      '    })',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_spinmc\', parms)',
      'res = pyalps.runApplication(\'spinmc\', input_file)',
      'print("Done. Results in:", pyalps.getResultFiles(prefix=\'parm_spinmc\'))'
    ].join('\n');

    return '<strong>SpinMC input</strong> — ' + model + ', ' + lattice + ', L=' + L + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>spinmc</code></small>';
  }

  function genQMC(p) {
    var lattice  = p.LATTICE || 'chain lattice';
    var L        = p.L       || 16;
    var local_S  = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J        = (p.J    !== undefined) ? p.J    : 1;
    var therm    = p.THERMALIZATION || 5000;
    var sweeps   = p.SWEEPS || 100000;
    var temps    = p.T !== undefined ? [p.T] : [0.5, 1.0, 2.0];
    var tempStr  = temps.length === 1 ? '[' + temps[0] + ']' : '[' + temps.join(', ') + ']';

    var parmLines = [
      'LATTICE="' + lattice + '"',
      'L=' + L,
      'MODEL="spin"',
      'local_S=' + local_S,
      'J=' + J,
      'THERMALIZATION=' + therm,
      'SWEEPS=' + sweeps
    ];
    temps.forEach(function(t) { parmLines.push('{T=' + t + ';}'); });
    var parm = parmLines.join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = []',
      'for t in ' + tempStr + ':',
      '    parms.append({',
      '        \'LATTICE\'        : "' + lattice + '",',
      '        \'L\'              : ' + L + ',',
      '        \'MODEL\'          : "spin",',
      '        \'local_S\'        : ' + local_S + ',',
      '        \'J\'              : ' + J + ',',
      '        \'THERMALIZATION\' : ' + therm + ',',
      '        \'SWEEPS\'         : ' + sweeps + ',',
      '        \'T\'              : t',
      '    })',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_qmc\', parms)',
      'res = pyalps.runApplication(\'looper\', input_file)'
    ].join('\n');

    return '<strong>QMC (looper) input</strong> — spin-' + local_S + ', ' + lattice + ', L=' + L + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>looper</code></small>';
  }

  function genBHM(p) {
    var lattice = p.LATTICE || 'square lattice';
    var L       = p.L      || 4;
    var U       = (p.U    !== undefined) ? p.U    : 1.0;
    var mu      = (p.mu   !== undefined) ? p.mu   : 0.5;
    var t_hop   = (p.t_hop!== undefined) ? p.t_hop: 0.05;
    var Nmax    = p.Nmax   || 2;
    var T       = (p.T    !== undefined) ? p.T    : 0.1;
    var therm   = p.THERMALIZATION || 10000;
    var sweeps  = p.SWEEPS || 500000;

    var parm = [
      'LATTICE="' + lattice + '"', 'L=' + L,
      '', 'MODEL="boson Hubbard"', 'NONLOCAL=0',
      'U='    + U, 'mu='   + mu, 'Nmax=' + Nmax,
      '', 'T=' + T, 'SWEEPS=' + sweeps, 'THERMALIZATION=' + therm,
      '', '{t=' + t_hop + ';}'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'        : "' + lattice + '",',
      '    \'L\'              : ' + L + ',',
      '    \'MODEL\'          : "boson Hubbard",',
      '    \'NONLOCAL\'       : 0,',
      '    \'U\'              : ' + U + ',',
      '    \'mu\'             : ' + mu + ',',
      '    \'Nmax\'           : ' + Nmax + ',',
      '    \'T\'              : ' + T + ',',
      '    \'THERMALIZATION\' : ' + therm + ',',
      '    \'SWEEPS\'         : ' + sweeps + ',',
      '    \'t\'              : ' + t_hop,
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_bhm\', parms)',
      'res = pyalps.runApplication(\'dirloop_sse\', input_file)'
    ].join('\n');

    return '<strong>Bose-Hubbard QMC input</strong> — ' + lattice + ', L=' + L + ', U=' + U + ', t=' + t_hop + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>dirloop_sse</code></small>';
  }

  function genED(p) {
    var lattice = p.LATTICE || 'chain lattice';
    var L       = p.L      || 8;
    var local_S = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J       = (p.J    !== undefined) ? p.J    : 1;

    var parm = [
      'MODEL="spin"',
      'LATTICE="' + lattice + '"',
      'local_S=' + local_S,
      'J=' + J,
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'MEASURE_CORRELATIONS[Spin correlations]=Sz',
      'MEASURE_CORRELATIONS[Off-diagonal correlations]="Splus:Sminus"',
      '{L=' + L + ';}'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'                                          : "' + lattice + '",',
      '    \'MODEL\'                                           : "spin",',
      '    \'local_S\'                                         : ' + local_S + ',',
      '    \'J\'                                               : ' + J + ',',
      '    \'L\'                                               : ' + L + ',',
      '    \'CONSERVED_QUANTUMNUMBERS\'                        : \'Sz\',',
      '    \'MEASURE_CORRELATIONS[Spin correlations]\'         : \'Sz\',',
      '    \'MEASURE_CORRELATIONS[Off-diagonal correlations]\' : \'Splus:Sminus\'',
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_ed\', parms)',
      'res = pyalps.runApplication(\'sparsediag\', input_file)',
      'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_ed\'))'
    ].join('\n');

    return '<strong>Exact Diagonalization input</strong> — spin-' + local_S + ', ' + lattice + ', L=' + L + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>sparsediag</code></small>';
  }

  function genFullDiag(p) {
    var lattice = p.LATTICE || 'chain lattice';
    var L       = p.L      || 8;
    var local_S = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J       = (p.J    !== undefined) ? p.J    : 1;

    var parm = [
      'MODEL="spin"',
      'LATTICE="' + lattice + '"',
      'local_S=' + local_S,
      'J=' + J,
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'T_MIN=0.1',
      'T_MAX=10.0',
      'DELTA_T=0.1',
      '{L=' + L + ';}'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'                  : "' + lattice + '",',
      '    \'MODEL\'                    : "spin",',
      '    \'local_S\'                  : ' + local_S + ',',
      '    \'J\'                        : ' + J + ',',
      '    \'L\'                        : ' + L + ',',
      '    \'CONSERVED_QUANTUMNUMBERS\' : \'Sz\',',
      '    \'T_MIN\'                    : 0.1,',
      '    \'T_MAX\'                    : 10.0,',
      '    \'DELTA_T\'                  : 0.1',
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_fulldiag\', parms)',
      'res = pyalps.runApplication(\'fulldiag\', input_file)'
    ].join('\n');

    return '<strong>Full ED (thermodynamics) input</strong> — spin-' + local_S + ', ' + lattice + ', L=' + L + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>fulldiag</code> — sweeps T from 0.1 to 10</small>';
  }

  function genDMRG(p, appName) {
    appName = appName || 'dmrg';
    var L        = p.L        || 32;
    var local_S  = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J        = (p.J       !== undefined) ? p.J       : 1;
    var MAXSTATES= p.MAXSTATES|| 100;
    var SWEEPS   = p.SWEEPS   || 4;
    var NEIGEN   = p.NUMBER_EIGENVALUES || 1;
    var Sz_total = (p.Sz_total!== undefined) ? p.Sz_total: 0;
    var prefix   = 'parm_' + appName.replace('_', '');

    var parm = [
      'LATTICE="open chain lattice"',
      'MODEL="spin"',
      'local_S=' + local_S,
      'J=' + J,
      'L=' + L,
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'Sz_total=' + Sz_total,
      'SWEEPS=' + SWEEPS,
      'NUMBER_EIGENVALUES=' + NEIGEN,
      '{MAXSTATES=' + MAXSTATES + '}'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'                  : "open chain lattice",',
      '    \'MODEL\'                    : "spin",',
      '    \'local_S\'                  : ' + local_S + ',',
      '    \'J\'                        : ' + J + ',',
      '    \'L\'                        : ' + L + ',',
      '    \'CONSERVED_QUANTUMNUMBERS\' : \'Sz\',',
      '    \'Sz_total\'                 : ' + Sz_total + ',',
      '    \'SWEEPS\'                   : ' + SWEEPS + ',',
      '    \'NUMBER_EIGENVALUES\'       : ' + NEIGEN + ',',
      '    \'MAXSTATES\'               : ' + MAXSTATES,
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'' + prefix + '\', parms)',
      'res = pyalps.runApplication(\'' + appName + '\', input_file, writexml=True)',
      'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'' + prefix + '\'))',
      'for s in data[0]:',
      '    print(s.props[\'observable\'], \':\', s.y[0])'
    ].join('\n');

    var label = appName === 'mps_optim' ? 'MPS optimization' : 'DMRG';
    return '<strong>' + label + ' input</strong> — spin-' + local_S + ', open chain, L=' + L + ', MAXSTATES=' + MAXSTATES + '<br>' +
      latticeDiagram('open chain lattice') +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>' + appName + '</code></small>';
  }

  function genTEBD(p) {
    var L       = p.L       || 10;
    var N_total = (p.N_total !== undefined) ? p.N_total : Math.floor(L / 2);
    var t_hop   = (p.t_hop  !== undefined) ? p.t_hop   : 1.0;

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'L\'                        : ' + L + ',',
      '    \'MODEL\'                    : \'hardcore boson\',',
      '    \'CONSERVED_QUANTUMNUMBERS\' : \'N_total\',',
      '    \'N_total\'                  : ' + N_total + ',',
      '    \'t\'                        : ' + t_hop + ',',
      '    \'V\'                        : 10.0,',
      '    \'ITP_CHIS\'                 : [20, 30, 40],',
      '    \'ITP_DTS\'                  : [0.05, 0.05, 0.025],',
      '    \'ITP_CONVS\'                : [1E-8, 1E-8, 1E-9],',
      '    \'INITIAL_STATE\'            : \'ground\',',
      '    \'CHI_LIMIT\'                : 40,',
      '    \'TRUNC_LIMIT\'              : 1E-12,',
      '    \'NUM_THREADS\'              : 1,',
      '    \'TAUS\'                     : [10.0, 10.0],',
      '    \'POWS\'                     : [1.0, 1.0],',
      '    \'GS\'                       : [\'V\', \'V\'],',
      '    \'GIS\'                      : [10.0, 0.0],',
      '    \'GFS\'                      : [0.0, 10.0],',
      '    \'NUMSTEPS\'                 : [500, 500],',
      '    \'STEPSFORSTORE\'            : [5, 5]',
      '}]',
      '',
      'nmlnameList = pyalps.writeTEBDfiles(parms, \'parm_tebd\')',
      'res = pyalps.runTEBD(nmlnameList)'
    ].join('\n');

    return '<strong>TEBD input</strong> — hardcore boson, L=' + L + ', N=' + N_total + '<br>' +
      '<em>TEBD uses Python-only input via <code>pyalps.writeTEBDfiles()</code>:</em><br>' +
      codeBlock(py, 'Python (pyalps)') +
      '<small>No standalone parameter file format for TEBD — use the Python script above.</small>';
  }

  /* ---- Two-leg ladder: QMC (looper) ---- */
  function genLadderQMC(p) {
    var L       = p.L  || 16;
    var W       = p.W  || 2;
    var local_S = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J0      = (p.J0 !== undefined) ? p.J0 : (p.J !== undefined ? p.J : 1);
    var J1      = (p.J1 !== undefined) ? p.J1 : 1;
    var therm   = p.THERMALIZATION || 5000;
    var sweeps  = p.SWEEPS || 50000;
    var lattice = (p.LATTICE === 'open ladder') ? 'open ladder' : 'ladder';
    var temps   = p.T !== undefined ? [p.T] : [0.5, 1.0, 2.0];
    var tempStr = temps.length === 1 ? '[' + temps[0] + ']' : '[' + temps.join(', ') + ']';

    var parmLines = [
      'LATTICE="' + lattice + '"',
      'MODEL="spin"',
      'local_S=' + local_S,
      'J0=' + J0,
      'J1=' + J1,
      'L=' + L,
      'W=' + W,
      'THERMALIZATION=' + therm,
      'SWEEPS=' + sweeps
    ];
    temps.forEach(function(t) { parmLines.push('{T=' + t + ';}'); });
    var parm = parmLines.join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = []',
      'for t in ' + tempStr + ':',
      '    parms.append({',
      '        \'LATTICE\'        : "' + lattice + '",',
      '        \'MODEL\'          : "spin",',
      '        \'local_S\'        : ' + local_S + ',',
      '        \'J0\'             : ' + J0 + ',',
      '        \'J1\'             : ' + J1 + ',',
      '        \'L\'              : ' + L + ',',
      '        \'W\'              : ' + W + ',',
      '        \'THERMALIZATION\' : ' + therm + ',',
      '        \'SWEEPS\'         : ' + sweeps + ',',
      '        \'T\'              : t',
      '    })',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_ladder\', parms)',
      'res = pyalps.runApplication(\'looper\', input_file)'
    ].join('\n');

    return '<strong>Ladder QMC input</strong> — ' + W + '-leg ladder, spin-' + local_S +
      ', L=' + L + ', J0(leg)=' + J0 + ', J1(rung)=' + J1 + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>looper</code></small>';
  }

  /* ---- Two-leg ladder: Exact Diagonalization ---- */
  function genLadderED(p) {
    var L       = p.L  || 8;
    var W       = p.W  || 2;
    var local_S = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J0      = (p.J0 !== undefined) ? p.J0 : (p.J !== undefined ? p.J : 1);
    var J1      = (p.J1 !== undefined) ? p.J1 : 1;
    var lattice = 'ladder';

    var parm = [
      'MODEL="spin"',
      'LATTICE="' + lattice + '"',
      'local_S=' + local_S,
      'J0=' + J0,
      'J1=' + J1,
      'W=' + W,
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'MEASURE_CORRELATIONS[Spin correlations]=Sz',
      'MEASURE_CORRELATIONS[Off-diagonal correlations]="Splus:Sminus"',
      '{L=' + L + '; Sz_total=0;}'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'                                          : "' + lattice + '",',
      '    \'MODEL\'                                           : "spin",',
      '    \'local_S\'                                         : ' + local_S + ',',
      '    \'J0\'                                              : ' + J0 + ',',
      '    \'J1\'                                              : ' + J1 + ',',
      '    \'L\'                                               : ' + L + ',',
      '    \'W\'                                               : ' + W + ',',
      '    \'CONSERVED_QUANTUMNUMBERS\'                        : \'Sz\',',
      '    \'Sz_total\'                                        : 0,',
      '    \'MEASURE_CORRELATIONS[Spin correlations]\'         : \'Sz\',',
      '    \'MEASURE_CORRELATIONS[Off-diagonal correlations]\' : \'Splus:Sminus\'',
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_ladder_ed\', parms)',
      'res = pyalps.runApplication(\'sparsediag\', input_file)',
      'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_ladder_ed\'))',
      'for sector in data[0]:',
      '    for s in sector:',
      '        print(s.props[\'observable\'], \':\', s.y[0])'
    ].join('\n');

    return '<strong>Ladder Exact Diagonalization input</strong> — ' + W + '-leg ladder, spin-' + local_S +
      ', L=' + L + ', J0(leg)=' + J0 + ', J1(rung)=' + J1 + '<br>' +
      latticeDiagram('ladder') +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>sparsediag</code></small>';
  }

  /* ---- Two-leg ladder: DMRG (open ladder — open BCs required) ---- */
  function genLadderDMRG(p) {
    var L        = p.L         || 32;
    var W        = p.W         || 2;
    var local_S  = (p.local_S  !== undefined) ? p.local_S  : 0.5;
    var J0       = (p.J0       !== undefined) ? p.J0       : (p.J !== undefined ? p.J : 1);
    var J1       = (p.J1       !== undefined) ? p.J1       : 1;
    var MAXSTATES= p.MAXSTATES || 200;
    var SWEEPS   = p.SWEEPS    || 4;
    var Sz_total = (p.Sz_total !== undefined) ? p.Sz_total : 0;
    var NEIGEN   = p.NUMBER_EIGENVALUES || 1;

    var parm = [
      'LATTICE="open ladder"',
      'MODEL="spin"',
      'local_S=' + local_S,
      'J0=' + J0,
      'J1=' + J1,
      'L=' + L,
      'W=' + W,
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'Sz_total=' + Sz_total,
      'SWEEPS=' + SWEEPS,
      'NUMBER_EIGENVALUES=' + NEIGEN,
      '{MAXSTATES=' + MAXSTATES + '}'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'                  : "open ladder",',
      '    \'MODEL\'                    : "spin",',
      '    \'local_S\'                  : ' + local_S + ',',
      '    \'J0\'                       : ' + J0 + ',',
      '    \'J1\'                       : ' + J1 + ',',
      '    \'L\'                        : ' + L + ',',
      '    \'W\'                        : ' + W + ',',
      '    \'CONSERVED_QUANTUMNUMBERS\' : \'Sz\',',
      '    \'Sz_total\'                 : ' + Sz_total + ',',
      '    \'SWEEPS\'                   : ' + SWEEPS + ',',
      '    \'NUMBER_EIGENVALUES\'       : ' + NEIGEN + ',',
      '    \'MAXSTATES\'                : ' + MAXSTATES,
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_ladder_dmrg\', parms)',
      'res = pyalps.runApplication(\'dmrg\', input_file, writexml=True)',
      'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_ladder_dmrg\'))',
      'for s in data[0]:',
      '    print(s.props[\'observable\'], \':\', s.y[0])'
    ].join('\n');

    return '<strong>Ladder DMRG input</strong> — ' + W + '-leg open ladder, spin-' + local_S +
      ', L=' + L + ', J0(leg)=' + J0 + ', J1(rung)=' + J1 + ', MAXSTATES=' + MAXSTATES + '<br>' +
      latticeDiagram('open ladder') +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>dmrg</code></small>';
  }

  /* ---- Coupled ladders: QMC (loop) — from mc-08 tutorial ---- */
  function genCoupledLadders(p) {
    var L     = p.L  || 8;
    var W     = p.W  || 4;
    var J0    = (p.J0 !== undefined) ? p.J0 : 1;
    var J1    = (p.J1 !== undefined) ? p.J1 : 1;
    var J2    = (p.J2 !== undefined) ? p.J2 : 0.3;
    var therm = p.THERMALIZATION || 5000;
    var sweeps= p.SWEEPS || 50000;
    var temps = p.T !== undefined ? [p.T] : [0.5, 1.0, 1.5, 2.0, 3.0];
    var tempStr = temps.length === 1 ? '[' + temps[0] + ']' : '[' + temps.join(', ') + ']';

    var parmLines = [
      'LATTICE="coupled ladders"',
      'MODEL="spin"',
      'local_S=1/2',
      '',
      'J0=' + J0,
      'J1=' + J1,
      'J2=' + J2,
      '',
      'L=' + L,
      'W=' + W,
      '',
      'THERMALIZATION=' + therm,
      'SWEEPS=' + sweeps,
      'ALGORITHM="loop"',
      'SEED=0'
    ];
    temps.forEach(function(t) { parmLines.push('{T=' + t + ';}'); });
    var parm = parmLines.join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = []',
      'for t in ' + tempStr + ':',
      '    parms.append({',
      '        \'LATTICE\'        : "coupled ladders",',
      '        \'MODEL\'          : "spin",',
      '        \'local_S\'        : 0.5,',
      '        \'ALGORITHM\'      : \'loop\',',
      '        \'SEED\'           : 0,',
      '        \'T\'              : t,',
      '        \'J0\'             : ' + J0 + ',',
      '        \'J1\'             : ' + J1 + ',',
      '        \'J2\'             : ' + J2 + ',',
      '        \'THERMALIZATION\' : ' + therm + ',',
      '        \'SWEEPS\'         : ' + sweeps + ',',
      '        \'L\'              : ' + L + ',',
      '        \'W\'              : ' + W,
      '    })',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_coupled_ladders\', parms)',
      'res = pyalps.runApplication(\'loop\', input_file)'
    ].join('\n');

    return '<strong>Coupled Ladders QMC input</strong> — ' +
      'L=' + L + '×W=' + W + ', J0(leg)=' + J0 + ', J1(rung)=' + J1 + ', J2(inter-ladder)=' + J2 + '<br>' +
      latticeDiagram('coupled ladders') +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>loop</code></small>';
  }

  function genDMFT(p) {
    var BETA  = (p.BETA !== undefined) ? p.BETA  : 10.0;
    var U     = (p.U    !== undefined) ? p.U     : 4.0;
    var MU    = (p.mu   !== undefined) ? p.mu    : 0;
    var t_hop = (p.t_hop!== undefined) ? p.t_hop : 0.5;
    var SWEEPS= p.SWEEPS || 5000;
    var THERM = p.THERMALIZATION || 500;
    var N     = Math.max(100, Math.round(BETA * 50));

    var parm = [
      'BETA='  + BETA,  'U='   + U,    'MU='  + MU,   't='   + t_hop,
      'SOLVER=hybridization',
      'N='     + N,     'NMATSUBARA=' + N,
      'N_MEAS=10000',   'SWEEPS=' + SWEEPS, 'THERMALIZATION=' + THERM,
      'FLAVORS=2',      'SITES=1',
      'CONVERGED=0.003','MAX_IT=20',   'MAX_TIME=600',
      'OMEGA_LOOP=1',   'SEED=0'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = {',
      '    \'BETA\'           : ' + BETA  + ',',
      '    \'U\'              : ' + U     + ',',
      '    \'MU\'             : ' + MU    + ',',
      '    \'t\'              : ' + t_hop + ',',
      '    \'SOLVER\'         : \'hybridization\',',
      '    \'N\'              : ' + N     + ',',
      '    \'NMATSUBARA\'     : ' + N     + ',',
      '    \'N_MEAS\'         : 10000,',
      '    \'SWEEPS\'         : ' + SWEEPS + ',',
      '    \'THERMALIZATION\' : ' + THERM  + ',',
      '    \'FLAVORS\'        : 2,',
      '    \'SITES\'          : 1,',
      '    \'CONVERGED\'      : 0.003,',
      '    \'MAX_IT\'         : 20,',
      '    \'MAX_TIME\'       : 600,',
      '    \'OMEGA_LOOP\'     : 1,',
      '    \'SEED\'           : 0',
      '}',
      '',
      'input_file = pyalps.writeParameterFile(\'parm_dmft\', parms)',
      'res = pyalps.runDMFT(input_file)'
    ].join('\n');

    return '<strong>DMFT input</strong> — β=' + BETA + ', U=' + U + ', t=' + t_hop + '<br>' +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>Run via <code>pyalps.runDMFT()</code>. Solver: hybridization expansion CT-HYB.</small>';
  }

  var METHOD_CHOICES_MSG =
    'Which simulation method would you like an input file for?<ul>' +
    '<li><strong>spinmc</strong> — Classical spin MC (Ising, Heisenberg, XY)</li>' +
    '<li><strong>qmc</strong> — Quantum spin MC (looper, chain/square)</li>' +
    '<li><strong>bhm</strong> — Bose-Hubbard MC (bosons)</li>' +
    '<li><strong>ed</strong> — Exact Diagonalization (ground state)</li>' +
    '<li><strong>fulldiag</strong> — Full ED (thermodynamics, finite-T)</li>' +
    '<li><strong>dmrg</strong> — DMRG (1D ground state)</li>' +
    '<li><strong>mps</strong> — MPS optimization</li>' +
    '<li><strong>tebd</strong> — TEBD (real-time evolution)</li>' +
    '<li><strong>dmft</strong> — DMFT (single-site, Hubbard)</li>' +
    '</ul>' +
    '<strong>Ladder lattice variants:</strong><ul>' +
    '<li><strong>ladder qmc</strong> — Two-leg ladder QMC (looper), J0=leg, J1=rung</li>' +
    '<li><strong>ladder ed</strong> — Two-leg ladder Exact Diagonalization</li>' +
    '<li><strong>ladder dmrg</strong> — Two-leg ladder DMRG (open ladder)</li>' +
    '<li><strong>coupled ladders</strong> — 2D coupled-ladders QMC (loop), adds J2=inter-ladder</li>' +
    '</ul>' +
    'Type the method name and any parameters, e.g.:<br>' +
    '<em>"ladder qmc spin-1/2 L=16 J0=1 J1=0.5"</em><br>' +
    '<em>"coupled ladders L=8 W=4 J2=0.3"</em><br>' +
    '<em>"dmrg spin-1/2 L=32 MAXSTATES=200"</em>';

  function generateInputFile(method, params) {
    switch (method) {
      case 'spinmc':                    return genSpinMC(params);
      case 'looper': case 'qmc':        return genQMC(params);
      case 'dwa':    case 'bhm':        return genBHM(params);
      case 'ed':                        return genED(params);
      case 'fulldiag':                  return genFullDiag(params);
      case 'dmrg':                      return genDMRG(params, 'dmrg');
      case 'mps':                       return genDMRG(params, 'mps_optim');
      case 'tebd':                      return genTEBD(params);
      case 'dmft':                      return genDMFT(params);
      case 'ladder':                    return genLadderQMC(params);
      case 'ladder_ed':                 return genLadderED(params);
      case 'ladder_fulldiag':           return genLadderED(params);
      case 'ladder_dmrg':               return genLadderDMRG(params);
      case 'coupled_ladders':           return genCoupledLadders(params);
      default:                          return null;
    }
  }

  /* ================================================================
   * MAIN RESPONSE BUILDER
   * ================================================================ */
  function buildResponse(query) {
    var q = query.toLowerCase().trim();

    /* --- input-file flow --- */
    if (isInputRequest(q) || chatState.mode === 'awaiting_method') {
      var method = detectMethod(q);
      var params = extractParams(q);

      if (method) {
        chatState.mode = 'normal';
        var fileHTML = generateInputFile(method, params);
        if (fileHTML) return fileHTML;
      } else if (isInputRequest(q)) {
        chatState.mode = 'awaiting_method';
        return METHOD_CHOICES_MSG;
      } else {
        /* in awaiting_method but no method recognised */
        if (q === 'cancel' || q === 'nevermind' || q === 'no') {
          chatState.mode = 'normal';
          return 'No problem! Ask me anything else about ALPS.';
        }
        return 'I didn\'t recognise that method. Please choose from: ' +
               'spinmc, qmc, bhm, ed, fulldiag, dmrg, mps, tebd, dmft, ' +
               '"ladder qmc", "ladder ed", "ladder dmrg", "coupled ladders". ' +
               'Or type "cancel" to go back.';
      }
    }

    /* --- general KB lookup --- */
    var match = findBestKB(q);
    if (!match) {
      return 'I\'m not sure about that. Try the ' +
             '<a href="{lang}/documentation">Documentation</a>, ' +
             '<a href="{lang}/faqs">FAQs</a>, or ask on ' +
             '<a href="https://discord.gg/JRNWnnva9g" target="_blank" rel="noopener">Discord</a>.';
    }
    return match.response;
  }

  /* ================================================================
   * DOM helpers
   * ================================================================ */
  function applyLang(html) {
    return html.replace(/\{lang\}/g, langPrefix);
  }

  function addMessage(container, html, isUser) {
    var div = document.createElement('div');
    div.className = 'alps-msg ' + (isUser ? 'alps-msg-user' : 'alps-msg-bot');
    if (isUser) {
      div.textContent = html;
    } else {
      div.innerHTML = applyLang(html);
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  /* ================================================================
   * INIT
   * ================================================================ */
  function init() {
    var widget   = document.getElementById('alps-chat-widget');
    if (!widget) return;

    var toggleBtn = document.getElementById('alps-chat-toggle');
    var closeBtn  = document.getElementById('alps-chat-close');
    var win       = document.getElementById('alps-chat-window');
    var messages  = document.getElementById('alps-chat-messages');
    var input     = document.getElementById('alps-chat-input');
    var sendBtn   = document.getElementById('alps-chat-send');

    addMessage(messages,
      'Hi! I\'m the ALPS assistant. I can answer questions about ALPS and ' +
      '<strong>generate simulation input files</strong> for you.<br><br>' +
      'Try: <em>"create a DMRG input file for a spin-1/2 chain L=32"</em><br>' +
      'or ask about installation, methods, models, tutorials, etc.',
      false);

    toggleBtn.addEventListener('click', function () {
      var hidden = win.classList.toggle('alps-chat-hidden');
      if (!hidden) { setTimeout(function () { input.focus(); }, 50); }
    });

    closeBtn.addEventListener('click', function () {
      win.classList.add('alps-chat-hidden');
    });

    function handleSend() {
      var text = input.value.trim();
      if (!text) return;
      addMessage(messages, text, true);
      input.value = '';
      var response = buildResponse(text);
      setTimeout(function () { addMessage(messages, response, false); }, 280);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
