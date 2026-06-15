import numpy as np
from scipy import stats

time_to_solve = [388.27]
heart_rate = []


def analyze_metric(name, master_list, lower_is_better=True):

    on_data = master_list[0::2]
    off_data = master_list[1::2]

    on_mean = np.mean(on_data)
    off_mean = np.mean(off_data)

    t_stat, p_value = stats.ttest_ind(on_data, off_data, equal_var=False)

    pooled_std = np.sqrt(
        (np.std(on_data, ddof=1) ** 2 + np.std(off_data, ddof=1) ** 2) / 2
    )
    cohens_d = (
        (off_mean - on_mean) / pooled_std
        if lower_is_better
        else (on_mean - off_mean) / pooled_std
    )

    print(f"=== {name.upper()} ANALYSIS ===")
    print(f"ON Days Average:  {on_mean:.2f}")
    print(f"OFF Days Average: {off_mean:.2f}")
    print(f"Raw Difference:   {abs(on_mean - off_mean):.2f}")
    print(
        f"P-value:          {p_value:.4f} "
        + (
            "(Statistically Significant!)"
            if p_value < 0.05
            else "(Not Significant Yet)"
        )
    )
    print(f"Cohen's d:        {cohens_d:.2f} (Effect size)")
    print("-" * 40)


total_days = len(time_to_solve)
print(f"Data points collected: {total_days} days total.\n")

analyze_metric("Brain Activity (Puzzle Speed)", time_to_solve, lower_is_better=True)
analyze_metric("Relaxation (Heart Rate)", heart_rate, lower_is_better=True)
