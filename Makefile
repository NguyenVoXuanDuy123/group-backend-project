docker-run:
	docker compose up -d
	

docker-down:
	@if docker compose down ; then \
		: ; \
	else \
		docker-compose down ; \
	fi
