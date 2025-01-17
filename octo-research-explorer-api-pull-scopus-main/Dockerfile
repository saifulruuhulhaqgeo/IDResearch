FROM python:3.9.5 
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install zip unzip -y

WORKDIR /app

COPY . .


RUN /usr/local/bin/python -m pip install --upgrade pip


RUN pip install stem selenium requests faker tbselenium pyvirtualdisplay

RUN apt install xvfb libdbus-glib-1-2 libgtk-3-0 -y

CMD ["python3", "src/main.py"]
#CMD ["sleep", "infinity"]
