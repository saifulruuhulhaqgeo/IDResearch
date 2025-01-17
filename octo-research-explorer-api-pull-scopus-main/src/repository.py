from typing import Union
import requests
import dataclasses
import json

class JurnalRepository:
    def __init__(self, octoHost: Union[str, None], label: Union[str,None] ) -> None:
        self.host = octoHost
        self.label = label

    def get_params(self):
        response = requests.post("{}/v1/scraper/parameters".format(self.host), data = {"label": self.host })
        if response.status_code == 200:
            return response.json()['data']
        else:
            return None

    def ingest_information(self, information):
        params = dataclasses.asdict(information)
        print(json.dumps(params))
        response = requests.post("{}/v1/informations".format(self.host),  json = params)
        print(response.json())
