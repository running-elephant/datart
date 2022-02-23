package datart.server.base.dto.chart;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONValidator;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ChartConfigDTO {

    private ChartDetailConfigDTO chartConfig = new ChartDetailConfigDTO();

    private String chartGraphId;

    private Boolean aggregation;

    private static final String COLUMN_KEY = "mixed";

    private static final String TITLE_KEY = "header";

    private static final String MODAL_KEY = "modal";

    private static final String HEADER_KEY = "tableHeaders";

    public List<ChartColumn> getColumnSettings(){
        ChartDataConfigDTO mixed = this.chartConfig.getDatas().stream()
                .filter(item -> COLUMN_KEY.equals(item.getKey())).findFirst().orElse(new ChartDataConfigDTO());
        return mixed.getRows();
    }

    public List<ChartColumn> getDataHeaders(){
        List<ChartColumn> chartHeaders = new ArrayList<>();
        ChartStyleConfigDTO title = this.chartConfig.getStyles().stream().filter(item -> TITLE_KEY.equals(item.getKey())).findFirst().orElse(new ChartStyleConfigDTO());
        ChartStyleConfigDTO header = title.getRows().stream().filter(item -> MODAL_KEY.equals(item.getKey())).findFirst().orElse(new ChartStyleConfigDTO());
        ChartStyleConfigDTO chartStyleConfigDTO = header.getRows().stream().filter(item -> HEADER_KEY.equals(item.getKey())).findFirst().orElse(new ChartStyleConfigDTO());
        if (chartStyleConfigDTO.getValue()!=null && JSONValidator.from(chartStyleConfigDTO.getValue().toString()).validate()){
            chartHeaders = JSON.parseArray(chartStyleConfigDTO.getValue().toString(), ChartColumn.class);
        }
        return chartHeaders;
    }
}
