# Stage 1: Build environment using Maven and Amazon Corretto 21
FROM maven:3.9.6-amazoncorretto-21 AS builder
WORKDIR /app

# Copy only the pom.xml first to cache dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime environment using Amazon Corretto 21 on Alpine Linux
FROM amazoncorretto:21-alpine
WORKDIR /app

# Copy the compiled executable JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]