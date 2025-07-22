# Keycloak for OBK

## Background
- มีการ Customize Keycloak ทำให้ Default image ไม่สามารถใช้ deploy และ scale ได้อย่างมีประสิทธิภาพ
- Repo นี้จึงเอาไว้เก็บ Image ที่มีการ Commit image ที่ Modified เรียบร้อยแล้ว เพื่อ Deploy บน OBK Cluster

## Source
- bitnami/keycloak:23.0.7-debian-12-r4

## Additional Files
- themes/onebangkok --> /opt/bitnami/keycloak/themes/onebangkok
- attribute-login-provider-0.0.0.jar --> /opt/bitnami/keycloak/providers/attribute-login-provider-0.0.0.jar

## Post-processing
- Run /opt/bitnami/keycloak/bin/kc.sh build

## Docker commit & push
- docker container commit 22dff51fc408 registry.lab.tcctech.app/obk/keycloak/keycloak:23.0.7-debian-12-r4-obk-091024
- docker push registry.lab.tcctech.app/obk/keycloak/keycloak:23.0.7-debian-12-r4-obk-091024