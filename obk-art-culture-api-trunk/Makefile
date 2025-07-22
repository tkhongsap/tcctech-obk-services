default:
	@echo do nothing ...

release_production:
	docker login registry.lab.tcctech.app
	docker build --platform linux/amd64 --pull --compress -f dockerfile -t registry.lab.tcctech.app/obk/obk-art-culture-api:production .
	docker push registry.lab.tcctech.app/obk/obk-art-culture-api:production

release_staging:
	docker login registry.lab.tcctech.app
	docker build --platform linux/amd64 --pull --compress -f dockerfile -t registry.lab.tcctech.app/obk/obk-art-culture-api:staging .
	docker push registry.lab.tcctech.app/obk/obk-art-culture-api:staging
