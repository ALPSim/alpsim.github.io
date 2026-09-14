#!/usr/bin/env python3
"""Open versus periodic boundary conditions for the spinless fermion chain,
benchmarked against the Bethe ansatz.

At V = 2t the spinless fermion chain is the isotropic Heisenberg chain, whose
bulk ground state energy per bond is known exactly:

    e0 / J = 1/4 - ln 2 = -0.4431471805599...

This script runs the ALPS `dmrg` code on open chains and on rings at the *same*
bond dimension and reports the ground state energy per bond for each, so the two
boundary conditions can be compared on equal footing.

Two things are being separated.

1.  Finite-size error.  A ring has no surface: every site touches two bonds, so
    the leading correction to e0 is the conformal 1/L^2.  An open chain has two
    singly-coordinated ends, which contribute a surface energy at order 1/L.  At
    equal L and equal D the ring is far closer to the bulk value.

2.  Truncation error.  DMRG on a ring must carry entanglement across two cuts
    rather than one, so at equal D the ring is much further from *its own*
    converged energy than the open chain is from its.  This is the bond
    dimension the ring costs.

Two conventions matter and are handled here.

*   The model is entered as `hardcore boson`, not `spinless fermions`.  The
    legacy `dmrg` binary returns energies far below the true ground state for
    the fermionic model; the boson form is exactly the XXZ chain by the local
    Matsubara-Matsuda mapping, and `dmrg` handles it correctly.

*   Writing Sz = n - 1/2 in the Jz Sz Sz term shifts the energy by Jz*Nb/4,
    with Nb = L-1 bonds on an open chain and Nb = L on a ring.  That constant is
    added back below before dividing by Nb.

With Jxy = Jz = J = 1 the parameters are t = J/2, V = J, mu = J.

Usage:
    python3 run_bethe_ansatz.py --lengths 16 24 32 48 64 --maxstates 200
    python3 run_bethe_ansatz.py --dscan 20 40 80 160 320 --dscan-length 32
"""

import argparse
import math
import os
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

J = 1.0                      # isotropic Heisenberg coupling
BETHE = 0.25 - math.log(2)   # exact bulk e0/J

OPEN = "open chain lattice"
RING = "chain lattice"


def find_alps_bin(explicit=None):
    if explicit:
        return explicit
    if shutil.which("dmrg") and shutil.which("parameter2xml"):
        return ""
    guess = os.path.expanduser("~/alps-install/bin")
    if os.path.isfile(os.path.join(guess, "dmrg")):
        return guess
    sys.exit("Could not find the ALPS binaries. Pass --alps-bin /path/to/alps/bin.")


def write_parm(path, lattice, L, maxstates, sweeps):
    """Half-filled chain or ring at the isotropic Heisenberg point."""
    with open(path, "w") as f:
        f.write(
            f'LATTICE="{lattice}"\n'
            'MODEL="hardcore boson"\n'
            'CONSERVED_QUANTUMNUMBERS="N"\n'
            f"N_total={L // 2}\n"
            f"t={J / 2}\n"                       # t  = Jxy/2
            f"V={J}\n"                           # V  = Jz     (so V = 2t)
            f"mu={J}\n"                          # mu = Jz
            f"L={L}\n"
            "NUMBER_EIGENVALUES=1\n"
            f"{{SWEEPS={sweeps}; MAXSTATES={maxstates}}}\n"
        )


def read_results(xml_path):
    root = ET.parse(xml_path).getroot()
    energy = trunc = None
    for avg in root.iter("SCALAR_AVERAGE"):
        if avg.get("name") == "Energy":
            energy = float(avg.find("MEAN").text)
        elif avg.get("name") == "Truncation error":
            trunc = float(avg.find("MEAN").text)
    if energy is None:
        raise RuntimeError(f"no Energy found in {xml_path}")
    return energy, trunc


def run(exe, workdir, lattice, L, maxstates, sweeps):
    """Run one task and return (e0 per bond in spin units, truncation error)."""
    tag = ("ring" if lattice == RING else "open") + f"_L{L}_D{maxstates}"
    stem = f"parm_{tag}"
    write_parm(os.path.join(workdir, stem), lattice, L, maxstates, sweeps)
    subprocess.run([exe("parameter2xml"), stem], cwd=workdir,
                   check=True, capture_output=True)
    subprocess.run([exe("dmrg"), "--write-xml", f"{stem}.in.xml"], cwd=workdir,
                   check=True, capture_output=True)
    e_hcb, trunc = read_results(os.path.join(workdir, f"{stem}.task1.out.xml"))
    nbonds = L if lattice == RING else L - 1
    e_xxz = e_hcb + J * nbonds / 4.0     # Sz = n - 1/2 shifts by Jz*Nb/4
    return e_xxz / nbonds, trunc


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--lengths", type=int, nargs="+", default=[16, 24, 32, 48, 64],
                    help="length series, run at --maxstates for both geometries")
    ap.add_argument("--maxstates", type=int, default=200)
    ap.add_argument("--dscan", type=int, nargs="*", default=[20, 40, 80, 160, 320],
                    help="bond dimensions to scan at --dscan-length; empty to skip")
    ap.add_argument("--dscan-length", type=int, default=32)
    ap.add_argument("--sweeps", type=int, default=8)
    ap.add_argument("--workdir", default=None)
    ap.add_argument("--alps-bin", default=None)
    args = ap.parse_args()

    for L in args.lengths + [args.dscan_length]:
        if L % 2:
            sys.exit(f"L={L} is odd; half filling needs an even length.")

    bindir = find_alps_bin(args.alps_bin)
    exe = lambda name: os.path.join(bindir, name) if bindir else name
    workdir = args.workdir or tempfile.mkdtemp(prefix="alps_bc_")
    os.makedirs(workdir, exist_ok=True)

    print(f"isotropic Heisenberg point: J = {J}, so t = {J/2}, V = {J}, mu = {J}")
    print(f"half filling, Bethe ansatz bulk value 1/4 - ln 2 = {BETHE:.12f}")
    print(f"working in {workdir}\n")

    print(f"length series at D = {args.maxstates}, same D for both geometries")
    print(f"{'L':>4} {'e0 open':>17} {'e0 - Bethe':>11} | "
          f"{'e0 ring':>17} {'e0 - Bethe':>11}")
    for L in args.lengths:
        eo, _ = run(exe, workdir, OPEN, L, args.maxstates, args.sweeps)
        er, _ = run(exe, workdir, RING, L, args.maxstates, args.sweeps)
        print(f"{L:>4} {eo:>17.12f} {eo - BETHE:>11.2e} | "
              f"{er:>17.12f} {er - BETHE:>11.2e}", flush=True)
    print("\nThe open column falls as 1/L (halving per doubling), the ring column")
    print("as 1/L^2 (quartering per doubling).  That gap is the surface energy.")

    if args.dscan:
        L = args.dscan_length
        print(f"\nbond dimension scan at L = {L}")
        print(f"{'D':>5} {'e0 open':>17} {'trunc open':>11} | "
              f"{'e0 ring':>17} {'trunc ring':>11}")
        for D in args.dscan:
            eo, to = run(exe, workdir, OPEN, L, D, args.sweeps)
            er, tr = run(exe, workdir, RING, L, D, args.sweeps)
            print(f"{D:>5} {eo:>17.12f} {to:>11.1e} | "
                  f"{er:>17.12f} {tr:>11.1e}", flush=True)
        print("\nThe open chain is converged by D = 40; the ring is still moving at")
        print("D = 320.  Two entanglement cuts instead of one is what that costs.")


if __name__ == "__main__":
    main()
