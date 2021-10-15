package datart.core.mappers.ext;

import org.apache.ibatis.annotations.*;

import java.util.List;

public interface BaseMapper {

    @Select({
            "${sql}"
    })
    <T> T executeQuery(@Param("sql") String sql);

    @Select({
            "${sql}"
    })
    <T> List<T> queryList(@Param("sql") String sql);

    @Update({
            "${sql}"
    })
    int executeUpdate(@Param("sql") String sql);

    @Delete({
            "${sql}"
    })
    int executeDelete(@Param("sql") String sql);

}