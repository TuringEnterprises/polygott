ARG LANGS=
FROM node:8.14.0-alpine AS gen
ARG LANGS
RUN mkdir -p out
ADD gen gen
RUN cd gen && npm install
ADD languages languages
ADD packages.txt packages.txt
RUN node gen/index.js

FROM ubuntu:20.04

COPY lang-helpers /opt/lang-helpers

COPY --from=gen /out/phase0.sh /phase0.sh
RUN /bin/bash phase0.sh

ENV XDG_CONFIG_HOME=/config

COPY --from=gen /out/phase1.sh /phase1.sh
RUN /bin/bash phase1.sh

COPY --from=gen /out/phase2.sh /phase2.sh
RUN /bin/bash phase2.sh

RUN echo '[core]\n    excludesFile = /etc/.gitignore' > /etc/gitconfig
ADD polygott-gitignore /etc/.gitignore

COPY --from=gen /out/run-project /usr/bin/run-project
COPY --from=gen /out/run-task /usr/bin/run-task
COPY --from=gen /out/run-language-server /usr/bin/run-language-server
COPY --from=gen /out/detect-language /usr/bin/detect-language
COPY --from=gen /out/self-test /usr/bin/polygott-self-test
COPY --from=gen /out/polygott-survey /usr/bin/polygott-survey
COPY --from=gen /out/polygott-lang-setup /usr/bin/polygott-lang-setup
COPY --from=gen /out/polygott-x11-vnc /usr/bin/polygott-x11-vnc

ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8

WORKDIR /home/runner

