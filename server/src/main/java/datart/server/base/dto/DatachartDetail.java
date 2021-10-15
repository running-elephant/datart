package datart.server.base.dto;

import datart.core.entity.Datachart;
import datart.core.entity.View;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class DatachartDetail extends Datachart {

    private String parentId;

    private Double index;

    private View view;

    private boolean download;

}
