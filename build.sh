#!/bin/bash -ev
PYTHONPATH=/app
pip install -e .
pip list
mkdocs build --site-dir /site
