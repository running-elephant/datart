FROM java:8
LABEL "author"="tl"
RUN mkdir /datart
COPY ./bin/ /datart/bin/
COPY ./config/ /datart/config/
COPY server/src/main/resources/application-demo.yml /datart/config/application-config.yml
COPY ./lib/ /datart/lib/
COPY static /datart/static
ENV TZ=Asia/Shanghai
EXPOSE 8080
WORKDIR /datart
ENTRYPOINT java -cp "lib/*" datart.DatartServerApplication