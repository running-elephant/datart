package datart.core.mappers.ext;

import datart.core.entity.Storypage;
import datart.core.mappers.StorypageMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface StorypageMapperExt extends StorypageMapper {

    @Select({
            "SELECT * FROM storypage sp WHERE sp.storyboard_id = #{storyboardId}"
    })
    List<Storypage> listByStoryboardId(String storyboardId);

}
