package datart.core.data.provider.processor;

import datart.core.base.ExtendProcessor;
import datart.core.data.provider.DataProviderSource;
import datart.core.data.provider.ExecuteParam;
import datart.core.data.provider.QueryScript;

public interface DataProviderPreProcessor extends ExtendProcessor {
    public void preRun(DataProviderSource config, QueryScript script, ExecuteParam executeParam);
}
