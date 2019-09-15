import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run() {
  try {
    const go_version = core.getInput('go_version');
    const targets = core.getInput('targets');
    const flag_ldflags = core.getInput('flag_ldflags');
    const flag_v = core.getInput('flag_v');
    const flag_x = core.getInput('flag_x');

    console.log('🐳 Check Docker version');
    await exec.exec('docker', ['version']);

    console.log(`⬇️ Pulling crazymax/xgo:${go_version}...`);
    await exec.exec('docker', ['pull', `crazymax/xgo:${go_version}`]);

    console.log('🏃 Building project...');
    await exec.exec('docker', [
      'run',
      '--rm',
      '-i',
      '-v',
      `${process.env['GITHUB_WORKSPACE']}:/source`,
      '-v',
      `${process.env['GITHUB_WORKSPACE']}/build:/build`,
      '-e',
      `TARGETS=${targets}`,
      '-e',
      `FLAG_LDFLAGS=${flag_ldflags}`,
      '-e',
      `FLAG_V=${flag_v}`,
      '-e',
      `FLAG_X=${flag_x}`,
      `crazymax/xgo:${go_version}`
    ]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
