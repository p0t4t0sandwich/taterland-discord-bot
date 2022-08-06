FROM python:3.8-alpine
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt && mkdir /bas_discord_bot
COPY ./code /app
ENV BOT_ID="" MYSQL_USER="" MYSQL_PASSWORD="" MYSQL_HOST="" MYSQL_DATABASE="" TWITCH_CLIENT_ID="" TWITCH_CLIENT_SECRET=""
ENTRYPOINT [ "python" ]
CMD [ "bas_discord_bot.py" ]