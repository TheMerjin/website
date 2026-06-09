import numpy as np
import pandas as pd


def simulate_multigenerational_selection_fixed(
    generations=5,
    embryos_per_generation=6,
    heritability=0.5,
    trait_mean=100,
    trait_sd=15,
    iterations=10000,
    r_assortative=0.35,  # Realistic spouse correlation for traits like IQ/Height
):
    final_control_scores = []
    final_enhanced_scores = []
    final_assortative_scores = []

    genetic_sd = trait_sd * np.sqrt(heritability)
    environmental_sd = trait_sd * np.sqrt(1 - heritability)
    recombination_sd = genetic_sd / np.sqrt(2)

    for _ in range(iterations):

        # --- 1. CONTROL LINEAGE ---
        gen_control = 0.0
        for gen in range(generations):
            partner = np.random.normal(0, genetic_sd)
            mid_parent = (gen_control + partner) / 2
            pool = np.random.normal(
                mid_parent, recombination_sd, embryos_per_generation
            )
            gen_control = pool[0]  # Random pick
        final_control_scores.append(
            trait_mean + gen_control + np.random.normal(0, environmental_sd)
        )

        # --- 2. ENHANCED LINEAGE (Random Partner + Selection) ---
        gen_enhanced = 0.0
        for gen in range(generations):
            partner = np.random.normal(0, genetic_sd)
            mid_parent = (gen_enhanced + partner) / 2
            pool = np.random.normal(
                mid_parent, recombination_sd, embryos_per_generation
            )
            gen_enhanced = np.max(pool)  # Selection
        final_enhanced_scores.append(
            trait_mean + gen_enhanced + np.random.normal(0, environmental_sd)
        )

        # --- 3. ASSORTATIVE ENHANCED LINEAGE (High-Trait Partner + Selection) ---
        gen_assortative = 0.0
        for gen in range(generations):
            # Correct conditional distribution for assortative mating:
            partner_mean = r_assortative * gen_assortative
            partner_sd = genetic_sd * np.sqrt(1 - r_assortative**2)
            partner = np.random.normal(partner_mean, partner_sd)

            mid_parent = (gen_assortative + partner) / 2
            pool = np.random.normal(
                mid_parent, recombination_sd, embryos_per_generation
            )
            gen_assortative = np.max(pool)  # Selection
        final_assortative_scores.append(
            trait_mean + gen_assortative + np.random.normal(0, environmental_sd)
        )

    return pd.DataFrame(
        {
            "Control (Natural)": final_control_scores,
            "Enhanced (Standard)": final_enhanced_scores,
            "Enhanced (Assortative)": final_assortative_scores,
        }
    )


# Run and Print
results = simulate_multigenerational_selection_fixed()
print(results.describe().loc[["mean", "50%"]])
