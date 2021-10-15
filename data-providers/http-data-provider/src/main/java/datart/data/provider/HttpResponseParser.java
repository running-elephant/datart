package datart.data.provider;

import datart.core.data.provider.Dataframe;
import org.apache.http.HttpResponse;

import java.io.IOException;

public interface HttpResponseParser {

    Dataframe parseResponse(String targetPropertyName, HttpResponse response) throws IOException;

}
