import os
import random
import subprocess
from datetime import datetime, timedelta


def get_positive_int(prompt, default=20):
    while True:
        try:
            user_input = input(f"{prompt} (default {default}): ")

            if not user_input.strip():
                return default

            value = int(user_input)

            if value > 0:
                return value
            else:
                print("Please enter a positive integer.")

        except ValueError:
            print("Invalid input. Please enter a valid integer.")


def get_repo_path(prompt, default="."):
    while True:
        user_input = input(f"{prompt} (default current directory): ")

        if not user_input.strip():
            return default

        if os.path.isdir(user_input):
            return user_input
        else:
            print("Directory does not exist. Please enter a valid path.")


def get_filename(prompt, default="data.txt"):
    user_input = input(f"{prompt} (default {default}): ")

    if not user_input.strip():
        return default

    return user_input


# RANDOM DATE BETWEEN JANUARY AND MAY 2025
def random_date_2025_jan_to_may():
    start_date = datetime(2025, 1, 1, 0, 0, 0)
    end_date = datetime(2025, 5, 31, 23, 59, 59)

    delta = end_date - start_date

    random_seconds = random.randint(
        0,
        int(delta.total_seconds())
    )

    commit_date = start_date + timedelta(seconds=random_seconds)

    return commit_date


def make_commit(date, repo_path, filename, message="graph-greener!"):
    filepath = os.path.join(repo_path, filename)

    # CREATE FILE IF IT DOES NOT EXIST
    if not os.path.exists(filepath):
        with open(filepath, "w") as f:
            f.write("GitHub contribution graph data\n")

    # APPEND NEW LINE
    with open(filepath, "a") as f:
        f.write(f"Commit at {date.isoformat()}\n")

    # GIT ADD
    subprocess.run(
        ["git", "add", filename],
        cwd=repo_path
    )

    # SET CUSTOM COMMIT DATE
    env = os.environ.copy()

    date_str = date.strftime("%Y-%m-%dT%H:%M:%S")

    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str

    # GIT COMMIT
    subprocess.run(
        ["git", "commit", "-m", message],
        cwd=repo_path,
        env=env
    )


def main():
    print("=" * 60)
    print("🌱 Welcome to graph-greener 🌱")
    print("=" * 60)

    print("Generate GitHub contribution commits from Jan-May 2025\n")

    num_commits = get_positive_int(
        "How many commits do you want to make",
        20
    )

    repo_path = get_repo_path(
        "Enter the path to your local git repository",
        "."
    )

    filename = get_filename(
        "Enter the filename to modify for commits",
        "data.txt"
    )

    print(f"\nMaking {num_commits} commits...")
    print(f"Repository: {repo_path}")
    print(f"File: {filename}\n")

    # CREATE COMMITS
    for i in range(num_commits):
        commit_date = random_date_2025_jan_to_may()

        print(
            f"[{i+1}/{num_commits}] "
            f"Committing at "
            f"{commit_date.strftime('%Y-%m-%d %H:%M:%S')}"
        )

        make_commit(
            commit_date,
            repo_path,
            filename
        )

    # PUSH TO GITHUB
    print("\nPushing commits to GitHub...\n")

    subprocess.run(
        ["git", "push"],
        cwd=repo_path
    )

    print("\n✅ All done!")
    print("Check your GitHub contribution graph in a few minutes.")


if __name__ == "__main__":
    main()
