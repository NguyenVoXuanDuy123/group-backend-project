docker-run:
	@if docker compose up -d; then \
		: ; \
	else \
		docker-compose up -d; \
	fi

docker-down:
	@if docker compose down ; then \
		: ; \
	else \
		docker-compose down ; \
	fi
