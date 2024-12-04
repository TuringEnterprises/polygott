import os
import sys

def update_build_gradle(dependencies_list, build_gradle_path="build.gradle"):
    if not os.path.exists(build_gradle_path):
        print(f"Error: {build_gradle_path} not found!")
        return

    # Read the current content of build.gradle
    with open(build_gradle_path, 'r') as file:
        content = file.readlines()

    # Identify where the dependencies block is
    start_idx = -1
    end_idx = -1
    for idx, line in enumerate(content):
        if "dependencies {" in line:
            start_idx = idx
        if start_idx != -1 and "}" in line and idx > start_idx:
            end_idx = idx
            break

    if start_idx == -1:
        print("Error: No dependencies block found in build.gradle!")
        return

    # Extract existing dependencies
    existing_dependencies = [
        line.strip() for line in content[start_idx + 1:end_idx]
        if line.strip().startswith("implementation")
    ]

    # Prepare the new dependencies to add
    new_dependencies = []
    for dep in dependencies_list:
        dep_entry = f"implementation '{dep}'"
        if dep_entry not in existing_dependencies:
            new_dependencies.append(dep_entry)

    if not new_dependencies:
        return

    # Insert the new dependencies into the content
    updated_content = content[:end_idx] + [f"    {dep}\n" for dep in new_dependencies] + content[end_idx:]

    # Write the updated content back to build.gradle
    with open(build_gradle_path, 'w') as file:
        file.writelines(updated_content)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update_deps.py group:artifact:version [group:artifact:version ...]")
        sys.exit(1)

    dependencies = sys.argv[1:]  # Collect all arguments after the script name as dependencies
    update_build_gradle(dependencies)
