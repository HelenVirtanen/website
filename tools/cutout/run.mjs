// Запуск cutout.py из pnpm на любой ОС: находит Python окружения tools/cutout/.venv или ставит его.
//
//   pnpm cutout --setup                       → создать .venv и поставить requirements.txt
//   pnpm cutout <вход> <выход> [опции]        → вырезать фон (опции — в README.md)

import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const venv = join(here, '.venv');
const venvPython = process.platform === 'win32' ? join(venv, 'Scripts', 'python.exe') : join(venv, 'bin', 'python');

// Python пишет UTF-8, а консоль Windows читала бы байты в своей кодировке: вывод печатает Node, он пишет в неё верно.
const env = { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' };
const run = (command, args) =>
  new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ['inherit', 'pipe', 'pipe'], env });
    child.stdout.setEncoding('utf8').on('data', (chunk) => process.stdout.write(chunk));
    child.stderr.setEncoding('utf8').on('data', (chunk) => process.stderr.write(chunk));
    child.on('error', () => resolve(1));
    child.on('close', (code) => resolve(code ?? 1));
  });

// Системный Python: на Windows обычно `python`, на macOS и Linux — `python3`.
function systemPython() {
  for (const candidate of process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python']) {
    if (spawnSync(candidate, ['--version'], { stdio: 'ignore' }).status === 0) return candidate;
  }
  return undefined;
}

async function setup() {
  const python = systemPython();
  if (!python) {
    console.error('cutout: не найден Python 3.11+. Установите его и повторите pnpm cutout --setup');
    return 1;
  }
  if (!existsSync(venvPython)) {
    const created = await run(python, ['-m', 'venv', venv]);
    if (created !== 0) return created;
  }
  return run(venvPython, ['-m', 'pip', 'install', '--require-virtualenv', '-r', join(here, 'requirements.txt')]);
}

const args = process.argv.slice(2);
if (args[0] === '--setup') {
  process.exitCode = await setup();
} else if (!existsSync(venvPython)) {
  console.error('cutout: окружение не готово. Один раз выполните: pnpm cutout --setup');
  process.exitCode = 2;
} else {
  // -I: скрипты из текущей папки не подменят модули Python. Он же отключает переменные PYTHON*, поэтому UTF-8 — флагом.
  process.exitCode = await run(venvPython, ['-I', '-X', 'utf8', join(here, 'cutout.py'), ...args]);
}
