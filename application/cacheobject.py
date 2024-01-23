from flask_caching import Cache

cache = Cache()

# redis-server
# sudo systemctl stop redis-server
# celery -A main:celery_app worker --loglevel INFO
# celery -A main:celery_app beat --loglevel INFO
# ~/go/bin/MailHog
#  wsl.exe sudo hwclock -s