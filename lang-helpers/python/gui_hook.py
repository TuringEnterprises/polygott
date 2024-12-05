import os
import re

# Function to conditionally import matplotlib and patch plt.show
def patch_matplotlib():
    try:
        import matplotlib.pyplot as plt

        def custom_show(*args, **kwargs):
            os.makedirs('data/out', exist_ok=True)
            plt.savefig('data/out/inline.png', format='png')

        # Monkey-patch plt.show
        plt.show = custom_show
    except ImportError:
        pass

    # Function to conditionally import plotly and patch fig.show
def patch_plotly():
    try:
        import plotly.graph_objects as go

        # Function to save Plotly figures
        def custom_plotly_show(fig, *args, **kwargs):
            output_dir = 'data/out'
            os.makedirs(output_dir, exist_ok=True)
            output_file_path = os.path.join(output_dir, 'inline.png')
            fig.write_image(output_file_path)

        # Function to globally patch the Plotly go.Figure class
        def patch_plotly_global_show():

            def custom_show(self, *args, **kwargs):
                custom_plotly_show(self, *args, **kwargs)

            # Monkey-patch the global go.Figure.show method
            go.Figure.show = custom_show

        # Apply the patch globally for all Plotly figures
        patch_plotly_global_show()
    except ImportError:
        pass

filename = 'main.py'
with open(filename) as file:
    code = file.read()

    patch_matplotlib()
    patch_plotly()

    compiled_code = compile(code, filename, 'exec')
    exec(compiled_code, globals())

