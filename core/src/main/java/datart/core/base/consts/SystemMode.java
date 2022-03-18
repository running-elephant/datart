package datart.core.base.consts;

import datart.core.common.Application;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum SystemMode {
    /** 单组织模式 */
    SINGLE,
    /** 多组织/正常模式 */
    NORMAL;

    private static SystemMode currMode;

    public static void setCurrMode(SystemMode currMode) {
        SystemMode.currMode = currMode;
    }

    /**
     * 获取当前运行模式
     * @return SystemMode
     */
    public static SystemMode getCurrMode() {
        if (currMode == null) {
            currMode = querySystemMode();
        }
        return currMode;
    }

    private static SystemMode querySystemMode() {
        String mode = Application.getProperty("datart.mode");
        try {
            return SystemMode.valueOf(mode.toUpperCase());
        } catch (Exception e) {
            log.warn("Unrecognized mode: '{}', and this will run in normal mode", mode);
        }
        return NORMAL;
    }

}
