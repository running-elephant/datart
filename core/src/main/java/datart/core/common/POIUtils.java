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
package datart.core.common;

import datart.core.base.consts.FileFormat;
import datart.core.base.exception.BaseException;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

@Slf4j
public class POIUtils {

    public static void save(Workbook workbook, String path, boolean cover) throws IOException {
        if (workbook == null || path == null) {
            return;
        }
        File file = new File(path);
        if (file.exists()) {
            if (cover) {
                file.delete();
            } else {
                throw new BaseException("file (" + path + ")  already exists");
            }
        } else {
            file.getParentFile().mkdirs();
        }
        try (FileOutputStream fos = new FileOutputStream(file)) {
            workbook.write(fos);
        }
    }

    public static Workbook fromTableData(Dataframe dataframe) {
        Workbook workbook = new SXSSFWorkbook();
        Sheet sheet = workbook.createSheet();
        fillSheet(sheet, dataframe);
        return workbook;
    }

    public static Workbook createEmpty() {
        return new SXSSFWorkbook();
    }

    public static void withSheet(Workbook workbook, String sheetName, Dataframe sheetData) {
        fillSheet(workbook.createSheet(sheetName), sheetData);
    }

    private static void fillSheet(Sheet sheet, Dataframe data) {
        writeHeader(data.getColumns(), sheet);
        int rowIndex = 1;
        for (List<Object> dataRow : data.getRows()) {
            Row row = sheet.createRow(rowIndex);
            int columnIndex = 0;
            for (Object val : dataRow) {
                row.createCell(columnIndex).setCellValue(val == null ? null : val.toString());
                columnIndex++;
            }
            rowIndex++;
        }
    }

    private static void writeHeader(List<Column> columns, Sheet sheet) {
        Row row = sheet.createRow(0);
        for (int i = 0; i < columns.size(); i++) {
            row.createCell(i).setCellValue(columns.get(i).getName());
        }
    }

    public static List<List<Object>> loadExcel(String path) throws IOException {
        LinkedList<List<Object>> rows = new LinkedList<>();
        try (InputStream inputStream = new FileInputStream(path)) {
            Workbook workbook;
            if (path.toLowerCase().endsWith(FileFormat.XLS.getFormat())) {
                workbook = new HSSFWorkbook(inputStream);
            } else if (path.toLowerCase().endsWith(FileFormat.XLSX.getFormat())) {
                workbook = new XSSFWorkbook(inputStream);
            } else {
                throw new BaseException("Unknown file format :" + path);
            }

            if (workbook.getNumberOfSheets() < 1) {
                throw new BaseException("empty excel :" + path);
            }
            // 只处理第一个sheet
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.rowIterator();
            Row row0 = sheet.getRow(0);
            if (row0 == null) {
                throw new RuntimeException("excel is empty");
            }
            int columns = row0.getPhysicalNumberOfCells();
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                LinkedList<Object> cellValues = new LinkedList<>();
                for (int i = 0; i < columns; i++)
                    cellValues.add(readCellValue(row.getCell(i)));
                rows.add(cellValues);
            }
        }
        return rows;
    }

    private static Object readCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        switch (cell.getCellType()) {
            case NUMERIC:
                return cell.getNumericCellValue();
            case BOOLEAN:
                return cell.getBooleanCellValue();
            default:
                return cell.getStringCellValue();
        }
    }

}
