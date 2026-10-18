#!/usr/bin/env python3
"""Fixed particle-number sectors of the spinless fermion chain: N = 0, 1, 2.

`CONSERVED_QUANTUMNUMBERS="N"` block-diagonalises the Hamiltonian by particle
number, and `N_total` selects one block.  Putting several `{ N_total=... }`
blocks in one parameter file therefore runs one independent DMRG calculation
per sector, and the sectors can be compared directly because they are
eigenvalues of the same Hamiltonian.

The three dilute sectors are the calibration end of that ladder:

    N = 0   the vacuum, a one-dimensional block.  E = 0 exactly.
    N = 1   one particle, an L-dimensional block.  E = -2t cos(pi/(L+1)) and
            <n_i> = 2/(L+1) sin^2(pi i/(L+1)) exactly, for any V, because a
            nearest-neighbour interaction needs two particles to act on.
    N = 2   L(L-1)/2 states.  The first sector in which V does anything at all.

In spin language S^z_i = n_i - 1/2, so these are the sectors S^z_tot = N - L/2
at the bottom of the magnetisation ladder: the fully polarised state and the
one- and two-magnon states built on it.  <n_i> is the magnon density.

`dmrg` supplies the energies, and every one is checked against a closed form:
E = 0 at N = 0, and the free-fermion level sum at N = 1 (exact for any V) and
at N = 2, V = 0.

The density profiles come from `sparsediag` instead.  The legacy ALPS `dmrg`
application measures MEASURE_LOCAL observables only on the final two-site
window of the sweep and reports zero on every other site, so it cannot give a
whole-chain profile.  These sectors are tiny -- 1, 32 and 496 states -- so
sparse diagonalisation returns the exact profile in well under a second, and
its energies agree with the DMRG ones to twelve digits, which is checked below.

Usage:
    python3 run_number_sectors.py [--L 32] [--sectors 0 1 2] [--plot fig.png]
"""

import argparse
import math
import os
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

DEFAULT_SECTORS = [0, 1, 2]


def find_alps_bin(explicit=None):
    if explicit:
        return explicit
    if shutil.which("dmrg") and shutil.which("parameter2xml"):
        return ""
    guess = os.path.expanduser("~/alps-install/bin")
    if os.path.isfile(os.path.join(guess, "dmrg")):
        return guess
    sys.exit("Could not find the ALPS binaries. Pass --alps-bin /path/to/alps/bin.")


def exact_free_energy(L, N, t=1.0):
    """N free spinless fermions on an open L-site chain: sum of the N lowest levels."""
    levels = sorted(-2.0 * t * math.cos(k * math.pi / (L + 1)) for k in range(1, L + 1))
    return sum(levels[:N])


def exact_one_particle_profile(L):
    """<n_i> of the single-particle ground state: a half-wavelength standing wave."""
    return [2.0 / (L + 1) * math.sin(math.pi * i / (L + 1)) ** 2 for i in range(1, L + 1)]


def write_parm(path, L, t, sectors, couplings, sweeps, maxstates):
    """One block per (V, N_total) pair -- the fixed-N blocks this tutorial is about."""
    with open(path, "w") as f:
        f.write(
            'LATTICE="open chain lattice"\n'
            'MODEL="hardcore boson"\n'
            'CONSERVED_QUANTUMNUMBERS="N"\n'
            f"L={L}\n"
            f"t={t}\n"
            "NUMBER_EIGENVALUES=1\n"
            f"SWEEPS={sweeps}\n"
            f"MAXSTATES={maxstates}\n"
            "MEASURE_LOCAL[Local density]=n\n"
        )
        for V in couplings:
            for N in sectors:
                f.write(f"{{ V={V}; N_total={N} }}\n")


def read_task(xml_path):
    """Return (V, N_total, energy, local density profile) of one task."""
    root = ET.parse(xml_path).getroot()
    parms = {p.get("name"): p.text for p in root.iter("PARAMETER")}
    energy, profile = None, None
    for avg in root.iter("SCALAR_AVERAGE"):
        if avg.get("name") == "Energy":
            energy = float(avg.find("MEAN").text)
            break
    for vec in root.iter("VECTOR_AVERAGE"):
        if vec.get("name") == "Local density":
            profile = [float(s.find("MEAN").text) for s in vec]
    return float(parms["V"]), int(parms["N_total"]), energy, profile


