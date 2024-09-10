import io
import os
import base64
import matplotlib.pyplot as plt

# Backup the original plt.show
original_show = plt.show

def custom_show(*args, **kwargs):
    os.makedirs('data/out', exist_ok=True)
    plt.savefig('data/out/inline.png', format='png')

# Monkey-patch plt.show
plt.show = custom_show

# Now execute the original script
exec(open('/opt/python3-blank-env/main.py').read())

# Restore the original plt.show
plt.show = original_show
