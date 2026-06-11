# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy the pom.xml and download dependencies first (for caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy the built jar file from the build stage
COPY --from=build /app/target/pulsestream-backend-1.0.0.jar app.jar

# Expose port 8080 (Render will route traffic here)
EXPOSE 8080

# Run the application with the prod profile
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
