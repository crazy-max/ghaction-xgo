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
const download = __importStar(require("download"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const child_process = __importStar(require("child_process"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repo = process.env['GITHUB_REPOSITORY'];
            const root = path.join(__dirname, '..');
            const xgo_version = '0.3.1';
            const go_version = core.getInput('go_version');
            const dest = core.getInput('dest');
            const prefix = core.getInput('prefix');
            const targets = core.getInput('targets');
            const v = core.getInput('v');
            const x = core.getInput('x');
            const ldflags = core.getInput('ldflags');
            console.log('⬇️ Downloading xgo...');
            const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'xgo-'));
            yield download.default(`https://github.com/crazy-max/xgo/releases/download/v${xgo_version}/xgo_linux_amd64`, tmpdir, { filename: 'xgo' });
            const xgo_path = `${tmpdir}/xgo`;
            fs.chmodSync(xgo_path, '755');
            // Run xgo
            let args = [];
            if (go_version) {
                args.push('-go', go_version);
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
            args.push(root);
            yield exec.exec(xgo_path, args);
            console.log('🔨 Fixing perms...');
            const uid = parseInt(child_process.execSync(`id -u`, { encoding: 'utf8' }).trim());
            const gid = parseInt(child_process.execSync(`id -g`, { encoding: 'utf8' }).trim());
            yield exec.exec('sudo', ['chown', '-R', `${uid}:${gid}`, root]);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
