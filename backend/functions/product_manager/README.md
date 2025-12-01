# Skill Suggest API

## Source Structure

```bash
.
├── README.md                  # -> Here
├── app                        # Source root space
│   ├── api                    # Routes, API logic
│   ├── config                 # Get config
│   ├── core
│   ├── models                 # Model folder
│   ├── exceptions
│   ├── helpers
│   ├── main.py
│   ├── middlewares            # Middleware folder
│   ├── services               # Services folder
│   ├── repositories           # Repository folder
│   ├── schemas
├── docker
│   ├── nginx                  # Nginx config folder
│   ├── Dockerfile_fastapi     # Dockerfile for fastapi, using for local only
│   ├── Dockerfile_nginx       # Dockerfile for nginx, using for local only
├── conftest.py
├── docker-compose.yaml        # Running it for build local
├── Dockerfile                 # Dockerfile for dev/qa/stg/prod
├── requirements.txt           # library python
├── tests                      # Testing area folder (unit test)
```

## Requirement

Python == 3.12
fastapi
Docker

## Build step

### Create virtual environments for python

```bash
python -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### Install package

```bash
pip install -r requirements.txt
```

### Run source

```bash
cp .env.example .env

# Build compose
docker-compose build --no-cache

# Up compose
docker-compose up

# Up and build compose
docker-compose up --build
```

### Init database

```bash

docker exec -it {compose_name}-api-1 bash

alembic upgrade head

cd app

python3 tools/init_database.py

```

### Create new client

```bash

docker exec -it {compose_name}-api-1 bash

cd app

python3 tools/create_client.py --client_name {client_name}

```

### How run unit test and make report

```bash

docker exec -it {compose_name}-api-1 bash

pytest --cov --cov-report=html:coverage_report tests/ -vv

```

### Update model

Create a new model or update an existing model in the `/models` folder.
If you create a new model, import the model into the `/alembic/env.py` file.

```python
from models.base_model import Base
# ...
# Import your model at here

```

```bash

docker exec -it {compose_name}-api-1 bash

alembic revision --autogenerate -m "{message}"

```

Apply to the database

```bash

alembic upgrade head

```

If get error about `function uuid_generate_v4()`
Please add this to the version file in folder `alembic/versions/`

```python
# Above code

def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    # Initial database script

```

Revert to the latest version

```bash

## alembic downgrade {version}
## Example

alembic downgrade 78a44f91de69

```
