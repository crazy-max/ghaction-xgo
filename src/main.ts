import * as installer from './installer';
import * as os from 'os';
import * as path from 'path';
import * as child_process from 'child_process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    if (os.platform() !== 'linux') {
      core.setFailed('Only supported on linux platform');
      return;
    }

    const xgo_version = core.getInput('xgo_version') || 'latest';
    const go_version = core.getInput('go_version');
    const dest = core.getInput('dest');
    const pkg = core.getInput('pkg');
    const prefix = core.getInput('prefix');
    const targets = core.getInput('targets');
    const v = core.getInput('v');
    const x = core.getInput('x');
    const race = core.getInput('race');
    const tags = core.getInput('tags');
    const ldflags = core.getInput('ldflags');
    const buildmode = core.getInput('buildmode');
    const buildvcs = core.getInput('buildvcs');
    const workingDir = path.resolve(core.getInput('working_dir') || process.env['GITHUB_WORKSPACE'] || '.');

    core.startGroup(`Download and install xgo`);
    const xgo = await installer.getXgo(xgo_version);
    core.endGroup();

    // Run xgo
    const args: Array<string> = [];
    if (go_version) {
      args.push('-go', go_version);
    }
    if (pkg) {
      args.push('-pkg', pkg);
    }
    if (prefix) {
      args.push('-out', prefix);
    }
    if (dest) {
      args.push('-dest', dest);
    }
    if (targets) {
      args.push('-targets', targets);
    }
    if (/true/i.test(v)) {
      args.push('-v');
    }
    if (/true/i.test(x)) {
      args.push('-x');
    }
    if (/true/i.test(race)) {
      args.push('-race');
    }
    if (tags) {
      args.push('-tags', tags);
    }
    if (ldflags) {
      args.push('-ldflags', ldflags);
    }
    if (buildmode) {
      args.push('-buildmode', buildmode);
    }
    if (buildvcs) {
      args.push('-buildvcs', buildvcs);
    }
    args.push('.');

    process.chdir(workingDir);
    await exec.exec(xgo.path, args);

    core.startGroup(`Fixing perms`);
    const uid = parseInt(child_process.execSync(`id -u`, {encoding: 'utf8'}).trim());
    const gid = parseInt(child_process.execSync(`id -g`, {encoding: 'utf8'}).trim());
    await exec.exec('sudo', ['chown', '-R', `${uid}:${gid}`, workingDir]);
    core.endGroup();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
