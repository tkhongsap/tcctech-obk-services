default:
	@echo do nothing ...

release_production:
	docker login registry.lab.tcctech.app
	git rev-parse --short HEAD > TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/version.txt
	docker build --platform linux/amd64 --pull --compress -f TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Dockerfile -t registry.lab.tcctech.app/obk/tcct-serviceabstraction/tcct.serviceabstraction.api:production .
	docker push registry.lab.tcctech.app/obk/tcct-serviceabstraction/tcct.serviceabstraction.api:production

release_staging:
	docker login registry.lab.tcctech.app
	git rev-parse --short HEAD > TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/version.txt
	docker build --platform linux/amd64 --pull --compress -f TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/Dockerfile -t registry.lab.tcctech.app/obk/tcct-serviceabstraction/tcct.serviceabstraction.api:staging .
	docker push registry.lab.tcctech.app/obk/tcct-serviceabstraction/tcct.serviceabstraction.api:staging
