package com.collectiontracker.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {

    private static final String DB_HOST;
    private static final String DB_PORT;
    private static final String DB_NAME;
    private static final String DB_USER;
    private static final String DB_PASSWORD;
    private static final String URL;

    static {
        String rawUrl = System.getenv("MYSQL_URL");
        if (rawUrl != null && rawUrl.startsWith("mysql://")) {
            String withoutScheme = rawUrl.substring(8);
            int atIdx = withoutScheme.lastIndexOf('@');
            String userInfo = withoutScheme.substring(0, atIdx);
            String hostPart = withoutScheme.substring(atIdx + 1);
            int colonIdx = userInfo.indexOf(':');
            DB_USER = colonIdx >= 0 ? userInfo.substring(0, colonIdx) : userInfo;
            DB_PASSWORD = colonIdx >= 0 ? userInfo.substring(colonIdx + 1) : "";
            int slashIdx = hostPart.indexOf('/');
            String hostPort = slashIdx >= 0 ? hostPart.substring(0, slashIdx) : hostPart;
            String database = slashIdx >= 0 ? hostPart.substring(slashIdx + 1) : "railway";
            int portColon = hostPort.indexOf(':');
            DB_HOST = portColon >= 0 ? hostPort.substring(0, portColon) : hostPort;
            DB_PORT = portColon >= 0 ? hostPort.substring(portColon + 1) : "3306";
            DB_NAME = database;
        } else {
            DB_HOST = System.getenv().getOrDefault("DB_HOST", "mysql");
            DB_PORT = System.getenv().getOrDefault("DB_PORT", "3306");
            DB_NAME = System.getenv().getOrDefault("DB_NAME", "collection_db");
            DB_USER = System.getenv().getOrDefault("DB_USER", "root");
            DB_PASSWORD = System.getenv().getOrDefault("DB_PASSWORD", "root");
        }
        URL = "jdbc:mysql://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME
                + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("No se pudo cargar el driver de MySQL", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, DB_USER, DB_PASSWORD);
    }
}
