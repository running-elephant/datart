package datart.core.mappers.ext;

import datart.core.entity.Folder;
import datart.core.mappers.FolderMapper;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
@CacheNamespace(flushInterval = 5 * 1000)
public interface FolderMapperExt extends FolderMapper {

    @Select({
            "SELECT * FROM folder t WHERE t.org_id = #{orgId}"
    })
    List<Folder> selectByOrg(String orgId);

    @Select({
            "SELECT * FROM folder t WHERE t.parent_id = #{parentId}"
    })
    List<Folder> selectByParentId(String parentId);

    @Select({
            "<script>",
            "SELECT * FROM folder  WHERE org_id=#{orgId} AND `name` = #{name}",
            "<if test=\"parentId==null\">",
            " AND parent_id IS NULL ",
            "</if>",
            "<if test=\"parentId!=null\">",
            " AND parent_id=#{parentId} ",
            "</if>",
            "</script>",
    })
    List<Folder> checkVizName(String orgId, String parentId, String name);

    @Delete({
            "DELETE FROM folder WHERE rel_type=#{relType} and rel_id=#{relId}"
    })
    int deleteByRelTypeAndId(String relType, String relId);

    @Select({
            "SELECT * FROM folder WHERE rel_type=#{relType} and rel_id=#{relId}"
    })
    Folder selectByRelTypeAndId(String relType, String relId);

}
