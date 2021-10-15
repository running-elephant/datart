package datart.core.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Folder extends BaseEntity {
    private String name;

    private String orgId;

    private String relType;

    private String relId;

    private String parentId;

    private Double index;
}