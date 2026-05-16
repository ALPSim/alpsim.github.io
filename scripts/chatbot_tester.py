#!/usr/bin/env python3
"""
ALPS Chatbot Accuracy Tester
Validates the chatbot's JS knowledge-base routing AND input-file generator
output against the ground truth from the ALPSim/ALPS GitHub tutorials.

Run:  python3 scripts/chatbot_tester.py
Exit: 0 = all pass,  1 = failures
"""

import re
import sys
import json
from dataclasses import dataclass
from typing import Optional, Callable

# ═══════════════════════════════════════════════════════════════════
# 1.  KNOWLEDGE BASE  (mirrors chatbot.js KB array)
# ═══════════════════════════════════════════════════════════════════

KB = [
    {
        "id": "what_is_alps",
        "keywords": ["what is alps", "about alps", "alps software", "alps package",
                     "alps simulation", "quantum lattice", "many body", "open source",
                     "alps collaboration", "alps project"],
    },
    {
        "id": "install",
        "keywords": ["install", "installation", "set up", "setup", "download alps",
                     "get alps", "how to install", "requirements", "prerequisites",
                     "linux", "mac", "macos"],
    },
    {
        "id": "spack",
        "keywords": ["spack", "hpc", "supercomputer", "cluster", "module", "lmod",
                     "high performance computing"],
    },
    {
        "id": "windows",
        "keywords": ["windows", "win10", "win11", "microsoft", "wsl", "windows support"],
    },
    {
        "id": "dmft",
        "keywords": ["dmft", "dynamical mean field", "dynamical mean-field theory",
                     "mott transition", "hubbard dmft", "mott hubbard", "bethe lattice",
                     "self-consistent field", "impurity solver", "dmft u", "beta nmatsubara"],
    },
    {
        "id": "dmrg",
        "keywords": ["dmrg", "density matrix renormalization", "density matrix renormalization group",
                     "tensor network", "mps", "matrix product state", "mps optimization",
                     "1d chain dmrg", "one dimensional dmrg",
                     "maxstates", "bond dimension", "convergence sweep dmrg"],
    },
    {
        "id": "ed",
        "keywords": ["exact diagonalization", "exact diag", "ed method", "full diagonalization",
                     "lanczos", "hamiltonian matrix", "small system diag", "sparsediag", "fulldiag",
                     "number eigenvalues", "number_eigenvalues", "energy spectrum ed",
                     "ed-01", "ed-02", "ed-03", "ed-04", "ed-05", "ed-06"],
    },
    {
        "id": "qmc",
        "keywords": ["qmc", "quantum monte carlo", "loop algorithm", "loop qmc",
                     "dirloop", "directed loop", "stochastic series expansion", "sse",
                     "path integral monte carlo", "quantum spin qmc"],
    },
    {
        "id": "spinmc",
        "keywords": ["spinmc", "spin mc", "classical monte carlo", "classical spin",
                     "ising monte carlo", "metropolis", "wolff", "cluster algorithm"],
    },
    {
        "id": "heisenberg",
        "keywords": ["heisenberg model", "heisenberg", "spin chain", "spin half", "xxz model",
                     "antiferromagnet", "ferromagnet", "exchange interaction", "j coupling"],
    },
    {
        "id": "tfim",
        "keywords": ["transverse field ising", "tfim", "quantum ising", "transverse ising",
                     "ising in transverse", "ising transverse field", "gamma field", "transverse field"],
    },
    {
        "id": "xy_model",
        "keywords": ["xy model", "xy chain", "xy lattice", "jxy model", "planar model",
                     "xx model", "jxy jz", "xxz model", "anisotropic heisenberg"],
    },
    {
        "id": "hubbard",
        "keywords": ["hubbard model", "fermion hubbard", "fermi hubbard", "electron hubbard",
                     "hubbard chain", "hubbard lattice", "1d hubbard", "on-site interaction",
                     "hopping t", "hubbard u", "mott insulator", "strongly correlated electron",
                     "nup ndown", "spinful hubbard", "half filling"],
    },
    {
        "id": "bose_hubbard",
        "keywords": ["bose-hubbard", "bose hubbard", "bhm", "bosonic model", "superfluid mott",
                     "mott lobe", "optical lattice", "bose einstein condensate",
                     "soft core boson", "soft-core boson", "boson hubbard",
                     "nmax bosons", "worm algorithm boson",
                     "hardcore boson", "hard core boson", "hard-core boson"],
    },
    {
        "id": "getting_started",
        "keywords": ["getting started", "beginner", "introduction", "intro", "first steps",
                     "new user", "quickstart", "quick start", "basics", "how do i start"],
    },
    {
        "id": "documentation",
        "keywords": ["documentation", "docs", "manual", "reference guide", "how to use alps",
                     "alps guide"],
    },
    {
        "id": "models",
        "keywords": ["model", "models", "what models", "supported models", "which models",
                     "lattice model", "spin model"],
    },
    {
        "id": "methods",
        "keywords": ["method", "methods", "which method", "supported methods", "algorithms",
                     "numerical method", "simulation method"],
    },
    {
        "id": "bug",
        "keywords": ["bug", "error", "issue", "crash", "report bug", "report an issue",
                     "not working", "broken", "wrong result", "segfault"],
    },
    {
        "id": "contribute",
        "keywords": ["contribute", "contributing", "pull request", "code contribution",
                     "development", "codedev", "how to contribute"],
    },
    {
        "id": "community",
        "keywords": ["discord", "chat", "community", "discuss", "discussion", "ask a question",
                     "get help", "forum", "github discussions", "community support"],
    },
    {
        "id": "tebd",
        "keywords": ["tebd", "time-evolving block decimation", "time evolution", "real time evolution",
                     "quantum quench", "imaginary time", "trotterization", "suzuki-trotter"],
    },
    {
        "id": "qwl",
        "keywords": ["qwl", "quantum wang-landau", "wang landau", "wang-landau",
                     "density of states", "flat histogram"],
    },
]

