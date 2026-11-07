// Запуск cutout.py из pnpm на любой ОС: находит Python окружения tools/cutout/.venv или ставит его.
//
//   pnpm cutout --setup                       → создать .venv и поставить requirements.txt
//   pnpm cutout <вход> <выход> [опции]        → вырезать фон (опции — в README.md)

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const venv = join(here, '.venv');
const venvPython = process.platform === 'win32' ? join(venv, 'Scripts', 'python.exe') : join(venv, 'bin', 'python');

// UTF-8 явно: иначе в консоли Windows русские сообщения скрипта превращаются в кракозябры.
const env = { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' };
const run = (command, args) => spawnSync(command, args, { stdio: 'inherit', env }).status ?? 1;

// Системный Python: на Windows обычно `python`, на macOS и Linux — `python3`.
function systemPython() {
  for (const candidate of process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python']) {
    if (spawnSync(candidate, ['--version'], { stdio: 'ignore' }).status === 0) return candidate;
  }
  return undefined;
}

function setup() {
  const python = systemPython();
  if (!python) {
    console.error('cutout: не найден Python 3.11+. Установите его и повторите pnpm cutout --setup');
    return 1;
  }
  if (!existsSync(venvPython)) {
    const created = run(python, ['-m', 'venv', venv]);
    if (created !== 0) return created;
  }
  return run(venvPython, ['-m', 'pip', 'install', '--require-virtualenv', '-r', join(here, 'requirements.txt')]);
}

const args = process.argv.slice(2);
if (args[0] === '--setup') {
  process.exitCode = setup();
} else if (!existsSync(venvPython)) {
  console.error('cutout: окружение не готово. Один раз выполните: pnpm cutout --setup');
  process.exitCode = 2;
} else {
  // -I: скрипты из текущей папки не подменят модули Python.
  process.exitCode = run(venvPython, ['-I', join(here, 'cutout.py'), ...args]);
}
