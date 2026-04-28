package com.webguardx.ssl;

/**
 * Exception thrown when SSL analysis fails.
 */
public class SslAnalysisException extends RuntimeException {
    
    public SslAnalysisException(String message) {
        super(message);
    }
    
    public SslAnalysisException(String message, Throwable cause) {
        super(message, cause);
    }
}
