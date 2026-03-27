# utils/biology_constants.py

AGING_GENES = [
    "ELOVL2", "FHL2", "PENK", "KLF14", "TRIM59", "CSNK1D",
    "SIRT1", "SIRT6", "FOXO3", "CDKN2A", "TERT", "IGF1",
    "mTOR", "AMPK", "NFKB1", "LMNA", "WRN", "APOE", "TOMM40", "IL6"
]

CHROMOSOMES = [f"chr{i}" for i in range(1, 23)] + ["chrX", "chrY", "chrM"]

COMMON_GENES = [f"GENE_{i:04d}" for i in range(1, 100)] + ["ACTB", "GAPDH", "TP53", "BRCA1", "EGFR", "MYC"]

DRUG_CANDIDATES = [
    {"name": "Rapamycin", "smiles": "C[C@@H]1CC[C@H]2C[C@@H]...", "mechanism": "mTOR inhibitor"},
    {"name": "Metformin", "smiles": "CN(C)C(=N)N=C(N)N", "mechanism": "AMPK activator"},
    {"name": "Resveratrol", "smiles": "O[C@H]1C[C@@H]...", "mechanism": "SIRT1 activator"},
    {"name": "Senolytics-A", "smiles": "O=C1C=C(O)c2...", "mechanism": "Induces apoptosis in senescent cells"},
    {"name": "NAD+ Precursor", "smiles": "NC(=O)c1ccc(n1)C[C@H]...", "mechanism": "Boosts NAD+ levels"},
    {"name": "Acarbose", "smiles": "CC1OC(...)...", "mechanism": "Alpha-glucosidase inhibitor"},
]

PATHWAYS = [
    {"name": "mTOR signaling pathway"},
    {"name": "PI3K-Akt signaling pathway"},
    {"name": "p53 signaling pathway"},
    {"name": "NF-kappa B signaling pathway"},
    {"name": "Wnt signaling pathway"},
    {"name": "AMPK signaling pathway"},
]