def run(exe, binary, stem, workdir, ntasks):
    subprocess.run([exe("parameter2xml"), stem], cwd=workdir,
                   check=True, capture_output=True)
    subprocess.run([exe(binary), "--write-xml", f"{stem}.in.xml"], cwd=workdir,
                   check=True, capture_output=True)
    out = {}
    for k in range(1, ntasks + 1):
        V, N, E, profile = read_task(os.path.join(workdir, f"{stem}.task{k}.out.xml"))
        out[(V, N)] = (E, profile)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--L", type=int, default=32)
    ap.add_argument("--t", type=float, default=1.0)
    ap.add_argument("--sectors", type=int, nargs="+", default=DEFAULT_SECTORS)
    ap.add_argument("--sweeps", type=int, default=6)
    ap.add_argument("--maxstates", type=int, default=100)
    ap.add_argument("--plot", default=None, help="write the profile figure to this path")
    ap.add_argument("--workdir", default=None)
    ap.add_argument("--alps-bin", default=None)
    args = ap.parse_args()

    L, t = args.L, args.t
    couplings = [2.0 * t, 0.0]          # the isotropic point, and free fermions
    sectors = args.sectors
    ntasks = len(couplings) * len(sectors)

    bindir = find_alps_bin(args.alps_bin)
    exe = lambda name: os.path.join(bindir, name) if bindir else name
    workdir = args.workdir or tempfile.mkdtemp(prefix="alps_sectors_")
    os.makedirs(workdir, exist_ok=True)

    print(f"open chain, L = {L}, t = {t}, D = {args.maxstates}, sectors N = {sectors}")
    print(f"working in {workdir}\n")

    stem = "parm_sectors"
    write_parm(os.path.join(workdir, stem), L, t, sectors, couplings,
               args.sweeps, args.maxstates)
    dmrg = run(exe, "dmrg", stem, workdir, ntasks)

    # Profiles: sparsediag, because `dmrg` only measures the final sweep window.
    ed_stem = "parm_sectors_ed"
    write_parm(os.path.join(workdir, ed_stem), L, t, sectors, couplings,
               args.sweeps, args.maxstates)
    ed = run(exe, "sparsediag", ed_stem, workdir, ntasks)

    print(f"{'V':>6} {'N':>3} {'dim':>10} {'E (dmrg)':>18} {'E free (exact)':>18}")
    for V in couplings:
        for N in sectors:
            dim = math.comb(L, N)
            print(f"{V:>6.1f} {N:>3} {dim:>10} {dmrg[(V, N)][0]:>18.12f} "
                  f"{exact_free_energy(L, N, t):>18.12f}")

    worst = max(abs(dmrg[k][0] - ed[k][0]) for k in dmrg)
    print(f"\nlargest dmrg vs sparsediag energy difference: {worst:.1e}")

    if 1 in sectors:
        exact = exact_one_particle_profile(L)
        got = ed[(couplings[0], 1)][1]
        dev = max(abs(a - b) for a, b in zip(got, exact))
        print(f"\nN=1 profile against 2/(L+1) sin^2(pi i/(L+1)): max deviation {dev:.1e}")

    if 2 in sectors:
        e_int = dmrg[(2.0 * t, 2)][0] - dmrg[(0.0, 2)][0]
        print(f"N=2 interaction energy E(V=2t) - E(V=0) = {e_int:+.10f}")
        n_int = ed[(2.0 * t, 2)][1]
        n_free = ed[(0.0, 2)][1]
        mid = L // 2 - 1
        print(f"N=2 central density  <n_{mid+1}>: {n_free[mid]:.6f} at V=0, "
              f"{n_int[mid]:.6f} at V=2t")
        print(f"N=2 largest profile shift: "
              f"{max(abs(a - b) for a, b in zip(n_int, n_free)):.2e}")

    print()
    for (V, N), (_, profile) in sorted(ed.items()):
        if profile is not None:
            print(f"V={V:g}, N={N}: sum_i <n_i> = {sum(profile):.8f}  "
                  f"(sum rule: {N})")

    if args.plot:
        make_plot(args.plot, L, sectors, couplings, ed)
        print(f"\nfigure written to {args.plot}")


def make_plot(path, L, sectors, couplings, data):
    import numpy as np
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    i = np.arange(1, L + 1)
    V = couplings[0]
    fig, ax = plt.subplots(1, 2, figsize=(11, 4.2))

    ax[0].plot(i, exact_one_particle_profile(L), "-", color="0.6", lw=4, alpha=0.8,
               zorder=1, label=r"exact $\frac{2}{L+1}\sin^2\frac{\pi i}{L+1}$")
    for marker, N in zip("os^dv", sectors):
        ax[0].plot(i, data[(V, N)][1], marker + "-", ms=4, zorder=3, label=f"$N={N}$")
    ax[0].set_xlabel(r"site $i$")
    ax[0].set_ylabel(r"$\langle n_i \rangle$")
    ax[0].set_title(r"(a)  particle-number sectors, $V=2t$")
    ax[0].legend(loc="upper center", fontsize=9, ncol=2, framealpha=0.95)
    ax[0].grid(alpha=0.3)
    ax[0].set_xlim(0, L + 1)
    ax[0].set_ylim(-0.005, 0.135)

    if 2 in sectors:
        ax[1].plot(i, data[(0.0, 2)][1], "s-", ms=5, label=r"$V=0$  (free)")
        ax[1].plot(i, data[(V, 2)][1], "^-", ms=5, label=r"$V=2t$  (repulsive)")
        ax[1].set_xlabel(r"site $i$")
        ax[1].set_ylabel(r"$\langle n_i \rangle$")
        ax[1].set_title(r"(b)  $N=2$, central region magnified")
        ax[1].legend(loc="upper center", fontsize=9, framealpha=0.95)
        ax[1].grid(alpha=0.3)
        ax[1].set_xlim(L * 0.2, L * 0.8)
        ax[1].set_ylim(0.0545, 0.108)

    fig.tight_layout()
    fig.savefig(path, dpi=150)


if __name__ == "__main__":
    main()
