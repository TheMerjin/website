import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import pandas as pd

# ---- Load custom font with larger size ----
font_path = (
    r"C:\Users\Sreek\Downloads\helvetica-neue-55-cufonfonts\HelveticaNeue-Medium.otf"
)
helv_black = fm.FontProperties(fname=font_path, size=14)

# ---- Data ----
data = [
    ["Dysphonia", "R49.0", 0.4082804179, 0.367, 0.455, "<1e-300"],
    ["Voice and resonance disorders", "R49*", 0.4408890354, 0.400, 0.486, "<1e-300"],
    [
        "Other voice and resonance disorders",
        "R49.8",
        0.6530447852,
        0.516,
        0.827,
        "3.980E-04",
    ],
    [
        "Unspecified voice and resonance disorder",
        "R49.9",
        0.7128996011,
        0.576,
        0.883,
        "1.923E-03",
    ],
    ["Slurred speech", "R47.81", 0.8950850194, 0.821, 0.976, "1.163E-02"],
    ["Speech disturbances, NEC", "R47*", 0.9282413008, 0.883, 0.976, "3.768E-03"],
    ["Dysarthria and anarthria", "R47.1", 1.0000000000, 0.877, 1.013, "1.059E-01"],
    ["Aphonia", "R49.1", 1.048884936, 0.746, 1.475, "7.836E-01"],
    ["Dysphasia", "R47.02", 1.059236098, 0.908, 1.235, "4.630E-01"],
    ["Aphasia", "R47.01", 1.300403494, 1.212, 1.395, "2.345E-13"],
    [
        "Cognitive Communication Deficit",
        "R41.841",
        1.318071729,
        1.198,
        1.450,
        "1.257E-08",
    ],
    [
        "Unspecified symbolic dysfunctions",
        "R48.9",
        1.555791861,
        1.136,
        2.132,
        "5.938E-03",
    ],
    ["Other speech disturbances", "R47.89", 1.687107353, 1.562, 1.822, "<1e-300"],
    [
        "Dyslexia & other symbolic dysfunctions",
        "R48*",
        1.698927631,
        1.500,
        1.925,
        "<1e-300",
    ],
    ["Apraxia", "R48.2", 1.818300496, 1.469, 2.251, "4.044E-08"],
    ["Other symbolic dysfunctions", "R48.8", 1.838935010, 1.523, 2.220, "2.297E-10"],
    ["Unspecified speech disturbances", "R47.9", 2.073120004, 1.910, 2.250, "<1e-300"],
    ["Dyslexia and alexia", "R48.0", 3.173781168, 2.315, 4.351, "7.221E-13"],
    [
        "Fluency disorder in conditions classified elsewhere",
        "R47.82",
        6.523520796,
        5.269,
        8.076,
        "<1e-300",
    ],
]

df = pd.DataFrame(
    data, columns=["Diagnosis", "ICD", "OR", "CI_low", "CI_high", "p_value"]
)


# ---- Clean p-values ----
def parse_p(val):
    if isinstance(val, str) and val.startswith("<"):
        return float(val[1:])
    return float(val)


df["p_num"] = df["p_value"].apply(parse_p)

# ---- Assign colors ----
colors = []
for i, row in df.iterrows():
    if row["p_num"] > 0.05:
        colors.append("grey")
    else:
        if row["OR"] > 1:
            colors.append("#2774AE")
        else:
            colors.append("#FFD100")

# ---- Plot ----
plt.figure(figsize=(8, 10))  # slightly larger for better spacing

plt.scatter(df["OR"], df.index, color=colors, edgecolor="k", zorder=3, s=70)
plt.hlines(df.index, df["CI_low"], df["CI_high"], color="black", zorder=2)
plt.axvline(1, color="grey", linestyle="--")

# Formatting with larger font
plt.yticks(df.index, df["Diagnosis"], fontproperties=helv_black)
plt.xlabel("Odds Ratio (95% CI)", fontproperties=helv_black, fontsize=14)
plt.title("Forest Plot of Odds Ratios", fontproperties=helv_black, fontsize=16)

plt.tight_layout()
plt.show()
