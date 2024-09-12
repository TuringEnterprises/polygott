import os
import re

# Function to conditionally import matplotlib and patch plt.show
def patch_matplotlib():
    try:
        import matplotlib.pyplot as plt
        matplotlib_imported = True

        # Backup the original plt.show
        global original_show
        original_show = plt.show

        def custom_show(*args, **kwargs):
            os.makedirs('data/out', exist_ok=True)
            plt.savefig('data/out/inline.png', format='png')

        # Monkey-patch plt.show
        plt.show = custom_show
    except ImportError:
        print("matplotlib is not available")

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
            original_plotly_show = go.Figure.show

            def custom_show(self, *args, **kwargs):
                custom_plotly_show(self, *args, **kwargs)

            # Monkey-patch the global go.Figure.show method
            go.Figure.show = custom_show

        # Apply the patch globally for all Plotly figures
        patch_plotly_global_show()
    except ImportError:
        print("plotly is not available")


# Function to execute the script and detect imports
def execute_script_with_patches(script_path):
    with open(script_path) as file:
        code = file.read()

        # Check for 'import matplotlib' or 'from matplotlib' in the script
        if re.search(r'(^|\s)import matplotlib|from matplotlib', code):
            patch_matplotlib()

        # Check for 'import plotly' or 'from plotly' in the script
        if re.search(r'(^|\s)import plotly|from plotly', code):
            patch_plotly()

        # Now execute the original script
        exec(code, globals())

# Execute the script
execute_script_with_patches('plot1.py')
