site_path ?= $(abspath ../ddrscott.github.io)
commit_msg =$(shell git log --pretty=oneline --abbrev-commit -1 | head -1)

.PHONY: build

serve:
	docker run -t --rm  -v ${PWD}:/app -v ${site_path}:/site --entrypoint mkdocs \
		-p 8001:8000 mkdocs serve -a '0.0.0.0:8000'

build:
	docker run -t --rm  -v ${PWD}:/app -v ${site_path}:/site mkdocs

env:
	@echo ${site_path}
	@echo ${commit_msg}

image:
	docker build -t mkdocs .

deploy: build  ## deploy to ddrscott.github.io 
	cd ${site_path} && \
	  git add . && \
	  git commit -m "${commit_msg}" && \
	  git push

requirements.txt: requirements.in
	pip-compile $< -o $@
