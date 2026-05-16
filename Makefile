site_path ?= $(abspath ../ddrscott.github.io)
life_root ?= /Users/spierce/life/content
commit_msg = $(shell git -C ${life_root}/.. log --pretty=oneline --abbrev-commit -1 2>/dev/null | head -1)

.PHONY: install dev build sync-images clean verify deploy preview

install:
	pnpm install --ignore-workspace

sync-images:
	@mkdir -p public/images
	rclone copy r2:life-content/ddrscott/images public/images/ --progress

dev: sync-images
	pnpm dev

build: sync-images
	pnpm build
	pnpm exec pagefind --site dist --output-subdir pagefind
	@rm -rf public/pagefind
	@cp -R dist/pagefind public/pagefind
	@echo "Pagefind index copied to public/ for dev server."

preview: build
	pnpm preview

verify: build
	pnpm verify-urls

deploy: verify
	@echo "Deploying dist/ → ${site_path}"
	@# GitHub Pages runs Jekyll by default; Jekyll skips dirs starting with
	@# `_` (Astro emits assets under _astro/). .nojekyll opts the site out.
	@touch dist/.nojekyll
	rsync -av --delete \
		--exclude='.git/' \
		--exclude='.gitignore' \
		--exclude='.gitattributes' \
		--exclude='.gitmodules' \
		--exclude='.editorconfig' \
		--exclude='.powrc' \
		--exclude='.slugignore' \
		dist/ ${site_path}/
	@src_sha=$$(git -C ${CURDIR} rev-parse --short HEAD) ; \
	 cd ${site_path} && \
		git add -A && \
		if git diff --cached --quiet ; then \
			echo "" ; echo "No changes to deploy — site already up to date." ; \
		else \
			git commit -m "Deploy from ddrscott.site@$$src_sha ($$(date -u +%Y-%m-%dT%H:%M:%SZ))" ; \
			echo "" ; echo "Deploy commit created in ${site_path}." ; \
			echo "Run 'cd ${site_path} && git push' (or 'make publish' below) to ship." ; \
		fi

publish: deploy
	cd ${site_path} && git push --follow-tags

clean:
	rm -rf dist/ .astro/ public/images/ public/pagefind/

# Rebuild Pagefind index against existing dist/ (skip Astro build)
index:
	pnpm exec pagefind --site dist --output-subdir pagefind

# Quick env check
env:
	@echo "site_path:  ${site_path}"
	@echo "life_root:  ${life_root}"
	@echo "commit_msg: ${commit_msg}"
