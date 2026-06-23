import solution


def test_simple():
    assert solution.parse_row("a,b,c") == ["a", "b", "c"]


def test_quoted_comma():
    assert solution.parse_row('a,"b,c",d') == ["a", "b,c", "d"]


def test_escaped_quote():
    assert solution.parse_row('"x""y",z') == ['x"y', "z"]


def test_empty_fields():
    assert solution.parse_row("a,,c") == ["a", "", "c"]
