package com.desviorj.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<Map<String, Object>> resposta(
            HttpStatus status,
            String mensagem
    ) {

        Map<String, Object> corpo = new LinkedHashMap<>();

        corpo.put("timestamp", LocalDateTime.now().toString());
        corpo.put("status", status.value());
        corpo.put("erro", status.getReasonPhrase());
        corpo.put("mensagem", mensagem);
        corpo.put("message", mensagem);

        return ResponseEntity.status(status).body(corpo);

    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> statusException(
            ResponseStatusException ex
    ) {

        HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());

        if (status == null) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        String mensagem = ex.getReason() != null
                ? ex.getReason()
                : status.getReasonPhrase();

        return resposta(status, mensagem);

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacao(
            MethodArgumentNotValidException ex
    ) {

        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining("; "));

        return resposta(HttpStatus.BAD_REQUEST, mensagem);

    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> corpoInvalido(
            HttpMessageNotReadableException ex
    ) {

        return resposta(
                HttpStatus.BAD_REQUEST,
                "Corpo da requisição inválido ou mal formatado."
        );

    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> parametroAusente(
            MissingServletRequestParameterException ex
    ) {

        return resposta(
                HttpStatus.BAD_REQUEST,
                "Parâmetro obrigatório ausente: " + ex.getParameterName()
        );

    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> tipoInvalido(
            MethodArgumentTypeMismatchException ex
    ) {

        return resposta(
                HttpStatus.BAD_REQUEST,
                "Valor inválido para o parâmetro: " + ex.getName()
        );

    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> naoEncontrado(
            NoSuchElementException ex
    ) {

        return resposta(
                HttpStatus.NOT_FOUND,
                "Registro não encontrado."
        );

    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> integridade(
            DataIntegrityViolationException ex
    ) {

        log.warn("Violacao de integridade: {}", ex.getMostSpecificCause().getMessage());

        return resposta(
                HttpStatus.CONFLICT,
                "Operação não permitida: o registro está em uso ou já existe."
        );

    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> metodoNaoSuportado(
            HttpRequestMethodNotSupportedException ex
    ) {

        return resposta(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Método HTTP não suportado para esta rota."
        );

    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> midiaNaoSuportada(
            HttpMediaTypeNotSupportedException ex
    ) {

        return resposta(
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Content-Type não suportado."
        );

    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> rotaInexistente(
            NoResourceFoundException ex
    ) {

        return resposta(
                HttpStatus.NOT_FOUND,
                "Rota não encontrada."
        );

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> generico(Exception ex) {

        log.error("Erro inesperado", ex);

        return resposta(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno do servidor."
        );

    }

}
