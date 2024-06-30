from dataclasses import dataclass, field
from os.path import abspath, join, dirname, isfile
import json



@dataclass
class AppConfig:
    host: str = "mongodb"
    username: str = ""
    password: str = ""
    port: int = 27016
    database: str = "GlutenWebsite"
    server_port: str = ""
    upload_folder:str = ''
    product_categories: list = field(default_factory=lambda: ["Süss", "Salzig", "Sauer", "Bitter"])
    specialities: list = field(default_factory=lambda: ["Vegetarisch", "Vegan", "Kann Gluten Spuren enthalten"])


Config = AppConfig()

app_path = abspath(join(dirname(__file__), '../'))
devconfig = join(dirname(__file__), 'config.dev.json')

if isfile(devconfig):
    print('environment: dev')
    with open(devconfig, 'r') as file:
        Config = AppConfig(**json.load(file))
    env = 'dev'
else:
    Config = AppConfig()



