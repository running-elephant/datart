package datart.data.provider.base;

import datart.core.data.provider.Dataframe;

public interface DocumentClient<T> {

    public Dataframe execute(Object command);

}
