#!/usr/bin/env python3
"""Ground state energy of the free spinless fermion chain at half filling.

Runs the ALPS `dmrg` code over a range of bond dimensions at the free-fermion
point V=0 and compares each result against the exact answer, which on an open
chain is a closed-form sum over single-particle levels:

    eps_k = -2t cos(k pi / (L+1)),  k = 1..L,  fill the N lowest.

Unlike the thermodynamic-limit benchmarks used elsewhere, this one is exact at
finite L with open boundaries, so the difference it exposes is the DMRG
truncation error itself and nothing else.

The model is entered as `hardcore boson`, not `spinless fermions`.  On an open
chain with nearest-neighbour hopping the two are the same Hamiltonian, because
the Jordan-Wigner strings cancel between adjacent sites (see DMRG-07).  The
legacy `dmrg` binary returns energies far below the exact ground state for the
fermionic model; the boson form it handles correctly.

Usage:
    python3 run_free_theory.py [--L 32] [--maxstates 20 50 100 200]
"""

import argparse
import math
import os
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

DEFAULT_MAXSTATES = [20, 50, 100, 200]


def exact_energy(L, N, t=1.0):
    """Ground state energy of N free spinless fermions on an open L-site chain."""
    levels = sorted(-2.0 * t * math.cos(k * math.pi / (L + 1)) for k in range(1, L + 1))
    return sum(levels[:N])


def find_alps_bin(explicit=None):
    if explicit:
        return explicit
    if shutil.which("dmrg") and shutil.which("parameter2xml"):
        return ""
    guess = os.path.expanduser("~/alps-install/bin")
    if os.path.isfile(os.path.join(guess, "dmrg")):
        return guess
    sys.exit("Could not find the ALPS binaries. Pass --alps-bin /path/to/alps/bin.")


def write_parm(path, L, N, maxstates, t=1.0, V=0.0, sweeps=4):
    with open(path, "w") as f:
        f.write(
            'LATTICE="open chain lattice"\n'
            'MODEL="hardcore boson"\n'
            'CONSERVED_QUANTUMNUMBERS="N"\n'
            f"N_total={N}\n"
            f"t={t}\n"
            f"V={V}\n"
            f"L={L}\n"
            "NUMBER_EIGENVALUES=1\n"
            f"{{SWEEPS={sweeps}; MAXSTATES={maxstates}}}\n"
        )


def read_result(xml_path):
    root = ET.parse(xml_path).getroot()
    out = {}
    for avg in root.iter("SCALAR_AVERAGE"):
        mean = avg.find("MEAN")
        if mean is not None:
            out[avg.get("name")] = float(mean.text)
    return out.get("Energy"), out.get("Truncation error")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--L", type=int, default=32, help="chain length (default 32)")
    ap.add_argument("--maxstates", type=int, nargs="+", default=DEFAULT_MAXSTATES)
    ap.add_argument("--workdir", default=None)
    ap.add_argument("--alps-bin", default=None)
    args = ap.parse_args()

    L = args.L
    if L % 2:
        sys.exit("Use an even L so that half filling N = L/2 is an integer.")
    N = L // 2

    bindir = find_alps_bin(args.alps_bin)
    exe = lambda name: os.path.join(bindir, name) if bindir else name
    workdir = args.workdir or tempfile.mkdtemp(prefix="alps_free_")
    os.makedirs(workdir, exist_ok=True)

    print(f"L = {L}, N = {N} (half filling), t = 1, V = 0, open chain")
    print(f"working in {workdir}\n")

    exact = exact_energy(L, N)

    rows = []
    for m in args.maxstates:
        stem = f"parm_free_M{m}"
        write_parm(os.path.join(workdir, stem), L, N, m)
        subprocess.run([exe("parameter2xml"), stem], cwd=workdir,
                       check=True, capture_output=True)
        subprocess.run([exe("dmrg"), "--write-xml", f"{stem}.in.xml"], cwd=workdir,
                       check=True, capture_output=True)
        energy, trunc = read_result(os.path.join(workdir, f"{stem}.task1.out.xml"))
        rows.append((m, energy, trunc))

    w = max(len(str(m)) for m, _, _ in rows)
    print(f"{'D':>{w}}  {'E0 (DMRG)':>22}  {'trunc. error':>14}  {'E0 - exact':>12}")
    for m, energy, trunc in rows:
        print(f"{m:>{w}}  {energy:>22.15f}  {trunc:>14.3e}  {energy - exact:>12.3e}")

    print(f"\n{'exact':>{w}}  {exact:>22.15f}")
    print(f"per site  E0/L      = {exact / L:.9f}")
    print(f"per bond  E0/(L-1)  = {exact / (L - 1):.9f}")
    print(f"thermodynamic limit = {-2.0 / math.pi:.9f}  (half filling)")


if __name__ == "__main__":
    main()
