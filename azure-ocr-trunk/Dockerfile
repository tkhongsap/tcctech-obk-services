# FROM pytorch/pytorch:2.7.0-cuda11.8-cudnn9-runtime
FROM python:3.11

WORKDIR /azure-ocr


COPY ./requirements.txt /azure-ocr/requirements.txt

# RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
# RUN pip install --no-cache-dir sentence-transformers==4.1.0
# RUN pip install --no-cache-dir transformers==4.51.3
RUN pip install --no-cache-dir --upgrade -r /azure-ocr/requirements.txt


COPY . /azure-ocr

EXPOSE 80
CMD ["uvicorn", "main:app", "--host","0.0.0.0","--port", "80"] 