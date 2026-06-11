import numpy as np
import pandas as pd


def calculate_tidal_height(
    t_hours, csv_path="san_diego_harmonic_constituents.csv", z0=0.0
):
    """
    Calculates the tidal height h(t) in feet for a given time t (in hours).
    Formula: h(t) = Z0 + Sum( A_i * cos(speed_i * t - phase_i) )
    Note: Converts degrees to radians for numpy's cos function.
    """
    df = pd.read_csv(csv_path)

    # Convert speeds and phases from degrees to radians
    speed_rad = np.radians(df["Speed_DEG_HR"])
    phase_rad = np.radians(df["Phase_DEG"])
    amplitudes = df["Amplitude_FT"]

    # Vectorized computation of each constituent's contribution at time t
    contributions = amplitudes * np.cos(speed_rad * t_hours - phase_rad)

    # Return total sum + Mean Sea Level offset
    return z0 + np.sum(contributions)


h_t2 = calculate_tidal_height(t_hours=2.0)
print(f"Tidal height at t=2: {h_t2:.4f} feet")


def calculate_height_formula(
    csv_path="san_diego_harmonic_constituents.csv", z0=0.0, precision=4
):
    df = pd.read_csv(csv_path)

    # Filter out constituents with 0 amplitude to keep the equation clean
    df_filtered = df[df["Amplitude_FT"] > 0]

    terms = []
    for _, row in df_filtered.iterrows():
        amp = round(row["Amplitude_FT"], precision)
        speed = round(row["Speed_DEG_HR"], precision)
        phase = round(row["Phase_DEG"], precision)

        # Format individual constituent string: A*cos(v*t - phase)
        term = f"{amp}*cos({speed}*t - {phase})"
        terms.append(term)

    # Join all terms with a plus sign
    formula_body = " + ".join(terms)

    # Prepend Mean Sea Level if it's non-zero
    if z0 != 0.0:
        final_formula = f"h(t) = {z0} + {formula_body}"
    else:
        final_formula = f"h(t) = {formula_body}"

    return final_formula


# Example usage:
tide_formula = calculate_height_formula()
print(tide_formula)


print("Now lets consider a scenario where the moon disappears")


solar_constituents = [
    {
        "Name": "S2",
        "Amplitude_FT": 0.74,
        "Description": "Principal solar semidiurnal constituent",
    },
    {
        "Name": "P1",
        "Amplitude_FT": 0.35,
        "Description": "Solar diurnal constituent",
    },
    {
        "Name": "SA",
        "Amplitude_FT": 0.25,
        "Description": "Solar annual constituent (seasonal/thermal changes)",
    },
    {
        "Name": "T2",
        "Amplitude_FT": 0.05,
        "Description": "Larger solar elliptic constituent",
    },
    {
        "Name": "S1",
        "Amplitude_FT": 0.02,
        "Description": "Solar diurnal constituent (radiational/wind-driven)",
    },
    {
        "Name": "R2",
        "Amplitude_FT": 0.01,
        "Description": "Smaller solar elliptic constituent",
    },
    {
        "Name": "S4",
        "Amplitude_FT": 0.01,
        "Description": "Shallow water overtides of the principal solar constituent",
    },
    {
        "Name": "S6",
        "Amplitude_FT": 0.00,
        "Description": "Shallow water overtides of the principal solar constituent",
    },
    {
        "Name": "SSA",
        "Amplitude_FT": 0.00,
        "Description": "Solar semiannual constituent",
    },
]
solar_names = ["S2", "P1", "SA", "T2", "S1", "R2", "S4", "S6", "SSA"]


def calculate_solar_tidal_height(
    t_hours, csv_path="san_diego_harmonic_constituents.csv", z0=0.0
):
    df = pd.read_csv(csv_path)

    # FILTER: Only keep rows where the 'Name' is in our solar_names list
    df_solar = df[df["Name"].isin(solar_names)]

    # Convert speeds and phases from degrees to radians
    speed_rad = np.radians(df_solar["Speed_DEG_HR"])
    phase_rad = np.radians(df_solar["Phase_DEG"])
    amplitudes = df_solar["Amplitude_FT"]

    # Vectorized computation
    contributions = amplitudes * np.cos(speed_rad * t_hours - phase_rad)

    return z0 + np.sum(contributions)


def calculate_solar_height_formula(
    csv_path="san_diego_harmonic_constituents.csv", z0=0.0, precision=4
):
    df = pd.read_csv(csv_path)

    # FILTER: Keep only solar names AND amplitudes greater than 0
    solar_mask = df["Name"].isin(solar_names)
    amplitude_mask = df["Amplitude_FT"] > 0

    df_filtered = df[solar_mask & amplitude_mask]

    terms = []
    for _, row in df_filtered.iterrows():
        amp = round(row["Amplitude_FT"], precision)
        speed = round(row["Speed_DEG_HR"], precision)
        phase = round(row["Phase_DEG"], precision)

        # Format individual constituent string: A*cos(v*t - phase)
        term = f"{amp}*cos({speed}*t - {phase})"
        terms.append(term)

    formula_body = " + ".join(terms)

    if z0 != 0.0:
        final_formula = f"h(t) = {z0} + {formula_body}"
    else:
        final_formula = f"h(t) = {formula_body}"

    return final_formula


formula = calculate_solar_height_formula()
height_at_2 = calculate_solar_tidal_height(t_hours=2.0)

print("Formula:")
print(formula)
print("\nHeight at t=2:")
print(f"{height_at_2:.4f} feet")


print("\n")
print("Diffrence in heights at t= 2")
print(h_t2 - height_at_2)
