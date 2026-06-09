# Team Runner Choice

The word "team" maps to three different things around Vibe Coding OS. They are easy to confuse, so this doc disambiguates them and tells you which to use.

| # | Thing | What it is | Where it lives |
| --- | --- | --- | --- |
| 1 | Native `/team` | Claude Code's built-in interactive agent team. Spawns teammates that share a task list and message each other inside one session. | Claude Code harness |
| 2 | OMC `/team` skill | An orchestration skill that structures staged team flow (plan, execute, verify, fix) and role routing on top of an agent harness. | oh-my-claudecode layer |
| 3 | Runtime `team-run` | An optional, experimental local CLI runner that launches a team spec across parallel `tmux` panes and maps results into the runtime task-store. | `scripts/runtime-team-run.mjs` (`npm run runtime:team-run`) |

These are not competing implementations of one feature. They sit at different levels: harness, orchestration guidance, and an optional local automation helper.

## When to use which

| You want to... | Use | Requirements |
| --- | --- | --- |
| Run an interactive multi-agent session now, with live coordination | Native `/team` | Claude Code |
| Apply staged team discipline (roles, separate verify lane, no self-approval) as guidance | OMC `/team` skill | oh-my-claudecode available |
| Drive a saved team spec through local terminal panes and collect outputs to JSON state | Runtime `team-run` | `tmux` on `PATH`; a team spec imported into the team-store |

## Default and escalation

- **Default = native.** For most collaborative work, native `/team` (optionally guided by the OMC `/team` skill) is the right tool. It needs no extra setup and keeps everything in one session.
- **Runtime only if you want local automation.** Reach for `npm run runtime:team-run` only when you specifically want to fan a team spec across `tmux` panes on your machine and capture each pane's output into the optional runtime task-store. It is opt-in and experimental.

## Runtime runner notes

- It is fully optional. Nothing in the core runtime depends on it.
- It degrades gracefully when `tmux` is absent: `check` reports unavailable and `run` exits non-zero after printing install help, writing no partial state.
- It does not spawn or replace the native agent team; it pipes prompts into a configured command (default `claude`) per pane.
- See [`docs/workflows/runtime-team-runner.md`](runtime-team-runner.md) for the full runner contract.

## Ghi chú tiếng Việt

Có ba thứ tên "team": `/team` gốc của Claude Code (đội agent tương tác), skill `/team` của OMC (hướng dẫn điều phối theo giai đoạn), và `npm run runtime:team-run` (runner tmux local, tùy chọn/thử nghiệm, cần tmux). Mặc định dùng native; chỉ dùng runtime khi muốn tự động hóa local.
