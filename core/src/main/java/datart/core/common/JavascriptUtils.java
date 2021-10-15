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

import jdk.nashorn.api.scripting.NashornScriptEngineFactory;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import java.io.InputStream;
import java.io.InputStreamReader;

public class JavascriptUtils {

    private static final ScriptEngineFactory engineFactory;

    static {
        engineFactory = new NashornScriptEngineFactory();
    }

    public static Object invoke(String path, String functionName, Object... args) throws Exception {
        InputStream stream = JavascriptUtils.class.getClassLoader().getResourceAsStream(path);
        if (stream == null) {
            throw new RuntimeException("js file " + path + "not exists!");
        }
        try (InputStreamReader reader = new InputStreamReader(stream)) {
            ScriptEngine engine = engineFactory.getScriptEngine();
            engine.eval(reader);
            if (engine instanceof Invocable) {
                Invocable invocable = (Invocable) engine;
                return invocable.invokeFunction(functionName, args);
            }
            return null;
        }
    }
}