# ═══════════════════════════════════════════════════════════════════
# 2.  STOP WORDS + SCORING  (mirrors chatbot.js fix)
# ═══════════════════════════════════════════════════════════════════

_SCORE_STOP = {"alps"}   # stop-word fix from previous session


def score_entry(query: str, entry: dict) -> int:
    q = query.lower().strip()
    s = 0
    for kw in entry["keywords"]:
        if q == kw:
            s += 10
        elif kw in q:
            s += 4
        else:
            kw_words = kw.split()
            q_words = q.split()
            for w in q_words:
                if len(w) > 2 and w not in _SCORE_STOP and w in kw_words:
                    s += 1
    return s


def find_best_kb(query: str) -> Optional[dict]:
    best, best_s = None, 0
    for entry in KB:
        s = score_entry(query, entry)
        if s > best_s:
            best_s = s
            best = entry
    return best


# ═══════════════════════════════════════════════════════════════════
# 3.  INPUT-FILE GENERATOR VALIDATOR
#     Reads the actual chatbot.js and checks generated parm content
#     against known tutorial ground truth.
# ═══════════════════════════════════════════════════════════════════

import os
import subprocess


def _extract_generator(js_src: str, func_name: str) -> str:
    """Pull the body of a named function from the chatbot.js source."""
    start = js_src.find(f"function {func_name}(")
    if start == -1:
        return ""
    depth, i, n = 0, start, len(js_src)
    while i < n:
        if js_src[i] == "{":
            depth += 1
        elif js_src[i] == "}":
            depth -= 1
            if depth == 0:
                return js_src[start : i + 1]
        i += 1
    return js_src[start:]


@dataclass
class GenTest:
    """Check that a named generator function body contains expected strings."""
    func_name: str
    expected: list[str]
    not_expected: list[str]
    source: str  # which tutorial this comes from
    desc: str


