package com.example.carrental.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(
                        new TestController()
                )
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .build();
    }

    @Test
    void returnsBadRequestForIllegalArgumentException() throws Exception {
        mockMvc.perform(
                        get("/test/bad-request")
                )
                .andExpect(
                        status().isBadRequest()
                )
                .andExpect(
                        jsonPath("$.message")
                                .value("Bad request.")
                );
    }

    @Test
    void returnsConflictForIllegalStateException() throws Exception {
        mockMvc.perform(
                        get("/test/conflict")
                )
                .andExpect(
                        status().isConflict()
                )
                .andExpect(
                        jsonPath("$.message")
                                .value("Conflict.")
                );
    }

    @RestController
    static class TestController {

        @GetMapping("/test/bad-request")
        void badRequest() {
            throw new IllegalArgumentException(
                    "Bad request."
            );
        }

        @GetMapping("/test/conflict")
        void conflict() {
            throw new IllegalStateException(
                    "Conflict."
            );
        }
    }
}