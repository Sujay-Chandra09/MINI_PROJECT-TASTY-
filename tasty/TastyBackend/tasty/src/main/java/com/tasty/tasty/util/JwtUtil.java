package com.tasty.tasty.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static final SecretKey key =
            Keys.hmacShaKeyFor("tastySecretKeytastySecretKey12345".getBytes());

    public String generateToken(String id){

        return Jwts.builder()
                .subject(id)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();
    }
}