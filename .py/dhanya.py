import matplotlib.pyplot as plt
import numpy as np


def generate_water_flowchart_fixed():
    fig, ax = plt.subplots(figsize=(12, 4))

    # Use a smaller grid
    x_points = np.linspace(-10, 30, 100)
    y_points = np.linspace(-10, 30, 100)

    for x in x_points:
        for y in y_points:
            # Define your slope function dy/dx = f(x, y)
            dy_dt = 2 * y
            dx_dt = x  # example slope # horizontal arrow length
            scale = 1
            dx = dx_dt * scale
            dy = dy_dt * scale

            # Draw arrow at (x, y)
            ax.annotate(
                "",
                xy=(x + dx, y + dy),
                xytext=(x, y),
                arrowprops=dict(arrowstyle="->", lw=1),
            )

    ax.set_xlim(-10, 10)
    ax.set_ylim(-10, 10)
    ax.set_title(
        "Water Usage 'Rebound Effect' Cycle", fontsize=14, pad=20, fontweight="bold"
    )
    ax.axis("on")  # optional: show axes for slope field reference
    plt.show()


generate_water_flowchart_fixed()
