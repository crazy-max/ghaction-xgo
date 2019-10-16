"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const installer = __importStar(require("./installer"));
const os = __importStar(require("os"));
const child_process = __importStar(require("child_process"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (os.platform() !== 'linux') {
                core.setFailed('Only supported on linux platform');
                return;
            }
            const workspace = process.env['GITHUB_WORKSPACE'] || '.';
            const xgo_version = core.getInput('xgo_version') || 'latest';
            const go_version = core.getInput('go_version');
            const dest = core.getInput('dest');
            const pkg = core.getInput('pkg');
            const prefix = core.getInput('prefix');
            const targets = core.getInput('targets');
            const v = core.getInput('v');
            const x = core.getInput('x');
            const ldflags = core.getInput('ldflags');
            const xgo = yield installer.getXgo(xgo_version);
            // Run xgo
            let args = [];
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
            if (ldflags) {
                args.push('-ldflags', ldflags);
            }
            args.push(workspace);
            yield exec.exec(xgo, args);
            core.info('🔨 Fixing perms...');
            const uid = parseInt(child_process.execSync(`id -u`, { encoding: 'utf8' }).trim());
            const gid = parseInt(child_process.execSync(`id -g`, { encoding: 'utf8' }).trim());
            yield exec.exec('sudo', ['chown', '-R', `${uid}:${gid}`, workspace]);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