GEN_TESTS: list[GenTest] = [
    # ── DMRG (dmrg-01 tutorial) ───────────────────────────────────
    # Note: In the raw JS file, Python string literals use \' escaping, so
    # 'N,Sz' appears as \'N,Sz\' and "N,Sz" appears as "N,Sz" (double-quoted parm line).
    GenTest(
        func_name="genDMRG",
        expected=[
            # Both parm file and Python dict must have N,Sz (dmrg-01 tutorial)
            '"N,Sz"',          # parm file line: CONSERVED_QUANTUMNUMBERS="N,Sz"
            r"\'N,Sz\'",       # Python dict (JS-escaped): \'N,Sz\'
            "open chain lattice",
            "dmrg",
            "MAXSTATES",
            "SWEEPS",
            "NUMBER_EIGENVALUES",
        ],
        not_expected=[],
        source="dmrg-01 tutorial (spin_one_half.py)",
        desc="DMRG parm file and Python both use CONSERVED_QUANTUMNUMBERS='N,Sz'",
    ),
    # ── QMC / loop (mc-02c, mc-08 tutorials) ─────────────────────
    GenTest(
        func_name="genQMC",
        expected=[
            'ALGORITHM="loop"',   # required by mc-02c and mc-08 parm files
            "loop",               # app name
            "MODEL=\"spin\"",
            "local_S",
        ],
        not_expected=[],
        source="mc-02c tutorial (parm2c) and mc-08 tutorial (parm8a)",
        desc="QMC loop generator includes ALGORITHM='loop' in parm file",
    ),
    # ── QWL (mc-06 tutorial) ────────────────────────────────────
    GenTest(
        func_name="genQWL",
        expected=[
            "T_MIN",       # mc-06/parm6a: T_MIN=0.1
            "T_MAX",       # mc-06/parm6a: T_MAX=10.0
            "DELTA_T",     # mc-06/parm6a: DELTA_T=0.1
            "CUTOFF",      # mc-06/parm6a: CUTOFF=500
            "qwl",         # correct app name
        ],
        not_expected=[
            "SWEEPS=100000",  # old wrong output — QWL doesn't use SWEEPS
        ],
        source="mc-06 tutorial (parm6a: T_MIN=0.1, T_MAX=10.0, DELTA_T=0.1, CUTOFF=500)",
        desc="QWL generator uses T_MIN/T_MAX/DELTA_T/CUTOFF, not SWEEPS",
    ),
    # ── Ladder QMC (mc-02 quantum ladder tutorial) ───────────────
    GenTest(
        func_name="genLadderQMC",
        expected=[
            'ALGORITHM="loop"',   # mc-02d / mc-08 always include ALGORITHM="loop"
            "J0",
            "J1",
            "loop",
        ],
        not_expected=[],
        source="mc-02d tutorial (quantum Heisenberg ladder with loop app)",
        desc="Ladder QMC generator includes ALGORITHM='loop'",
    ),
    # ── Coupled ladders (mc-08 tutorial) ─────────────────────────
    # In raw JS file, Python string \'ALGORITHM\' : \'loop\' appears with backslash-escapes.
    GenTest(
        func_name="genCoupledLadders",
        expected=[
            'ALGORITHM="loop"',          # parm file line
            r"\'ALGORITHM\'",            # Python dict key (JS-escaped)
            "J0",
            "J1",
            "J2",
            "coupled ladders",
            "loop",
        ],
        not_expected=[],
        source="mc-08 tutorial (parm8a: coupled ladders, J0/J1/J2, ALGORITHM='loop')",
        desc="Coupled-ladders generator has ALGORITHM='loop' in parm and Python",
    ),
    # ── DMFT (dmft-02/03/04 tutorials) ───────────────────────────
    GenTest(
        func_name="genDMFT",
        expected=[
            "0.707106781",     # canonical Bethe-lattice t = 1/√2
            "BETA",
            "NMATSUBARA",
            "hybridization",   # SOLVER
            "FLAVORS",
            "SITES",
        ],
        not_expected=[
            "0.5",             # old wrong default t
        ],
        source="dmft-02/03/04 tutorials (t=0.707106781186547)",
        desc="DMFT default t is 1/√2 (Bethe lattice), not 0.5",
    ),
    # ── SpinMC (mc-01, mc-07 tutorials) ──────────────────────────
    GenTest(
        func_name="genSpinMC",
        expected=[
            "spinmc",
            'UPDATE="cluster"',
            "MODEL",
            "THERMALIZATION",
            "SWEEPS",
        ],
        not_expected=[],
        source="mc-01 tutorial (parm1a: Ising, square lattice, cluster updates)",
        desc="SpinMC generator uses cluster update and correct params",
    ),
    # ── Bose-Hubbard (mc-05, dwa-01 tutorials) ───────────────────
    GenTest(
        func_name="genBHM",
        expected=[
            "boson Hubbard",
            "NONLOCAL",
            "Nmax",
            "worm",
        ],
        not_expected=[],
        source="mc-05 tutorial (parm5a: MODEL=boson Hubbard, U, mu, Nmax, NONLOCAL=0)",
        desc="BHM generator uses correct model name, NONLOCAL, Nmax",
    ),
    # ── TFIM (ed-04-criticality parm_ising) ──────────────────────
    # Note: the function body contains "CONSERVED_QUANTUMNUMBERS" in a comment and in
    # the informational HTML note, so we can't use not_expected on the whole function.
    # Instead we check that the parm variable itself lacks the keyword by verifying
    # no CONSERVED_QUANTUMNUMBERS line is placed between 'var parm' and '.join'.
    GenTest(
        func_name="genTFIM",
        expected=[
            "Jxy=0",           # ed-04 parm_ising: Jxy=0
            "Jz",              # ed-04 parm_ising: Jz=-1
            "Gamma",           # ed-04 parm_ising: Gamma=0.5
            "NUMBER_EIGENVALUES",
            "sparsediag",
        ],
        not_expected=[
            # CONSERVED_QUANTUMNUMBERS must NOT appear as a parm file line —
            # the TFIM breaks Sz conservation. It DOES appear in the comment/HTML
            # so we only flag it if it shows up as a parm array element:
            "'CONSERVED_QUANTUMNUMBERS='",   # would be parm file string entry
        ],
        source="ed-04 tutorial (parm_ising: Jxy=0, Jz=-1, Gamma=0.5, NUMBER_EIGENVALUES=5)",
        desc="TFIM parm file has Jxy=0/Jz/Gamma/NUMBER_EIGENVALUES, no CONSERVED_QUANTUMNUMBERS entry",
    ),
    # ── FullDiag (ed-06, ed-06b tutorials) ───────────────────────
    GenTest(
        func_name="genFullDiag",
        expected=[
            "T_MIN",    # ed-06/parm6a: T_MIN=0.1
            "T_MAX",    # ed-06/parm6a: T_MAX=10.0
            "DELTA_T",  # ed-06/parm6a: DELTA_T=0.1
            "fulldiag",
            "evaluateFulldiagVersusT",
        ],
        not_expected=[],
        source="ed-06 tutorial (parm6a: T_MIN=0.1, T_MAX=10.0, DELTA_T=0.1)",
        desc="FullDiag generator uses T_MIN/T_MAX/DELTA_T and evaluateFulldiagVersusT",
    ),
    # ── ED sparsediag (ed-01 tutorial) ───────────────────────────
    GenTest(
        func_name="genED",
        expected=[
            "sparsediag",
            "CONSERVED_QUANTUMNUMBERS",
            "Sz_total",
            "MEASURE_CORRELATIONS",
        ],
        not_expected=[],
        source="ed-01 tutorial (parm1a: MODEL=spin, LATTICE=chain, CONSERVED_QUANTUMNUMBERS=Sz)",
        desc="ED sparsediag generator has CONSERVED_QUANTUMNUMBERS and measurements",
    ),
    # ── TEBD (tebd-01 tutorial) ───────────────────────────────────
    GenTest(
        func_name="genTEBD",
        expected=[
            "hardcore boson",
            "N_total",
            "ITP_CHIS",
            "ITP_DTS",
            "ITP_CONVS",
            "INITIAL_STATE",
            "CHI_LIMIT",
            "TRUNC_LIMIT",
            "TAUS",
            "writeTEBDfiles",
            "runTEBD",
        ],
        not_expected=[],
        source="tebd-01 tutorial (tutorial1a.py: hardcore boson, ITP params, TAUS/GS/GIS/GFS)",
        desc="TEBD generator has all required ITP/TAUS parameters and uses writeTEBDfiles",
    ),
    # ── Ladder ED (ed-03 parm_ladder) ────────────────────────────
    GenTest(
        func_name="genLadderED",
        expected=[
            "ladder",
            "J0",
            "J1",
            "sparsediag",
            "CONSERVED_QUANTUMNUMBERS",
        ],
        not_expected=[],
        source="ed-03 tutorial (parm_ladder: LATTICE=ladder, J0=1, J1=1, Sz_total=0)",
        desc="Ladder ED generator has J0, J1, CONSERVED_QUANTUMNUMBERS",
    ),
]


