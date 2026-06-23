# helpers.py  (provided — do not modify)

def fetch_once(url):
    """Pretend to fetch a URL. Raises TransientError sometimes."""
    raise NotImplementedError  # real impl injected by tests


class TransientError(Exception):
    pass


def retry(fn, attempts=3, on=(TransientError,)):
    """Call fn(); retry up to `attempts` times on the given exceptions.

    Returns fn()'s result, or re-raises the last exception.
    """
    last = None
    for _ in range(attempts):
        try:
            return fn()
        except on as exc:
            last = exc
    raise last
