import shell from "shelljs";
import fs from "node:fs";
import workerpool from "workerpool";
import { exec, spawn } from "child_process";
import path from "node:path";
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

export const removeLogFile = (name) => {
  const logFile = `${PWD}/logs/${name}.txt`;
  console.log(41, logFile);
  fs.existsSync(logFile) && fs.unlinkSync(logFile);
};

export const changePath = (path) => {
  shell.exec(`cd ${path}`);
};

async function runScript(script, ar, opts, stdoutCallback, stderrCallback) {
  console.log(43, script, ar || [], {
    shell: true,
    stdio: ["inherit"],
    encoding: "utf-8",
    ...(opts || {}),
  });
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

async function deploy(props) {
  try {
    const { root_path, branch, repo, envs, name } = props || {};

    console.log(69, props);

    /**
     * remove dir
     */
    fs.rmSync(root_path, { recursive: true, force: true });
    fs.mkdirSync(root_path, { recursive: true });
    removeLogFile(name);

    const content = await toEnv(envs);
    /**
     * deploy
     */
    // const clone = await shell.exec(
    //   `git clone --branch=${branch} ${repo} ${root_path} `
    // );

    const clone = await runScript(
      `git clone --branch=${branch} ${repo} ${root_path} `,
      [],
      {
        cwd: root_path,
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

    if (clone.code != 0) {
      console.log(
        106,
        `error git clone --branch=${branch} ${repo} ${root_path} `
      );

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

    changePath(PWD);
    // process.chdir(PWD);
  } catch (err) {
    console.log(54, err);

    // process.chdir(PWD);
    changePath(PWD);
  }
}

async function remove(props) {
  console.log(152, props);
  let root_path = null;
  const { name } = props;

  if (!name) {
    return console.log("name is required");
  }

  const removeDir = (root_path) =>
    root_path && fs.rmSync(root_path, { recursive: true, force: true });

  try {
    root_path = path.join(PWD, "../apps", `${name}`);

    console.log(156, fs.existsSync(root_path), root_path);

    if (!fs.existsSync(root_path)) {
      throw new Error(`unable to remove, root_path ${root_path} is not found`);
    }

    //TODO - make docker-compose.yml dynamic
    const composePath = `${root_path}/docker-compose.yml`;
    if (!fs.existsSync(composePath)) {
      throw new Error(
        `unable to remove, docker-compose.yml ${composePath} is not found`
      );
    }

    /**
     * down container
     */
    changePath(root_path);

    const down = await runScript(
      "docker compose down",
      [],
      {
        cwd: root_path,
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

    if (down.code !== 0) {
      throw new Error(down.stderr);
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

    removeDir(root_path);
    removeLogFile(name);
    // process.chdir(PWD);
    changePath(PWD);
  } catch (err) {
    /** remove directory*/
    console.log(216, err);
    console.log(217, root_path);

    removeDir(root_path);
    removeLogFile(name);
    // process.chdir(PWD);
    changePath(PWD);
  }
}

// console.log(49, workerData);
// deploy(workerData);

workerpool.worker({
  deploy: deploy,
  remove: remove,
});
