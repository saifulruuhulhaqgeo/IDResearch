import dataclasses
import re
import sys

from selenium.webdriver.firefox.webdriver import WebDriver
import time
from stem.exit_policy import socket

from jurnal_entity import InformationLake, Jurnal, SccraperStats
from faker import Faker
from selenium.webdriver.common.by import By
from random import randrange
from repository import JurnalRepository, requests


class ScopusPull:
    def __init__(self, octoRepository: JurnalRepository) -> None:
        self.scraper_run = True
        self.dry = False
        self.scraper_topic_keyword: str
        self.scraper_daerah_keyword: str
        self.scraper_daerah_level = 4
        self.level = {
            1:"provinsi",
            2:"kabupaten",
            3:"kecamatan",
            4:"desa"
        }
        self.repository = octoRepository



    def getIP(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip

    def scrap(self):
        print("starting")
        api_keys = ['c6ec682578cead31a56245961ed693a2', '214fc763e5304aef4bae69bcd94f9219']
        counter = 1
        while self.scraper_run:
            params = self.repository.get_params()
            print("PARAM", params)
            if params is not None:
                self.scraper_daerah_keyword = self.level[params['daerah_level']] + " " + params['daerah_label']
                self.scraper_topic_keyword = params['topic']

                if counter % 2 == 0:
                    api_key = api_keys[0]
                else:
                    api_key = api_keys[1]

                keyword = self.scraper_daerah_keyword.replace(" ", "+")
                uri = 'https://api.elsevier.com/content/search/scopus?query=title({0})&apiKey={1}'.format(keyword, api_key)

                #uri = 'https://api.elsevier.com/content/search/scopus?query=title({0})&apiKey={1}'.format("science", api_key)
                print("URL => ", uri)

                response = requests.get(uri)
                literature = response.json()
                entries = literature['search-results']['entry']
                if literature['search-results']['opensearch:totalResults'] != '0':
                    for x in entries:
                        title = x['dc:title']
                        description = x['subtypeDescription']
                        writer = x['dc:creator']
                        year = int(x['prism:coverDate'].split('-')[0])
                        ref_link = x['prism:url']
                        if year is not None:
                            information = InformationLake(
                                title=title,
                                description = description,
                                abstract = "-",
                                author = writer,
                                year = year,
                                daerah_label = params['daerah_label'],
                                daerah_level = params['daerah_level'],
                                daerah_code = params['daerah_code'],
                                links = [ref_link],
                                topik_id = params['topic_id'],
                                source = "Scopus",
                                stats = SccraperStats(
                                    label=self.repository.label,
                                    agent_ip=self.getIP(),
                                )
                            )
                            print(dataclasses.asdict(information))
                            self.repository.ingest_information(information)


            time.sleep(5 + randrange(10))
            counter += 1

    def dry_run(self):
        while self.scraper_run:
            time.sleep(2)
            fake = Faker()
            jurnal = Jurnal(
                title=fake.address(),
                description=fake.text(),
                abstract=fake.text(),
                writer=fake.name(),
                year=2022,
                daerah_level=1,
                daerah="Jawa Tengah",
                topik="Pangan",
                ref_link="https://fakelink.net"
            )
            print(dataclasses.asdict(jurnal))

    def start_agent(self) -> None:
        if self.dry:
            self.dry_run()
        else:
            self.scrap()

