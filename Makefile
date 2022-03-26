.PHONY: all deploy clean

all: dist dist/index.html dist/style.css

dist:
	git worktree add dist gh-pages

dist/index.html: src/index.html
	cp $< $@
	tsc --project tsconfig.prod.json

dist/style.css: src/style.css
	cp $< $@

deploy: all
	cd dist && \
	git add --all && \
	git commit -m "Deploy to gh-pages" && \
	git push origin gh-pages

# Removing the actual dist directory confuses git and will require a git worktree prune to fix
clean:
	rm -rf dist/*