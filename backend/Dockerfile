# maven build:
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /pns
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Java 21 image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /pns
COPY --from=build /pns/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

