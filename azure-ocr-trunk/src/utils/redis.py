import redis
from src.config.config import load_config
import pickle
from typing import Optional
import logging
import hashlib

logger = logging.getLogger(__name__)
config = load_config()
redis_config = config.redis_config()

REDIS_CONFIG = {
    "host": redis_config["REDIS_HOST"],
    "port": redis_config["REDIS_PORT"],
    "db": redis_config["REDIS_DB"],
}

cached_expire_time = int(redis_config["CACHED_EXPIRE_TIME"])

def get_redis_connection() -> Optional[redis.Redis]:
    try:
        return redis.Redis(**REDIS_CONFIG)
    except redis.ConnectionError as e:
        logger.error(f"Failed to connect to Redis: {e}")
        return None

r = get_redis_connection()

def store_to_redis(data, key):
    r.set(key, pickle.dumps(data), ex=cached_expire_time)
    return data

def generate_key(field_name):
    """Generate a hash key based on input data"""
    joined = " ".join(field_name)
    return hashlib.sha256(joined.encode("utf-8")).hexdigest()