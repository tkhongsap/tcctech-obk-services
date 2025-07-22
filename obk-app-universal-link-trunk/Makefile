default:
	@echo do nothing ...

release_production:
	docker login registry.lab.tcctech.app
	docker build --build-arg DEPLOY_ENV=prod --platform linux/amd64 --pull --compress -f Dockerfile -t registry.lab.tcctech.app/obk/obk-app-universal-link:production .
	docker push registry.lab.tcctech.app/obk/obk-app-universal-link:production

release_staging:
	docker login registry.lab.tcctech.app
	docker build --build-arg DEPLOY_ENV=staging --platform linux/amd64 --pull --compress -f Dockerfile -t registry.lab.tcctech.app/obk/obk-app-universal-link:staging .
	docker push registry.lab.tcctech.app/obk/obk-app-universal-link:staging

release_dev:
	docker login registry.lab.tcctech.app
	docker build --build-arg DEPLOY_ENV=dev --platform linux/amd64 --pull --compress -f Dockerfile -t registry.lab.tcctech.app/obk/obk-app-universal-link:dev .
	docker push registry.lab.tcctech.app/obk/obk-app-universal-link:dev
