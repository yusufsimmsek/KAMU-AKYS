@echo off
REM Turist Bilgilendirme Spring Boot Backend Runner Script (Windows)
REM This script starts the application with optimized JVM settings

echo 🚀 Starting Turist Bilgilendirme Spring Boot Backend...
echo 📊 JVM Memory Configuration:
echo    - Initial Heap: 1GB
echo    - Maximum Heap: 2GB
echo    - Garbage Collector: G1GC
echo.

REM Set JVM options for better performance
set JAVA_OPTS=-Xms1g -Xmx2g -XX:+UseG1GC -XX:+UseStringDeduplication -XX:+OptimizeStringConcat -XX:+UseCompressedOops

REM Additional JVM tuning
set JAVA_OPTS=%JAVA_OPTS% -Djava.awt.headless=true -Dfile.encoding=UTF-8 -Duser.timezone=Europe/Istanbul

REM Development settings
set JAVA_OPTS=%JAVA_OPTS% -Dspring.profiles.active=dev

echo 🔧 JVM Options: %JAVA_OPTS%
echo.

REM Build the application
echo 🔨 Building application...
call mvnw.cmd clean compile -DskipTests

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🏃 Starting application...
    echo 📡 Application will be available at: http://localhost:8080
    echo 📚 API Documentation: http://localhost:8080/swagger-ui.html
    echo 🏥 Health Check: http://localhost:8080/actuator/health
    echo.
    
    REM Run the application
    call mvnw.cmd spring-boot:run -Dspring-boot.run.jvmArguments="%JAVA_OPTS%"
) else (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
) 