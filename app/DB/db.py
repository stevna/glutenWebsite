import pymongo
from Config import Config


def Collection(collection):
    __client__ = pymongo.MongoClient(**{"host":Config.host, "username": Config.username, "password": Config.password, "port": Config.port})
    return __client__[Config.database][collection]
