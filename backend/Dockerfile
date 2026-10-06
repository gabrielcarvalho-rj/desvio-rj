# ============================================================
# Backend Desvio RJ - Spring Boot (Java 17 + Maven)
# Build em duas etapas (multi-stage):
#   1) "build": compila o projeto com Maven e gera o .jar
#   2) "runtime": imagem leve, so com o Java para executar o .jar
# ============================================================

# ---------- Etapa 1: compilacao ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copia o projeto e gera o .jar (testes ignorados no build da imagem).
# O Maven baixa as dependencias automaticamente (necessita internet no build).
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package \
    && cp target/*.jar /app/app.jar

# ---------- Etapa 2: execucao ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/app.jar app.jar

# Porta da API REST
EXPOSE 8080

# A conexao com o banco e a configuracao vem de variaveis de ambiente
# definidas no docker-compose.yml
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
