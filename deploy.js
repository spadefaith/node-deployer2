import shell from "shelljs";
import fs from "node:fs";
import workerpool from "workerpool";
import { exec, spawn } from "child_process";

const PWD = process.env.PWD;

export const log = (name, message) => {
  const logFile = `${PWD}/logs/${name}.txt`;
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, message);
  } else {
    let content = fs.readFileSync(logFile, "utf8");
    content += message;
    fs.writeFileSync(logFile, content);
  }
};

export const escapeNewlines = (str) => {
  return str ? String(str).replace(/\n/g, "\\n") : "";
};
export const format = (key, value) => {
  return `${key}=${escapeNewlines(value)}`;
};
export const toEnv = (obj) => {
  const joined = Object.keys(obj)
    .map((key) => {
      const val = obj[key];
      return format(key, val);
    })
    .join("\n");

  return joined;
};
async function deploy(props) {
  try {
    const { root_path, branch, repo, envs, name } = props || {};

    const logFile = `${PWD}/logs/${name}.txt`;

    console.log(41, logFile);
    /**
     * remove dir
     */
    fs.rmSync(root_path, { recursive: true, force: true });
    fs.mkdirSync(root_path, { recursive: true });
    fs.unlinkSync(logFile);

    const content = await toEnv(envs);
    /**
     * deploy
     */
    shell.cd(root_path);
    // const clone = await shell.exec(
    //   `git clone --branch=${branch} ${repo} ${root_path} `
    // );

    const clone = await runScript(
      `git clone --branch=${branch} ${repo} ${root_path} `,
      [],
      {},
      (d) =>
        workerpool.workerEmit({
          message: d,
        }) || log(name, d),
      (d) =>
        workerpool.workerEmit({
          message: d,
        }) || log(name, d)
    );

    // clone.stdout.on("data", (data) => console.log(41, data));

    if (clone.code != 0) {
      console.log(`git clone --branch=${branch} ${repo} ${root_path} `);
      throw new Error(clone.stderr);
    }
    await fs.writeFileSync(`${root_path}/.env`, content);
    const deploy = await runScript(
      `docker compose down  && docker compose up --build -d `,
      [],
      {
        cwd: root_path,
        env: envs,
      },
      (d) =>
        workerpool.workerEmit({
          message: d,
        }) || log(name, d),
      (d) =>
        workerpool.workerEmit({
          message: d,
        }) || log(name, d)
    );

    if (deploy.code !== 0) {
      throw new Error(deploy.stderr);
    }

    /**clean */
    await runScript(
      "docker system prune -f",
      [],
      {},
      (d) =>
        workerpool.workerEmit({
          message: d,
        }) || log(name, d),
      (d) =>
        workerpool.workerEmit({
          message: d,
        }) || log(name, d)
    );

    shell.cd(PWD);
    // process.chdir(PWD);
  } catch (err) {
    console.log(54, err);
    shell.cd(PWD);
    // process.chdir(PWD);
  }
}

// console.log(49, workerData);
// deploy(workerData);

workerpool.worker({
  deploy: deploy,
});

async function runScript(script, ar, opts, stdoutCallback, stderrCallback) {
  return await new Promise((resolve, reject) => {
    const child = spawn(script, ar || [], {
      shell: true,
      stdio: ["inherit"],
      encoding: "utf-8",
      ...(opts || {}),
    });
    child.stdout.on("data", async (data) => {
      data = data.toString();
      stdoutCallback(data);
    });
    child.stderr.on("data", async (data) => {
      data = data.toString();
      stderrCallback(data);
    });
    child.on("close", async (code) => {
      // console.log(output);
      resolve({ code });
    });
  });
}
