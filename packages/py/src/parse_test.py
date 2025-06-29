from . import parse as p


def test_yt():
    assert p.yt(["a"]) == ["a"]
