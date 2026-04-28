package com.webguardx.ssl.util;

/**
 * Utility to grade SSL cipher suites using industry-standard classification
 * aligned with SSL Labs' grading model.
 *
 * Grades:
 *  SECURE   - Modern AEAD ciphers (GCM, CHACHA20)
 *  LEGACY   - CBC-based with forward secrecy (ECDHE/DHE + CBC). Acceptable but not modern.
 *  INSECURE - NULL, anonymous, EXPORT, RC4, bare DES, 3DES, RSA key exchange
 */
public class CipherGrader {

    public static String gradeByName(String cipherName) {
        if (cipherName == null) {
            return "INSECURE";
        }

        String c = cipherName.toUpperCase();

        // ── INSECURE ────────────────────────────────────────────────────────
        // No encryption, anonymous (no authentication), export-grade, RC4,
        // bare DES (single), or 3DES (triple but broken/deprecated).
        if (c.contains("NULL")   ||
            c.contains("ANON")   ||
            c.contains("EXPORT") ||
            c.contains("RC4")    ||
            c.contains("3DES")   ||
            (c.contains("DES") && !c.contains("3DES"))) {
            return "INSECURE";
        }

        // ── SECURE ──────────────────────────────────────────────────────────
        // Modern AEAD ciphers — GCM or CHACHA20 with any key exchange.
        if (c.contains("GCM") || c.contains("CHACHA20")) {
            return "SECURE";
        }

        // ── LEGACY ──────────────────────────────────────────────────────────
        // CBC ciphers that still have forward secrecy (ECDHE or DHE).
        // SSL Labs calls these "weak" but accepts them; we label them LEGACY
        // to be accurate and avoid inflating the threat level.
        if (c.contains("CBC") && (c.contains("ECDHE") || c.contains("DHE"))) {
            return "LEGACY";
        }

        // CBC without forward secrecy (e.g. RSA key exchange) → INSECURE
        if (c.contains("CBC")) {
            return "INSECURE";
        }

        // Anything else that got this far is unknown — treat conservatively
        return "INSECURE";
    }
}