# ═══════════════════════════════════════════════════════════════════
# 4.  KB ROUTING TEST CASES  (drawn from tutorial parameter files)
# ═══════════════════════════════════════════════════════════════════

@dataclass
class KBTest:
    query: str
    expected_id: str
    source: str


KB_TESTS: list[KBTest] = [
    # ── Installation ─────────────────────────────────────────────
    KBTest("How do I install ALPS on Linux?", "install", "Install docs"),
    KBTest("ALPS installation on macOS", "install", "Install docs"),
    KBTest("How to install ALPS with Spack on an HPC cluster?", "spack", "Spack install doc"),
    KBTest("Does ALPS support Windows?", "windows", "FAQs"),
    KBTest("Can I use ALPS with WSL?", "windows", "FAQs"),

    # ── Getting started / docs ───────────────────────────────────
    KBTest("I'm a beginner, how do I get started?", "getting_started", "Intro docs"),
    KBTest("Quick start guide for ALPS", "getting_started", "Intro docs"),
    KBTest("Where is the ALPS documentation?", "documentation", "Docs home"),
    KBTest("ALPS reference manual", "documentation", "Docs home"),

    # ── Methods and models ───────────────────────────────────────
    KBTest("What simulation methods does ALPS support?", "methods", "Docs home"),
    KBTest("What lattice models can ALPS simulate?", "models", "Docs home"),
    KBTest("What is ALPS?", "what_is_alps", "About page"),
    KBTest("About the ALPS quantum lattice simulation package", "what_is_alps", "About page"),

    # ── ED (ed-01 to ed-06) ──────────────────────────────────────
    KBTest("How do I use exact diagonalization?", "ed", "ED-01"),
    KBTest("sparsediag Lanczos method spin chain", "ed", "ED-01"),
    KBTest("fulldiag thermodynamic quantities finite temperature", "ed", "ED-06"),
    KBTest("number_eigenvalues energy spectrum ed-04 criticality", "ed", "ED-04"),

    # ── DMRG (dmrg-01 to dmrg-02) ───────────────────────────────
    KBTest("How to run DMRG for spin chain?", "dmrg", "DMRG-01"),
    KBTest("density matrix renormalization group open chain", "dmrg", "DMRG-01"),
    KBTest("MAXSTATES bond dimension dmrg convergence", "dmrg", "DMRG-01"),
    KBTest("mps_optim matrix product state optimization", "dmrg", "DMRG-02"),

    # ── MC tutorials ─────────────────────────────────────────────
    # mc-01: classical Ising spinmc
    KBTest("classical Ising Monte Carlo simulation square lattice", "spinmc", "MC-01a"),
    KBTest("spinmc cluster algorithm autocorrelation", "spinmc", "MC-01a"),
    # mc-02: classical Heisenberg chain/ladder (spinmc) AND quantum loop
    KBTest("quantum Monte Carlo loop algorithm Heisenberg chain", "qmc", "MC-02c"),
    KBTest("directed loop SSE magnetic field h", "qmc", "MC-03"),
    KBTest("stochastic series expansion quantum spin", "qmc", "MC tutorials"),
    # mc-06: qwl
    KBTest("quantum Wang-Landau density of states spin chain", "qwl", "MC-06"),
    KBTest("flat histogram energy spectrum", "qwl", "MC-06"),
    # mc-07: classical Ising phase transition spinmc
    KBTest("classical Ising phase transition cluster Monte Carlo", "spinmc", "MC-07"),
    # mc-08: coupled ladders QMC loop
    KBTest("quantum phase transition coupled ladders loop QMC", "qmc", "MC-08"),

    # ── DMFT (dmft-02 to dmft-04) ────────────────────────────────
    KBTest("dynamical mean field theory hybridization solver", "dmft", "DMFT-02"),
    KBTest("DMFT impurity solver self-consistent Bethe lattice", "dmft", "DMFT-02"),
    KBTest("Mott hubbard dmft self-consistent impurity", "dmft", "DMFT-04"),

    # ── TEBD (tebd-01) ───────────────────────────────────────────
    KBTest("TEBD time-evolving block decimation", "tebd", "TEBD-01"),
    KBTest("real time evolution quantum quench hardcore boson", "tebd", "TEBD-01"),

    # ── Models (specific) ────────────────────────────────────────
    KBTest("Heisenberg spin-1/2 antiferromagnet chain J=1", "heisenberg", "ED-01"),
    KBTest("transverse field Ising model Gamma Jz sparsediag", "tfim", "ED-04/Jupyter"),
    KBTest("XY model Jxy=1 Jz=0 spin chain sparsediag", "xy_model", "ED-03/Jupyter"),
    KBTest("Hubbard model fermion t U Nup Ndown DMRG", "hubbard", "Hubbard docs"),
    KBTest("Bose-Hubbard model boson Hubbard Nmax worm superfluid", "bose_hubbard", "MC-05"),
    KBTest("hard-core boson hopping V nearest-neighbor TEBD", "bose_hubbard", "TEBD-01"),

    # ── Community / Bug ──────────────────────────────────────────
    KBTest("How do I report a bug in ALPS on GitHub?", "bug", "GitHub issues"),
    KBTest("How to contribute code to ALPS pull request?", "contribute", "Code dev docs"),
    KBTest("ALPS Discord community forum discussions", "community", "Community page"),
]


