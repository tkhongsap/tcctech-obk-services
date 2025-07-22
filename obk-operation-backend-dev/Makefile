default:
	@echo do nothing ...

release_production:
	docker login registry.lab.tcctech.app
	git rev-parse --short HEAD > TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/version.txt
	docker build --platform linux/amd64  --pull --compress -f TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Dockerfile -t registry.lab.tcctech.app/obk/obk-operation-backend/tcctobk.operationbackend.api:production .
	docker push registry.lab.tcctech.app/obk/obk-operation-backend/tcctobk.operationbackend.api:production

release_staging:
	docker login registry.lab.tcctech.app
	git rev-parse --short HEAD > TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/version.txt
	docker build --platform linux/amd64  --pull --compress -f TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api/Dockerfile -t registry.lab.tcctech.app/obk/obk-operation-backend/tcctobk.operationbackend.api:staging .
	docker push registry.lab.tcctech.app/obk/obk-operation-backend/tcctobk.operationbackend.api:staging
