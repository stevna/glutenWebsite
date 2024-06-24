from builtins import str

import bcrypt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import current_user, login_user, logout_user, login_required
from flask_login import LoginManager
from DB import Collection
from flask_login import UserMixin
import uuid
from flask import session


class User(UserMixin):
    def __init__(self, email, password, search_filter=None, sources=None, ki_matching=None, _id=None, job_offers=None,
                 user_descriptions=None, balance:float = 0.3, gpt_version="4", logged_in_for_first_time=True):
        self.email = email
        self.password = password
        # self.search_filter = search_filter
        # self.sources = sources
        # self.ki_matching = ki_matching
        # self._id = uuid.uuid4().hex if _id is None else _id
        # self.job_offers = job_offers if job_offers else {}
        # self.user_descriptions = user_descriptions if user_descriptions else {}
        # self.balance = balance
        # self.gpt_version = gpt_version
        # self.logged_in_for_first_time = logged_in_for_first_time

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.email

    def get_search_filter(self):
        return self.search_filter if self.search_filter else {}

    def get_mail(self):
        return self.email

    # def get_ki_matching(self):
    #     return self.ki_matching
    #
    # def get_user_descriptions(self):
    #     return self.user_descriptions
    #
    # def get_user_job_offers(self):
    #     return self.job_offers if self.job_offers else {}
    #
    # def get_balance(self, should_round: bool = True):
    #     return round(self.balance,3) if should_round else self.balance
    #
    # def get_gpt_version(self):
    #     return self.gpt_version
    #
    # def is_logged_in_for_first_time(self):
    #     return self.logged_in_for_first_time
    #
    # def set_logged_in_for_first_time(self, logged_in_for_first_time_value: bool ):
    #     self.logged_in_for_first_time = logged_in_for_first_time_value
    #
    #
    # def get_lastest_user_description_value(self) -> str:
    #     if not self.user_descriptions:
    #         return ""
    #     return list(self.user_descriptions.values())[-1]
    #
    # def add_user_description(self, new_desciption:str) -> None:
    #     if not self.user_descriptions:
    #         self.user_descriptions = {"1": new_desciption}
    #     else:
    #         last_key: str = list(self.user_descriptions.keys())[-1]
    #         new_key: int = int(last_key) + 1
    #         self.user_descriptions[str(new_key)] = new_desciption
    #
    # def set_gpt_version(self, gpt_version):
    #     self.gpt_version = gpt_version
    #
    #
    # def has_user_job_offer(self, job_id) -> bool:
    #     job_offers = self.get_user_job_offers()
    #     return True if job_id in job_offers else False
    #
    # def add_jobs_to_job_offers(self, job_informations: list[dict] | dict ):
    #     if isinstance(job_informations, dict):
    #         job_informations = [job_informations]
    #     for job in job_informations:
    #         self.job_offers[job.get("job_id")] = {"acknowledged": False, "ai_recommendation": "", "job_source": job.get("job_source") }
    #
    # def get_active_search_job_sources(self) -> list:
    #     search_filter: dict = self.get_search_filter()
    #     active_job_filters: list[str] = []
    #     for key, val in search_filter.items(): #type: str, bool|str
    #         if key.startswith("filter_source"):# and val:
    #             active_job_filters.append(key.split("_")[-1])
    #
    #     print("active_job_filters: ", active_job_filters)
    #     return active_job_filters
    #
    # def add_job_recommendation(self, job_id:str, ai_recommendation:str) -> bool:
    #     try:
    #         self.job_offers[job_id]["ai_recommendation"] = ai_recommendation
    #         return True
    #     except KeyError as e:
    #         print("An exception occured when adding job_recommendation: ", e )
    #         return False
    #
    # def subtract_amount_from_balance(self, amount_to_subtract: float):
    #     self.balance = self.balance - amount_to_subtract
    #
    # def set_acknowledged(self, job_id:str):
    #     job: dict = self.job_offers.get(job_id)
    #     current_ack_value: bool|str = job.get("acknowledged")
    #     new_ack_value = False if current_ack_value else True
    #     job["acknowledged"] = new_ack_value





    @staticmethod
    def check_password(password_hash, password):
        return check_password_hash(password_hash, password)

    @staticmethod
    def login_valid(email, password):
        verify_user = User.get_by_email(email)
        if verify_user is not None:
            return bcrypt.checkpw(password.encode('utf-8'), verify_user.password)
        return False

    # @classmethod
    # def get_by_id(cls, _id):
    #     data = Collection("User").find_one({"_id": _id})
    #     if data is not None:
    #         return cls(**data)

    @classmethod
    def get_by_email(cls, email):
        data = Collection("User").find_one({"email": email})
        if data is not None:
            return cls(**data)

    @classmethod
    def register(cls, email, password):
        user = cls.get_by_email(email)
        if user is None:
            new_user = cls(email, password)
            new_user.save_to_mongo()
            session['email'] = email
            return new_user
        else:
            return False

    def json(self):
        return {
            "email": self.email,
            "password": self.password,
            # "search_filter": self.search_filter,
            # "sources": self.sources,
            # "ki_matching": self.ki_matching,
            # "job_offers": self.job_offers,
            # "user_descriptions": self.user_descriptions,
            # "balance": self.balance,
            # "gpt_version": self.gpt_version,
            # "logged_in_for_first_time": self.logged_in_for_first_time
        }

    def save_to_mongo(self, update_mail=False):
        if not update_mail:
            result = Collection("User").insert_one(self.json())
            return True if result else False
        # update
        else:
            newvalues = {"$set": self.json()}
            result = Collection("User").update_one({"email": update_mail}, newvalues)
            return True if result else False


