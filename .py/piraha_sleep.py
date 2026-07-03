import pandas as pd
import matplotlib.pyplot as plt

piraha = pd.read_csv(r".py\piraha_sleep.csv")
normal = pd.read_csv(r".py\normal_sleep.csv")

plt.rcParams["figure.figsize"] = (10, 5)


def analyze(df, name):
    print(f"\n===== {name} =====")

    for column in df.columns[1:]:
        plt.figure()
        plt.plot(df["Day"], df[column], marker="o")
        plt.title(f"{name} - {column.replace('_', ' ')}")
        plt.xlabel("Day")
        plt.ylabel(column)
        plt.grid(alpha=0.3)
        plt.tight_layout()
        plt.show()

    print("\nSummary Statistics")
    print(df.describe())

    print("\nCorrelation Matrix")
    print(df.corr(numeric_only=True).round(2))

    df["Week"] = (df["Day"] - 1) // 7 + 1
    weekly = df.groupby("Week").mean(numeric_only=True)

    print("\nWeekly Averages")
    print(weekly)

    print("\nOverall Change (Day 1 -> Day 28)")
    for col in df.columns[1:]:
        change = df[col].iloc[-1] - df[col].iloc[0]
        print(f"{col:25s}: {change:+.2f}")

    print("\nTrend Slopes (correlation with day)")
    for col in df.columns[1:]:
        slope = df[["Day", col]].corr().iloc[0, 1]
        print(f"{col:25s}: {slope:.3f}")


analyze(piraha, "Piraha Sleep")
analyze(normal, "Normal Sleep")

piraha["Condition"] = "Piraha"
normal["Condition"] = "Normal"

df = pd.concat([piraha, normal], ignore_index=True)

print("\nGroup Means")
print(df.groupby("Condition").mean(numeric_only=True))

print("\nDifference (Normal - Piraha)")
diff = df[df["Condition"] == "Normal"].mean(numeric_only=True) - df[
    df["Condition"] == "Piraha"
].mean(numeric_only=True)

print(diff)

# Plot comparison for key variables
key_vars = [
    "ReactionTimeMs",
    "Mood_1_10",
    "MemoryRecallPercent",
    "ProductivityScore_100",
]

for var in key_vars:
    plt.figure()
    for condition in df["Condition"].unique():
        subset = df[df["Condition"] == condition]
        plt.plot(subset["Day"], subset[var], label=condition)

    plt.title(var)
    plt.xlabel("Day")
    plt.ylabel(var)
    plt.legend()
    plt.grid(alpha=0.3)
    plt.show()
