FROM python:3.9-slim

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y \
        libpq-dev \
        r-base \
        python3-dev \
        graphviz \
        libgraphviz-dev \
        default-libmysqlclient-dev \
        build-essential \
        pkg-config \
        jq \
        git \
        gdal-bin \
        libgdal-dev \
        curl \
        && rm -rf /var/lib/apt/lists/*

# Set the GDAL version
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

ARG JUPYTER_REQUIREMENTS_FILE=jupyter-requirements.txt
COPY $JUPYTER_REQUIREMENTS_FILE ./requirements.txt

RUN pip install --upgrade pip
RUN pip install --no-cache-dir jupyter_server
RUN pip install --no-cache-dir ipykernel

RUN pip install --no-cache-dir -r requirements.txt

# jupyter extension
COPY ./jupyter_briefer_extension /usr/src/jupyter_briefer_extension
RUN pip install /usr/src/jupyter_briefer_extension
RUN jupyter server extension enable jupyter_briefer_extension --sys-prefix

# Copy example-data to /usr/src for onboarding
COPY ./example-data/ /usr/src/example-data

RUN useradd -m -d /home/jupyteruser jupyteruser
RUN groupadd -g 1001 briefer && usermod -aG briefer jupyteruser

USER jupyteruser

WORKDIR /home/jupyteruser
