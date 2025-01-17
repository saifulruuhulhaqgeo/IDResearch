FROM --platform=linux/amd64 python:3.9.5 
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install zip unzip -y

WORKDIR /app

COPY . .

RUN wget https://www.torproject.org/dist/torbrowser/11.5.8/tor-browser-linux64-11.5.8_en-US.tar.xz

RUN tar -xf tor-browser-linux64-11.5.8_en-US.tar.xz

RUN /usr/local/bin/python -m pip install --upgrade pip

RUN cp ./geckodriver /usr/local/bin

RUN pip install stem selenium requests faker tbselenium pyvirtualdisplay

RUN apt install xvfb libdbus-glib-1-2 libgtk-3-0 -y

CMD ["python3", "src/main_tor.py"]
#CMD ["sleep", "infinity"]
