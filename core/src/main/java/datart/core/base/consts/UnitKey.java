package datart.core.base.consts;

public enum UnitKey {
    none(1, ""),
    thousand(1000, "K"),
    wan(10_000, "万"),
    million(1000_000, "M"),
    yi(100_000_000, "亿"),
    billion(1000_000_000, "B");

    private int unit;

    private String fmt;

    UnitKey(int i, String str) {
        this.unit = i;
        this.fmt = str;
    }

    public int getUnit() {
        return unit;
    }

    public String getFmt() {
        return fmt;
    }
}
