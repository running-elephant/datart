package datart.server.base.params;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class DashboardCreateParam extends VizCreateParam {

    private String name;

    private Double index;

    private String parentId;

    private List<WidgetCreateParam> widgetToCreate;

    private String config;

}
