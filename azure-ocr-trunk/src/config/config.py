# from dotenv import load_dotenv, find_dotenv
import os

# load_dotenv(find_dotenv())


class AppConfig:

    def __init__(self):
        self.ENDPOINT_S0_DOC_INT = os.getenv("ENDPOINT_S0_DOC_INT")
        self.KEY_S0_DOC_INT = os.getenv("KEY_S0_DOC_INT")
        self.AZ_CONTENT_UNDERSTANDING_ENDPOINT = os.getenv(
            "AZ_CONTENT_UNDERSTANDING_ENDPOINT"
        )
        self.AZ_CONTENT_UNDERSTANDING_API_VERSION = os.getenv(
            "AZ_CONTENT_UNDERSTANDING_API_VERSION"
        )
        self.AZ_CONTENT_UNDERSTANDING_KEY = os.getenv("AZ_CONTENT_UNDERSTANDING_KEY")
        self.AZ_CONTENT_UNDERSTANDING_ID = os.getenv("AZ_CONTENT_UNDERSTANDING_ID")
        self.AZ_OPEN_AI_ENDPOINT = os.getenv("AZ_OPEN_AI_ENDPOINT")
        self.GPT_MODELNAME = os.getenv("GPT_MODELNAME")
        self.GPT_DEPLOYMENT_NAME = os.getenv("GPT_DEPLOYMENT_NAME")
        self.AZ_OPEN_AI_KEY = os.getenv("AZ_OPEN_AI_KEY")
        self.GPT_API_VERSION = os.getenv("GPT_API_VERSION")
        self.EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME")
        self.CACHED_EXPIRE_TIME = int(os.getenv("CACHED_EXPIRE_TIME"))
        self.RV3_TIME_DELTA = int(os.getenv("RV3_TIME_DELTA"))
        self.HISTORY_RES_URL = os.getenv("HISTORY_RES_URL")
        self.REQUEST_TIMEOUT_ERROR = os.getenv("REQUEST_TIMEOUT_ERROR")
        self.PROPERTY_PARAM = os.getenv("PROPERTY_PARAM")
        self.PROPERTY_RES_URL = os.getenv("PROPERTY_RES_URL")
        self.EMBEDDING_MODEL_API_VERSION = os.getenv("EMBEDDING_MODEL_API_VERSION")
        self.REDIS_HOST = os.getenv("REDIS_HOST")
        self.REDIS_PORT = os.getenv("REDIS_PORT")
        self.REDIS_DB = os.getenv("REDIS_DB")
        self.DOC_RES_URL = os.getenv("DOC_RES_URL")
        self.WHITELIST_RES_URL = os.getenv("WHITELIST_RES_URL")
        self.SIMILARITY_THRESHOLD = os.getenv("SIMILARITY_THRESHOLD")

    def gpt_client(self):
        return {
            "GPT_API_VERSION": self.GPT_API_VERSION,
            "AZ_OPEN_AI_KEY": self.AZ_OPEN_AI_KEY,
            "AZ_OPEN_AI_ENDPOINT": self.AZ_OPEN_AI_ENDPOINT,
            "GPT_MODELNAME": self.GPT_MODELNAME,
            "GPT_DEPLOYMENT_NAME": self.GPT_DEPLOYMENT_NAME,
        }

    def azure_ai_client(self):
        return {
            "AZ_CONTENT_UNDERSTANDING_ENDPOINT": self.AZ_CONTENT_UNDERSTANDING_ENDPOINT,
            "AZ_CONTENT_UNDERSTANDING_API_VERSION": self.AZ_CONTENT_UNDERSTANDING_API_VERSION,
            "AZ_CONTENT_UNDERSTANDING_KEY": self.AZ_CONTENT_UNDERSTANDING_KEY,
            "AZ_CONTENT_UNDERSTANDING_ID": self.AZ_CONTENT_UNDERSTANDING_ID,
        }

    def doc_intel_client(self):
        return {
            "ENDPOINT_S0_DOC_INT": self.ENDPOINT_S0_DOC_INT,
            "KEY_S0_DOC_INT": self.KEY_S0_DOC_INT,
        }

    def validation_config(self):
        return {
            "RV3_TIME_DELTA": self.RV3_TIME_DELTA,
            "CACHED_EXPIRE_TIME": self.CACHED_EXPIRE_TIME,
            "HISTORY_RES_URL": self.HISTORY_RES_URL,
            "EMBEDDING_MODEL_NAME": self.EMBEDDING_MODEL_NAME,
        }

    def app_config(self):
        return {"REQUEST_TIMEOUT_ERROR": self.REQUEST_TIMEOUT_ERROR}

    def general_function_config(self):
        return {
            "PROPERTY_PARAM": self.PROPERTY_PARAM,
            "EMBEDDING_MODEL_NAME": self.EMBEDDING_MODEL_NAME,
            "EMBEDDING_MODEL_API_VERSION": self.EMBEDDING_MODEL_API_VERSION,
            "AZ_OPEN_AI_ENDPOINT": self.AZ_OPEN_AI_ENDPOINT,
            "AZ_OPEN_AI_KEY": self.AZ_OPEN_AI_KEY,
            "REDIS_HOST": self.REDIS_HOST,
            "REDIS_PORT": self.REDIS_PORT,
            "REDIS_DB": self.REDIS_DB,
            "CACHED_EXPIRE_TIME": self.CACHED_EXPIRE_TIME,
            "WHITELIST_RES_URL": self.WHITELIST_RES_URL,
            "PROPERTY_RES_URL": self.PROPERTY_RES_URL,
            "DOC_RES_URL": self.DOC_RES_URL,
        }

    def instruction_config(self):
        return {
            "PROPERTY_RES_URL": self.PROPERTY_RES_URL,
            "PROPERTY_PARAM": self.PROPERTY_PARAM,
        }

    def master_data_config(self):
        return {
            "PROPERTY_PARAM": self.PROPERTY_PARAM,
            "EMBEDDING_MODEL_NAME": self.EMBEDDING_MODEL_NAME,
            "DOC_RES_URL": self.DOC_RES_URL,
            "PROPERTY_RES_URL": self.PROPERTY_RES_URL,
            "WHITELIST_RES_URL": self.WHITELIST_RES_URL,
        }

    def compare_sim_config(self):
        return {"SIMILARITY_THRESHOLD": self.SIMILARITY_THRESHOLD}

    def redis_config(self):
        return {
            "REDIS_HOST": self.REDIS_HOST,
            "REDIS_PORT": self.REDIS_PORT,
            "REDIS_DB": self.REDIS_DB,
            "CACHED_EXPIRE_TIME": self.CACHED_EXPIRE_TIME,
        }

    def is_any_attributes_null(self, logger=None):
        """Check if any attributes of the configuration are None or empty."""
        missing_attributes = []
        for attr in self.__dict__.keys():
            value = self.__getattribute__(attr)
            if value is None or value == "":
                missing_attributes.append(attr)
        if missing_attributes:
            message = f"Following attributes have no values {missing_attributes}"
            logger.error(message)
            raise KeyError(message)


def load_config():
    app_config = AppConfig()
    return app_config
