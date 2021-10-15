package datart.core.mappers.ext;

import datart.core.entity.Dashboard;
import datart.core.mappers.DashboardMapper;
import org.apache.ibatis.annotations.CacheNamespaceRef;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
@CacheNamespaceRef(value = FolderMapperExt.class)
public interface DashboardMapperExt extends DashboardMapper {

    @Select({
            "SELECT " +
                    "	d.id, " +
                    "	d.`index`, " +
                    "	d.is_folder, " +
                    "	d.`name`, " +
                    "	d.parent_id, " +
                    "	d.portal_id " +
                    "FROM " +
                    "	dashboard d " +
                    "WHERE " +
                    "	d.`status` != 0 " +
                    "AND d.org_id = #{orgId}"
    })
    List<Dashboard> listByOrgId(@Param("orgId") String portalId);

    @Select({
            "SELECT id,`name`,org_id,`status` FROM dashboard WHERE org_id=#{orgId} AND `status`=0"
    })
    List<Dashboard> listArchived(String orgId);

}