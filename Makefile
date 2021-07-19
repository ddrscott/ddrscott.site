site_path ?=../ddrscott.github.io
commit_msg =$(shell git log --pretty=oneline --abbrev-commit -1 | head -1)

env:
	@echo ${site_path}
	@echo ${commit_msg}

build:
	mkdocs build --site-dir ${site_path}

deploy: build  ## deploy to ddrscott.github.io 
	cd ${site_path} && \
	  git add . && \
	  git commit -m "${commit_msg}" && \
	  git push
