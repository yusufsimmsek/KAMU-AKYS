#!/bin/bash

# Turist Bilgilendirme Spring Boot Backend Runner Script
# This script starts the application with optimized JVM settings

echo "🚀 Starting Turist Bilgilendirme Spring Boot Backend..."
echo "📊 JVM Memory Configuration:"
echo "   - Initial Heap: 1GB"
echo "   - Maximum Heap: 2GB"
echo "   - Garbage Collector: G1GC"
echo ""

# Set JVM options for better performance
export JAVA_OPTS="-Xms1g -Xmx2g -XX:+UseG1GC -XX:+UseStringDeduplication -XX:+OptimizeStringConcat -XX:+UseCompressedOops"

# Additional JVM tuning
export JAVA_OPTS="$JAVA_OPTS -Djava.awt.headless=true -Dfile.encoding=UTF-8 -Duser.timezone=Europe/Istanbul"

# Development settings
export JAVA_OPTS="$JAVA_OPTS -Dspring.profiles.active=dev"

echo "🔧 JVM Options: $JAVA_OPTS"
echo ""

# Build the application
echo "🔨 Building application..."
./mvnw clean compile -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🏃 Starting application..."
    echo "📡 Application will be available at: http://localhost:8080"
    echo "📚 API Documentation: http://localhost:8080/swagger-ui.html"
    echo "🏥 Health Check: http://localhost:8080/actuator/health"
    echo ""
    
    # Run the application
    ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="$JAVA_OPTS"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi 