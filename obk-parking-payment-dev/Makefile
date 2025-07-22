default:
	@echo do nothing ...

release_production:
	docker login registry.lab.tcctech.app
	docker build --pull --compress -f ./Dockerfile -t registry.lab.tcctech.app/obk/obk-parking-payment/production:latest .
	docker push registry.lab.tcctech.app/obk/obk-parking-payment/production:latest

release_staging:
	docker login registry.lab.tcctech.app
	docker build --pull --compress -f ./Dockerfile -t registry.lab.tcctech.app/obk/obk-parking-payment/staging:latest .
	docker push registry.lab.tcctech.app/obk/obk-parking-payment/staging:latest
