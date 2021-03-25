FROM node:12.18.3-alpine3.12
# 设置时区为上海
# RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
#    && echo "Asia/Shanghai" > /etc/timezone \
#    && apk del tzdata
RUN mkdir -p /api/edc-api
ADD . /api/edc-api/
WORKDIR /api/edc-api
ENTRYPOINT ["sh", "./entrypoint.sh" ]