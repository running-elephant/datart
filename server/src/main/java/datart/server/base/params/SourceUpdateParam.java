package datart.server.base.params;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.validation.constraints.PositiveOrZero;

@EqualsAndHashCode(callSuper = true)
@Data
public class SourceUpdateParam extends BaseUpdateParam {

    private String name;

    private String type;

    private String orgId;

    private String config;

    private String description;

}
