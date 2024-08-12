const { execSync } = require("child_process");
const fs = require("fs");

const UPSTREAM_URL = "https://github.com/AgentBurgundy/fire-saas.git";

function runCommand(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: "inherit" });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function checkAndAddUpstream() {
  try {
    const remotes = execSync("git remote", { encoding: "utf8" }).split("\n");
    if (!remotes.includes("upstream")) {
      console.log("Adding upstream remote...");
      runCommand(`git remote add upstream ${UPSTREAM_URL}`);
    } else {
      console.log("Upstream remote already exists.");
    }
  } catch (error) {
    console.error("Error checking/adding upstream:", error.message);
    process.exit(1);
  }
}

function updateFromUpstream() {
  checkAndAddUpstream();

  console.log("Fetching from upstream...");
  runCommand("git fetch upstream");

  try {
    execSync("git diff --quiet HEAD upstream/main", { stdio: "ignore" });
    console.log("No new changes from upstream.");
    return;
  } catch (error) {
    // There are changes, continue with the update
  }

  const branchName = `update-from-upstream-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}`;
  console.log(`Creating new branch: ${branchName}`);
  runCommand(`git checkout -b ${branchName}`);

  console.log("Merging changes from upstream...");
  runCommand("git merge upstream/main --no-edit");

  console.log("Pushing new branch to origin...");
  runCommand(`git push -u origin ${branchName}`);

  console.log(
    `Updates from upstream have been merged into the new branch: ${branchName}`,
  );
  console.log(
    "Please review the changes and create a pull request if everything looks good.",
  );
}

updateFromUpstream();
