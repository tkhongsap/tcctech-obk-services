import numpy as np
import logging
from src.config.config import load_config

logger = logging.getLogger(__name__)
config = load_config()
compare_sim_config = config.compare_sim_config()
sim_threshold = float(compare_sim_config['SIMILARITY_THRESHOLD'])

def cosine_similarity(X, Y=None, dense_output=True):
    X = np.atleast_2d(X)
    if Y is None:
        Y = X
    else:
        Y = np.atleast_2d(Y)

    X_norm = np.linalg.norm(X, axis=1, keepdims=True)
    Y_norm = np.linalg.norm(Y, axis=1, keepdims=True)

    X_norm[X_norm == 0] = 1
    Y_norm[Y_norm == 0] = 1

    sim = np.dot(X, Y.T) / (X_norm * Y_norm.T)

    if dense_output:
        return sim
    else:
        from scipy import sparse
        return sparse.csr_matrix(sim)

def store_name_sim(a, b):
    a_vector = a[0].embedding
    a_array = np.array(a_vector).reshape(1, -1)
    b_array = np.vstack(b)
    return cosine_similarity(a_array, b_array)

def compare_sim(sample_embedded_merchant_whitelist, sample_embedded_company_whitelist, embedded_merchant_name):
    sim_merchant = store_name_sim(embedded_merchant_name, sample_embedded_merchant_whitelist)
    sim_company = store_name_sim(embedded_merchant_name, sample_embedded_company_whitelist)
    most_from_merchant = np.argmax(sim_merchant[0])
    most_from_company = np.argmax(sim_company[0])
    
    merchant_score = sim_merchant[0][most_from_merchant]
    company_score = sim_company[0][most_from_company]

    if max(merchant_score, company_score) >= sim_threshold:
        if merchant_score > company_score:
            
            logger.info(f'{round(merchant_score*100, 2)}% Similar to merchant_name at index: {most_from_merchant}')
            return True, int(most_from_merchant)
        else:
            logger.info(f'{round(company_score*100, 2)}% Similar to merchant_name at index: {most_from_company}')
            return True, int(most_from_company)
    else:
        return False, 'invalid'