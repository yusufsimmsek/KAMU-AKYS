FROM openjdk:17-jdk-slim
LABEL authors="yusuf"
WORKDIR /src
COPY target/turist-bilgilendirme-backend-1.0.0.jar .
EXPOSE 8081
ENTRYPOINT ["java","-jar", "turist-bilgilendirme-backend-1.0.0.jar"]
