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

import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

public class FileUtils {


    public static String concatPath(String... paths) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < paths.length; i++) {
            String path = paths[i];
            path = StringUtils.appendIfMissing(path, "/");
            if (i != 0) {
                path = StringUtils.removeStart(path, "/");
            }
            if (i == paths.length - 1) {
                path = StringUtils.removeEnd(path, "/");
            }
            stringBuilder.append(path);
        }
        return StringUtils.removeEnd(stringBuilder.toString(), "/");
    }

    public static void mkdirParentIfNotExist(String path) {
        File file = new File(path);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
    }

    public static String withBasePath(String path) {
        return concatPath(Application.getFileBasePath(), path);
    }

    public static void delete(String path) {
        delete(new File(path));
    }

    public static void delete(File file) {
        if (file.exists()) {
            try {
                file.delete();
            } catch (Exception ignored) {
            }
        }
    }

    public static Set<String> walkDir(File file, String extension, boolean recursion) {
        if (file == null || !file.exists()) {
            return Collections.emptySet();
        }
        if (file.isFile()) {
            return Collections.singleton(file.getName());
        } else {
            File[] files = file.listFiles(pathname -> extension == null || pathname.getName().endsWith(extension));
            if (files == null) {
                return Collections.emptySet();
            }
            Set<String> names = new LinkedHashSet<>();
            for (File f : files) {
                if (f.isFile()) {
                    names.add(f.getName());
                } else if (recursion) {
                    names.addAll(walkDir(f, extension, recursion));
                }
            }
            return names;
        }
    }
}
