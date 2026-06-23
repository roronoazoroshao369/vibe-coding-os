import helpers
import solution


def test_uses_retry_and_succeeds(monkeypatch):
    calls = {"n": 0}

    def flaky():
        calls["n"] += 1
        if calls["n"] < 2:
            raise helpers.TransientError("boom")
        return "ok"

    monkeypatch.setattr(helpers, "fetch_once", lambda url: flaky())
    assert solution.robust_fetch("http://x", attempts=3) == "ok"
    assert calls["n"] == 2


def test_gives_up_after_attempts(monkeypatch):
    def always_fail():
        raise helpers.TransientError("nope")

    monkeypatch.setattr(helpers, "fetch_once", lambda url: always_fail())
    try:
        solution.robust_fetch("http://x", attempts=2)
        assert False, "should have raised"
    except helpers.TransientError:
        pass
