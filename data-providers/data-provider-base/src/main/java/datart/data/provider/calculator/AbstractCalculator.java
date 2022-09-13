package datart.data.provider.calculator;

import datart.core.data.provider.*;

/**
 * 高级计算器
 *
 * @author rwe
 * @date 2022/9/6 17:07
 **/
public abstract class AbstractCalculator {

    private Object config;

    private DataProvider dataProvider;

    /**
     * 计算器类型
     * 对应前端 src/app/constants.ts 中 AdvanceCalcFieldActionType
     */
    public abstract String type();

    public Object getConfig() {
        return config;
    }

    public void setConfig(Object config) {
        this.config = config;
    }

    public void setDataProvider(DataProvider dataProvider) {
        this.dataProvider = dataProvider;
    }

    public DataProvider getDataProvider() {
        return dataProvider;
    }

    public abstract void calc(Dataframe dataframe, int dataIndex, DataProviderSource source, QueryScript queryScript, ExecuteParam executeParam);
}
