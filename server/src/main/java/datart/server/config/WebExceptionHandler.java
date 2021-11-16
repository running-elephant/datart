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

package datart.server.config;

import datart.security.exception.AuthException;
import datart.security.exception.PermissionDeniedException;
import datart.server.base.dto.ResponseData;
import datart.server.base.exception.NotFoundException;
import datart.server.base.exception.ParamException;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class WebExceptionHandler {

    @ResponseBody
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseData<String> exceptionHandler(ExpiredJwtException e) {
        ResponseData.ResponseDataBuilder<String> builder = ResponseData.builder();
        return builder.success(false)
                .message(e.getMessage())
                .exception(e)
                .build();
    }

    @ResponseBody
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ParamException.class)
    public ResponseData<String> exceptionHandler(ParamException e) {
        ResponseData.ResponseDataBuilder<String> builder = ResponseData.builder();
        return builder.success(false)
                .message(e.getMessage())
                .errCode(e.getErrCode())
                .exception(e)
                .build();
    }

    @ResponseBody
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(NotFoundException.class)
    public ResponseData<String> exceptionHandler(NotFoundException e) {
        ResponseData.ResponseDataBuilder<String> builder = ResponseData.builder();
        return builder.success(false)
                .message(e.getMessage())
                .errCode(e.getErrCode())
                .exception(e).build();
    }

    @ResponseBody
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(AuthException.class)
    public ResponseData<String> exceptionHandler(AuthException e) {
        ResponseData.ResponseDataBuilder<String> builder = ResponseData.builder();
        return builder.success(false)
                .message(e.getMessage())
                .errCode(e.getErrCode())
                .exception(e).build();
    }

    @ResponseBody
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PermissionDeniedException.class)
    public ResponseData<String> exceptionHandler(PermissionDeniedException e) {
        ResponseData.ResponseDataBuilder<String> builder = ResponseData.builder();
        return builder.success(false)
                .message(e.getMessage())
                .exception(e).build();
    }

    @ResponseBody
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BindException.class)
    public ResponseData<String> validateException(BindException e) {
        ResponseData.ResponseDataBuilder<String> builder = ResponseData.builder();
        return builder.success(false)
                .message(e.getBindingResult().getFieldErrors().stream()
                        .map(error -> error.getField() + ":" + error.getDefaultMessage())
                        .collect(Collectors.toList()).toString())
                .exception(e)
                .build();
    }

    @ResponseBody
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(Exception.class)
    public ResponseData<String> exceptionHandler(Exception e) {
        String msg = null;
        msg = e.getMessage();
        if (msg == null) {
            Throwable cause = e.getCause();
            if (cause != null) {
                msg = cause.getMessage();
            }
        }
        log.error(msg, e);
        ResponseData.ResponseDataBuilder<String> builder = ResponseData.builder();
        return builder.success(false)
                .message(msg)
                .exception(e)
                .build();
    }

}
