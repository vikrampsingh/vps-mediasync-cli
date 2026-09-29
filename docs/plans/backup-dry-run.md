# Plan: Add `--dry-run` mode to `backup`

## Goal
Add a `--dry-run` flag to `vps-mediasync-cli backup` that previews the backup (per-path file counts, total, destination) without performing any side effects.

## Behavior
- Runs the normal interactive flow: dependencies → device → categories → destination.
- For each resolved Android path, counts files on the device using read-only `adb shell "find '<path>' -type f | wc -l"`.
- Prints per-path counts, grand total, and destination.
- Exits without creating `~/mediasync_tmp`, destination directories, or running `adb pull` / `rsync`.

## Files to change
1. `src/commands/backup.ts` — add `Flags.boolean` `'dry-run'`, parse flags, pass to `runBackup`.
2. `src/services/adb.ts` — add `countFiles(path)` helper.
3. `src/services/sync.ts` — add `dryRun` parameter to `runBackup`; early preview branch.
4. `docs/plans/backup-dry-run.md` — this plan.
5. `AGENTS.md` — add §26 plan/verification workflow + fix `docs/spec/` → `docs/specs/`.

## Safety
The dry-run branch returns before `TMP`/`DEST` creation and before any ADB pull or rsync call. It performs only read-only `adb shell find` operations.

## Testing
- `npm run build`
- `node ./bin/run.js backup --dry-run` with an expect script: select device, categories, destination → verify counts, "Dry-run complete", and no `~/mediasync_tmp`.
- `node ./bin/run.js backup --help` shows the flag.
- `node ./bin/run.js backup` (no flag) still behaves as before.

## Checklist
- [x] 1. Add `--dry-run` flag to `backup.ts`
- [x] 2. Add `countFiles()` to `adb.ts`
- [x] 3. Add `dryRun` branch to `runBackup()` in `sync.ts`
- [x] 4. `npm run build` passes
- [x] 5. Test `backup --dry-run`
- [x] 6. Test normal `backup` regression
- [x] 7. Review `git diff` / `git status`
- [x] 8. **User verification**
