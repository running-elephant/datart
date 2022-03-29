/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package datart.server.job;

import com.fasterxml.jackson.databind.ObjectMapper;
import datart.core.common.Application;
import datart.core.common.UUIDGenerator;
import datart.core.data.provider.SchemaItem;
import datart.core.data.provider.TableInfo;
import datart.core.entity.SourceSchemas;
import datart.core.mappers.ext.SourceSchemasMapperExt;
import datart.server.service.DataProviderService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.io.Closeable;
import java.io.IOException;
import java.util.*;

@Slf4j
public class SchemaSyncJob implements Job, Closeable {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public static final String SOURCE_ID = "SOURCE_ID";

    @Override
    public void close() throws IOException {
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String sourceId = (String) context.getMergedJobDataMap().get(SOURCE_ID);
        try {
            execute(sourceId);
        } catch (Exception e) {
            log.error("source schema sync error ", e);
        }
    }

    public boolean execute(String sourceId) throws Exception {
        List<SchemaItem> schemaItems = new LinkedList<>();
        DataProviderService dataProviderService = Application.getBean(DataProviderService.class);

        // TODO remove job if source not exists

        Set<String> databases = dataProviderService.readAllDatabases(sourceId);
        if (CollectionUtils.isNotEmpty(databases)) {
            for (String database : databases) {
                SchemaItem schemaItem = new SchemaItem();
                schemaItems.add(schemaItem);
                schemaItem.setDbName(database);
                schemaItem.setTables(new LinkedList<>());
                Set<String> tables = dataProviderService.readTables(sourceId, database);
                if (CollectionUtils.isNotEmpty(tables)) {
                    for (String table : tables) {
                        TableInfo tableInfo = new TableInfo();
                        schemaItem.getTables().add(tableInfo);
                        tableInfo.setTableName(table);
                        tableInfo.setColumns(dataProviderService.readTableColumns(sourceId, database, table));
                    }
                }
            }
        }
        return upsertSchemaInfo(sourceId, schemaItems);
    }

    private boolean upsertSchemaInfo(String sourceId, List<SchemaItem> schemaItems) {
        try {
            SourceSchemasMapperExt mapper = Application.getBean(SourceSchemasMapperExt.class);
            SourceSchemas sourceSchemas = mapper.selectBySource(sourceId);
            if (sourceSchemas == null) {
                sourceSchemas = new SourceSchemas();
                sourceSchemas.setId(UUIDGenerator.generate());
                sourceSchemas.setSourceId(sourceId);
                sourceSchemas.setUpdateTime(new Date());
                sourceSchemas.setSchemas(OBJECT_MAPPER.writeValueAsString(schemaItems));
                mapper.insert(sourceSchemas);
            } else {
                sourceSchemas.setUpdateTime(new Date());
                sourceSchemas.setSchemas(OBJECT_MAPPER.writeValueAsString(schemaItems));
                mapper.updateByPrimaryKey(sourceSchemas);
            }
            return true;
        } catch (Exception e) {
            log.error("source schema parse error ", e);
            return false;
        }
    }


}
