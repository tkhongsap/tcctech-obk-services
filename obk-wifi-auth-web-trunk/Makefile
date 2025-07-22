include .env.dev

default:
	@echo do nothing ...

release_production:
	docker login registry.lab.tcctech.app
	docker build --pull --compress -f ./Dockerfile --build-arg NEXT_PUBLIC_APP_HOST=$(NEXT_PUBLIC_APP_HOST) --build-arg NODE_ENV=$(NODE_ENV) -t registry.lab.tcctech.app/obk/obk-wifi-auth-web/production:latest .
	docker push registry.lab.tcctech.app/obk/obk-wifi-auth-web/production:latest

release_staging:
	docker login registry.lab.tcctech.app
	docker build --pull --compress -f ./Dockerfile --build-arg NEXT_PUBLIC_APP_HOST=$(NEXT_PUBLIC_APP_HOST) --build-arg NODE_ENV=$(NODE_ENV) -t registry.lab.tcctech.app/obk/obk-wifi-auth-web/staging:latest .
	docker push registry.lab.tcctech.app/obk/obk-wifi-auth-web/staging:latest

