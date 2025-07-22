FROM docker.tyk.io/tyk-gateway/tyk-gateway:v4.3.3
ARG ENV

COPY ./tyk.${ENV}.conf /opt/tyk-gateway/tyk.conf

RUN rm -rf /opt/tyk-gateway/middleware
COPY ./middleware /opt/tyk-gateway/middleware

RUN rm -rf /opt/tyk-gateway/apps
COPY ./apps /opt/tyk-gateway/apps

# COPY ./configs ./configs
# COPY ./scripts ./scripts
# RUN ./scripts/set_config.sh ./configs/env.${ENV}.json /opt/tyk-gateway/apps /opt/tyk-gateway/middleware

ENTRYPOINT ["/opt/tyk-gateway/tyk"]
