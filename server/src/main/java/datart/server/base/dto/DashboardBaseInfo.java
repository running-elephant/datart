package datart.server.base.dto;

import datart.core.entity.Dashboard;
import lombok.Data;
import org.springframework.beans.BeanUtils;

@Data
public class DashboardBaseInfo {

    private String id;

    private String name;

    private String portalId;

    private String parentId;

    private Boolean isFolder;

    private Integer index;

    public DashboardBaseInfo(Dashboard dashboard) {
        BeanUtils.copyProperties(dashboard, this);
    }

    public DashboardBaseInfo() {
    }
}