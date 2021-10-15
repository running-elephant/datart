package datart.server.base.dto;

import datart.core.entity.Datachart;
import datart.core.entity.View;
import lombok.Data;

import java.util.List;

@Data
public class DatachartDetailList {

    private List<Datachart> datacharts;

    private List<View> views;

}