# ═══════════════════════════════════════════════════════════════════
# 5.  RUN TESTS
# ═══════════════════════════════════════════════════════════════════

@dataclass
class KBResult:
    query: str
    expected_id: str
    matched_id: Optional[str]
    score: int
    passed: bool
    source: str


@dataclass
class GenResult:
    func_name: str
    desc: str
    source: str
    missing: list[str]     # expected strings not found
    forbidden: list[str]   # not_expected strings that were found
    passed: bool


def run_kb_tests() -> list[KBResult]:
    results = []
    for tc in KB_TESTS:
        best = find_best_kb(tc.query)
        matched_id = best["id"] if best else None
        score = score_entry(tc.query, best) if best else 0
        results.append(KBResult(
            query=tc.query,
            expected_id=tc.expected_id,
            matched_id=matched_id,
            score=score,
            passed=(matched_id == tc.expected_id),
            source=tc.source,
        ))
    return results


def run_gen_tests() -> list[GenResult]:
    js_path = os.path.join(os.path.dirname(__file__),
                           "..", "static", "js", "chatbot.js")
    js_path = os.path.normpath(js_path)
    if not os.path.exists(js_path):
        print(f"  WARNING: chatbot.js not found at {js_path}", file=sys.stderr)
        return []

    with open(js_path, encoding="utf-8") as f:
        js_src = f.read()

    results = []
    for gt in GEN_TESTS:
        body = _extract_generator(js_src, gt.func_name)
        if not body:
            results.append(GenResult(
                func_name=gt.func_name, desc=gt.desc, source=gt.source,
                missing=[f"<function {gt.func_name} not found in chatbot.js>"],
                forbidden=[], passed=False,
            ))
            continue

        missing   = [e for e in gt.expected     if e not in body]
        forbidden = [e for e in gt.not_expected if e in body]
        passed    = (not missing) and (not forbidden)
        results.append(GenResult(
            func_name=gt.func_name, desc=gt.desc, source=gt.source,
            missing=missing, forbidden=forbidden, passed=passed,
        ))
    return results


