package datart.core.mappers.ext;

import datart.core.entity.Organization;
import datart.core.entity.Source;
import datart.core.mappers.SourceMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;


import java.util.List;


@Mapper
public interface SourceMapperExt extends SourceMapper {

    @Select({
            "SELECT " +
                    "	s.* " +
                    "FROM " +
                    "	source s " +
                    "WHERE " +
                    "	s.org_id = #{orgId} AND s.`name` =#{name}"
    })
    Source checkNameWithOrg(@Param("orgId") String orgId, @Param("name") String name);

    @Select({
            "SELECT s.* FROM source s WHERE s.status=#{archived} and s.org_id=#{orgId} ORDER BY create_time ASC"
    })
    List<Source> listByOrg(@Param("orgId") String orgId, boolean archived);

    @Select({
            "SELECT org.* FROM organization org JOIN source s " +
                    "ON s.orgId=org.od AND s.id=#{sourceId}"
    })
    Organization getOrgById(@Param("sourceId") String sourceId);

}
