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
                 'tensor network', 'mps', 'matrix product state', 'mps optimization',
                 '1d chain dmrg', 'one dimensional dmrg'],
      response:
        '<strong>DMRG / MPS</strong> in ALPS — two apps:<ul>' +
        '<li><code>dmrg</code> — DMRG ground state; requires <code>LATTICE="open chain lattice"</code></li>' +
        '<li><code>mps_optim</code> — MPS optimization (alternative ground state solver)</li>' +
        '</ul>' +
        'MODEL="spin" or "fermion Hubbard"; key params: <code>MAXSTATES</code> (bond dimension), <code>SWEEPS</code><br>' +
        'Requires open boundary conditions; use <code>LATTICE="open chain lattice"</code>.<br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/dmrg">DMRG documentation</a><br>' +
        '&#8594; <a href="{lang}/tutorials/dmrg">DMRG tutorials</a>'
    },
    {
      keywords: ['exact diagonalization', 'exact diag', 'ed method', 'full diagonalization',
                 'lanczos', 'hamiltonian matrix', 'small system diag', 'sparsediag', 'fulldiag'],
      response:
        '<strong>Exact Diagonalization</strong> in ALPS — two apps:<ul>' +
        '<li><code>sparsediag</code> — sparse (Lanczos) diagonalization; ground state and low-lying levels (ED-01 to ED-05)</li>' +
        '<li><code>fulldiag</code> — full diagonalization; thermodynamic quantities vs T (ED-06)</li>' +
        '</ul>' +
        'MODEL="spin" (or "fermion Hubbard" for small Hubbard clusters)<br>' +
        'Parameters: <code>L</code>, <code>J</code>, <code>local_S</code>, <code>CONSERVED_QUANTUMNUMBERS="Sz"</code><br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/ed">ED documentation</a><br>' +
        '&#8594; <a href="{lang}/tutorials/ed">ED tutorials</a>'
    },
    {
      keywords: ['qmc', 'quantum monte carlo', 'loop algorithm', 'loop qmc',
                 'dirloop', 'directed loop', 'stochastic series expansion', 'sse',
                 'path integral monte carlo', 'quantum spin qmc'],
      response:
        '<strong>Quantum MC</strong> in ALPS — MODEL="spin", two apps:<ul>' +
        '<li><code>loop</code> — loop algorithm; susceptibility, gaps, phase diagrams (MC-02, MC-08)</li>' +
        '<li><code>dirloop_sse</code> — directed loop SSE; use when magnetic field <code>h</code> is present (MC-03, MC-04)</li>' +
        '</ul>' +
        'Parameters: <code>J</code> (coupling), <code>local_S</code> (spin), <code>T</code> (temperature), optional <code>h</code> (field)<br>' +
        'Sign-problem-free for unfrustrated spin models.<br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/qmc">QMC documentation</a>'
    },
    {
      keywords: ['spinmc', 'spin mc', 'classical monte carlo', 'classical spin',
                 'ising monte carlo', 'metropolis', 'wolff', 'cluster algorithm'],
      response:
        '<strong>SpinMC</strong> — classical Monte Carlo; app: <code>spinmc</code><br>' +
        'MODEL: <code>"Ising"</code>, <code>"Heisenberg"</code>, or <code>"XY"</code><br>' +
        'Parameters: <code>J</code>, <code>T</code>, <code>h</code> (field), <code>UPDATE="cluster"</code><br><br>' +
        '&#8594; <a href="{lang}/documentation/methods/spinmc">SpinMC documentation</a>'
    },
    {
      keywords: ['qwl', 'quantum wang-landau', 'wang landau', 'wang-landau',
                 'density of states', 'flat histogram'],
      response:
        '<strong>QWL</strong> (Quantum Wang-Landau) computes the density of states directly, ' +
        'giving thermodynamic quantities at all temperatures in a single run.<br>' +
        'App: <code>qwl</code>, MODEL="spin"<br><br>' +
        '&#8594; <a href="{lang}/tutorials/mcs">MC tutorials (MC-06)</a>'
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
      keywords: ['hubbard model', 'fermion hubbard', 'fermi hubbard', 'electron hubbard',
                 'hubbard chain', 'hubbard lattice', '1d hubbard', 'on-site interaction',
                 'hopping t', 'hubbard u', 'mott insulator', 'strongly correlated electron',
                 'nup ndown', 'spinful hubbard', 'half filling'],
      response:
        '<strong>Hubbard model</strong> in ALPS — <code>MODEL="fermion Hubbard"</code><br><br>' +
        'H = &minus;t &Sigma; c<sup>&dagger;</sup>c + U &Sigma; n<sub>&uarr;</sub>n<sub>&darr;</sub> &minus; &mu; &Sigma; n<br><br>' +
        '<strong>ALPS parameters:</strong><ul>' +
        '<li><code>t</code> — hopping amplitude between neighboring sites</li>' +
        '<li><code>U</code> — on-site Coulomb repulsion</li>' +
        '<li><code>mu</code> — chemical potential (&mu; = 0 gives half filling)</li>' +
        '<li><code>Nup_total</code> — total number of spin-up electrons</li>' +
        '<li><code>Ndown_total</code> — total number of spin-down electrons</li>' +
        '<li><code>CONSERVED_QUANTUMNUMBERS="Nup,Ndown"</code></li>' +
        '</ul>' +
        '<strong>Recommended method:</strong> DMRG / MPS for 1D chains; ED (sparsediag) for tiny clusters<br>' +
        '<strong>Lattice:</strong> <code>open chain lattice</code> (required for DMRG), <code>chain lattice</code> (ED)<br><br>' +
        'Try: <em>"create Hubbard model input L=16 U=4 t=1"</em> or ' +
        '<em>"fermion Hubbard ED L=6 U=8"</em><br>' +
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
      keywords: ['transverse field ising', 'tfim', 'quantum ising', 'transverse ising',
                 'ising in transverse', 'ising transverse field', 'gamma field', 'transverse field'],
      response:
        '<strong>Transverse-Field Ising Model (TFIM)</strong> in ALPS — <code>MODEL="spin"</code><br><br>' +
        'H = &minus;J<sub>z</sub> &Sigma; S<sup>z</sup>S<sup>z</sup> &minus; &Gamma; &Sigma; S<sup>x</sup><br><br>' +
        '<strong>ALPS parameters:</strong><ul>' +
        '<li><code>Jxy=0</code> — no XY coupling (pure Ising)</li>' +
        '<li><code>Jz=-1</code> — ferromagnetic Ising coupling (negative = FM)</li>' +
        '<li><code>Gamma=0.5</code> — transverse field; critical point at &Gamma;/|J<sub>z</sub>|=1 (1D)</li>' +
        '<li><code>local_S=0.5</code> — always spin-1/2</li>' +
        '<li><strong>No</strong> <code>CONSERVED_QUANTUMNUMBERS</code> — &Gamma; breaks S<sup>z</sup> conservation</li>' +
        '<li><code>NUMBER_EIGENVALUES=5</code> — recommended for spectrum/criticality</li>' +
        '</ul>' +
        'App: <code>sparsediag</code> (ED for exact spectrum)<br>' +
        '1D critical point: &Gamma;<sub>c</sub> = |J<sub>z</sub>| (quantum phase transition, Ising CFT)<br><br>' +
        'Try: <em>"tfim input L=12 Jz=-1 Gamma=0.5"</em> or <em>"transverse Ising ED L=10"</em>'
    },
    {
      keywords: ['xy model', 'xy chain', 'xy lattice', 'jxy model', 'planar model',
                 'xx model', 'jxy jz', 'xxz model', 'anisotropic heisenberg',
                 'ising model', 'ising', 'classical ising', 'phase transition',
                 'ferromagnetic', 'z2 symmetry'],
      response:
        '<strong>XY model</strong> in ALPS — <code>MODEL="spin"</code><br><br>' +
        'H = &minus;J<sub>xy</sub> &Sigma; (S<sup>x</sup>S<sup>x</sup> + S<sup>y</sup>S<sup>y</sup>)<br><br>' +
        '<strong>ALPS parameters:</strong><ul>' +
        '<li><code>Jxy=1</code> — XY coupling (S&sup+;S&sup-; + h.c.)</li>' +
        '<li><code>Jz=0</code> — Ising (longitudinal) coupling; omit or set 0 for pure XY</li>' +
        '<li><code>CONSERVED_QUANTUMNUMBERS="Sz"</code> — XY coupling conserves total S<sup>z</sup></li>' +
        '</ul>' +
        '<strong>XXZ model</strong> (general): <code>Jxy&ne;0</code> and <code>Jz&ne;0</code><br>' +
        'Limits: Jxy=1,Jz=1 → Heisenberg; Jxy=1,Jz=0 → XY; Jxy=0,Jz=±1 → Ising<br><br>' +
        'App: <code>loop</code> (QMC) or <code>sparsediag</code> (ED)<br><br>' +
        'Try: <em>"xy model QMC chain L=60"</em> or <em>"xy model ED L=12"</em>'
    },
    {
      keywords: ['bose-hubbard', 'bose hubbard', 'bhm', 'bosonic model', 'superfluid mott',
                 'mott lobe', 'optical lattice', 'bose einstein condensate',
                 'soft core boson', 'soft-core boson', 'boson hubbard',
                 'nmax bosons', 'worm algorithm boson',
                 'hardcore boson', 'hard core boson', 'hard-core boson'],
      response:
        '<strong>Bose-Hubbard model</strong> in ALPS — two variants:<br><br>' +
        '<strong>&#9312; Soft-core bosons</strong> — <code>MODEL="boson Hubbard"</code><br>' +
        'H = &minus;t &Sigma; b<sup>&dagger;</sup>b + (U/2) &Sigma; n(n&minus;1) &minus; &mu; &Sigma; n<br>' +
        '<ul>' +
        '<li><code>t</code> — hopping amplitude</li>' +
        '<li><code>U</code> — on-site repulsion (U&gt;0 → repulsive)</li>' +
        '<li><code>mu</code> — chemical potential</li>' +
        '<li><code>Nmax</code> — max bosons per site (2–5 typical)</li>' +
        '<li><code>NONLOCAL=0</code> — required flag</li>' +
        '<li><code>V</code> — optional nearest-neighbor repulsion</li>' +
        '</ul>' +
        'App: <code>worm</code> (standard QMC) or <code>dwa</code> (directed worm algorithm)<br><br>' +
        '<strong>&#9313; Hard-core bosons</strong> — <code>MODEL="hardcore boson"</code><br>' +
        'Hopping-only Hamiltonian; occupancy is strictly 0 or 1 per site (no U parameter).<br>' +
        '<ul>' +
        '<li><code>t</code> — hopping amplitude</li>' +
        '<li><code>mu</code> — chemical potential</li>' +
        '<li><code>V</code> — optional NN repulsion</li>' +
        '</ul>' +
        'App: <code>worm</code> or <code>dwa</code><br><br>' +
        '<strong>Typical lattice:</strong> <code>square lattice</code> (2D superfluid&ndash;Mott), <code>chain lattice</code> (1D)<br>' +
        'Phase diagram: superfluid (large t/U) &#8596; Mott insulator (large U/t)<br><br>' +
        'Try: <em>"create Bose-Hubbard input L=4 W=4 U=1 t=0.05"</em> or ' +
        '<em>"hardcore boson input L=16"</em><br>' +
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
      keywords: ['available lattice', 'all lattice', 'which lattice', 'list of lattice',
                 'what lattice', 'supported lattice', '2d lattice', '3d lattice',
                 'triangular lattice', 'honeycomb', 'honeycomb lattice', 'kagome',
                 'simple cubic', 'cubic lattice', 'frustrated lattice', 'j1 j2 model',
                 'j1-j2', 'nnn chain', 'next nearest neighbor chain'],
      response:
        'ALPS supports the following lattice geometries in <code>LATTICE="..."</code>:<br><br>' +
        '<strong>1D lattices</strong><ul>' +
        '<li><code>chain lattice</code> — periodic, 1 parameter: L</li>' +
        '<li><code>open chain lattice</code> — open BCs; use for DMRG</li>' +
        '<li><code>nnn chain lattice</code> — adds next-nearest-neighbor (NNN) bonds; parameters J, J\'</li>' +
        '</ul>' +
        '<strong>2D lattices</strong><ul>' +
        '<li><code>square lattice</code> — periodic square grid; parameters L, W (default W=L), J</li>' +
        '<li><code>open square lattice</code> — open BCs in both directions</li>' +
        '<li><code>frustrated square lattice</code> — adds diagonal NNN bonds J\'; classic J1-J2 model</li>' +
        '<li><code>anisotropic square lattice</code> — J0 (x-bonds), J1 (y-bonds)</li>' +
        '<li><code>triangular lattice</code> — 6 neighbors; J; periodic; L, W</li>' +
        '<li><code>anisotropic triangular lattice</code> — J0, J1, J2 for 3 bond directions</li>' +
        '<li><code>honeycomb lattice</code> — 3 neighbors/site; bipartite; hexagonal rings</li>' +
        '<li><code>kagome lattice</code> — highly frustrated; corner-sharing triangles</li>' +
        '<li><code>ladder</code> — W-leg ladder; J0=legs, J1=rungs; periodic along legs</li>' +
        '<li><code>open ladder</code> — open BCs both directions; for DMRG</li>' +
        '<li><code>coupled ladders</code> — 2D stack of ladders; J0=legs, J1=rungs, J2=inter-ladder</li>' +
        '</ul>' +
        '<strong>3D lattices</strong><ul>' +
        '<li><code>simple cubic lattice</code> — 6 neighbors; parameters L, W, H; J</li>' +
        '</ul>' +
        'Try: <em>"create spinmc input square lattice L=16 W=16"</em>, ' +
        '<em>"qmc triangular lattice L=12 J=-1"</em>, or ' +
        '<em>"ed frustrated square lattice L=4"</em>.'
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
    loop:            ['loop algorithm', 'loop qmc', 'quantum spin mc', 'quantum monte carlo spin',
                      'looper', 'loop app'],
    dirloop:         ['dirloop_sse', 'dirloop', 'directed loop', 'quantum spin mc field',
                      'qmc with field', 'spin qmc magnetic field'],
    qwl:             ['qwl', 'quantum wang-landau', 'wang landau spin', 'wang-landau qmc'],
    qmc:             ['qmc'],
    dwa:             ['dwa', 'directed worm', 'bose-hubbard dwa', 'boson hubbard dwa',
                      'directed worm boson'],
    bhm:             ['boson hubbard', 'bose hubbard', 'bose-hubbard', 'bhm', 'bose hubbard model',
                      'boson qmc', 'bosonic qmc', 'worm boson', 'boson worm',
                      'hubbard qmc', 'qmc hubbard', 'hubbard worm', 'hubbard model qmc'],
    hardcore_boson:  ['hardcore boson', 'hard-core boson', 'hard core boson', 'hcb'],
    fermion_hubbard: ['fermion hubbard', 'fermi hubbard', 'electron hubbard', 'spinful hubbard',
                      'hubbard dmrg', 'hubbard ed', 'hubbard model ed', 'hubbard model dmrg',
                      'hubbard chain', '1d hubbard', 'one dimensional hubbard',
                      'fermion hubbard model', 'fermi hubbard model'],
    tfim:            ['transverse field ising', 'transverse ising', 'tfim',
                      'quantum ising model', 'ising transverse field', 'ising gamma'],
    xy_model:        ['xy model', 'xy chain', 'xy lattice', 'xy qmc',
                      'planar model', 'jxy model', 'xx model chain'],
    xy_ed:           ['xy ed', 'xy exact diag', 'xy sparsediag', 'xy model ed', 'xy ground state'],
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
    /* Pre-checks: catch cross-keyword combos before the single-word loop fires.
       "hubbard" + any QMC keyword → Bose-Hubbard worm (only sign-problem-free Hubbard QMC in ALPS).
       Must run before the generic 'qmc' keyword match. */
    if (/\bhubbard\b/i.test(q) && /\bqmc\b|\bworm\b|\bmonte\s*carlo\b/i.test(q) &&
        !/\bferm|\belectron\b|\bspinful\b/i.test(q)) return 'bhm';

    /* Check longer / more-specific keys first to avoid false partial matches.
       Boson models must be checked before fermion_hubbard. */
    var order = ['ladder_dmrg', 'ladder_ed', 'ladder_fulldiag', 'coupled_ladders', 'ladder',
                 'hardcore_boson', 'dwa', 'bhm',
                 'fermion_hubbard',
                 'tfim', 'xy_ed', 'xy_model',
                 'spinmc', 'dirloop', 'loop', 'qwl', 'qmc',
                 'ed', 'fulldiag', 'dmrg', 'mps', 'tebd', 'dmft'];
    for (var oi = 0; oi < order.length; oi++) {
      var m = order[oi];
      var kws = METHOD_MAP[m];
      for (var i = 0; i < kws.length; i++) {
        if (q.indexOf(kws[i]) !== -1) return m;
      }
    }
    /* fallback heuristics — order matters */
    if (/\bbeta\b|\bnmatsubara\b|\bimpurity\b|\bhybridization\b/i.test(q)) return 'dmft';
    if (/\btebd\b|\bquench\b|\breal.?time\b/i.test(q))                     return 'tebd';
    if (/\bdmrg\b|\bmaxstates\b/i.test(q))                                 return 'dmrg';
    /* Boson Hubbard: any "hubbard" + boson context → QMC via worm */
    if (/\bhubbard\b/i.test(q) && /\bbose\b|\bboson\b/i.test(q))           return 'bhm';
    /* Hubbard + QMC keyword: in ALPS, QMC for Hubbard means Bose-Hubbard */
    if (/\bhubbard\b/i.test(q) && /\bqmc\b|\bworm\b|\bloop\b/i.test(q))   return 'bhm';
    /* Explicit fermion/electron Hubbard → DMRG/ED */
    if (/\bhubbard\b/i.test(q) && /\bferm|\belectron\b|\bspinful\b/i.test(q)) return 'fermion_hubbard';
    /* Plain "hubbard" (no boson/QMC context) → fermion Hubbard */
    if (/\bhubbard\b/i.test(q))                                             return 'fermion_hubbard';
    /* Generic boson/bose → BHM */
    if (/\bboson\b|\bbose\b/i.test(q))                                      return 'bhm';
    /* ladder heuristics — check after other methods so "ladder dmrg" etc. already matched above */
    if (/\bladder\b/i.test(q) && /\bdmrg\b|\bmps\b/i.test(q))                      return 'ladder_dmrg';
    if (/\bladder\b/i.test(q) && /\b(?:exact\s*diag|sparsediag|\bed\b)/i.test(q)) return 'ladder_ed';
    if (/coupled\s+ladders?\b/i.test(q))                                            return 'coupled_ladders';
    if (/\bladder\b/i.test(q))                                                      return 'ladder';
    if (/\bdiagonal/i.test(q))                                                      return 'ed';
    /* TFIM: Gamma or transverse-field context with Ising */
    if (/\bGamma\b/i.test(q) || (/\btransverse\b/i.test(q) && /\bising\b/i.test(q))) return 'tfim';
    /* XY model: Jxy or xy + spin context */
    if (/\bJxy\b/i.test(q) || (/\bxy\b/i.test(q) && /\bmodel\b|\bchain\b|\blattice\b/i.test(q))) {
      return (/\bed\b|sparsediag|exact\s*diag/i.test(q)) ? 'xy_ed' : 'xy_model';
    }
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

    /* N_total (bosons) */
    if ((m = q.match(/N_total\s*=\s*(\d+)/i))                ||
        (m = q.match(/(\d+)\s*(?:particles?|bosons?)\b/i)))  p.N_total = +m[1];

    /* Nup_total / Ndown_total (fermion Hubbard) */
    if ((m = q.match(/Nup(?:_total)?\s*=\s*(\d+)/i))         ||
        (m = q.match(/spin.?up\s*[=:]\s*(\d+)/i)))           p.Nup_total = +m[1];
    if ((m = q.match(/Ndown(?:_total)?\s*=\s*(\d+)/i))       ||
        (m = q.match(/spin.?down\s*[=:]\s*(\d+)/i)))         p.Ndown_total = +m[1];

    /* V nearest-neighbor repulsion (bosons) */
    if ((m = q.match(/\bV\s*=\s*([\d.]+)/))                  ||
        (m = q.match(/nn\s+repulsion\s*[=:]\s*([\d.]+)/i)))  p.V = +m[1];

    /* Jxy / Jz (XY, XXZ, TFIM) */
    if ((m = q.match(/\bJxy\s*=\s*([-\d.]+)/i))              ||
        (m = q.match(/xy\s+coupling\s*[=:]\s*([-\d.]+)/i)))  p.Jxy = +m[1];
    if ((m = q.match(/\bJz\s*=\s*([-\d.]+)/i))               ||
        (m = q.match(/ising\s+coupling\s*[=:]\s*([-\d.]+)/i))) p.Jz = +m[1];

    /* Gamma (transverse field for TFIM) */
    if ((m = q.match(/\bGamma\s*=\s*([-\d.]+)/i))            ||
        (m = q.match(/transverse\s+field\s*[=:]\s*([-\d.]+)/i)) ||
        (m = q.match(/\b[Γ]\s*=\s*([-\d.]+)/)))              p.Gamma = +m[1];

    /* T_MIN / T_MAX / DELTA_T (fulldiag) */
    if ((m = q.match(/T_MIN\s*=\s*([\d.]+)/i))               ||
        (m = q.match(/min\s+temp\w*\s*[=:]\s*([\d.]+)/i)))   p.T_MIN = +m[1];
    if ((m = q.match(/T_MAX\s*=\s*([\d.]+)/i))               ||
        (m = q.match(/max\s+temp\w*\s*[=:]\s*([\d.]+)/i)))   p.T_MAX = +m[1];
    if ((m = q.match(/DELTA_T\s*=\s*([\d.]+)/i)))             p.DELTA_T = +m[1];

    /* Lattice — check most-specific first */
    if      (/nnn\s+open\s+chain|nnn\s+obc/i.test(q))            p.LATTICE = 'nnn open chain lattice';
    else if (/nnn\s+chain|next.?nearest.*chain/i.test(q))         p.LATTICE = 'nnn chain lattice';
    else if (/open\s+chain|obc\b/i.test(q))                       p.LATTICE = 'open chain lattice';
    else if (/\bchain\b/i.test(q) && !/ladder/i.test(q))          p.LATTICE = 'chain lattice';
    if      (/frustrated\s+square|j1.?j2\s+square|nnn\s+square/i.test(q))  p.LATTICE = 'frustrated square lattice';
    else if (/anisotropic\s+square/i.test(q))                      p.LATTICE = 'anisotropic square lattice';
    else if (/open\s+square/i.test(q))                             p.LATTICE = 'open square lattice';
    else if (/\bsquare\b/i.test(q))                                p.LATTICE = 'square lattice';
    if      (/simple\s+cubic|cubic\s+lattice|\bsc\s+lattice/i.test(q)) p.LATTICE = 'simple cubic lattice';
    else if (/\bcubic\b/i.test(q))                                 p.LATTICE = 'simple cubic lattice';
    if      (/\bkagome\b/i.test(q))                                p.LATTICE = 'kagome lattice';
    if      (/anisotropic\s+trian/i.test(q))                       p.LATTICE = 'anisotropic triangular lattice';
    else if (/\btriangular\b/i.test(q))                            p.LATTICE = 'triangular lattice';
    if      (/\bhoneycomb\b/i.test(q))                             p.LATTICE = 'honeycomb lattice';
    /* Ladder lattices — most specific first */
    if      (/coupled\s+ladders?\b/i.test(q))       p.LATTICE = 'coupled ladders';
    else if (/open\s+ladder\b/i.test(q))            p.LATTICE = 'open ladder';
    else if (/\bladder\b/i.test(q))                 p.LATTICE = 'ladder';
    /* Height H for 3D lattices */
    if ((m = q.match(/\bH\s*=\s*(\d+)/i))          ||
        (m = q.match(/height\s*[=:]\s*(\d+)/i)))   p.H = +m[1];

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
          'o --J-- o --J-- o --J-- o\n' +
          '|       |       |       |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '|       |       |       |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '|       |       |       |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '\n' +
          'J  = NN coupling (horizontal \'--J--\' and vertical \'|\' bonds)\n' +
          'Periodic BCs in both directions  (4×4 shown)\n' +
          'L  = sites along x,   W = sites along y  (default W = L)',
          'Lattice: square lattice (4×4 shown)'
        );

      case 'open square lattice':
        return diagramBlock(
          'o --J-- o --J-- o --J-- o\n' +
          '|       |       |       |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '|       |       |       |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '|       |       |       |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '\n' +
          'J  = NN coupling  (all bonds)\n' +
          'Open BCs in both directions  (4×4 shown)\n' +
          'L  = sites along x,   W = sites along y',
          'Lattice: open square lattice (4×4 shown)'
        );

      case 'triangular lattice':
        return diagramBlock(
          'o -J- o -J- o -J- o\n' +
          '|  \\  |  \\  |  \\  |\n' +
          '|  J\\ |  J\\ |  J\\ |\n' +
          'o -J- o -J- o -J- o\n' +
          '|  \\  |  \\  |  \\  |\n' +
          '|  J\\ |  J\\ |  J\\ |\n' +
          'o -J- o -J- o -J- o\n' +
          '\n' +
          'J  = NN coupling  (6 neighbors per site)\n' +
          'Bond directions: horizontal (J), vertical (J), diagonal (J)\n' +
          'Periodic BCs in both directions\n' +
          'L  = sites along x,   W = sites along y',
          'Lattice: triangular lattice'
        );

      case 'honeycomb lattice':
        return diagramBlock(
          'o - o       o - o\n' +
          '    |           |\n' +
          '    o - o   o - o\n' +
          '    |           |\n' +
          'o - o       o - o\n' +
          '    |           |\n' +
          '    o - o   o - o\n' +
          '\n' +
          'J  = NN coupling  (3 neighbors per site)\n' +
          'Bipartite lattice; sites form hexagonal rings\n' +
          'Periodic BCs in both directions',
          'Lattice: honeycomb lattice'
        );

      case 'simple cubic lattice':
        return diagramBlock(
          '      o ---J--- o ---J--- o\n' +
          '     /|        /|        /|\n' +
          '    J |       J |       J |\n' +
          '   /  J      /  J      /  J\n' +
          '  o ---J--- o ---J--- o   |\n' +
          '  |   o     |   o     |   o\n' +
          '  |  /      |  /      |  /\n' +
          '  | J       | J       | J\n' +
          '  |/        |/        |/\n' +
          '  o ---J--- o ---J--- o\n' +
          '\n' +
          'J  = NN coupling  (6 neighbors: ±x, ±y, ±z)\n' +
          'Periodic BCs in all three directions\n' +
          'L = sites along x,  W = along y  (default W=L),  H = along z  (default H=W)',
          'Lattice: simple cubic lattice (3×3×2 shown)'
        );

      case 'frustrated square lattice':
        return diagramBlock(
          'o --J-- o --J-- o --J-- o\n' +
          '|\\ J\'  |\\ J\'  |\\ J\'  |\n' +
          'J  \\   J  \\   J  \\   J\n' +
          '|   \\  |   \\  |   \\  |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '|\\ J\'  |\\ J\'  |\\ J\'  |\n' +
          'J  \\   J  \\   J  \\   J\n' +
          '|   \\  |   \\  |   \\  |\n' +
          'o --J-- o --J-- o --J-- o\n' +
          '\n' +
          'J  = NN coupling  (nearest-neighbor bonds, horizontal and vertical)\n' +
          'J\' = NNN coupling (next-nearest-neighbor diagonal bonds, frustrating)\n' +
          'Periodic BCs in both directions  (4×3 shown)\n' +
          'Use J\'≈0.5J for maximum frustration (classical Lissajous point)',
          'Lattice: frustrated square lattice (J1-J2 model)'
        );

      case 'nnn chain lattice':
        return diagramBlock(
          'o --J-- o --J-- o --J-- o --J-- o\n' +
          ' \\  J\'  / \\  J\'  / \\  J\'  / \\\n' +
          '  o --J-- o --J-- o --J-- o\n' +
          '\n' +
          'J  = NN coupling  (nearest-neighbor, bond type 0)\n' +
          'J\' = NNN coupling (next-nearest-neighbor, bond type 1)\n' +
          'Periodic BCs along the chain',
          'Lattice: nnn chain lattice'
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

  var _2D_LATTICES = ['square lattice', 'open square lattice', 'anisotropic square lattice',
                       'frustrated square lattice', 'triangular lattice',
                       'anisotropic triangular lattice', 'honeycomb lattice', 'kagome lattice'];
  var _3D_LATTICES = ['simple cubic lattice'];

  function genSpinMC(p) {
    var lattice = p.LATTICE || 'square lattice';
    var L       = p.L       || 8;
    var is2D    = _2D_LATTICES.indexOf(lattice) !== -1;
    var is3D    = _3D_LATTICES.indexOf(lattice) !== -1;
    var W       = (is2D || is3D) ? (p.W || L) : undefined;
    var H       = is3D ? (p.H || (W || L)) : undefined;
    var model   = p.spinMCmodel || 'Ising';
    var J       = (p.J   !== undefined) ? p.J   : 1;
    var therm   = p.THERMALIZATION || 1000;
    var sweeps  = p.SWEEPS || 50000;
    var temps   = p.T !== undefined ? [p.T] : [1.5, 2.0, 2.5];

    var parmLines = ['LATTICE="' + lattice + '"', 'L=' + L];
    if (W !== undefined) parmLines.push('W=' + W);
    if (H !== undefined) parmLines.push('H=' + H);
    parmLines.push('MODEL="' + model + '"', 'J=' + J,
                   'THERMALIZATION=' + therm, 'SWEEPS=' + sweeps, 'UPDATE="cluster"');
    temps.forEach(function(t) { parmLines.push('{T=' + t + ';}'); });
    var parm = parmLines.join('\n');

    var tempStr = temps.length === 1 ? '[' + temps[0] + ']' : '[' + temps.join(', ') + ']';
    var pyDict = [
      '        \'LATTICE\'        : "' + lattice + '",',
      '        \'L\'              : ' + L + ','
    ];
    if (W !== undefined) pyDict.push('        \'W\'              : ' + W + ',');
    if (H !== undefined) pyDict.push('        \'H\'              : ' + H + ',');
    pyDict = pyDict.concat([
      '        \'MODEL\'          : "' + model + '",',
      '        \'J\'              : ' + J + ',',
      '        \'THERMALIZATION\' : ' + therm + ',',
      '        \'SWEEPS\'         : ' + sweeps + ',',
      '        \'UPDATE\'         : "cluster",',
      '        \'T\'              : t'
    ]);
    var py = [
      'import pyalps', '',
      'parms = []',
      'for t in ' + tempStr + ':',
      '    parms.append({'
    ].concat(pyDict).concat([
      '    })', '',
      'input_file = pyalps.writeInputFiles(\'parm_spinmc\', parms)',
      'res = pyalps.runApplication(\'spinmc\', input_file)',
      'print("Done. Results in:", pyalps.getResultFiles(prefix=\'parm_spinmc\'))'
    ]).join('\n');

    var sizeStr = W !== undefined ? 'L=' + L + '×W=' + W : 'L=' + L;
    return '<strong>SpinMC input</strong> — ' + model + ', ' + lattice + ', ' + sizeStr + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>spinmc</code></small>';
  }

  function genQMC(p) {
    var lattice  = p.LATTICE || 'chain lattice';
    var L        = p.L       || 16;
    var is2D     = _2D_LATTICES.indexOf(lattice) !== -1;
    var is3D     = _3D_LATTICES.indexOf(lattice) !== -1;
    var W        = (is2D || is3D) ? (p.W || L) : undefined;
    var local_S  = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J        = (p.J    !== undefined) ? p.J    : 1;
    var therm    = p.THERMALIZATION || 5000;
    var sweeps   = p.SWEEPS || 100000;
    var temps    = p.T !== undefined ? [p.T] : [0.5, 1.0, 2.0];
    var tempStr  = temps.length === 1 ? '[' + temps[0] + ']' : '[' + temps.join(', ') + ']';

    var parmLines = ['LATTICE="' + lattice + '"', 'L=' + L];
    if (W !== undefined) parmLines.push('W=' + W);
    parmLines.push('MODEL="spin"', 'local_S=' + local_S, 'J=' + J,
                   'THERMALIZATION=' + therm, 'SWEEPS=' + sweeps);
    temps.forEach(function(t) { parmLines.push('{T=' + t + ';}'); });
    var parm = parmLines.join('\n');

    var pyDict = [
      '        \'LATTICE\'        : "' + lattice + '",',
      '        \'L\'              : ' + L + ','
    ];
    if (W !== undefined) pyDict.push('        \'W\'              : ' + W + ',');
    pyDict = pyDict.concat([
      '        \'MODEL\'          : "spin",',
      '        \'local_S\'        : ' + local_S + ',',
      '        \'J\'              : ' + J + ',',
      '        \'THERMALIZATION\' : ' + therm + ',',
      '        \'SWEEPS\'         : ' + sweeps + ',',
      '        \'T\'              : t'
    ]);
    var py = [
      'import pyalps', '',
      'parms = []',
      'for t in ' + tempStr + ':',
      '    parms.append({'
    ].concat(pyDict).concat([
      '    })', '',
      'input_file = pyalps.writeInputFiles(\'parm_qmc\', parms)',
      /* use dirloop_sse when magnetic field is present, loop otherwise */
      'res = pyalps.runApplication(\'' + (p.h !== undefined ? 'dirloop_sse' : 'loop') + '\', input_file)'
    ]).join('\n');

    var app = p.h !== undefined ? 'dirloop_sse' : 'loop';
    var sizeStr = W !== undefined ? 'L=' + L + '×W=' + W : 'L=' + L;
    return '<strong>QMC input</strong> — spin-' + local_S + ', ' + lattice + ', ' + sizeStr + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>' + app + '</code>' +
      (p.h !== undefined
        ? ' — <code>dirloop_sse</code> (directed loop SSE, recommended when field h is present)'
        : ' — <code>loop</code> (loop algorithm); use <code>dirloop_sse</code> if applying a magnetic field h') +
      '</small>';
  }

  function genBHM(p, algo) {
    algo = algo || 'worm';
    var lattice = p.LATTICE || 'square lattice';
    var L       = p.L      || 4;
    var is2D    = _2D_LATTICES.indexOf(lattice) !== -1;
    var is3D    = _3D_LATTICES.indexOf(lattice) !== -1;
    var W       = (is2D || is3D) ? (p.W || L) : undefined;
    /* J is the spin-model coupling — for Bose-Hubbard remap to U if U not given */
    var U       = (p.U    !== undefined) ? p.U    :
                  (p.J    !== undefined) ? p.J    : 1.0;
    var mu      = (p.mu   !== undefined) ? p.mu   : 0.5;
    var t_hop   = (p.t_hop!== undefined) ? p.t_hop: 0.05;
    var Nmax    = p.Nmax   || 2;
    var T       = (p.T    !== undefined) ? p.T    : 0.1;
    var therm   = p.THERMALIZATION || 10000;
    var sweeps  = p.SWEEPS || 500000;

    var parmLines = ['LATTICE="' + lattice + '"', 'L=' + L];
    if (W !== undefined) parmLines.push('W=' + W);
    parmLines = parmLines.concat([
      '', 'MODEL="boson Hubbard"', 'NONLOCAL=0',
      'U=' + U, 'mu=' + mu, 'Nmax=' + Nmax,
      '', 'T=' + T, 'SWEEPS=' + sweeps, 'THERMALIZATION=' + therm,
      '', '{t=' + t_hop + ';}'
    ]);
    var parm = parmLines.join('\n');

    var pyDict = [
      '    \'LATTICE\'        : "' + lattice + '",',
      '    \'L\'              : ' + L + ','
    ];
    if (W !== undefined) pyDict.push('    \'W\'              : ' + W + ',');
    pyDict = pyDict.concat([
      '    \'MODEL\'          : "boson Hubbard",',
      '    \'NONLOCAL\'       : 0,',
      '    \'U\'              : ' + U + ',',
      '    \'mu\'             : ' + mu + ',',
      '    \'Nmax\'           : ' + Nmax + ',',
      '    \'T\'              : ' + T + ',',
      '    \'THERMALIZATION\' : ' + therm + ',',
      '    \'SWEEPS\'         : ' + sweeps + ',',
      '    \'t\'              : ' + t_hop
    ]);
    var py = ['import pyalps', '', 'parms = [{']
      .concat(pyDict)
      .concat(['}]', '',
        'input_file = pyalps.writeInputFiles(\'parm_bhm\', parms)',
        'res = pyalps.runApplication(\'' + algo + '\', input_file)'
      ]).join('\n');

    var sizeStr = W !== undefined ? 'L=' + L + '×W=' + W : 'L=' + L;
    return '<strong>Bose-Hubbard QMC input</strong> — ' + lattice + ', ' + sizeStr + ', U=' + U + ', t=' + t_hop + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>' + algo + '</code> — use <code>worm</code> (standard) or <code>dwa</code> (directed worm algorithm)</small>';
  }

  function genHardcoreBoson(p, algo) {
    algo = algo || 'worm';
    var lattice = p.LATTICE || 'chain lattice';
    var L       = p.L      || 16;
    var is2D    = _2D_LATTICES.indexOf(lattice) !== -1;
    var W       = is2D ? (p.W || L) : undefined;
    var mu      = (p.mu   !== undefined) ? p.mu   : 0;
    var t_hop   = (p.t_hop!== undefined) ? p.t_hop: 1.0;
    var V       = (p.V    !== undefined) ? p.V    : undefined;
    var T       = (p.T    !== undefined) ? p.T    : 0.1;
    var therm   = p.THERMALIZATION || 10000;
    var sweeps  = p.SWEEPS || 200000;

    var parmLines = ['LATTICE="' + lattice + '"', 'L=' + L];
    if (W !== undefined) parmLines.push('W=' + W);
    parmLines = parmLines.concat(['', 'MODEL="hardcore boson"',
      't=' + t_hop, 'mu=' + mu]);
    if (V !== undefined) parmLines.push('V=' + V);
    parmLines = parmLines.concat(['', 'T=' + T, 'SWEEPS=' + sweeps,
      'THERMALIZATION=' + therm, '', '{t=' + t_hop + ';}']);
    var parm = parmLines.join('\n');

    var pyDict = ['    \'LATTICE\'        : "' + lattice + '",', '    \'L\'              : ' + L + ','];
    if (W !== undefined) pyDict.push('    \'W\'              : ' + W + ',');
    pyDict = pyDict.concat([
      '    \'MODEL\'          : "hardcore boson",',
      '    \'t\'              : ' + t_hop + ',',
      '    \'mu\'             : ' + mu + ','
    ]);
    if (V !== undefined) pyDict.push('    \'V\'              : ' + V + ',');
    pyDict = pyDict.concat([
      '    \'T\'              : ' + T + ',',
      '    \'THERMALIZATION\' : ' + therm + ',',
      '    \'SWEEPS\'         : ' + sweeps
    ]);
    var py = ['import pyalps', '', 'parms = [{']
      .concat(pyDict)
      .concat(['}]', '',
        'input_file = pyalps.writeInputFiles(\'parm_hcb\', parms)',
        'res = pyalps.runApplication(\'' + algo + '\', input_file)'
      ]).join('\n');

    var sizeStr = W !== undefined ? 'L=' + L + '×W=' + W : 'L=' + L;
    return '<strong>Hardcore Boson QMC input</strong> — ' + lattice + ', ' + sizeStr + ', t=' + t_hop + (V !== undefined ? ', V=' + V : '') + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>' + algo + '</code>. Max occupancy = 1 per site (no U needed).</small>';
  }

  function genFermionHubbard(p) {
    var lattice  = p.LATTICE || 'open chain lattice';
    var L        = p.L       || 8;
    var t_hop    = (p.t_hop  !== undefined) ? p.t_hop  : 1.0;
    /* J is the spin-model coupling — for Hubbard, remap to U if U not given */
    var U        = (p.U      !== undefined) ? p.U      :
                   (p.J      !== undefined) ? p.J      : 4.0;
    var mu       = (p.mu     !== undefined) ? p.mu     : 0;
    var Nup      = (p.Nup_total !== undefined) ? p.Nup_total : Math.floor(L / 2);
    var Ndown    = (p.Ndown_total !== undefined) ? p.Ndown_total : Math.floor(L / 2);
    var MAXSTATES= p.MAXSTATES || 100;
    var SWEEPS   = p.SWEEPS   || 4;
    var NEIGEN   = p.NUMBER_EIGENVALUES || 1;
    /* Use DMRG for open chain, sparsediag for small chain */
    var useDMRG  = /open/i.test(lattice) || L > 8;
    var app      = useDMRG ? 'dmrg' : 'sparsediag';

    var parm;
    if (useDMRG) {
      parm = [
        'MODEL="fermion Hubbard"',
        'LATTICE="' + lattice + '"',
        'L=' + L,
        't=' + t_hop,
        'U=' + U,
        'mu=' + mu,
        'CONSERVED_QUANTUMNUMBERS="Nup,Ndown"',
        'Nup_total=' + Nup,
        'Ndown_total=' + Ndown,
        'SWEEPS=' + SWEEPS,
        'NUMBER_EIGENVALUES=' + NEIGEN,
        '{MAXSTATES=' + MAXSTATES + '}'
      ].join('\n');
    } else {
      parm = [
        'MODEL="fermion Hubbard"',
        'LATTICE="' + lattice + '"',
        'L=' + L,
        't=' + t_hop,
        'U=' + U,
        'mu=' + mu,
        'CONSERVED_QUANTUMNUMBERS="Nup,Ndown"',
        'MEASURE_CORRELATIONS[density-density]=n',
        '{Nup_total=' + Nup + '; Ndown_total=' + Ndown + ';}'
      ].join('\n');
    }

    var pyLines;
    if (useDMRG) {
      pyLines = [
        'import pyalps', '',
        'parms = [{',
        '    \'LATTICE\'                  : "' + lattice + '",',
        '    \'MODEL\'                    : "fermion Hubbard",',
        '    \'L\'                        : ' + L + ',',
        '    \'t\'                        : ' + t_hop + ',',
        '    \'U\'                        : ' + U + ',',
        '    \'mu\'                       : ' + mu + ',',
        '    \'CONSERVED_QUANTUMNUMBERS\' : \'Nup,Ndown\',',
        '    \'Nup_total\'                : ' + Nup + ',',
        '    \'Ndown_total\'              : ' + Ndown + ',',
        '    \'SWEEPS\'                   : ' + SWEEPS + ',',
        '    \'NUMBER_EIGENVALUES\'       : ' + NEIGEN + ',',
        '    \'MAXSTATES\'               : ' + MAXSTATES,
        '}]', '',
        'input_file = pyalps.writeInputFiles(\'parm_hubbard\', parms)',
        'res = pyalps.runApplication(\'dmrg\', input_file, writexml=True)',
        'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_hubbard\'))',
        'for s in data[0]:',
        '    print(s.props[\'observable\'], \':\', s.y[0])'
      ];
    } else {
      pyLines = [
        'import pyalps', '',
        'parms = [{',
        '    \'LATTICE\'                  : "' + lattice + '",',
        '    \'MODEL\'                    : "fermion Hubbard",',
        '    \'L\'                        : ' + L + ',',
        '    \'t\'                        : ' + t_hop + ',',
        '    \'U\'                        : ' + U + ',',
        '    \'mu\'                       : ' + mu + ',',
        '    \'CONSERVED_QUANTUMNUMBERS\' : \'Nup,Ndown\',',
        '    \'Nup_total\'                : ' + Nup + ',',
        '    \'Ndown_total\'              : ' + Ndown + ',',
        '    \'MEASURE_CORRELATIONS[density-density]\' : \'n\'',
        '}]', '',
        'input_file = pyalps.writeInputFiles(\'parm_hubbard\', parms)',
        'res = pyalps.runApplication(\'sparsediag\', input_file)',
        'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_hubbard\'))'
      ];
    }

    return '<strong>Fermion Hubbard input</strong> — ' + lattice + ', L=' + L +
      ', t=' + t_hop + ', U=' + U + ', Nup=' + Nup + ', Ndown=' + Ndown + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(pyLines.join('\n'), 'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>' + app + '</code>' +
      (useDMRG ? ' — DMRG for 1D Hubbard chains; use <code>open chain lattice</code> for DMRG'
               : ' — sparsediag (ED) for small clusters') +
      '</small>';
  }

  /* ---- Transverse-Field Ising Model (TFIM) — sparsediag ED ---- */
  function genTFIM(p) {
    var lattice = p.LATTICE || 'chain lattice';
    var L       = p.L       || 12;
    var Jz      = (p.Jz    !== undefined) ? p.Jz    : -1;   /* ferromagnetic Ising */
    var Gamma   = (p.Gamma !== undefined) ? p.Gamma : 0.5;  /* transverse field */
    var NEIGEN  = p.NUMBER_EIGENVALUES || 5;

    /* TFIM: Jxy=0, Jz≠0, Gamma≠0. Sz is NOT conserved → no CONSERVED_QUANTUMNUMBERS. */
    var parm = [
      'MODEL="spin"',
      'LATTICE="' + lattice + '"',
      'local_S=0.5',
      'Jxy=0',
      'Jz=' + Jz,
      'Gamma=' + Gamma,
      'NUMBER_EIGENVALUES=' + NEIGEN,
      '{L=' + L + ';}'
    ].join('\n');

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'            : "' + lattice + '",',
      '    \'MODEL\'              : "spin",',
      '    \'local_S\'            : 0.5,',
      '    \'Jxy\'                : 0,',
      '    \'Jz\'                 : ' + Jz + ',',
      '    \'Gamma\'              : ' + Gamma + ',',
      '    \'NUMBER_EIGENVALUES\' : ' + NEIGEN + ',',
      '    \'L\'                  : ' + L,
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_tfim\', parms)',
      'res = pyalps.runApplication(\'sparsediag\', input_file)',
      'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_tfim\'))',
      'for sector in data[0]:',
      '    for s in sector:',
      '        print(s.props[\'observable\'], \':\', s.y[0])'
    ].join('\n');

    return '<strong>TFIM input</strong> — ' + lattice + ', L=' + L +
      ', Jz=' + Jz + ', &Gamma;=' + Gamma + '<br>' +
      '<em>H = &minus;J<sub>z</sub> &Sigma; S<sup>z</sup>S<sup>z</sup> &minus; &Gamma; &Sigma; S<sup>x</sup>;' +
      ' critical point: &Gamma;<sub>c</sub> = |J<sub>z</sub>| = ' + Math.abs(Jz) + '</em><br>' +
      '<em>Note: no <code>CONSERVED_QUANTUMNUMBERS</code> — &Gamma; breaks S<sup>z</sup> conservation.</em><br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>sparsediag</code> — ' + NEIGEN + ' lowest eigenvalues; ' +
      'adjust Gamma to scan the quantum phase transition</small>';
  }

  /* ---- XY model ---- */
  function genXY(p, useQMC) {
    if (useQMC === undefined) useQMC = true;
    var lattice  = p.LATTICE || 'chain lattice';
    var L        = p.L       || 16;
    var is2D     = _2D_LATTICES.indexOf(lattice) !== -1;
    var is3D     = _3D_LATTICES.indexOf(lattice) !== -1;
    var W        = (is2D || is3D) ? (p.W || L) : undefined;
    var Jxy      = (p.Jxy !== undefined) ? p.Jxy : 1;
    var Jz       = (p.Jz  !== undefined) ? p.Jz  : 0;       /* 0 = pure XY */
    var local_S  = (p.local_S !== undefined) ? p.local_S : 0.5;
    var Sz_total = (p.Sz_total !== undefined) ? p.Sz_total : 0;

    if (useQMC) {
      /* QMC path — loop algorithm */
      var therm  = p.THERMALIZATION || 5000;
      var sweeps = p.SWEEPS || 50000;
      var temps  = p.T !== undefined ? [p.T] : [0.5, 1.0, 2.0];
      var tempStr = temps.length === 1 ? '[' + temps[0] + ']' : '[' + temps.join(', ') + ']';

      var parmLines = ['LATTICE="' + lattice + '"', 'L=' + L];
      if (W !== undefined) parmLines.push('W=' + W);
      parmLines = parmLines.concat([
        'MODEL="spin"', 'local_S=' + local_S,
        'Jxy=' + Jxy,
        (Jz !== 0 ? 'Jz=' + Jz : '# Jz=0  (pure XY — omit or set 0)'),
        'CONSERVED_QUANTUMNUMBERS="Sz"',
        'THERMALIZATION=' + therm, 'SWEEPS=' + sweeps
      ]);
      temps.forEach(function(t) { parmLines.push('{T=' + t + ';}'); });
      var parm = parmLines.join('\n');

      var pyDict = ['    \'LATTICE\'        : "' + lattice + '",', '    \'L\'              : ' + L + ','];
      if (W !== undefined) pyDict.push('    \'W\'              : ' + W + ',');
      pyDict = pyDict.concat([
        '    \'MODEL\'          : "spin",',
        '    \'local_S\'        : ' + local_S + ',',
        '    \'Jxy\'            : ' + Jxy + ','
      ]);
      if (Jz !== 0) pyDict.push('    \'Jz\'             : ' + Jz + ',');
      pyDict = pyDict.concat([
        '    \'CONSERVED_QUANTUMNUMBERS\' : \'Sz\',',
        '    \'THERMALIZATION\' : ' + therm + ',',
        '    \'SWEEPS\'         : ' + sweeps + ',',
        '    \'T\'              : t'
      ]);
      var py = [
        'import pyalps', '',
        'parms = []',
        'for t in ' + tempStr + ':',
        '    parms.append({'
      ].concat(pyDict).concat([
        '    })', '',
        'input_file = pyalps.writeInputFiles(\'parm_xy\', parms)',
        'res = pyalps.runApplication(\'loop\', input_file)'
      ]).join('\n');

      var sizeStr = W !== undefined ? 'L=' + L + '×W=' + W : 'L=' + L;
      return '<strong>XY model QMC input</strong> — ' + lattice + ', ' + sizeStr +
        ', Jxy=' + Jxy + (Jz !== 0 ? ', Jz=' + Jz + ' (XXZ)' : ' (pure XY)') + '<br>' +
        '<em>H = &minus;J<sub>xy</sub> &Sigma; (S<sup>x</sup>S<sup>x</sup>+S<sup>y</sup>S<sup>y</sup>)' +
        (Jz !== 0 ? ' &minus; J<sub>z</sub> &Sigma; S<sup>z</sup>S<sup>z</sup>' : '') + '</em><br>' +
        latticeDiagram(lattice) +
        codeBlock(py,   'Python (pyalps)') +
        codeBlock(parm, 'Parameter file') +
        '<small>App: <code>loop</code>; XY model conserves S<sup>z</sup> — use <code>CONSERVED_QUANTUMNUMBERS="Sz"</code></small>';
    } else {
      /* ED path — sparsediag */
      var parmED = [
        'MODEL="spin"',
        'LATTICE="' + lattice + '"',
        'local_S=' + local_S,
        'Jxy=' + Jxy
      ];
      if (Jz !== 0) parmED.push('Jz=' + Jz);
      parmED = parmED.concat([
        'CONSERVED_QUANTUMNUMBERS="Sz"',
        'Sz_total=' + Sz_total,
        'NUMBER_EIGENVALUES=' + (p.NUMBER_EIGENVALUES || 1),
        'MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz',
        'MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"',
        '{L=' + L + ';}'
      ]);
      var pyED = [
        'import pyalps', '',
        'parms = [{',
        '    \'LATTICE\'                  : "' + lattice + '",',
        '    \'MODEL\'                    : "spin",',
        '    \'local_S\'                  : ' + local_S + ',',
        '    \'Jxy\'                      : ' + Jxy + ','
      ];
      if (Jz !== 0) pyED.push('    \'Jz\'                       : ' + Jz + ',');
      pyED = pyED.concat([
        '    \'L\'                        : ' + L + ',',
        '    \'CONSERVED_QUANTUMNUMBERS\' : \'Sz\',',
        '    \'Sz_total\'                 : ' + Sz_total + ',',
        '    \'MEASURE_CORRELATIONS[Diagonal spin correlations]\'    : \'Sz\',',
        '    \'MEASURE_CORRELATIONS[Offdiagonal spin correlations]\' : \'Splus:Sminus\'',
        '}]', '',
        'input_file = pyalps.writeInputFiles(\'parm_xy_ed\', parms)',
        'res = pyalps.runApplication(\'sparsediag\', input_file)',
        'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_xy_ed\'))'
      ]);
      return '<strong>XY model ED input</strong> — ' + lattice + ', L=' + L +
        ', Jxy=' + Jxy + (Jz !== 0 ? ', Jz=' + Jz + ' (XXZ)' : ' (pure XY)') + '<br>' +
        latticeDiagram(lattice) +
        codeBlock(pyED.join('\n'), 'Python (pyalps)') +
        codeBlock(parmED.join('\n'), 'Parameter file') +
        '<small>App: <code>sparsediag</code>; for QMC use <em>"xy model qmc"</em></small>';
    }
  }

  function genED(p) {
    var lattice  = p.LATTICE || 'chain lattice';
    var L        = p.L       || 8;
    var local_S  = (p.local_S  !== undefined) ? p.local_S  : 0.5;
    var J        = (p.J        !== undefined) ? p.J        : 1;
    var Sz_total = (p.Sz_total !== undefined) ? p.Sz_total : 0;
    var NEIGEN   = p.NUMBER_EIGENVALUES || 1;
    var J1       = p.J1;  /* NNN coupling (ed-05) or anisotropic bond */

    var parmLines = [
      'MODEL="spin"',
      'LATTICE="' + lattice + '"',
      'local_S=' + local_S,
      'J=' + J
    ];
    if (J1 !== undefined) parmLines.push('J1=' + J1);
    parmLines = parmLines.concat([
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'Sz_total=' + Sz_total
    ]);
    if (NEIGEN > 1) parmLines.push('NUMBER_EIGENVALUES=' + NEIGEN);
    parmLines = parmLines.concat([
      'MEASURE_STRUCTURE_FACTOR[Structure Factor S]=Sz',
      'MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz',
      'MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"',
      '{L=' + L + ';}'
    ]);
    var parm = parmLines.join('\n');

    var pyDict = [
      '    \'LATTICE\'                                                   : "' + lattice + '",',
      '    \'MODEL\'                                                    : "spin",',
      '    \'local_S\'                                                  : ' + local_S + ','
    ];
    if (J1 !== undefined) {
      pyDict.push('    \'J\'                                                        : ' + J + ',');
      pyDict.push('    \'J1\'                                                       : ' + J1 + ',');
    } else {
      pyDict.push('    \'J\'                                                        : ' + J + ',');
    }
    pyDict = pyDict.concat([
      '    \'L\'                                                        : ' + L + ',',
      '    \'CONSERVED_QUANTUMNUMBERS\'                                 : \'Sz\',',
      '    \'Sz_total\'                                                 : ' + Sz_total + ','
    ]);
    if (NEIGEN > 1) pyDict.push('    \'NUMBER_EIGENVALUES\'                                        : ' + NEIGEN + ',');
    pyDict = pyDict.concat([
      '    \'MEASURE_STRUCTURE_FACTOR[Structure Factor S]\'             : \'Sz\',',
      '    \'MEASURE_CORRELATIONS[Diagonal spin correlations]\'        : \'Sz\',',
      '    \'MEASURE_CORRELATIONS[Offdiagonal spin correlations]\'     : \'Splus:Sminus\''
    ]);

    var py = ['import pyalps', '', 'parms = [{']
      .concat(pyDict)
      .concat(['}]', '',
        'input_file = pyalps.writeInputFiles(\'parm_ed\', parms)',
        'res = pyalps.runApplication(\'sparsediag\', input_file)',
        'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'parm_ed\'))',
        'for sector in data[0]:',
        '    print(\'Sector Sz =\', sector[0].props[\'Sz\'])',
        '    for s in sector:',
        '        print(s.props[\'observable\'], \':\', s.y[0])'
      ]).join('\n');

    return '<strong>Exact Diagonalization input</strong> — spin-' + local_S + ', ' + lattice +
      ', L=' + L + ', Sz=' + Sz_total + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>sparsediag</code>' +
      (NEIGEN > 1 ? ' — ' + NEIGEN + ' lowest eigenvalues' : ' — ground state (Sz_total=' + Sz_total + ')') +
      '; set <code>Sz_total=1</code> for the triplet sector to compute the spin gap</small>';
  }

  function genFullDiag(p) {
    var lattice = p.LATTICE || 'chain lattice';
    /* fulldiag diagonalizes the full Hilbert space — keep L small */
    var L       = p.L       || 8;
    var local_S = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J       = (p.J     !== undefined) ? p.J     : 1;
    var T_MIN   = (p.T_MIN  !== undefined) ? p.T_MIN  : 0.1;
    var T_MAX   = (p.T_MAX  !== undefined) ? p.T_MAX  : 10.0;
    var DELTA_T = (p.DELTA_T!== undefined) ? p.DELTA_T: 0.1;

    var parm = [
      'MODEL="spin"',
      'LATTICE="' + lattice + '"',
      'local_S=' + local_S,
      'J=' + J,
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'T_MIN='   + T_MIN,
      'T_MAX='   + T_MAX,
      'DELTA_T=' + DELTA_T,
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
      '    \'CONSERVED_QUANTUMNUMBERS\' : \'Sz\'',
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_fulldiag\', parms)',
      'res = pyalps.runApplication(\'fulldiag\', input_file)',
      '',
      '# Evaluate thermodynamic observables (specific heat, susceptibility, …) vs T',
      'data = pyalps.evaluateFulldiagVersusT(',
      '    pyalps.getResultFiles(prefix=\'parm_fulldiag\'),',
      '    DELTA_T=' + DELTA_T + ', T_MIN=' + T_MIN + ', T_MAX=' + T_MAX + ')',
      'for s in pyalps.flatten(data):',
      '    print(s.props[\'observable\'])'
    ].join('\n');

    return '<strong>Full ED (thermodynamics) input</strong> — spin-' + local_S + ', ' + lattice +
      ', L=' + L + ', T: ' + T_MIN + '→' + T_MAX + '<br>' +
      '<em>fulldiag diagonalizes the full Hilbert space — keep L ≤ 8 (spin-1/2) or ≤ 6 (spin-1).</em><br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>fulldiag</code>; use <code>evaluateFulldiagVersusT</code> to extract C(T), χ(T), etc.</small>';
  }

  function genDMRG(p, appName) {
    appName = appName || 'dmrg';
    var L        = p.L        || 32;
    var local_S  = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J        = (p.J       !== undefined) ? p.J       : 1;
    var SWEEPS   = p.SWEEPS   || 4;
    var NEIGEN   = p.NUMBER_EIGENVALUES || 1;
    var Sz_total = (p.Sz_total!== undefined) ? p.Sz_total: 0;
    var prefix   = 'parm_' + appName.replace('_', '');

    /* When user specifies MAXSTATES, use that single value.
       Otherwise generate a convergence sweep {20},{40},{60} as in the tutorials. */
    var userMX   = p.MAXSTATES;
    var mxBlocks = userMX ? ['{MAXSTATES=' + userMX + '}']
                           : ['{ MAXSTATES=20 }', '{ MAXSTATES=40 }', '{ MAXSTATES=60 }'];
    var mxList   = userMX ? [userMX] : [20, 40, 60];

    var parmLines = [
      'LATTICE="open chain lattice"',
      'MODEL="spin"',
      'local_S=' + local_S,
      'J=' + J,
      'L=' + L,
      'CONSERVED_QUANTUMNUMBERS="Sz"',
      'Sz_total=' + Sz_total,
      'SWEEPS=' + SWEEPS,
      'NUMBER_EIGENVALUES=' + NEIGEN,
      'MEASURE_LOCAL[Local magnetization]=Sz',
      'MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz',
      'MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"'
    ].concat(mxBlocks);
    var parm = parmLines.join('\n');

    var pyParms = userMX
      ? [
          'parms = [{',
          '    \'LATTICE\'                                                 : "open chain lattice",',
          '    \'MODEL\'                                                   : "spin",',
          '    \'CONSERVED_QUANTUMNUMBERS\'                               : \'N,Sz\',',
          '    \'Sz_total\'                                               : ' + Sz_total + ',',
          '    \'J\'                                                      : ' + J + ',',
          '    \'SWEEPS\'                                                 : ' + SWEEPS + ',',
          '    \'NUMBER_EIGENVALUES\'                                     : ' + NEIGEN + ',',
          '    \'L\'                                                      : ' + L + ',',
          '    \'MAXSTATES\'                                              : ' + userMX + ',',
          '    \'MEASURE_LOCAL[Local magnetization]\'                     : \'Sz\',',
          '    \'MEASURE_CORRELATIONS[Diagonal spin correlations]\'       : \'Sz\',',
          '    \'MEASURE_CORRELATIONS[Offdiagonal spin correlations]\'    : \'Splus:Sminus\'',
          '}]'
        ]
      : [
          '# Sweep MAXSTATES to check convergence (tutorial style)',
          'parms = []',
          'for D in ' + JSON.stringify(mxList) + ':',
          '    parms.append({',
          '        \'LATTICE\'                                                : "open chain lattice",',
          '        \'MODEL\'                                                  : "spin",',
          '        \'CONSERVED_QUANTUMNUMBERS\'                              : \'N,Sz\',',
          '        \'Sz_total\'                                              : ' + Sz_total + ',',
          '        \'J\'                                                     : ' + J + ',',
          '        \'SWEEPS\'                                                : ' + SWEEPS + ',',
          '        \'NUMBER_EIGENVALUES\'                                    : ' + NEIGEN + ',',
          '        \'L\'                                                     : ' + L + ',',
          '        \'MAXSTATES\'                                             : D,',
          '        \'MEASURE_LOCAL[Local magnetization]\'                    : \'Sz\',',
          '        \'MEASURE_CORRELATIONS[Diagonal spin correlations]\'      : \'Sz\',',
          '        \'MEASURE_CORRELATIONS[Offdiagonal spin correlations]\'   : \'Splus:Sminus\'',
          '    })'
        ];

    var py = ['import pyalps', '']
      .concat(pyParms)
      .concat(['',
        'input_file = pyalps.writeInputFiles(\'' + prefix + '\', parms)',
        'res = pyalps.runApplication(\'' + appName + '\', input_file, writexml=True)',
        'data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=\'' + prefix + '\'))',
        'for s in data[0]:',
        '    print(s.props[\'observable\'], \':\', s.y[0])'
      ]).join('\n');

    var label = appName === 'mps_optim' ? 'MPS optimization' : 'DMRG';
    var mxStr = userMX ? 'MAXSTATES=' + userMX : 'MAXSTATES=20,40,60 (convergence sweep)';
    return '<strong>' + label + ' input</strong> — spin-' + local_S +
      ', open chain, L=' + L + ', ' + mxStr + '<br>' +
      latticeDiagram('open chain lattice') +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>' + appName + '</code>; DMRG requires <code>open chain lattice</code>' +
      (userMX ? '' : '; sweeping MAXSTATES checks convergence of ground state energy') +
      '</small>';
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
      'res = pyalps.runApplication(\'loop\', input_file)'
    ].join('\n');

    return '<strong>Ladder QMC input</strong> — ' + W + '-leg ladder, spin-' + local_S +
      ', L=' + L + ', J0(leg)=' + J0 + ', J1(rung)=' + J1 + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>loop</code></small>';
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

  /* ---- Quantum Wang-Landau (qwl) ---- */
  function genQWL(p) {
    var L       = p.L  || 8;
    var local_S = (p.local_S !== undefined) ? p.local_S : 0.5;
    var J       = (p.J !== undefined) ? p.J : 1.0;
    var lattice = p.LATTICE || 'chain lattice';
    var is2D    = _2D_LATTICES.indexOf(lattice) !== -1;
    var is3D    = _3D_LATTICES.indexOf(lattice) !== -1;
    var W       = (is2D || is3D) ? (p.W || L) : undefined;
    var H_val   = is3D ? (p.H || L) : undefined;

    var parmLines = [
      'LATTICE="' + lattice + '"',
      'MODEL="spin"',
      'local_S=' + local_S,
      'J=' + J,
      'L=' + L
    ];
    if (W !== undefined)   parmLines.push('W=' + W);
    if (H_val !== undefined) parmLines.push('H=' + H_val);
    parmLines.push('SWEEPS=100000');
    var parm = parmLines.join('\n');

    var pyExtra = '';
    if (W !== undefined && H_val === undefined) pyExtra = '\n        \'W\'     : ' + W + ',';
    if (H_val !== undefined) pyExtra = '\n        \'W\'     : ' + W + ',\n        \'H\'     : ' + H_val + ',';

    var py = [
      'import pyalps',
      '',
      'parms = [{',
      '    \'LATTICE\'  : "' + lattice + '",',
      '    \'MODEL\'    : "spin",',
      '    \'local_S\'  : ' + local_S + ',',
      '    \'J\'        : ' + J + ',',
      '    \'L\'        : ' + L + ',' + pyExtra,
      '    \'SWEEPS\'   : 100000',
      '}]',
      '',
      'input_file = pyalps.writeInputFiles(\'parm_qwl\', parms)',
      'res = pyalps.runApplication(\'qwl\', input_file)'
    ].join('\n');

    var dimInfo = is3D ? 'L=' + L + '×W=' + W + '×H=' + H_val
                  : is2D ? 'L=' + L + '×W=' + W
                  : 'L=' + L;
    return '<strong>Quantum Wang-Landau input</strong> — ' + lattice + ', spin-' + local_S +
      ', ' + dimInfo + ', J=' + J + '<br>' +
      latticeDiagram(lattice) +
      codeBlock(py,   'Python (pyalps)') +
      codeBlock(parm, 'Parameter file') +
      '<small>App: <code>qwl</code> — computes density of states across the full energy spectrum.</small>';
  }

  var METHOD_CHOICES_MSG =
    'Which simulation method would you like an input file for?<ul>' +
    '<li><strong>spinmc</strong> — Classical spin MC (Ising, Heisenberg, XY)</li>' +
    '<li><strong>qmc</strong> — Quantum spin MC (loop / dirloop_sse); MODEL="spin"</li>' +
    '<li><strong>tfim</strong> — Transverse-Field Ising Model (sparsediag ED); params: Jz, Gamma</li>' +
    '<li><strong>xy model</strong> — XY / XXZ model QMC (loop) or ED; params: Jxy, Jz</li>' +
    '<li><strong>qwl</strong> — Quantum Wang-Landau; MODEL="spin"; full density of states</li>' +
    '<li><strong>bhm</strong> — Bose-Hubbard QMC (worm alg.); MODEL="boson Hubbard"; params: t, U, mu, Nmax</li>' +
    '<li><strong>dwa</strong> — Directed Worm Algorithm; same as bhm but uses dwa app</li>' +
    '<li><strong>hardcore boson</strong> — Hard-core boson QMC (worm); MODEL="hardcore boson"; params: t, mu, V</li>' +
    '<li><strong>fermion hubbard</strong> — Fermion Hubbard; MODEL="fermion Hubbard"; params: t, U, mu, Nup, Ndown; app: dmrg/sparsediag</li>' +
    '<li><strong>ed</strong> — Exact Diagonalization (ground state); MODEL="spin"</li>' +
    '<li><strong>fulldiag</strong> — Full ED (thermodynamics, finite-T)</li>' +
    '<li><strong>dmrg</strong> — DMRG for 1D spin chains (open chain lattice)</li>' +
    '<li><strong>mps</strong> — MPS optimization</li>' +
    '<li><strong>tebd</strong> — TEBD (real-time evolution)</li>' +
    '<li><strong>dmft</strong> — DMFT (Hubbard on Bethe lattice, CT-HYB)</li>' +
    '</ul>' +
    '<strong>Ladder lattice variants:</strong><ul>' +
    '<li><strong>ladder qmc</strong> — Two-leg ladder QMC (loop), J0=leg, J1=rung</li>' +
    '<li><strong>ladder ed</strong> — Two-leg ladder Exact Diagonalization</li>' +
    '<li><strong>ladder dmrg</strong> — Two-leg ladder DMRG (open ladder)</li>' +
    '<li><strong>coupled ladders</strong> — 2D coupled-ladders QMC (loop), J2=inter-ladder</li>' +
    '</ul>' +
    '<strong>Lattice options</strong> (add to any method):<ul>' +
    '<li>1D: <code>chain lattice</code>, <code>open chain lattice</code>, <code>nnn chain lattice</code></li>' +
    '<li>2D: <code>square lattice</code>, <code>triangular lattice</code>, <code>honeycomb lattice</code>, ' +
    '<code>kagome lattice</code>, <code>frustrated square lattice</code></li>' +
    '<li>3D: <code>simple cubic lattice</code></li>' +
    '</ul>' +
    'Type the method and any parameters, e.g.:<br>' +
    '<em>"spinmc Ising square lattice L=16 W=16"</em><br>' +
    '<em>"qmc triangular lattice L=12 J=-1"</em><br>' +
    '<em>"ladder qmc spin-1/2 L=16 J0=1 J1=0.5"</em><br>' +
    '<em>"coupled ladders L=8 W=4 J2=0.3"</em><br>' +
    '<em>"dmrg spin-1/2 L=32 MAXSTATES=200"</em>';

  function generateInputFile(method, params) {
    switch (method) {
      case 'spinmc':                    return genSpinMC(params);
      case 'tfim':                       return genTFIM(params);
      case 'xy_model':                  return genXY(params, true);
      case 'xy_ed':                     return genXY(params, false);
      case 'loop': case 'dirloop': case 'looper': case 'qmc': return genQMC(params);
      case 'qwl':                       return genQWL(params);
      case 'bhm':                       return genBHM(params, 'worm');
      case 'dwa':                       return genBHM(params, 'dwa');
      case 'hardcore_boson':            return genHardcoreBoson(params, 'worm');
      case 'fermion_hubbard':           return genFermionHubbard(params);
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
               'spinmc, qmc, qwl, tfim, "xy model", bhm, dwa, "hardcore boson", "fermion hubbard", ' +
               'ed, fulldiag, dmrg, mps, tebd, dmft, ' +
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
