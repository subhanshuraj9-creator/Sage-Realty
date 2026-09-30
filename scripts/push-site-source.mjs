import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import process from "node:process";

const rl = createInterface({ input: process.stdin, terminal: false });
const line = await new Promise((resolve) => rl.once("line", resolve));
rl.close();
const credential = JSON.parse(line || "{}");
if (!credential.token || !credential.remote_url || !credential.branch) throw new Error("Missing source credential");

const common = ["--git-dir=.sites-runtime/source.git", "--work-tree=."];
const run = (args, extraEnv = {}) => new Promise((resolve, reject) => {
  const child = spawn("git", [...common, ...args], { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...extraEnv } });
  let stdout = ""; let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  child.on("close", (code) => code === 0 ? resolve(stdout.trim()) : reject(new Error(stderr.trim() || `git exited ${code}`)));
});

await run(["init", "--initial-branch=main"]);
await run(["config", "user.name", "Codex Sites"]);
await run(["config", "user.email", "sites@openai.com"]);
await run(["add", "--all"]);
await run(["commit", "-m", "Build SAGE Skyline concept"]);
try { await run(["remote", "remove", "origin"]); } catch {}
await run(["remote", "add", "origin", credential.remote_url]);
const authEnv = {
  GIT_CONFIG_COUNT: "1",
  GIT_CONFIG_KEY_0: "http.extraHeader",
  GIT_CONFIG_VALUE_0: `Authorization: Bearer ${credential.token}`,
};
await run(["push", "origin", `HEAD:${credential.branch}`], authEnv);
const sha = await run(["rev-parse", "HEAD"]);
process.stdout.write(JSON.stringify({ commit_sha: sha }));
