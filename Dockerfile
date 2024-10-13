FROM node:20.18.0-slim

RUN apt update && apt install -y --no-install-recommends \
  git \
  openssh-client \
  default-jre

USER node

WORKDIR /home/node/app

CMD ["sh", "-c", "npm install && tail -f /dev/null"]