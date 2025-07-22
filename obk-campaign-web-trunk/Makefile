default:
	@echo do nothing ...

release_production:
	docker login registry.lab.tcctech.app
	docker build --pull --compress -f ./Dockerfile -t registry.lab.tcctech.app/obk/obk-campaign-web/production:latest .
	docker push registry.lab.tcctech.app/obk/obk-campaign-web/production:latest

release_staging:
	docker login registry.lab.tcctech.app
	docker build --pull --compress -f ./Dockerfile -t registry.lab.tcctech.app/obk/obk-campaign-web/staging:latest .
	docker push registry.lab.tcctech.app/obk/obk-campaign-web/staging:latest