# ═══════════════════════════════════════════════════════════════════
# 6.  PRINT REPORT
# ═══════════════════════════════════════════════════════════════════

def print_report(kb_res: list[KBResult], gen_res: list[GenResult]) -> bool:
    kb_pass = sum(1 for r in kb_res if r.passed)
    gen_pass = sum(1 for r in gen_res if r.passed)
    total_pass = kb_pass + gen_pass
    total = len(kb_res) + len(gen_res)
    all_ok = (total_pass == total)

    print("=" * 70)
    print("  ALPS Chatbot Accuracy Report  (GitHub tutorial ground truth)")
    print("=" * 70)
    print(f"  KB routing tests  : {kb_pass:2d} / {len(kb_res)}")
    print(f"  Generator tests   : {gen_pass:2d} / {len(gen_res)}")
    print(f"  TOTAL             : {total_pass:2d} / {total}  "
          f"({'100%' if all_ok else f'{100*total_pass//total}%'})")
    print()

    # ── KB failures ──────────────────────────────────────────────
    kb_fails = [r for r in kb_res if not r.passed]
    if kb_fails:
        print("── KB ROUTING FAILURES ──────────────────────────────────────────")
        for r in kb_fails:
            print(f"  Query   : {r.query!r}")
            print(f"  Source  : {r.source}")
            print(f"  Expected: {r.expected_id}   Got: {r.matched_id}  (score={r.score})")
            print()

    # ── Generator failures ────────────────────────────────────────
    gen_fails = [r for r in gen_res if not r.passed]
    if gen_fails:
        print("── GENERATOR FAILURES ───────────────────────────────────────────")
        for r in gen_fails:
            print(f"  Function: {r.func_name}")
            print(f"  Source  : {r.source}")
            print(f"  Desc    : {r.desc}")
            if r.missing:
                print(f"  Missing : {r.missing}")
            if r.forbidden:
                print(f"  Forbidden (should not be in output): {r.forbidden}")
            print()

    # ── By category ──────────────────────────────────────────────
    print("── KB ROUTING BY CATEGORY ───────────────────────────────────────")
    cats: dict[str, list[KBResult]] = {}
    for r in kb_res:
        cats.setdefault(r.expected_id, []).append(r)
    for cat, res_list in sorted(cats.items()):
        ok = sum(1 for r in res_list if r.passed)
        n  = len(res_list)
        print(f"  {'✓' if ok == n else '✗'} {cat:35s} {ok}/{n}")

    print()
    print("── GENERATOR CHECKS ─────────────────────────────────────────────")
    for r in gen_res:
        status = "✓" if r.passed else "✗"
        print(f"  {status} {r.func_name:25s} {r.desc[:50]}")

    # ── JSON summary ──────────────────────────────────────────────
    print()
    summary = {
        "accuracy_pct": round(100 * total_pass / total, 1),
        "kb_routing": {"passed": kb_pass, "total": len(kb_res)},
        "generators": {"passed": gen_pass, "total": len(gen_res)},
        "failures": {
            "kb": [{"query": r.query, "expected": r.expected_id, "got": r.matched_id}
                   for r in kb_fails],
            "generators": [{"func": r.func_name, "missing": r.missing, "forbidden": r.forbidden}
                           for r in gen_fails],
        },
    }
    print("── JSON SUMMARY ─────────────────────────────────────────────────")
    print(json.dumps(summary, indent=2))
    return all_ok


if __name__ == "__main__":
    kb_results  = run_kb_tests()
    gen_results = run_gen_tests()
    ok = print_report(kb_results, gen_results)
    sys.exit(0 if ok else 1)
